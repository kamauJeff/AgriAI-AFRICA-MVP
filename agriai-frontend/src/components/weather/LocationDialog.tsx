import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { setFarmLocation } from '@/api/endpoints/weather';
import { toast } from '@/components/ui/use-toast';

interface LocationDialogProps {
  farmId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSet: () => void;
}

export default function LocationDialog({ farmId, open, onOpenChange, onLocationSet }: LocationDialogProps) {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  const mutation = useMutation({
    mutationFn: () => setFarmLocation(farmId!, parseFloat(lat), parseFloat(lon)),
    onSuccess: () => {
      toast({ title: 'Location saved' });
      onLocationSet();
      onOpenChange(false);
      setLat('');
      setLon('');
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.error || 'Failed to save location', variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lat || !lon) {
      toast({ title: 'Please enter both latitude and longitude', variant: 'destructive' });
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Farm Location</DialogTitle>
          <DialogDescription>
            Enter the latitude and longitude for this farm. You can find these from Google Maps or a GPS device.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="lat">Latitude</Label>
            <Input
              id="lat"
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="e.g., -1.2921"
              required
            />
          </div>
          <div>
            <Label htmlFor="lon">Longitude</Label>
            <Input
              id="lon"
              type="number"
              step="any"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="e.g., 36.8219"
              required
            />
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save Location'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}