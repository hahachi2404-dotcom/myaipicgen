import React from 'react';
import { ColorFilter } from '../types';

interface ResultViewerProps {
  generatedImage: string | null;
  isGenerating: boolean;
  onDownload: () => void;
  activeFilter: ColorFilter;
}

const getFilterStyle = (filter: ColorFilter): React.CSSProperties => {
  switch (filter) {
    case ColorFilter.SEPIA:
      return { filter: 'sepia(0.8) contrast(1.1)' };
    case ColorFilter.GRAYSCALE:
      return { filter: 'grayscale(1) contrast(1.1)' };
    case ColorFilter.COOL:
      // A cool tone: use sepia for tint base, then hue-rotate to blue, and increase saturation
      return { filter: 'sepia(1) hue-rotate(180deg) saturate(1.5) contrast(1.1)' };
    case ColorFilter.WARM:
      return { filter: 'sepia(0.4) saturate(1.4) contrast(1.05)' };
    case ColorFilter.NONE:
    default:
      return {};
  }
};

export const ResultViewer: React.FC<ResultViewerProps> = ({ 
  generatedImage, 
  isGenerating, 
  onDownload: onDownloadProp,
  activeFilter 
}) => {

  const handleDownload = () => {
    if (!generatedImage) return;

    // Create a temporary canvas to burn in the CSS filter
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        // Translate CSS filter string to Canvas filter string
        // Note: Canvas filter syntax is very similar to CSS
        let filterString = 'none';
        switch (activeFilter) {
          case ColorFilter.SEPIA:
            filterString = 'sepia(0.8) contrast(1.1)';
            break;
          case ColorFilter.GRAYSCALE:
            filterString = 'grayscale(1) contrast(1.1)';
            break;
          case ColorFilter.COOL:
            filterString = 'sepia(1) hue-rotate(180deg) saturate(1.5) contrast(1.1)';
            break;
          case ColorFilter.WARM:
            filterString = 'sepia(0.4) saturate(1.4) contrast(1.05)';
            break;
        }
        ctx.filter = filterString;
        ctx.drawImage(img, 0, 0);
        
        // Trigger download
        const link = document.createElement('a');
        link.download = `gemini-sketch-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
    img.src = generatedImage;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">生成结果</h3>
        {activeFilter !== ColorFilter.NONE && generatedImage && (
          <span className="text-xs text-indigo-600 font-medium px-2 py-0.5 bg-indigo-50 rounded-full">
            已应用滤镜: {activeFilter.split(' ')[0]}
          </span>
        )}
      </div>
      <div className="relative flex-grow rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
        {isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-600 font-medium animate-pulse">AI 正在绘制中...</p>
            <p className="text-slate-400 text-xs mt-2">Gemini 3 正在分析图像细节</p>
          </div>
        ) : generatedImage ? (
          <div className="relative w-full h-full group">
            <img 
              src={generatedImage} 
              alt="Generated Sketch" 
              style={getFilterStyle(activeFilter)}
              className="w-full h-full object-contain bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-white transition-all duration-300" 
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end z-10">
              <button
                onClick={handleDownload}
                className="bg-white hover:bg-slate-100 text-slate-900 px-4 py-2 rounded-lg font-medium shadow-lg flex items-center gap-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                下载图片 (含滤镜)
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 opacity-40">
            <div className="w-16 h-16 mx-auto bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">预览将在此处显示</p>
          </div>
        )}
      </div>
    </div>
  );
};