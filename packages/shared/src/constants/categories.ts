export const MODULE_TILES = [
  {
    key: 'paint',
    icon: '🎨',
    title: 'Verf & Kleuren',
    subtitle: 'Kleur je muur',
    gradient: ['#FF6B6B', '#EE5A24'],
    route: 'PaintStack',
  },
  {
    key: 'design',
    icon: '🛋️',
    title: 'Ontwerp & Inspiratie',
    subtitle: 'Stijl ontdekken',
    gradient: ['#6C5CE7', '#A29BFE'],
    route: 'DesignStack',
  },
  {
    key: 'space',
    icon: '🧱',
    title: 'Mijn Ruimte',
    subtitle: 'Digitaal model',
    gradient: ['#00B894', '#55E6C1'],
    route: 'SpaceStack',
  },
  {
    key: 'budget',
    icon: '💰',
    title: 'Budget & Duurzaamheid',
    subtitle: 'Slim besparen',
    gradient: ['#FDCB6E', '#F39C12'],
    route: 'BudgetStack',
  },
  {
    key: 'build',
    icon: '🛠️',
    title: 'Bouw & Klushulp',
    subtitle: 'Stap voor stap',
    gradient: ['#E17055', '#D63031'],
    route: 'BuildStack',
  },
  {
    key: 'reverse',
    icon: '📸',
    title: 'Voorbeeld Nadoen',
    subtitle: 'Pinterest → winkel',
    gradient: ['#0984E3', '#74B9FF'],
    route: 'ReverseStack',
  },
] as const;

export const DESIGN_STYLES = [
  { key: 'japandi', label: 'Japandi', description: 'Japans minimalisme meets Scandinavische warmte' },
  { key: 'scandinavisch', label: 'Scandinavisch', description: 'Licht, functioneel en gezellig' },
  { key: 'modern', label: 'Modern', description: 'Strakke lijnen en hedendaags design' },
  { key: 'industrieel', label: 'Industrieel', description: 'Ruw, stoer en authentiek' },
  { key: 'landelijk', label: 'Landelijk', description: 'Warm, natuurlijk en tijdloos' },
  { key: 'bohemian', label: 'Bohemian', description: 'Kleurrijk, eclectisch en persoonlijk' },
  { key: 'minimalistisch', label: 'Minimalistisch', description: 'Minder is meer' },
] as const;

export const STORES = [
  { key: 'gamma', label: 'Gamma', baseUrl: 'https://www.gamma.nl' },
  { key: 'praxis', label: 'Praxis', baseUrl: 'https://www.praxis.nl' },
  { key: 'ikea', label: 'IKEA', baseUrl: 'https://www.ikea.com/nl/nl' },
  { key: 'karwei', label: 'Karwei', baseUrl: 'https://www.karwei.nl' },
  { key: 'kwantum', label: 'Kwantum', baseUrl: 'https://www.kwantum.nl' },
] as const;

export const ROOM_TYPES = [
  'woonkamer',
  'slaapkamer',
  'keuken',
  'badkamer',
  'toilet',
  'hal',
  'kinderkamer',
  'werkkamer',
  'zolder',
  'kelder',
  'garage',
  'tuin',
] as const;

export const PAINT_FINISHES = [
  { key: 'mat', label: 'Mat' },
  { key: 'zijdemat', label: 'Zijdemat' },
  { key: 'zijdeglans', label: 'Zijdeglans' },
  { key: 'hoogglans', label: 'Hoogglans' },
] as const;
