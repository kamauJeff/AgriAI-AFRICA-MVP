import { useQuery } from '@tanstack/react-query';
import { getPrices, getCrops, getRegions } from '@/api/endpoints/market';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function MarketPrices() {
  const [crop, setCrop] = useState<string>('all');
  const [region, setRegion] = useState<string>('all');

  const { 
    data: crops, 
    isLoading: cropsLoading,
    refetch: refetchCrops 
  } = useQuery({ 
    queryKey: ['crops'], 
    queryFn: getCrops 
  });

  const { 
    data: regions, 
    isLoading: regionsLoading,
    refetch: refetchRegions 
  } = useQuery({ 
    queryKey: ['regions'], 
    queryFn: getRegions 
  });

  const { 
    data: prices, 
    isLoading: pricesLoading,
    refetch: refetchPrices,
    error 
  } = useQuery({
    queryKey: ['prices', crop, region],
    queryFn: () => getPrices(crop === 'all' ? undefined : crop, region === 'all' ? undefined : region),
  });

  const handleRefresh = () => {
    refetchCrops();
    refetchRegions();
    refetchPrices();
  };

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          Failed to load market data. Please try again later.
          <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-4">
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Market Prices</h1>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Select value={crop} onValueChange={setCrop}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Crops" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Crops</SelectItem>
            {cropsLoading ? (
              <SelectItem value="loading" disabled>Loading...</SelectItem>
            ) : (
              crops?.data?.map((c: string) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {regionsLoading ? (
              <SelectItem value="loading" disabled>Loading...</SelectItem>
            ) : (
              regions?.data?.map((r: string) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {pricesLoading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crop</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Price (per kg)</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prices?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No price data available. Please seed the database.
                </TableCell>
              </TableRow>
            ) : (
              prices?.data?.map((price: any) => (
                <TableRow key={price.id}>
                  <TableCell className="font-medium">{price.crop}</TableCell>
                  <TableCell>{price.region}</TableCell>
                  <TableCell>KSh {price.price.toLocaleString()}</TableCell>
                  <TableCell>{new Date(price.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}