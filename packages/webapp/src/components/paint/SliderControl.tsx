'use client';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  gradient?: string;
}

export default function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  gradient,
}: SliderControlProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#1A1A2E]">{label}</span>
        <span className="text-sm tabular-nums text-[#6B7280]">
          {value}{unit}
        </span>
      </div>
      <div className="relative">
        <div className="h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${percent}%`,
              background: gradient || '#4A90D9',
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
