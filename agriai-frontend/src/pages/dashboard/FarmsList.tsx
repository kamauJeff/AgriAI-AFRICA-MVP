import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MapPin } from 'lucide-react';
import type { Farm } from '@/types';
import FarmForm from './FarmForm';
import FieldList from './FieldList';
import { deleteFarm } from '@/api/endpoints/farms';
import { setFarmLocation } from '@/api/endpoints/weather';
import { toast } from '@/components/ui/use-toast';
import ForecastCard from '@/components/weather/ForecastCard';
import LocationDialog from '@/components/weather/LocationDialog';

interface FarmsListProps {
  farms: Farm[];
}

export default function FarmsList({ farms }: FarmsListProps) {
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [expandedFarm, setExpandedFarm] = useState<string | null>(null);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
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

  const openLocationDialog = (farmId: string) => {
    setSelectedFarmId(farmId);
    setLocationDialogOpen(true);
  };

  const handleLocationSet = () => {
    queryClient.invalidateQueries({ queryKey: ['farms'] });
    toast({ title: 'Location updated' });
  };

  return (
    <div className="space-y-4">
      {farms.map((farm) => (
        <Card key={farm.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>{farm.name}</CardTitle>
              <CardDescription>{farm.location}</CardDescription>
              {farm.lat && farm.lon && (
                <p className="text-xs text-muted-foreground mt-1">
                  Coordinates: {farm.lat}, {farm.lon}
                </p>
              )}
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => openLocationDialog(farm.id)}>
                <MapPin className="h-4 w-4 mr-1" /> Set Location
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditingFarm(farm)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(farm.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedFarm(expandedFarm === farm.id ? null : farm.id)}
              >
                {expandedFarm === farm.id ? 'Hide' : 'Show'} Fields ({farm.fields.length})
              </Button>
            </div>
            {expandedFarm === farm.id && (
              <>
                <FieldList farmId={farm.id} fields={farm.fields} />
                {farm.lat && farm.lon && (
                  <div className="mt-4">
                    <ForecastCard farmId={farm.id} />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
      <FarmForm farm={editingFarm} open={!!editingFarm} onClose={() => setEditingFarm(null)} />
      <LocationDialog
        farmId={selectedFarmId}
        open={locationDialogOpen}
        onOpenChange={setLocationDialogOpen}
        onLocationSet={handleLocationSet}
      />
    </div>
  );
}