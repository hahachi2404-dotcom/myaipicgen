import React from 'react';
import { SketchStyle, StrokeWidth, DetailLevel, GenerationSettings, ColorFilter } from '../types';

interface ControlPanelProps {
  settings: GenerationSettings;
  setSettings: React.Dispatch<React.SetStateAction<GenerationSettings>>;
  activeFilter: ColorFilter;
  setActiveFilter: (filter: ColorFilter) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
  hasResult: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  settings, 
  setSettings, 
  activeFilter,
  setActiveFilter,
  onGenerate, 
  isGenerating,
  disabled,
  hasResult
}) => {
  
  const handleChange = <K extends keyof GenerationSettings>(key: K, value: GenerationSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-y-auto">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2 sticky top-0 bg-white z-10 py-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        生成设置
      </h3>

      <div className="space-y-6 flex-grow">
        {/* Style Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            艺术风格 (Style)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(SketchStyle).map((style) => (
              <button
                key={style}
                onClick={() => handleChange('style', style)}
                className={`text-left px-4 py-2.5 rounded-lg border transition-all duration-200 text-sm flex items-center justify-between ${
                  settings.style === style
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{style.split('(')[0]}</span>
                <span className="text-xs opacity-60 ml-2">{style.split('(')[1].replace(')', '')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stroke Width Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            笔触粗细 (Line Weight)
          </label>
          <div className="flex gap-2">
            {Object.values(StrokeWidth).map((width) => (
              <button
                key={width}
                onClick={() => handleChange('strokeWidth', width)}
                className={`flex-1 px-2 py-2 rounded-lg border text-center text-xs sm:text-sm transition-all duration-200 ${
                  settings.strokeWidth === width
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {width.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Detail Level Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            细节锐度 (Detail Level)
          </label>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {Object.values(DetailLevel).map((level) => (
              <button
                key={level}
                onClick={() => handleChange('detailLevel', level)}
                className={`flex-1 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                  settings.detailLevel === level
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {level.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Color Filters - Only enabled if we have a result usually, but user can pre-select */}
        <div className={`transition-opacity duration-300 ${hasResult ? 'opacity-100' : 'opacity-60 grayscale'}`}>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between">
            <span>后期滤镜 (Filter)</span>
            {!hasResult && <span className="text-xs font-normal text-slate-400">生成后应用</span>}
          </label>
          <div className="grid grid-cols-5 gap-2">
            {Object.values(ColorFilter).map((filter) => {
               let bgClass = "bg-white";
               if (filter === ColorFilter.SEPIA) bgClass = "bg-[#f4e4bc]";
               if (filter === ColorFilter.COOL) bgClass = "bg-[#dbeafe]";
               if (filter === ColorFilter.WARM) bgClass = "bg-[#fff1f2]";
               if (filter === ColorFilter.GRAYSCALE) bgClass = "bg-gray-200";

               return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  disabled={!hasResult}
                  className={`aspect-square rounded-full border-2 flex items-center justify-center transition-all duration-200 relative group ${
                    activeFilter === filter
                      ? 'border-indigo-600 scale-110 shadow-md'
                      : 'border-slate-200 hover:scale-105'
                  } ${bgClass}`}
                  title={filter}
                >
                  {activeFilter === filter && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  )}
                  <span className="absolute -bottom-6 text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 whitespace-nowrap bg-white px-1 py-0.5 rounded shadow z-10">
                    {filter.split(' ')[0]}
                  </span>
                </button>
               );
            })}
          </div>
        </div>

      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 sticky bottom-0 bg-white">
        <button
          onClick={onGenerate}
          disabled={disabled || isGenerating}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            disabled || isGenerating
              ? 'bg-slate-300 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:shadow-indigo-500/30 active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              正在绘制...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              生成素描
            </>
          )}
        </button>
      </div>
    </div>
  );
};