import { ThemeConfig } from '../types';

export const THEMES: ThemeConfig[] = [
  {
    id: 'war-pink',
    name: 'WAR PINK',
    primary: '#FF2E88',
    primaryDark: '#B3004A',
    primaryRgb: '255, 46, 136',
    heroText: '#FFFFFF',
  },
  {
    id: 'electric-blue',
    name: 'ELECTRIC BLUE',
    primary: '#2E7DFF',
    primaryDark: '#1D4ED8',
    primaryRgb: '46, 125, 255',
    heroText: '#FFFFFF',
  },
  {
    id: 'neon-green',
    name: 'NEON GREEN',
    primary: '#22FF88',
    primaryDark: '#15803D',
    primaryRgb: '34, 255, 136',
    heroText: '#0A0A0A',
  },
  {
    id: 'sunset-orange',
    name: 'SUNSET ORANGE',
    primary: '#FF6B1A',
    primaryDark: '#C2410C',
    primaryRgb: '255, 107, 26',
    heroText: '#FFFFFF',
  },
  {
    id: 'royal-purple',
    name: 'ROYAL PURPLE',
    primary: '#9B5CFF',
    primaryDark: '#5B21B6',
    primaryRgb: '155, 92, 255',
    heroText: '#FFFFFF',
  },
  {
    id: 'crimson-red',
    name: 'CRIMSON RED',
    primary: '#FF2B2B',
    primaryDark: '#991B1B',
    primaryRgb: '255, 43, 43',
    heroText: '#FFFFFF',
  },
  {
    id: 'steel-gray',
    name: 'STEEL GRAY',
    primary: '#9E9E9E',
    primaryDark: '#525252',
    primaryRgb: '158, 158, 158',
    heroText: '#0A0A0A',
  },
  {
    id: 'rose-pink',
    name: 'ROSE PINK',
    primary: '#FF8FAB',
    primaryDark: '#C94C6D',
    primaryRgb: '255, 143, 171',
    heroText: '#0A0A0A',
  },
];

export const DEFAULT_THEME_ID = 'war-pink' as const;
