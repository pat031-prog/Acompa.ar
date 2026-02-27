/**
 * DeepInfra Service
 * Provides AI responses using DeepInfra API (OpenAI-compatible)
 * Models: meta-llama/Meta-Llama-3.1-70B-Instruct, etc.
 */

import { SYSTEM_PROMPT } from '../constants';
import type { HistoryContent, ConsentData, Source } from '../types';

interface DeepInfraMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepInfraResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Gets a response from DeepInfra using OpenAI-compatible API
 * @param message The user's message
 * @param history The chat history
 * @param consent The user's consent data
 * @param apiKey The DeepInfra API key
 * @returns An object containing the chatbot's response text and sources
 */
export const getDeepInfraResponse = async (
  message: string,
  history: HistoryContent[],
  consent: ConsentData,
  apiKey: string
): Promise<{ text: string; sources: Source[] }> => {
  try {
    // Convert history to DeepInfra format
    const messages: DeepInfraMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(h => ({
        role: h.role === 'model' ? 'assistant' as const : 'user' as const,
        content: h.parts[0].text
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepInfra API Error:', response.status, errorData);

      if (response.status === 401) {
        return {
          text: 'La API key de DeepInfra no es válida. Por favor, verifica tu clave y recarga la página.',
          sources: []
        };
      }

      return {
        text: 'Hubo un problema al conectar con el servicio de IA. Por favor, intentalo más tarde.',
        sources: []
      };
    }

    const data: DeepInfraResponse = await response.json();
    const responseText = data.choices[0]?.message?.content;

    if (!responseText) {
      return {
        text: 'No pude generar una respuesta. Por favor, intenta de nuevo.',
        sources: []
      };
    }

    // DeepInfra doesn't provide web search grounding by default
    // Sources would need to be implemented separately (e.g., via Tavily, Perplexity API)
    return {
      text: responseText,
      sources: []
    };

  } catch (error) {
    console.error('DeepInfra Service Error:', error);
    return {
      text: 'Hubo un problema al conectar con el servicio de IA. Por favor, intentalo más tarde.',
      sources: []
    };
  }
};
