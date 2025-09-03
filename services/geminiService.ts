
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import type { HistoryContent, ConsentData, Source } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gets a response from the Gemini model, using Google Search for grounding.
 * @param message The user's message.
 * @param history The chat history.
 * @param consent The user's consent data.
 * @returns An object containing the chatbot's response text and any sources used.
 */
export const getChatbotResponse = async (
  message: string,
  history: HistoryContent[],
  consent: ConsentData
): Promise<{ text: string; sources: Source[] }> => {
  try {
    // NOTE: Consent data is available here for potential anonymous logging.
    // Example: if (consent.share) { logToObservatory(consent.province, message); }
    
    const contents = [...history, { role: 'user' as const, parts: [{ text: message }] }];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        tools: [{ googleSearch: {} }],
      },
    });

    const responseText = response.text;
    
    // Extract sources from grounding metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    let sources: Source[] = [];
    if (groundingChunks) {
      const uniqueSources = new Map<string, string>();
      for (const chunk of groundingChunks) {
        if (chunk.web && chunk.web.uri) {
           uniqueSources.set(chunk.web.uri, chunk.web.title || '');
        }
      }
      sources = Array.from(uniqueSources, ([uri, title]) => ({ uri, title }));
    }

    if (!responseText) {
      return {
        text: 'No pude generar una respuesta. Por favor, intenta de nuevo.',
        sources: [],
      };
    }
    
    return { text: responseText, sources };

  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      text: 'Hubo un problema al conectar con el servicio de IA. Por favor, intentalo más tarde.',
      sources: [],
    };
  }
};