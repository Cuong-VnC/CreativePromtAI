
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { GEMINI_TEXT_MODEL, GEMINI_MULTIMODAL_MODEL } from '../constants';
import { PromptMode } from "../types";

const getAiClient = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("API Key is not set.");
  }
  return new GoogleGenAI({ apiKey });
};

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedString = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve((reader.result as string).split(',')[1]);
      } else {
        reject(new Error("Failed to read file: result is null."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      mimeType: file.type,
      data: base64EncodedString,
    },
  };
};

export const generatePrompt = async (
  apiKey: string,
  // mode: PromptMode, // Mode is implicitly Text/Structured here
  userInput: string // This userInput is the combined structured string from the UI
): Promise<string> => {
  const ai = getAiClient(apiKey);
  
  const systemInstructionText = `You are an AI assistant that specializes in crafting expert-level prompts for other AI models.
Given a structured request detailing the Task, Context, Requirements, Language/Format, and Examples, your job is to synthesize this information into a single, coherent, and powerful prompt.
Adhere strictly to the specified Language/Format for the outputted prompt if provided in the user's request, otherwise generate a versatile text prompt.
Output ONLY the refined prompt itself, without any conversational fluff, introductory phrases, or repeating the [Task], [Context] like headers from the input.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: [{ role: "user", parts: [{ text: userInput }] }],
      config: {
        systemInstruction: systemInstructionText,
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      }
    });
    
    const textResponse = response.text;
    if (typeof textResponse === 'string') {
        return textResponse.trim();
    }
    console.error("Gemini API response.text was not a string:", response);
    throw new Error("Failed to get valid text from Gemini response for structured prompt.");

  } catch (error) {
    console.error("Gemini API error in generatePrompt (structured text):", error);
    if (error instanceof Error) {
       throw new Error(`Failed to generate prompt from Gemini (structured text): ${error.message}`);
    }
    throw new Error("Failed to generate prompt from Gemini (structured text) due to an unknown error.");
  }
};

export const generatePromptFromMedia = async (
  apiKey: string,
  file: File,
  userHint?: string
): Promise<string> => {
  const ai = getAiClient(apiKey);
  const systemInstructionText = `You are an AI assistant specialized in analyzing visual media (images and videos) and generating descriptive prompts suitable for AI art/video generators.
Based on the provided media and any user hint, create a concise, evocative, and detailed prompt.
The prompt should capture the main subjects, setting, style, mood, and any notable visual elements.
Focus on descriptive keywords and phrases that would be effective for an AI image/video generator.
Output ONLY the generated prompt text itself, without any conversational fluff or introductory phrases.`;

  try {
    const mediaPart = await fileToGenerativePart(file);
    const textParts: Part[] = [];
    if (userHint && userHint.trim() !== "") {
      textParts.push({ text: `User hint for generating the prompt: "${userHint}"` });
    } else {
      textParts.push({ text: "Describe the provided media to generate a prompt for an AI art/video generator." });
    }

    const contents = [{ role: "user", parts: [mediaPart, ...textParts] }];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MULTIMODAL_MODEL,
      contents: contents,
      config: {
        systemInstruction: systemInstructionText,
        temperature: 0.6, // Slightly less temperature for more factual description from media
        topP: 0.95,
        topK: 64,
      }
    });

    const textResponse = response.text;
    if (typeof textResponse === 'string') {
        return textResponse.trim();
    }
    console.error("Gemini API response.text was not a string for media prompt:", response);
    throw new Error("Failed to get valid text from Gemini response for media prompt.");

  } catch (error) {
    console.error("Gemini API error in generatePromptFromMedia:", error);
     if (error instanceof Error) {
       throw new Error(`Failed to generate prompt from media via Gemini: ${error.message}`);
    }
    throw new Error("Failed to generate prompt from media via Gemini due to an unknown error.");
  }
};


export const translateText = async (apiKey: string, text: string, targetLanguage: 'Vietnamese' | 'English'): Promise<string> => {
  const ai = getAiClient(apiKey);
  const prompt = `Translate the following text accurately into ${targetLanguage}:\n\n"${text}"\n\nOutput only the translated text.`;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: [{ role: "user", parts: [{text: prompt}] }],
       config: {
        temperature: 0.3, 
      }
    });

    const textResponse = response.text;
    if (typeof textResponse === 'string') {
        return textResponse.trim();
    }
    console.error("Gemini API translation response.text was not a string:", response);
    throw new Error("Failed to get valid text from Gemini translation response.");

  } catch (error)
 {
    console.error("Gemini API translation error:", error);
     if (error instanceof Error) {
       throw new Error(`Failed to translate text via Gemini: ${error.message}`);
    }
    throw new Error("Failed to translate text via Gemini due to an unknown error.");
  }
};
