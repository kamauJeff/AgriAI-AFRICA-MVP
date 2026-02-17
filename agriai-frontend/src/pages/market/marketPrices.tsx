import { useQuery } from '@tanstack/react-query';
import { getPrices, getCrops, getRegions } from '@/api/endpoints/market';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';

export default function MarketPrices() {
  const [crop, setCrop] = useState<string>('');
  const [region, setRegion] = useState<string>('');

  const { data: crops } = useQuery({ queryKey: ['crops'], queryFn: getCrops });
  const { data: regions } = useQuery({ queryKey: ['regions'], queryFn: getRegions });
  const { data: prices } = useQuery({
    queryKey: ['prices', crop, region],
    queryFn: () => getPrices(crop, region),
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Market Prices</h1>
      <div className="flex gap-4 mb-6">
        <Select value={crop} onValueChange={setCrop}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Crops" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Crops</SelectItem>
            {crops?.data?.map((c: string) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Regions</SelectItem>
            {regions?.data?.map((r: string) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
          {prices?.data?.map((price: any) => (
            <TableRow key={price.id}>
              <TableCell>{price.crop}</TableCell>
              <TableCell>{price.region}</TableCell>
              <TableCell>KSh {price.price}</TableCell>
              <TableCell>{new Date(price.date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}