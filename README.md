

# ACompañ.Ar: Chatbot & Observatorio de Consumos

**ACompañ.Ar** es un prototipo de aplicación web diseñada como una herramienta integral de reducción de daños para el consumo de sustancias en Argentina.

Su objetivo es doble:

1.  Ofrecer un espacio seguro, anónimo y sin juicios para que los usuarios puedan hacer preguntas y recibir acompañamiento sobre consumos recreativos o problemáticos.
2.  Contribuir a un observatorio territorial anónimo que genera datos agregados para el diseño de políticas de salud pública.

-----

## Core Features

La aplicación se estructura en tres módulos principales:

  * ### 💬 1. Chat de Acompañamiento

      * **Chatbot de IA Empático:** Un asistente conversacional (impulsado por Google Gemini) configurado con un prompt de sistema enfocado en la reducción de daños, con lenguaje español rioplatense y un enfoque no moralista.
      * **Información en Tiempo Real:** El bot está configurado para utilizar Google Search (`tools: [{ googleSearch: {} }]`) para buscar información actualizada, con prioridad en fuentes locales como ArgenPills.
      * **Citación de Fuentes:** Las respuestas del bot incluyen las fuentes web utilizadas para fundamentar su información.

  * ### 📚 2. Biblioteca de Sustancias

      * **Base de Datos Curada:** Una biblioteca de información estática y detallada sobre diversas sustancias (MDMA, Cannabis, LSD, Cocaína, etc.).
      * **Información Detallada:** Cada entrada incluye efectos positivos/negativos, duración, dosificación, riesgos principales y pautas de cuidado.
      * **Búsqueda y Filtro:** Los usuarios pueden buscar por nombre o alias, y filtrar por categoría (Estimulante, Depresor, Psicodélico, etc.).

  * ### 🗺️ 3. Observatorio Territorial

      * **Visualización de Datos:** Un mapa (actualmente simulado con datos estáticos) que muestra un desglose de las consultas por provincia.
      * **Inteligencia de Salud Pública:** Muestra el total de consultas y las categorías principales más consultadas por región, permitiendo identificar tendencias territoriales.
      * **Consentimiento Ético:** Esta función se alimenta de un modal de consentimiento inicial (`ConsentModal.tsx`) que solicita al usuario permiso para registrar anónimamente su provincia y la categoría de consulta.

-----

## 🛠️ Stack Tecnológico

Este proyecto es una Single Page Application (SPA) moderna construida con:

  * **Framework Principal:** React 19
  * **Lenguaje:** TypeScript
  * **Build Tool:** Vite
  * **Estilos:** Tailwind CSS (cargado vía CDN)
  * **IA & Backend:** Google Gemini (modelo `gemini-2.5-flash`) a través del SDK `@google/genai`

-----

## 🚀 Correr Localmente

**Requisitos:** Node.js

1.  **Instalar dependencias:**

    ```bash
    npm install
    ```

2.  **Configurar la API Key:**
    Crea un archivo `.env.local` en la raíz del proyecto y añade tu API key de Google Gemini:

    ```
    GEMINI_API_KEY=TU_API_KEY_AQUI
    ```

    *Nota: El `vite.config.ts` está configurado para leer esta variable y exponerla a la aplicación de forma segura*.

3.  **Ejecutar la aplicación:**

    ```bash
    npm run dev
    ```

    La aplicación estará disponible en `http://localhost:3000`.

-----

## 📂 Estructura del Proyecto

La arquitectura del código está organizada para una clara separación de conceptos:

```
/
├── index.html        # Punto de entrada HTML (carga Tailwind y el importmap)
├── index.tsx         # Raíz de la aplicación React
├── App.tsx           # Componente principal, gestiona el estado (tabs, chat)
├── package.json      # Dependencias del proyecto
├── vite.config.ts    # Configuración de Vite (variables de entorno)
├── tsconfig.json     # Configuración de TypeScript
├── constants.ts      # Datos estáticos: SYSTEM_PROMPT, LIBRARY_DATA, MAP_DATA, PROVINCES
├── types.ts          # Interfaces y tipos de TypeScript (Message, LibraryEntry, etc.)
│
├── components/       # Componentes de React reutilizables
│   ├── ChatInput.tsx
│   ├── ChatWindow.tsx
│   ├── ConsentModal.tsx
│   ├── Header.tsx
│   ├── Library.tsx
│   ├── Map.tsx
│   ├── MessageBubble.tsx
│   └── Tabs.tsx
│
└── services/         # Lógica de negocio y API
    └── geminiService.ts  # Lógica para conectar con la API de Gemini
```
