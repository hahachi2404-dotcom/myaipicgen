export enum SketchStyle {
  PENCIL = '铅笔素描 (Realistic Pencil)',
  CHARCOAL = '炭笔画 (Rough Charcoal)',
  CRAYON = '柔和蜡笔 (Soft Crayon)',
  INK = '钢笔线条 (Ink Outline)',
  MARKER = '马克笔速写 (Marker Sketch)'
}

export enum StrokeWidth {
  THIN = '细腻 (Fine)',
  MEDIUM = '标准 (Medium)',
  THICK = '粗犷 (Bold)'
}

export enum DetailLevel {
  LOW = '简约 (Minimalist)',
  MEDIUM = '标准 (Standard)',
  HIGH = '精细 (Detailed)'
}

export enum ColorFilter {
  NONE = '原色 (None)',
  GRAYSCALE = '黑白 (Grayscale)',
  SEPIA = '复古 (Sepia)',
  COOL = '冷色 (Cool)',
  WARM = '暖色 (Warm)'
}

export interface GenerationSettings {
  style: SketchStyle;
  strokeWidth: StrokeWidth;
  detailLevel: DetailLevel;
  promptEnhancement: string;
}

export interface ImageState {
  original: string | null; // Base64
  generated: string | null; // Base64
  loading: boolean;
  error: string | null;
}