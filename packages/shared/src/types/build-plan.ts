export interface BuildPlan {
  id: number;
  projectId: number;
  title: string;
  difficulty: 'makkelijk' | 'gemiddeld' | 'moeilijk';
  estimatedHours: number | null;
  totalCostEstimate: number | null;
  safetyLevel: 'laag' | 'middel' | 'hoog';
  steps: BuildStep[];
  createdAt: string;
}

export interface BuildStep {
  id: number;
  order: number;
  title: string;
  description: string;
  tools: string[];
  materials: MaterialItem[];
  safetyWarnings: string[];
  estimatedMinutes: number | null;
  imageUrl: string | null;
  videoUrl: string | null;
  completed: boolean;
}

export interface MaterialItem {
  productId: number | null;
  name: string;
  quantity: number;
  unit: string;
  estimatedPrice: number | null;
}

export interface BuildPlanRequest {
  projectId: number;
  description: string;
  roomId: number | null;
  scope: string;
  skillLevel: 'beginner' | 'gemiddeld' | 'ervaren';
}
