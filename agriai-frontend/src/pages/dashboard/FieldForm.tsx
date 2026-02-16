import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Field } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createField, updateField } from '../../api/endpoints/farms';
import { toast } from '../../components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(1, 'Field name is required'),
  area: z.number().min(0.1, 'Area must be at least 0.1 hectares'),
  soilType: z.enum(['clay', 'sandy', 'loamy']),
  crop: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface FieldFormProps {
  farmId: string;
  field?: Field | null;
  open: boolean;
  onClose: () => void;
}

export default function FieldForm({ farmId, field, open, onClose }: FieldFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: field
      ? {
          name: field.name,
          area: field.area,
          soilType: field.soilType,
          crop: field.crop || '',
        }
      : {
          name: '',
          area: 1,
          soilType: 'loamy',
          crop: '',
        },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      field
        ? updateField(field.id, data)
        : createField(farmId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast({ title: field ? 'Field updated' : 'Field created' });
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Something went wrong',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{field ? 'Edit Field' : 'Add Field'}</DialogTitle>
          <DialogDescription>
            {field ? 'Update your field details' : 'Enter details for your new field'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Name</FormLabel>
                  <FormControl>
                    <Input placeholder="North Field" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area (hectares)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="soilType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soil Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="clay">Clay</SelectItem>
                      <SelectItem value="sandy">Sandy</SelectItem>
                      <SelectItem value="loamy">Loamy</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="crop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Maize" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : field ? 'Update' : 'Create'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}