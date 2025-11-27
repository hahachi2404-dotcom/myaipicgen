import { GoogleGenAI } from "@google/genai";
import { SketchStyle, StrokeWidth, DetailLevel } from "../types";

export const checkApiKey = async (): Promise<boolean> => {
  const win = window as any;
  if (win.aistudio) {
    return await win.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const promptSelectKey = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio) {
    await win.aistudio.openSelectKey();
  }
};

const fileToPart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
};

export const generateSketch = async (
  base64Image: string,
  style: SketchStyle,
  strokeWidth: StrokeWidth,
  detailLevel: DetailLevel,
  additionalPrompt: string
): Promise<string> => {
  // Always initialize a new instance to ensure we pick up the selected key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Clean the base64 string (remove data URL prefix if present)
  const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
  const mimeType = "image/png"; // Assuming generic support or converted input

  let detailInstruction = "";
  switch (detailLevel) {
    case DetailLevel.LOW:
      detailInstruction = "Focus on main contours and shapes only. Ignore minor textures and small details. Minimalist approach.";
      break;
    case DetailLevel.HIGH:
      detailInstruction = "Capture every texture, shadow, and fine detail. High fidelity to the original textures.";
      break;
    default:
      detailInstruction = "Maintain a balanced level of detail, capturing key features without overcrowding the image.";
      break;
  }

  const prompt = `
    Task: Transform the attached image into a high-quality artistic sketch.
    
    Style Requirement: ${style}
    Line Weight: ${strokeWidth}
    Detail Level: ${detailLevel}
    
    Instructions:
    - Maintain the original composition, perspective, and main subject details accurately.
    - ${detailInstruction}
    - If style is 'Crayon' or 'Pastel', allow for some soft color accents, otherwise keep it monochromatic/black and white.
    - Ensure high contrast between the lines and the background.
    - Background should be mostly white or paper-textured appropriate for the style.
    - ${additionalPrompt}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [
          fileToPart(base64Data, mimeType),
          { text: prompt }
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          // imageSize is not supported in gemini-2.5-flash-image
        }
      },
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data found in response");

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    // Handling specific error for missing key if needed, though usually handled by checks
    if (error.message && error.message.includes("Requested entity was not found")) {
        throw new Error("API Key issue. Please re-select your key.");
    }
    throw error;
  }
};