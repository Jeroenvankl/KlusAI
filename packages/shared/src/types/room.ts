export interface RoomAnalysis {
  roomType: string;
  walls: WallInfo[];
  windows: WindowInfo[];
  doors: DoorInfo[];
  floor: FloorInfo;
  ceiling: CeilingInfo;
  furniture: FurnitureItem[];
  lighting: LightingInfo;
  estimatedDimensions: RoomDimensions;
  styleAssessment: string;
}

export interface WallInfo {
  id: number;
  position: string; // "noord", "oost", "zuid", "west"
  color: string; // hex
  condition: string;
  areaM2: number | null;
}

export interface WindowInfo {
  id: number;
  type: string; // "draairaam", "schuifraam", "dakraam"
  wallPosition: string;
  estimatedSize: string;
}

export interface DoorInfo {
  id: number;
  type: string; // "binnendeur", "buitendeur", "schuifdeur"
  wallPosition: string;
}

export interface FloorInfo {
  type: string; // "laminaat", "tegels", "hout", "beton"
  condition: string;
  color: string;
}

export interface CeilingInfo {
  type: string; // "gestuukt", "plafondplaten", "houten balken"
  color: string;
  height: number | null;
}

export interface FurnitureItem {
  name: string;
  type: string;
  estimatedSize: string;
  position: string;
  style: string;
}

export interface LightingInfo {
  natural: string;
  artificial: string[];
  overallBrightness: string;
}

export interface RoomDimensions {
  widthM: number | null;
  lengthM: number | null;
  heightM: number | null;
}

export interface Room {
  id: number;
  projectId: number;
  name: string;
  originalImage: string;
  roomType: string | null;
  dimensions: RoomDimensions | null;
  analysisData: RoomAnalysis | null;
  createdAt: string;
}
