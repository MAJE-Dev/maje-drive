import type { MaintenanceCategory } from './types';

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function fmtKm(km: number): string {
  return km.toLocaleString('pt-BR');
}

export function fmtCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${d} ${months[parseInt(m) - 1]} ${y}`;
}

export const categoryConfig: Record<MaintenanceCategory, { label: string; color: string; bg: string }> = {
  oil: { label: 'Óleo', color: '#F59E0B', bg: 'rgba(245,158,11,0.14)' },
  brakes: { label: 'Freios', color: '#EF4444', bg: 'rgba(239,68,68,0.14)' },
  filters: { label: 'Filtros', color: '#4A9EFF', bg: 'rgba(74,158,255,0.12)' },
  revision: { label: 'Revisão', color: '#00CCCC', bg: 'rgba(0,204,204,0.12)' },
  electrical: { label: 'Elétrica', color: '#A78BFA', bg: 'rgba(167,139,250,0.14)' },
  suspension: { label: 'Suspensão', color: '#00CCCC', bg: 'rgba(0,204,204,0.1)' },
  cooling: { label: 'Arrefec.', color: '#67E8F9', bg: 'rgba(103,232,249,0.12)' },
  transmission: { label: 'Câmbio', color: '#FB923C', bg: 'rgba(251,146,60,0.12)' },
  battery: { label: 'Bateria', color: '#84CC16', bg: 'rgba(132,204,22,0.12)' },
  other: { label: 'Outros', color: '#8B929E', bg: 'rgba(139,146,158,0.12)' },
};

export function healthColor(score: number): string {
  if (score >= 70) return '#00CCCC';
  if (score >= 40) return '#FF7A30';
  return '#EF4444';
}

export function healthLabel(score: number): string {
  if (score >= 70) return 'EM DIA';
  if (score >= 40) return 'ATENÇÃO';
  return 'CRÍTICO';
}
