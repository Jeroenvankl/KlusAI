import type { DesignStyle } from '@/types/api';
import {
  Paintbrush,
  Lightbulb,
  ScanLine,
  Wallet,
  Hammer,
  Camera,
  Video,
  type LucideIcon,
} from 'lucide-react';

// ============================================================
// Constants — gradients & colours from mobile theme
// ============================================================

export interface ModuleItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  emoji: string;
  description: string;
  gradient: readonly [string, string];
}

export const MODULES: ModuleItem[] = [
  {
    key: 'paint',
    label: 'Verf & Kleuren',
    href: '/verf',
    icon: Paintbrush,
    emoji: '\uD83C\uDFA8',
    description: 'Kleur je muur',
    gradient: ['#FF6B6B', '#EE5A24'],
  },
  {
    key: 'design',
    label: 'Ontwerp & Inspiratie',
    href: '/ontwerp',
    icon: Lightbulb,
    emoji: '\uD83D\uDECB\uFE0F',
    description: 'Stijl ontdekken',
    gradient: ['#6C5CE7', '#A29BFE'],
  },
  {
    key: 'space',
    label: 'Mijn Ruimte',
    href: '/mijn-ruimte',
    icon: ScanLine,
    emoji: '\uD83E\uDDF1',
    description: 'Digitaal model',
    gradient: ['#00B894', '#55E6C1'],
  },
  {
    key: 'budget',
    label: 'Budget & Duurzaamheid',
    href: '/budget',
    icon: Wallet,
    emoji: '\uD83D\uDCB0',
    description: 'Slim besparen',
    gradient: ['#FDCB6E', '#F39C12'],
  },
  {
    key: 'build',
    label: 'Bouw & Klushulp',
    href: '/bouw',
    icon: Hammer,
    emoji: '\uD83D\uDEE0\uFE0F',
    description: 'Stap voor stap',
    gradient: ['#E17055', '#D63031'],
  },
  {
    key: 'reverse',
    label: 'Voorbeeld Nadoen',
    href: '/voorbeeld-nadoen',
    icon: Camera,
    emoji: '\uD83D\uDCF8',
    description: 'Pinterest \u2192 winkel',
    gradient: ['#0984E3', '#74B9FF'],
  },
];

export const LIVE_HULP: ModuleItem = {
  key: 'live',
  label: 'Live Hulp',
  href: '/live-hulp',
  icon: Video,
  emoji: '\uD83D\uDCF9',
  description: 'Realtime camera klushulp',
  gradient: ['#E67E22', '#F39C12'],
};

export const NAV_ITEMS: ModuleItem[] = [...MODULES, LIVE_HULP];

export const DESIGN_STYLES: Record<DesignStyle, { label: string; emoji: string }> = {
  japandi: { label: 'Japandi', emoji: '\uD83C\uDF8E' },
  scandinavisch: { label: 'Scandinavisch', emoji: '\u2744\uFE0F' },
  modern: { label: 'Modern', emoji: '\uD83C\uDFD9\uFE0F' },
  industrieel: { label: 'Industrieel', emoji: '\uD83C\uDFED' },
  landelijk: { label: 'Landelijk', emoji: '\uD83C\uDF3E' },
  bohemian: { label: 'Bohemian', emoji: '\uD83C\uDF38' },
  minimalistisch: { label: 'Minimalistisch', emoji: '\u25FB\uFE0F' },
};

export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'Weinig tot geen ervaring' },
  { value: 'intermediate', label: 'Gevorderd', description: 'Basiskennis aanwezig' },
  { value: 'advanced', label: 'Expert', description: 'Ruime ervaring' },
] as const;
