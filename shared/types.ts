export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// Veridian Dash Types
export type Platform = 'Solana' | 'Ethereum' | 'BSC';
export type TimeFrame = '24H' | '7D' | '30D';
export interface TimeSeriesDataPoint {
  time: string;
  value: number;
}
export interface Metric {
  label: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  data: TimeSeriesDataPoint[];
}
export interface ChartData {
  '24H': TimeSeriesDataPoint[];
  '7D': TimeSeriesDataPoint[];
  '30D': TimeSeriesDataPoint[];
}
export interface PlatformMetrics {
  paymentVolume: Metric;
  transactionSpeed: Metric;
  gasFees: Metric;
  etfPrice: Metric;
  crossBorderVolume: ChartData;
  gasFeeTrend: ChartData;
}
export interface PlatformData {
  platform: Platform;
  metrics: PlatformMetrics;
}
export interface ComparisonData {
  metric: string;
  Solana: number;
  Ethereum: number;
  BSC: number;
}
// Phase 4: Regional Insights
export interface RegionalMetric {
  countryCode: string; // ISO 3166-1 alpha-2
  countryName: string;
  paymentVolume: number; // in USD
  transactionSpeed: number; // in ms
  gasFee: number; // in USD
}
// Phase 4 & 5: Alerts Configuration
export type AlertMetricType = 'paymentVolume' | 'transactionSpeed' | 'gasFees' | 'etfPrice';
export type AlertCondition = 'above' | 'below';
export type AlertChannel = 'email' | 'push' | 'in-app';
export interface AlertConfiguration {
  id: string;
  platform: Platform;
  metric: AlertMetricType;
  condition: AlertCondition;
  threshold: number;
  channels: AlertChannel[];
  isEnabled: boolean;
}
// Phase 5: Triggered Alerts
export interface TriggeredAlert {
  id: string;
  platform: Platform;
  metric: AlertMetricType;
  message: string;
  timestamp: string; // ISO 8601
}