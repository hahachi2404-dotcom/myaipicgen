import React, { useState, useEffect } from 'react';
import { checkApiKey, promptSelectKey, generateSketch } from './services/geminiService';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ImageUploader } from './components/ImageUploader';
import { ResultViewer } from './components/ResultViewer';
import { ControlPanel } from './components/ControlPanel';
import { SketchStyle, StrokeWidth, DetailLevel, ColorFilter, GenerationSettings } from './types';

function App() {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [checkingKey, setCheckingKey] = useState<boolean>(true);
  
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const [settings, setSettings] = useState<GenerationSettings>({
    style: SketchStyle.PENCIL,
    strokeWidth: StrokeWidth.MEDIUM,
    detailLevel: DetailLevel.MEDIUM,
    promptEnhancement: ''
  });

  const [activeFilter, setActiveFilter] = useState<ColorFilter>(ColorFilter.NONE);

  useEffect(() => {
    const verifyKey = async () => {
      try {
        const keyExists = await checkApiKey();
        setHasKey(keyExists);
      } catch (e) {
        console.error("Failed to check API key", e);
      } finally {
        setCheckingKey(false);
      }
    };
    verifyKey();
  }, []);

  const handleSelectKey = async () => {
    try {
      await promptSelectKey();
      // Assume success after dialog interaction to avoid race conditions
      setHasKey(true);
    } catch (e) {
      console.error("Failed to select key", e);
    }
  };

  const handleGenerate = async () => {
    if (!originalImage) return;

    setIsGenerating(true);
    setGeneratedImage(null); // Clear previous result while generating
    setActiveFilter(ColorFilter.NONE); // Reset filter on new generation

    try {
      // Re-verify key exists before call, just in case, or to trigger re-selection
      const result = await generateSketch(
        originalImage,
        settings.style,
        settings.strokeWidth,
        settings.detailLevel,
        settings.promptEnhancement
      );
      setGeneratedImage(result);
    } catch (error: any) {
      console.error(error);
      if (error.message && error.message.includes("API Key")) {
        setHasKey(false); // Trigger modal again
      } else {
        alert("生成失败，请重试。错误信息: " + error.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    // This is now handled inside ResultViewer to capture canvas filters, 
    // but we keep this as a fallback stub or for logic moved from viewer if needed later.
    // The actual execution is in ResultViewer.tsx
  };

  if (checkingKey) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-12">
      {/* API Key Modal Overlay */}
      {!hasKey && <ApiKeyModal onSelectKey={handleSelectKey} />}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-violet-700">
              Gemini Sketchify
            </h1>
          </div>
          <div className="text-xs text-slate-400 font-medium px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column (Left on Desktop) */}
          <div className="lg:col-span-3 order-2 lg:order-1 h-[calc(100vh-12rem)] min-h-[500px]">
            <ControlPanel 
              settings={settings}
              setSettings={setSettings}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              disabled={!originalImage}
              hasResult={!!generatedImage}
            />
          </div>

          {/* Workspace (Center + Right) */}
          <div className="lg:col-span-9 order-1 lg:order-2 h-[calc(100vh-12rem)] min-h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* Input Area */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-full">
                <ImageUploader 
                  currentImage={originalImage} 
                  onImageSelected={setOriginalImage} 
                />
              </div>

              {/* Output Area */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-full">
                <ResultViewer 
                  generatedImage={generatedImage}
                  isGenerating={isGenerating}
                  onDownload={handleDownload}
                  activeFilter={activeFilter}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;