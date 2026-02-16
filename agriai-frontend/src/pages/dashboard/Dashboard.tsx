import { useQuery } from '@tanstack/react-query';
import { getFarms } from '../../api/endpoints/farms';
import FarmsList from './FarmsList';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import FarmForm from './FarmForm';

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['farms'],
    queryFn: getFarms,
  });
  const [showFarmForm, setShowFarmForm] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading farms</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Farms</h1>
        <Button onClick={() => setShowFarmForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Farm
        </Button>
      </div>
      <FarmsList farms={data?.data || []} />
      <FarmForm open={showFarmForm} onClose={() => setShowFarmForm(false)} />
    </div>
  );
}