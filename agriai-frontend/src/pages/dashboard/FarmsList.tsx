import type { Farm, Field } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import FarmForm from './FarmForm';
import FieldList from './FieldList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFarm } from '../../api/endpoints/farms';
import { toast } from '../../components/ui/use-toast';

interface FarmsListProps {
  farms: Farm[];
}

export default function FarmsList({ farms }: FarmsListProps) {
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [expandedFarm, setExpandedFarm] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast({ title: 'Farm deleted' });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-4">
      {farms.map((farm) => (
        <Card key={farm.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>{farm.name}</CardTitle>
              <CardDescription>{farm.location}</CardDescription>
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => setEditingFarm(farm)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(farm.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" size="sm" onClick={() => setExpandedFarm(expandedFarm === farm.id ? null : farm.id)}>
              {expandedFarm === farm.id ? 'Hide' : 'Show'} Fields ({farm.fields.length})
            </Button>
            {expandedFarm === farm.id && <FieldList farmId={farm.id} fields={farm.fields} />}
          </CardContent>
        </Card>
      ))}
      <FarmForm farm={editingFarm} open={!!editingFarm} onClose={() => setEditingFarm(null)} />
    </div>
  );
}