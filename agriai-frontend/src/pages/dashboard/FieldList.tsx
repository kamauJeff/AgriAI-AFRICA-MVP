import type { Farm, Field } from '../../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import FieldForm from './FieldForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteField } from '../../api/endpoints/farms';
import { toast } from '../../components/ui/use-toast';

interface FieldListProps {
  farmId: string;
  fields: Field[];
}

export default function FieldList({ farmId, fields }: FieldListProps) {
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [showFieldForm, setShowFieldForm] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast({ title: 'Field deleted' });
    },
  });

  return (
    <div className="mt-4">
      <div className="flex justify-end mb-2">
        <Button size="sm" onClick={() => setShowFieldForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Field
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Area (ha)</TableHead>
            <TableHead>Soil Type</TableHead>
            <TableHead>Crop</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell>{field.name}</TableCell>
              <TableCell>{field.area}</TableCell>
              <TableCell className="capitalize">{field.soilType}</TableCell>
              <TableCell>{field.crop || '—'}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => setEditingField(field)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(field.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <FieldForm
        farmId={farmId}
        field={editingField}
        open={showFieldForm || !!editingField}
        onClose={() => {
          setShowFieldForm(false);
          setEditingField(null);
        }}
      />
    </div>
  );
}