// ============================================================
// KlusAI API Types — mirrors FastAPI Pydantic models
// ============================================================

// ---- Segmentation ----

export interface SegmentMask {
  id: number;
  polygon: number[][];
  area: number;
  label: string;
  segment_type: string;
}

export interface SegmentResponse {
  masks: SegmentMask[];
  image_width: number;
  image_height: number;
}

export interface PointSegmentRequest {
  image_base64: string;
  point_x: number;
  point_y: number;
}

// ---- Paint ----

export interface PaintRequest {
  image_base64: string;
  mask_id: number;
  color_hex: string;
  brightness?: number;
  warmth?: number;
}

export interface PaintResponse {
  preview_image_base64: string;
  applied_color_hex: string;
  estimated_area_m2: number | null;
  estimated_liters: number | null;
  estimated_cost: number | null;
}

export interface ColorSearchRequest {
  hex_code: string;
  limit?: number;
  brand?: string;
  finish?: string;
}

export interface PaintColor {
  id: number;
  brand: string;
  collection: string | null;
  name: string;
  hex_code: string;
  price_per_liter: number | null;
  coverage_m2: number | null;
  eco_score: string | null;
  product_url: string | null;
  finish: string | null;
}

// ---- Room Analysis ----

export interface RoomAnalysisResponse {
  room_type: string;
  walls: { position: string; color: string; condition: string; area_m2: number }[];
  windows: { type: string; wall_position: string; estimated_size: string }[];
  doors: { type: string; wall_position: string }[];
  floor: { type: string; condition: string; color: string };
  ceiling: { type: string; color: string; height: string };
  furniture: { name: string; type: string; estimated_size: string; position: string; style: string }[];
  lighting: { natural: string; artificial: string[]; overall_brightness: string };
  estimated_dimensions: { width_m: number; length_m: number; height_m: number };
  style_assessment: string;
}

// ---- Design ----

export interface DesignRequest {
  room_id?: number;
  style: DesignStyle;
  budget_min?: number | null;
  budget_max?: number | null;
  preferences?: string[];
}

export type DesignStyle =
  | 'japandi'
  | 'scandinavisch'
  | 'modern'
  | 'industrieel'
  | 'landelijk'
  | 'bohemian'
  | 'minimalistisch';

export interface DesignStyleInfo {
  key: DesignStyle;
  description: string;
}

export interface DesignSuggestionResponse {
  style: string;
  description: string;
  color_palette: { role: string; hex_code: string; paint_name: string; paint_brand: string }[];
  furniture_changes: {
    action: string;
    item: string;
    suggestion: string;
    product_name: string;
    store: string;
    estimated_price: number;
  }[];
  lighting_suggestions: string[];
  accessories: {
    type: string;
    description: string;
    product_name: string;
    store: string;
    estimated_price: number;
  }[];
  budget_breakdown: { category: string; description: string; estimated_cost: number }[];
  total_estimated_cost: number;
  mood_keywords: string[];
}

// ---- Products ----

export interface Product {
  id: number;
  store: string;
  category: string;
  subcategory: string | null;
  name: string;
  description: string | null;
  price: number | null;
  unit: string | null;
  product_url: string | null;
  image_url: string | null;
  brand: string | null;
  eco_score: string | null;
  in_stock: boolean;
  tags: string[] | null;
}

export interface ProductSearchParams {
  query?: string;
  store?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  eco_score?: string;
  page?: number;
  per_page?: number;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  per_page: number;
}

// ---- Build Plan ----

export interface BuildPlanRequest {
  project_id?: number;
  description: string;
  room_id?: number | null;
  scope?: string;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface BuildStep {
  order: number;
  title: string;
  description: string;
  tools: string[];
  materials: { name: string; quantity: number; unit: string; estimated_price: number }[];
  safety_warnings: string[];
  estimated_mins: number | null;
}

export interface BuildPlan {
  title: string;
  difficulty: 'makkelijk' | 'gemiddeld' | 'moeilijk';
  estimated_hours: number | null;
  total_cost_est: number | null;
  safety_level: string | null;
  steps: BuildStep[];
}

// ---- Reverse Engineering ----

export interface ReverseAnalysisResponse {
  style_name: string;
  description: string;
  color_palette: { role: string; hex_code: string; name: string }[];
  furniture: {
    item: string;
    material: string;
    estimated_product: string;
    store: string;
    estimated_price: number;
  }[];
  materials: { type: string; description: string }[];
  lighting: { type: string; description: string };
  how_to_recreate: string[];
  total_estimated_cost: number;
}

// ---- Live Help (WebSocket) ----

export interface LiveHelpMessage {
  image_base64: string;
  question: string;
}

export interface LiveHelpResponse {
  response?: string;
  error?: string;
}

// ---- Health ----

export interface HealthResponse {
  status: string;
  version: string;
}
