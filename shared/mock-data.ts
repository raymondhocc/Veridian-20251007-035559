import type { User, Chat, ChatMessage, Platform, PlatformMetrics, TimeSeriesDataPoint, RegionalMetric, TriggeredAlert } from './types';
import { subDays, format } from 'date-fns';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A' },
  { id: 'u2', name: 'User B' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];
// --- Consolidated Mock Data Generation from src/lib/mockData.ts ---
const generateTimeSeries = (days: number, baseValue: number, volatility: number): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = [];
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), days - 1 - i);
    const value = baseValue + (Math.random() - 0.5) * volatility * baseValue;
    data.push({
      time: format(date, 'MMM dd'),
      value: Math.max(0, parseFloat(value.toFixed(2))),
    });
  }
  return data;
};
const platformBaseValues = {
  Solana: { volume: 50e9, speed: 400, fees: 0.00025, etf: 150 },
  Ethereum: { volume: 25e9, speed: 12000, fees: 5.5, etf: 3500 },
  BSC: { volume: 10e9, speed: 3000, fees: 0.15, etf: 450 },
};
export const generateMockMetrics = (platform: Platform): PlatformMetrics => {
  const base = platformBaseValues[platform];
  const volumeData = generateTimeSeries(30, base.volume / 30, 0.2);
  const speedData = generateTimeSeries(30, base.speed, 0.1);
  const feesData = generateTimeSeries(30, base.fees, 0.3);
  const etfData = generateTimeSeries(30, base.etf, 0.15);
  return {
    paymentVolume: {
      label: 'Payment Volume',
      value: `$${(base.volume / 1e9).toFixed(2)}B`,
      change: '+2.5%',
      changeType: 'increase',
      data: volumeData.slice(-7),
    },
    transactionSpeed: {
      label: 'Avg. Txn Speed',
      value: `${base.speed.toFixed(0)} ms`,
      change: '-1.2%',
      changeType: 'decrease',
      data: speedData.slice(-7),
    },
    gasFees: {
      label: 'Avg. Gas Fees',
      value: `$${base.fees.toFixed(4)}`,
      change: '+5.8%',
      changeType: 'increase',
      data: feesData.slice(-7),
    },
    etfPrice: {
      label: `${platform === 'BSC' ? 'BNB' : platform.slice(0,3)} ETF Price`,
      value: `$${base.etf.toFixed(2)}`,
      change: '+0.5%',
      changeType: 'increase',
      data: etfData.slice(-7),
    },
    crossBorderVolume: {
      '24H': generateTimeSeries(24, base.volume / 30, 0.1).map((d, i) => ({ ...d, time: `${i}:00` })),
      '7D': volumeData.slice(-7),
      '30D': volumeData,
    },
    gasFeeTrend: {
      '24H': generateTimeSeries(24, base.fees, 0.2).map((d, i) => ({ ...d, time: `${i}:00` })),
      '7D': feesData.slice(-7),
      '30D': feesData,
    },
  };
};
export const generateRegionalMockData = (): RegionalMetric[] => {
  return [
    { countryCode: 'US', countryName: 'United States', paymentVolume: 1.2e9, transactionSpeed: 450, gasFee: 0.00026 },
    { countryCode: 'GB', countryName: 'United Kingdom', paymentVolume: 8.5e8, transactionSpeed: 550, gasFee: 0.00024 },
    { countryCode: 'SG', countryName: 'Singapore', paymentVolume: 9.2e8, transactionSpeed: 400, gasFee: 0.00022 },
    { countryCode: 'DE', countryName: 'Germany', paymentVolume: 7.1e8, transactionSpeed: 580, gasFee: 0.00028 },
    { countryCode: 'JP', countryName: 'Japan', paymentVolume: 6.5e8, transactionSpeed: 420, gasFee: 0.00023 },
    { countryCode: 'BR', countryName: 'Brazil', paymentVolume: 4.3e8, transactionSpeed: 650, gasFee: 0.00030 },
    { countryCode: 'NG', countryName: 'Nigeria', paymentVolume: 3.1e8, transactionSpeed: 700, gasFee: 0.00032 },
    { countryCode: 'IN', countryName: 'India', paymentVolume: 5.5e8, transactionSpeed: 680, gasFee: 0.00031 },
  ];
};
export const generateTriggeredAlerts = (): TriggeredAlert[] => {
  return [
    {
      id: 'alert-1',
      platform: 'Solana',
      metric: 'gasFees',
      message: 'Gas fees are unusually high, reaching $0.0005.',
      timestamp: subDays(new Date(), 0).toISOString(),
    },
    {
      id: 'alert-2',
      platform: 'Ethereum',
      metric: 'transactionSpeed',
      message: 'Transaction speed has dropped below 15,000ms.',
      timestamp: subDays(new Date(), 1).toISOString(),
    },
    {
      id: 'alert-3',
      platform: 'BSC',
      metric: 'etfPrice',
      message: 'BNB ETF price dropped by 5% in the last hour.',
      timestamp: subDays(new Date(), 2).toISOString(),
    },
  ];
};