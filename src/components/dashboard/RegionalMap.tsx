import React, { useState, useMemo } from 'react';
import { RegionalMetric } from '@shared/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
// A simplified set of SVG paths for the world map. In a real app, this would be more detailed.
const countryPaths: Record<string, string> = {
  US: "M100 100 L150 100 L150 150 L100 150 Z", // Placeholder, replace with actual paths
  CA: "M100 50 L150 50 L150 100 L100 100 Z",
  MX: "M100 150 L150 150 L150 200 L100 200 Z",
  BR: "M200 200 L250 200 L250 250 L200 250 Z",
  AR: "M200 250 L250 250 L250 300 L200 300 Z",
  GB: "M300 80 L320 80 L320 120 L300 120 Z",
  DE: "M330 90 L360 90 L360 130 L330 130 Z",
  FR: "M300 130 L330 130 L330 170 L300 170 Z",
  CN: "M500 120 L600 120 L600 200 L500 200 Z",
  IN: "M450 200 L520 200 L520 250 L450 250 Z",
  JP: "M620 100 L650 100 L650 150 L620 150 Z",
  AU: "M550 300 L650 300 L650 380 L550 380 Z",
  ZA: "M350 350 L400 350 L400 400 L350 400 Z",
  NG: "M300 250 L350 250 L350 300 L300 300 Z",
  EG: "M350 200 L400 200 L400 250 L350 250 Z",
  RU: "M400 50 L600 50 L600 120 L400 120 Z",
  KR: "M600 150 L620 150 L620 180 L600 180 Z",
  SG: "M520 255 L530 255 L530 265 L520 265 Z",
};
interface RegionalMapProps {
  data: RegionalMetric[];
}
const formatCurrency = (value: number) => `$${(value / 1e6).toFixed(2)}M`;
export function RegionalMap({ data }: RegionalMapProps) {
  const dataByCountry = useMemo(() => {
    const map = new Map<string, RegionalMetric>();
    data.forEach(item => map.set(item.countryCode, item));
    return map;
  }, [data]);
  const maxVolume = useMemo(() => Math.max(...data.map(d => d.paymentVolume)), [data]);
  const getColor = (volume: number) => {
    const intensity = Math.max(0.1, Math.min(1, volume / maxVolume));
    return `hsl(221.2 83.2% ${100 - intensity * 50}%)`;
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Payment Volume</CardTitle>
        <CardDescription>Cross-border payment volume by country. Hover for details.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full aspect-[16/9] flex items-center justify-center">
          <TooltipProvider>
            <svg viewBox="0 0 700 450" className="w-full h-full">
              <g>
                {Object.entries(countryPaths).map(([countryCode, pathData]) => {
                  const countryData = dataByCountry.get(countryCode);
                  const volume = countryData?.paymentVolume || 0;
                  const color = countryData ? getColor(volume) : 'hsl(220 13% 91%)'; // bg-muted

                  return (
                    <Tooltip key={countryCode}>
                      <TooltipTrigger asChild>
                        <path
                          d={pathData}
                          fill={color}
                          stroke="hsl(220 13% 69%)"
                          strokeWidth="0.5"
                          className="transition-opacity hover:opacity-80"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {countryData ? (
                          <div>
                            <p className="font-bold">{countryData.countryName} ({countryData.countryCode})</p>
                            <p>Volume: {formatCurrency(countryData.paymentVolume)}</p>
                            <p>Avg. Speed: {countryData.transactionSpeed.toFixed(2)}ms</p>
                            <p>Avg. Fee: ${countryData.gasFee.toFixed(4)}</p>
                          </div>
                        ) : (
                          <p>{countryCode} - No data available</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </g>
            </svg>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}