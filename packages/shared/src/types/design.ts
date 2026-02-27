export type DesignStyle =
  | 'japandi'
  | 'scandinavisch'
  | 'modern'
  | 'industrieel'
  | 'landelijk'
  | 'bohemian'
  | 'minimalistisch';

export interface DesignRequest {
  roomId: number;
  style: DesignStyle;
  budgetMin: number | null;
  budgetMax: number | null;
  preferences: string[]; // "meer warm", "goedkoper", etc.
}

export interface DesignSuggestion {
  id: string;
  style: DesignStyle;
  description: string;
  colorPalette: ColorPaletteItem[];
  furnitureChanges: FurnitureChange[];
  lightingSuggestions: string[];
  accessories: AccessoryRecommendation[];
  budgetBreakdown: BudgetItem[];
  totalEstimatedCost: number;
  moodKeywords: string[];
}

export interface ColorPaletteItem {
  role: string; // "hoofdkleur muren", "accentkleur", "houtwerk"
  hexCode: string;
  paintName: string | null;
  paintBrand: string | null;
}

export interface FurnitureChange {
  action: 'toevoegen' | 'vervangen' | 'verwijderen' | 'verplaatsen';
  item: string;
  suggestion: string | null;
  productName: string | null;
  store: string | null;
  estimatedPrice: number | null;
}

export interface AccessoryRecommendation {
  type: string;
  description: string;
  productName: string | null;
  store: string | null;
  estimatedPrice: number | null;
}

export interface BudgetItem {
  category: string;
  description: string;
  estimatedCost: number;
}
