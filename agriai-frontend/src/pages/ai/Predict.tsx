import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { getPrediction } from '../../api/endpoints/ai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from '../../components/ui/use-toast';

const formSchema = z.object({
  soilType: z.enum(['clay', 'sandy', 'loamy']),
  area: z.number().min(0.1, 'Area must be at least 0.1 ha'),
  crop: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PredictionResult {
  predictedYield: string;
  confidence: number;
  recommendation: string;
}

export default function Predict() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { soilType: 'loamy', area: 1, crop: '' },
  });

  const mutation = useMutation({
    mutationFn: getPrediction,
    onSuccess: (response) => {
      setResult(response.data);
      toast({ title: 'Prediction ready' });
    },
    onError: () => {
      toast({ title: 'Prediction failed', variant: 'destructive' });
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Yield Prediction</h1>
      <Card>
        <CardHeader>
          <CardTitle>Field Information</CardTitle>
          <CardDescription>Enter soil and field details to get a yield prediction</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                {mutation.isPending ? 'Predicting...' : 'Get Prediction'}
              </Button>
            </form>
          </Form>
          {result && (
            <div className="mt-6 p-4 border rounded-lg bg-muted">
              <h3 className="font-semibold text-lg">Prediction Result</h3>
              <p className="text-2xl font-bold text-green-600">{result.predictedYield}</p>
              <p className="text-sm text-muted-foreground">Confidence: {(result.confidence * 100).toFixed(0)}%</p>
              <p className="mt-2">{result.recommendation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}