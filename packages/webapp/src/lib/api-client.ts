import type {
  SegmentResponse,
  SegmentMask,
  PointSegmentRequest,
  PaintRequest,
  PaintResponse,
  ColorSearchRequest,
  PaintColor,
  RoomAnalysisResponse,
  DesignRequest,
  DesignSuggestionResponse,
  DesignStyleInfo,
  ProductSearchParams,
  ProductSearchResult,
  Product,
  BuildPlanRequest,
  BuildPlan,
  ReverseAnalysisResponse,
  LiveHelpMessage,
  LiveHelpResponse,
  HealthResponse,
} from '@/types/api';

// ============================================================
// KlusAI API Client
// ============================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_V1 = `${API_BASE}/api/v1`;

// ---- Helpers ----

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(res.status, body || res.statusText);
  }

  return res.json() as Promise<T>;
}

async function uploadFile<T>(url: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(res.status, body || res.statusText);
  }

  return res.json() as Promise<T>;
}

// ---- Health ----

export async function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>(`${API_BASE}/health`);
}

// ---- Segmentation ----

export async function segmentAuto(image: File): Promise<SegmentResponse> {
  return uploadFile<SegmentResponse>(`${API_V1}/segment/auto`, image);
}

export async function segmentPoint(data: PointSegmentRequest): Promise<SegmentMask> {
  return request<SegmentMask>(`${API_V1}/segment/point`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ---- Paint ----

export async function applyPaint(data: PaintRequest): Promise<PaintResponse> {
  return request<PaintResponse>(`${API_V1}/paint/apply`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function searchColors(data: ColorSearchRequest): Promise<PaintColor[]> {
  return request<PaintColor[]>(`${API_V1}/paint/search-colors`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAllColors(params?: {
  brand?: string;
  search?: string;
  limit?: number;
}): Promise<PaintColor[]> {
  const searchParams = new URLSearchParams();
  if (params?.brand) searchParams.set('brand', params.brand);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  return request<PaintColor[]>(`${API_V1}/paint/colors?${searchParams.toString()}`);
}

export async function getPaintBrands(): Promise<string[]> {
  return request<string[]>(`${API_V1}/paint/brands`);
}

// ---- Room Analysis ----

export async function analyzeRoom(image: File): Promise<RoomAnalysisResponse> {
  return uploadFile<RoomAnalysisResponse>(`${API_V1}/analyze-room/`, image);
}

// ---- Design ----

export async function suggestDesign(data: DesignRequest): Promise<DesignSuggestionResponse> {
  return request<DesignSuggestionResponse>(`${API_V1}/design/suggest`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getDesignStyles(): Promise<DesignStyleInfo[]> {
  return request<DesignStyleInfo[]>(`${API_V1}/design/styles`);
}

// ---- Products ----

export async function searchProducts(params: ProductSearchParams): Promise<ProductSearchResult> {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set('query', params.query);
  if (params.store) searchParams.set('store', params.store);
  if (params.category) searchParams.set('category', params.category);
  if (params.min_price != null) searchParams.set('min_price', String(params.min_price));
  if (params.max_price != null) searchParams.set('max_price', String(params.max_price));
  if (params.eco_score) searchParams.set('eco_score', params.eco_score);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.per_page) searchParams.set('per_page', String(params.per_page));

  return request<ProductSearchResult>(`${API_V1}/products/?${searchParams.toString()}`);
}

export async function getProduct(productId: number): Promise<Product> {
  return request<Product>(`${API_V1}/products/${productId}`);
}

// ---- Build Plan ----

export async function createBuildPlan(data: BuildPlanRequest): Promise<BuildPlan> {
  return request<BuildPlan>(`${API_V1}/build-plan/create`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ---- Reverse Engineering ----

export async function reverseAnalyze(image: File): Promise<ReverseAnalysisResponse> {
  return uploadFile<ReverseAnalysisResponse>(`${API_V1}/reverse/analyze`, image);
}

// ---- Live Help (WebSocket) ----

export function createLiveHelpSocket(
  onMessage: (data: LiveHelpResponse) => void,
  onError?: (error: Event) => void,
  onClose?: () => void,
): WebSocket {
  const wsBase = API_BASE.replace(/^http/, 'ws');
  const ws = new WebSocket(`${wsBase}/api/v1/live-help/ws`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data) as LiveHelpResponse;
    onMessage(data);
  };

  if (onError) ws.onerror = onError;
  if (onClose) ws.onclose = onClose;

  return ws;
}

export function sendLiveHelpFrame(ws: WebSocket, data: LiveHelpMessage): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

export { ApiError };
