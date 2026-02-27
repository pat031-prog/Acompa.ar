// Fix: Import MapDataset type
import type { LibraryEntry, MapDataset, SubstanceCategory, ReagentTest, TestingResource, LocalResource } from './types';

export const SYSTEM_PROMPT = `
Actuás como acompañante de reducción de daños para consumos en Argentina. Tu lenguaje debe ser español rioplatense, empático, breve, claro y sin juicios.
Tu misión es cuidar y reducir riesgos.

**Instrucciones clave:**
-   **Usa tu herramienta de búsqueda:** Cuando te pregunten sobre pastillas específicas (por nombre, color, logo), alertas de sustancias o información muy reciente, utiliza activamente tu herramienta de búsqueda para encontrar la información más actualizada.
-   **Prioriza fuentes confiables:** Al buscar, da **máxima prioridad a los resultados del sitio web argenpills.org**. Es tu principal fuente de información para alertas y análisis de sustancias en Argentina.
-   **Cita tus fuentes:** Siempre que uses información de una página web, debes citarla al final de tu respuesta.

**Prioridades en tus respuestas:**
1.  **Información de riesgos**: Explica los peligros de manera objetiva.
2.  **Señales de alarma**: Detalla síntomas físicos o psicológicos que indiquen una emergencia.
3.  **Interacciones peligrosas**: Advierte sobre mezclas de sustancias (polifarmacia), especialmente depresores con otros depresores.
4.  **Pautas de cuidado**: Recomienda hidratación, descanso, alimentación, cuidar el "set & setting" (ambiente y estado mental), y testear sustancias si es posible.
5.  **Derivación a recursos**: Si detectas una situación de riesgo o crisis, sugiere contactar a servicios de emergencia (SAME 107, 911) o líneas de atención especializadas en salud mental y consumos.

**Restricciones estrictas:**
-   NO des instrucciones para fabricar o preparar sustancias.
-   NO recomiendes dosis exactas. En su lugar, habla de rangos orientativos de bajo riesgo y la importancia de empezar con dosis bajas.
-   NO alientes el consumo de ninguna manera.
-   Mantené siempre un tono de apoyo y nunca moralista.
-   Recuerda al usuario que no eres un profesional de la salud y que la información es para reducción de daños, no es consejo médico.
`;

export const PROVINCES: string[] = [
  "Buenos Aires",
  "Ciudad Autónoma de Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
  "Tucumán",
];

// Fix: Un-comment and define HIGH_FIDELITY_PROVINCE_ID_MAP to resolve import error in ArgentinaMap.tsx
export const HIGH_FIDELITY_PROVINCE_ID_MAP: Record<string, string> = {
  'AR-B': 'Buenos Aires',
  'AR-C': 'Ciudad Autónoma de Buenos Aires',
  'AR-K': 'Catamarca',
  'AR-H': 'Chaco',
  'AR-U': 'Chubut',
  'AR-X': 'Córdoba',
  'AR-W': 'Corrientes',
  'AR-E': 'Entre Ríos',
  'AR-P': 'Formosa',
  'AR-Y': 'Jujuy',
  'AR-L': 'La Pampa',
  'AR-F': 'La Rioja',
  'AR-M': 'Mendoza',
  'AR-N': 'Misiones',
  'AR-Q': 'Neuquén',
  'AR-R': 'Río Negro',
  'AR-A': 'Salta',
  'AR-J': 'San Juan',
  'AR-D': 'San Luis',
  'AR-Z': 'Santa Cruz',
  'AR-S': 'Santa Fe',
  'AR-G': 'Santiago del Estero',
  'AR-V': 'Tierra del Fuego, Antártida e Islas del Atlántico Sur',
  'AR-T': 'Tucumán',
};


export const INITIAL_BOT_MESSAGE = 'Hola, soy tu acompañante. Contame qué necesitás saber para reducir riesgos o cuidarte. Si es una urgencia, llamá al 107 o 911.';

// Fix: Add map data for the new map component
export const MAP_DATA: Record<string, MapDataset> = {
  'Buenos Aires': {
    totalQueries: 1520,
    topCategories: [
      { category: 'MDMA / Éxtasis', percentage: 35 },
      { category: 'Cocaína', percentage: 25 },
      { category: 'Cannabis', percentage: 20 },
    ],
  },
  'Ciudad Autónoma de Buenos Aires': {
    totalQueries: 2105,
    topCategories: [
      { category: 'MDMA / Éxtasis', percentage: 40 },
      { category: 'Psicodélicos', percentage: 22 },
      { category: 'Ketamina', percentage: 18 },
    ],
  },
  'Córdoba': {
    totalQueries: 850,
    topCategories: [
      { category: 'Cannabis', percentage: 30 },
      { category: 'MDMA / Éxtasis', percentage: 28 },
      { category: 'Cocaína', percentage: 15 },
    ],
  },
  'Santa Fe': {
    totalQueries: 780,
    topCategories: [
      { category: 'Cocaína', percentage: 32 },
      { category: 'Cannabis', percentage: 25 },
      { category: 'Benzodiacepinas', percentage: 12 },
    ],
  },
  'Mendoza': {
    totalQueries: 450,
    topCategories: [
      { category: 'Cannabis', percentage: 38 },
      { category: 'Alcohol', percentage: 20 },
      { category: 'MDMA / Éxtasis', percentage: 15 },
    ],
  },
  'Tucumán': {
    totalQueries: 310,
    topCategories: [
      { category: 'Cocaína', percentage: 40 },
      { category: 'Cannabis', percentage: 22 },
      { category: 'Benzodiacepinas', percentage: 18 },
    ],
  },
  'Salta': {
    totalQueries: 250,
    topCategories: [
      { category: 'Cocaína', percentage: 45 },
      { category: 'Alcohol', percentage: 25 },
      { category: 'Cannabis', percentage: 15 },
    ],
  },
  'Catamarca': { totalQueries: 80, topCategories: [] },
  'Chaco': { totalQueries: 120, topCategories: [] },
  'Chubut': { totalQueries: 150, topCategories: [] },
  'Corrientes': { totalQueries: 130, topCategories: [] },
  'Entre Ríos': { totalQueries: 320, topCategories: [] },
  'Formosa': { totalQueries: 90, topCategories: [] },
  'Jujuy': { totalQueries: 110, topCategories: [] },
  'La Pampa': { totalQueries: 180, topCategories: [] },
  'La Rioja': { totalQueries: 70, topCategories: [] },
  'Misiones': { totalQueries: 210, topCategories: [] },
  'Neuquén': { totalQueries: 350, topCategories: [] },
  'Río Negro': { totalQueries: 300, topCategories: [] },
  'San Juan': { totalQueries: 140, topCategories: [] },
  'San Luis': { totalQueries: 160, topCategories: [] },
  'Santa Cruz': { totalQueries: 100, topCategories: [] },
  'Santiago del Estero': { totalQueries: 120, topCategories: [] },
  'Tierra del Fuego, Antártida e Islas del Atlántico Sur': { totalQueries: 80, topCategories: [] },
};

export const SUBSTANCE_CATEGORIES: SubstanceCategory[] = ['Estimulante', 'Depresor', 'Psicodélico', 'Disociativo', 'Empatógeno'];

export const LIBRARY_DATA: LibraryEntry[] = [
  {
    title: "MDMA",
    aliases: ["Éxtasis", "Pasti", "Rola", "Molly", "Cristal"],
    category: ["Empatógeno", "Estimulante"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=1615&t=l',
    chemicalFormula: 'C₁₁H₁₅NO₂',
    content: {
      description: "Sustancia empatógena-entactógena que produce euforia, sociabilidad y una mayor percepción sensorial. Comúnmente se encuentra en forma de pastillas o cristales.",
      effects: {
        positive: ["Euforia y bienestar", "Aumento de la empatía y la sociabilidad", "Mayor conexión con la música", "Incremento de energía"],
        negative: ["Tensión en la mandíbula (bruxismo)", "Aumento de la temperatura corporal y ritmo cardíaco", "Ansiedad o paranoia (especialmente al subir)", "Dificultad para orinar", "Bajón anímico en los días posteriores"],
      },
      duration: {
        total: "3 - 6 horas",
        onset: "20 - 70 minutos (oral)",
        peak: "2 - 3 horas",
      },
      dosage: {
        oral: "Dosis baja: 50-75 mg | Dosis media: 75-120 mg | Dosis alta: >120 mg",
        warning: "Las pastillas en el mercado ilegal tienen dosis muy variables (de 50 a +300 mg). Siempre es recomendable empezar con una dosis baja (¼ o ½ pastilla) y esperar al menos 90 minutos antes de redosificar.",
      },
      risks: [
        "Hipertermia (golpe de calor), especialmente en lugares concurridos y sin ventilación.",
        "Deshidratación o hiponatremia (intoxicación por exceso de agua).",
        "Agotamiento y 'bajón' anímico severo en los días posteriores.",
        "Riesgo de síndrome serotoninérgico si se mezcla con otras sustancias que afectan la serotonina (IMAOs, algunos antidepresivos).",
      ],
      guidelines: [
        "💧 **Hidratate:** Tomá agua o bebidas isotónicas (~500ml por hora si bailás), pero no en exceso.",
        "🕺 **Descansá:** Tomá pausas regulares en lugares frescos y ventilados.",
        "💊 **Dosificá bajo:** Empezá con dosis bajas, especialmente si la sustancia es de origen desconocido.",
        "❌ **Evitar mezclar con:** Alcohol (aumenta la deshidratación y la neurotoxicidad), IMAOs, y otros estimulantes (aumenta la carga cardíaca)."
      ],
      alerts: "Las pastillas de éxtasis a menudo contienen otras sustancias como cafeína, anfetaminas o catinonas sintéticas. A veces, no contienen MDMA en absoluto. Testear la sustancia con reactivos es la forma más segura de saber su composición. Priorizá la información de análisis de fuentes locales como ArgenPills."
    }
  },
  {
    title: "Cannabis",
    aliases: ["Marihuana", "Flores", "Porro", "Faso"],
    category: ["Psicodélico", "Depresor"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=16078&t=l',
    chemicalFormula: 'C₂₁H₃₀O₂',
    content: {
      description: "Planta psicoactiva cuyo principal componente es el THC. Sus efectos pueden variar mucho según la variedad, la dosis y la persona.",
      effects: {
        positive: ["Relajación, calma", "Euforia, risa", "Aumento de la percepción sensorial (sabores, sonidos)", "Creatividad, introspección"],
        negative: ["Ansiedad, paranoia", "Afectación de la memoria a corto plazo y la coordinación", "Boca seca, ojos rojos", "Aumento del ritmo cardíaco", "'Pálida' (malestar, mareos, náuseas) por dosis altas"],
      },
      duration: {
        total: "Inhalado: 2-4 hs | Comestible: 4-10 hs",
        onset: "Inhalado: 1-10 mins | Comestible: 30-120 mins",
        peak: "Inhalado: 15-30 mins | Comestible: 2-4 hs",
      },
      dosage: {
        warning: "La potencia del cannabis varía enormemente. Con comestibles, la dosificación es muy difícil; empezá con una dosis muy baja (2.5-5 mg de THC) y esperá al menos 2 horas antes de pensar en redosificar.",
      },
      risks: [
        "En personas predispuestas, puede desencadenar episodios psicóticos.",
        "Afectación del desarrollo cerebral en adolescentes.",
        "El humo de la combustión es perjudicial para el sistema respiratorio (considerar vaporizar).",
      ],
      guidelines: [
        "🏠 **Set & Setting:** Elegí un entorno seguro y cómodo, especialmente si tenés poca experiencia.",
        "🍽️ **Comestibles:** ¡Empezá bajo y andá lento! Los efectos tardan en aparecer y son más intensos y duraderos.",
        "😌 **Si sentís ansiedad:** Recordá que el efecto es temporal. Buscá un lugar tranquilo, respirá profundo, tomá algo dulce y poné música relajante.",
        "❌ **Evitar mezclar con:** Alcohol (puede potenciar los mareos y náuseas)."
      ],
      alerts: "El cannabis del mercado ilegal puede contener pesticidas, hongos u otros contaminantes. Siempre que sea posible, optá por fuentes seguras como el autocultivo o redes de confianza."
    }
  },
  {
    title: "LSD",
    aliases: ["Ácido", "Pepas", "Cartón", "Trip"],
    category: ["Psicodélico"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=5761&t=l',
    chemicalFormula: 'C₂₀H₂₅N₃O',
    content: {
      description: "Psicodélico potente que altera la percepción, el pensamiento y el estado de ánimo. Actúa principalmente sobre los receptores de serotonina.",
      effects: {
        positive: ["Intensificación de los sentidos, sinestesia", "Euforia, introspección, experiencias místicas", "Cambios en la percepción del tiempo y el espacio", "Aumento de la creatividad y la asociación de ideas"],
        negative: ["Ansiedad, paranoia, confusión", "Experiencias abrumadoras o angustiantes ('mal viaje')", "Dificultad para comunicarse", "Bucles de pensamiento (loops)"],
      },
      duration: {
        total: "8 - 12 horas (o más)",
        onset: "30 - 90 minutos",
        peak: "3 - 5 horas",
      },
      dosage: {
        oral: "Dosis baja: 25-75 µg (microgramos) | Dosis media: 75-150 µg | Dosis alta: >150 µg",
        warning: "La dosis en los cartones del mercado ilegal es desconocida y a menudo se vende como más potente de lo que es. Es imposible dosificar con precisión sin información de origen.",
      },
      risks: [
        "El principal riesgo es conductual: tomar malas decisiones por la alteración de la percepción.",
        "Puede desencadenar o agravar trastornos de salud mental latentes.",
        "HPPD (Trastorno Perceptivo Persistente por Alucinógenos): 'flashbacks' visuales que persisten después de la experiencia (muy raro).",
      ],
      guidelines: [
        "🧠 **Set & Setting:** El estado de ánimo previo y el entorno son CLAVE. Hacelo en un buen día, en un lugar seguro y con gente de confianza.",
        "🧑‍🤝‍🧑 **Compañía:** Si es tu primera vez, considerá tener un 'cuidador' sobrio y experimentado.",
        "⏳ **Planificá:** Es una experiencia larga. Asegurate de no tener responsabilidades y tené a mano agua, comida liviana y música.",
        "😌 **Si el viaje se pone difícil:** Cambiá de ambiente (ej. pasar a otra habitación, cambiar la música). Recordá que es el efecto de la sustancia y va a pasar. No luches contra la experiencia.",
      ],
      alerts: "A veces, lo que se vende como LSD son otras sustancias, como los NBOMe, que son mucho más peligrosos y tienen riesgo de sobredosis. Los NBOMe tienen un sabor muy amargo y metálico, mientras que el LSD es insípido. 'If it's bitter, it's a spitter' (Si es amargo, escupilo)."
    }
  },
  {
    title: "Cocaína",
    aliases: ["Mercadería", "Pala", "Alita de mosca"],
    category: ["Estimulante"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=5760&t=l',
    chemicalFormula: 'C₁₇H₂₁NO₄',
    content: {
      description: "Potente estimulante del sistema nervioso central que produce euforia, aumento de la energía y supresión del apetito y la fatiga.",
      effects: {
        positive: ["Euforia, aumento de la confianza y la energía", "Mayor locuacidad y sociabilidad", "Incremento del estado de alerta mental"],
        negative: ["Ansiedad, paranoia, irritabilidad", "Aumento del ritmo cardíaco y la presión arterial", "Tensión muscular, bruxismo", "Deseo intenso de volver a consumir ('craving')"],
      },
      duration: {
        total: "Nasal: 60-90 minutos",
        onset: "Nasal: 1-5 minutos",
        peak: "Nasal: 15-30 minutos",
      },
      dosage: {
        nasal: "Dosis baja: 20-50 mg | Dosis media: 50-100 mg | Dosis alta: >100 mg",
        warning: "La pureza de la cocaína en el mercado ilegal es muy variable. Suele estar 'cortada' con otras sustancias, algunas inocuas y otras peligrosas. Esto hace que la dosificación sea impredecible.",
      },
      risks: [
        "Riesgo de infarto, arritmias o ACV, especialmente con dosis altas o en personas con problemas cardíacos.",
        "Daño en el tabique nasal con el uso crónico.",
        "Alto potencial de dependencia psicológica y compulsión.",
      ],
      guidelines: [
        "💳 **Reducí daños nasales:** Usá un elemento personal, limpio y de material no cortante para aspirar (evitá billetes). Pulverizá bien el material para evitar heridas. Alterná las fosas nasales.",
        "💧 **Lavado nasal:** Enjuagá las fosas nasales con solución salina después del consumo para limpiar y reducir el daño.",
        "😴 **Respetá el descanso:** La falta de sueño y alimentación aumenta los riesgos físicos y psicológicos.",
        "❌ **Evitar mezclar con:** Alcohol (forman cocaetileno, un compuesto más tóxico para el corazón), otros estimulantes, IMAOs o depresores (riesgo de sobredosis por no sentir los efectos).",
      ],
      alerts: "La cocaína suele estar adulterada con sustancias como levamisol (un antiparasitario tóxico), fenacetina, cafeína, etc. También puede estar contaminada con fentanilo en algunas regiones (aunque menos común en Argentina hasta ahora), lo cual aumenta drásticamente el riesgo de sobredosis mortal."
    }
  },
  {
    title: "Ketamina",
    aliases: ["Keta", "K", "Special K", "Vitamina K"],
    category: ["Disociativo"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=3821&t=l',
    chemicalFormula: 'C₁₃H₁₆ClNO',
    content: {
      description: "Anestésico disociativo que produce efectos que van desde la euforia y la desinhibición a dosis bajas hasta intensas experiencias psicodélicas y de disociación del cuerpo y la mente a dosis altas.",
      effects: {
        positive: ["Euforia, sociabilidad", "Sensación de flotar, disociación leve", "Introspección, alucinaciones visuales y auditivas", "Experiencias de trascendencia ('K-Hole')"],
        negative: ["Confusión, desorientación", "Dificultad para moverse y hablar (efecto 'robot')", "Náuseas y vómitos", "Ansiedad, experiencias terroríficas"],
      },
      duration: {
        total: "Nasal: 45 - 90 minutos",
        onset: "Nasal: 5 - 15 minutos",
        peak: "Nasal: 20 - 45 minutos",
      },
      dosage: {
        nasal: "Dosis baja: 15-30 mg | Dosis media: 30-75 mg | Dosis alta: 75-150 mg ('K-Hole')",
        warning: "La tolerancia a la ketamina se desarrolla muy rápidamente. Aumentar la dosis para conseguir los mismos efectos eleva el riesgo de dependencia y daños a la salud.",
      },
      risks: [
        "Riesgo de accidentes y caídas por la pérdida de coordinación motora.",
        "Daño grave en la vejiga y el tracto urinario (cistitis) con el uso frecuente.",
        "Potencial de dependencia psicológica.",
        "Parálisis respiratoria en caso de sobredosis, especialmente si se mezcla con otros depresores.",
      ],
      guidelines: [
        "🏠 **Entorno seguro:** Consumí siempre en un lugar seguro y cómodo, preferentemente sentado o recostado.",
        "👃 **Cuidado nasal:** Pulverizá bien el cristal para reducir el daño nasal. Utilizá un turulo personal y limpio.",
        "💧 **Hidratate bien:** Beber agua es importante para la salud de la vejiga.",
        "❌ **Evitar mezclar con:** Alcohol, GHB/GBL, opiáceos y benzodiacepinas. Esta combinación aumenta peligrosamente el riesgo de sobredosis y depresión respiratoria.",
      ],
      alerts: "La ketamina del mercado ilegal puede estar adulterada. La distinción entre los isómeros (S-ketamina y R-ketamina) también influye en sus efectos; la S-ketamina suele ser más potente y psicodélica."
    }
  },
  {
    title: "Hongos (Psilocibina)",
    aliases: ["Cucumelos", "Monguis", "Hongos Mágicos", "Psilocibes"],
    category: ["Psicodélico"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=10624&t=l',
    chemicalFormula: 'C₁₂H₁₇N₂O₄P',
    content: {
      description: "Hongos que contienen psilocibina y psilocina, compuestos psicodélicos que alteran la percepción, el ánimo y la cognición.",
      effects: {
        positive: ["Euforia, risa incontrolable", "Profunda introspección y conexión emocional", "Alteraciones visuales (colores más vivos, patrones)", "Cambios en la percepción del tiempo"],
        negative: ["Ansiedad, paranoia ('mal viaje')", "Confusión y desorientación", "Náuseas y malestar estomacal", "Sensibilidad emocional extrema"],
      },
      duration: {
        total: "4 - 6 horas",
        onset: "20 - 60 minutos (oral)",
        peak: "2 - 3 horas",
      },
      dosage: {
        oral: "Dosis baja: 0.5-1g (secos) | Dosis media: 1-2.5g (secos) | Dosis alta: >2.5g (secos)",
        warning: "La potencia varía enormemente entre distintas especies y hasta entre distintas partes del mismo hongo. Siempre es mejor empezar con una dosis baja si no conocés la tanda.",
      },
      risks: [
        "El principal riesgo es psicológico: un 'mal viaje' puede ser una experiencia muy angustiante.",
        "Riesgo conductual: tomar decisiones peligrosas bajo los efectos de la confusión perceptual.",
        "En personas con predisposición, puede desencadenar episodios psicóticos.",
        "Intoxicación si se confunde con especies de hongos venenosos al recolectar.",
      ],
      guidelines: [
        "🧠 **Set & Setting:** Es fundamental estar en un buen estado de ánimo y en un entorno seguro y tranquilo.",
        "🍋 **Lemon Tek:** Algunos usuarios maceran los hongos en jugo de limón para reducir las náuseas y acelerar el inicio de los efectos.",
        "🧑‍🤝‍🧑 **Compañía:** Consumir con gente de confianza. Considerar tener un 'cuidador' sobrio si es de tus primeras veces o vas a tomar una dosis alta.",
        "😌 **Gestionar un mal viaje:** Si la experiencia se vuelve difícil, recordá que es temporal. Cambiá de ambiente, poné música calma, y enfocate en tu respiración.",
      ],
      alerts: "El riesgo más grande al obtener hongos de fuentes no confiables es la identificación incorrecta. Nunca consumas un hongo silvestre si no estás 100% seguro de su especie. La venta de 'chocolates' con hongos hace que la dosificación sea muy imprecisa."
    }
  },
  {
    title: "Benzodiacepinas",
    aliases: ["Benzos", "Clona", "Alpra", "Rivotril", "Xanax"],
    category: ["Depresor"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=2811&t=l',
    chemicalFormula: 'C₁₅H₁₀ClN₃O₃',
    content: {
      description: "Son medicamentos depresores del sistema nervioso central, recetados comúnmente como ansiolíticos, sedantes o anticonvulsivos. Los más comunes son Clonazepam y Alprazolam.",
      effects: {
        positive: ["Reducción de la ansiedad y el estrés", "Relajación muscular", "Sensación de calma y sedación", "Inducción del sueño"],
        negative: ["Somnolencia, confusión", "Amnesia anterógrada ('blackouts')", "Falta de coordinación, mareos", "Depresión, irritabilidad (especialmente con uso crónico)"],
      },
      duration: {
        total: "Varía mucho (Alprazolam: 6-12 hs | Clonazepam: 18-50 hs)",
        onset: "15 - 60 minutos (oral)",
        peak: "1 - 4 horas",
      },
      dosage: {
        warning: "Deben usarse únicamente bajo prescripción médica. La automedicación es muy riesgosa. La dosis depende del individuo y la condición a tratar. No exceder nunca la dosis recetada.",
      },
      risks: [
        "Alto potencial de dependencia física y psicológica, con un síndrome de abstinencia que puede ser mortal.",
        "Sobredosis, especialmente si se mezclan con otros depresores como alcohol u opiáceos. Esta combinación es extremadamente peligrosa.",
        "Aumento del riesgo de accidentes por deterioro cognitivo y motor.",
      ],
      guidelines: [
        "🚫 **NO MEZCLAR CON ALCOHOL:** Esta es la regla más importante. La combinación potencia la depresión respiratoria y puede ser letal.",
        "👨‍⚕️ **Uso médico:** Utilizalas solo si te fueron recetadas y seguí las indicaciones al pie de la letra.",
        "📉 **Abstinencia gradual:** Nunca dejes de tomarlas de golpe si las usaste por un tiempo prolongado. La retirada debe ser supervisada por un profesional de la salud.",
        "🚗 **No conducir:** No operes maquinaria pesada ni conduzcas bajo sus efectos.",
      ],
      alerts: "En el mercado ilegal circulan comprimidos falsificados que pueden no contener el principio activo declarado o, peor aún, estar adulterados con otras sustancias como opioides sintéticos (fentanilo), lo que multiplica exponencialmente el riesgo de sobredosis mortal."
    }
  },
  {
    title: "2C-B",
    aliases: ["Nexus", "Venus", "Erox", "Tusi", "Cocaína Rosa"],
    category: ["Psicodélico", "Estimulante"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=75899&t=l',
    chemicalFormula: 'C₁₀H₁₄BrNO₂',
    content: {
      description: "Es una feniletilamina psicodélica con efectos que se describen como un cruce entre el MDMA y el LSD, aunque con características propias. Produce estimulación, empatía y alteraciones visuales.",
      effects: {
        positive: ["Euforia, risa", "Estimulación mental y física", "Visuales coloridas y patrones geométricos", "Aumento de la percepción musical y táctil"],
        negative: ["Ansiedad y confusión, especialmente en el inicio", "Malestar físico ('body load'), náuseas", "Sensibilidad extrema a los estímulos", "Pensamientos en bucle"],
      },
      duration: {
        total: "Oral: 4-8 hs | Nasal: 2-4 hs",
        onset: "Oral: 30-90 mins | Nasal: 1-10 mins",
        peak: "2 - 4 horas",
      },
      dosage: {
        oral: "Dosis baja: 5-15 mg | Dosis media: 15-25 mg | Dosis alta: >25 mg",
        nasal: "Dosis baja: 2-5 mg | Dosis media: 5-10 mg | Dosis alta: >10 mg",
        warning: "La curva de dosis es muy sensible: pequeños aumentos pueden intensificar drásticamente los efectos. La vía nasal es mucho más potente y dolorosa. Es indispensable usar una balanza de miligramos para dosificar.",
      },
      risks: [
        "Una sobredosis no suele ser mortal, pero puede producir una experiencia psicológica extremadamente desagradable y abrumadora.",
        "Malos viajes, ataques de pánico.",
        "Riesgos asociados a la estimulación: aumento de la presión y el ritmo cardíaco.",
      ],
      guidelines: [
        "⚖️ **Dosificar con precisión:** Usá siempre una balanza de miligramos (0.001g). No dosifiques 'a ojo'.",
        "🧠 **Set & Setting:** Como con cualquier psicodélico, el entorno y tu estado mental son cruciales para una buena experiencia.",
        "👃 **Vía nasal:** Es muy dolorosa y los efectos son más abruptos y confusos. No es recomendada para principiantes.",
        "🔄 **Redosificación:** Esperá a que los efectos se estabilicen (al menos 2 horas) antes de considerar redosificar. Hacelo con una dosis menor a la inicial.",
      ],
      alerts: "MUY IMPORTANTE: Lo que se vende en la calle como 'Tusi' o 'Cocaína Rosa' CASI NUNCA es 2C-B. Generalmente es un cóctel de varias sustancias, como ketamina, MDMA, cafeína y colorante rosa. Los efectos y riesgos de esta mezcla son impredecibles y muy diferentes a los del 2C-B puro."
    }
  },
  {
    title: "Anfetamina",
    aliases: ["Speed", "Anfeta", "Aderall"],
    category: ["Estimulante"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=3007&t=l',
    chemicalFormula: 'C₉H₁₃N',
    content: {
      description: "Es un potente estimulante del sistema nervioso central. Aumenta el estado de alerta, la concentración y la energía, mientras que reduce el apetito y la fatiga. Se utiliza médicamente para tratar el TDAH y la narcolepsia.",
      effects: {
        positive: ["Aumento de la energía y la vigilia", "Euforia y confianza", "Mayor concentración y enfoque", "Supresión del apetito"],
        negative: ["Ansiedad, insomnio, paranoia", "Aumento del ritmo cardíaco y la presión arterial", "Bruxismo, sequedad bucal", "Irritabilidad y agitación durante la bajada"],
      },
      duration: {
        total: "Oral: 4-6 hs | Nasal: 2-4 hs",
        onset: "Oral: 20-60 mins | Nasal: 5-15 mins",
        peak: "2 - 4 horas",
      },
      dosage: {
        oral: "Dosis baja: 5-15 mg | Dosis media: 15-30 mg | Dosis alta: >30 mg",
        nasal: "Dosis baja: 5-10 mg | Dosis media: 10-25 mg | Dosis alta: >25 mg",
        warning: "La pureza en el mercado ilegal es muy variable. La tolerancia se desarrolla rápidamente, lo que aumenta el riesgo de consumir dosis cada vez más altas.",
      },
      risks: [
        "Riesgo cardiovascular (infarto, ACV) por el aumento de la presión arterial.",
        "Psicosis anfetamínica con el uso de dosis altas o prolongado.",
        "Alto potencial de dependencia.",
        "Neurotoxicidad con el uso crónico.",
      ],
      guidelines: [
        "😴 **Priorizá el descanso:** Evitá consumir para no dormir. La privación del sueño aumenta todos los riesgos.",
        "💧 **Mantenete hidratado y nutrido:** Es fácil olvidarse de comer y beber. Forzate a hacerlo.",
        "💊 **Evitá redosificar compulsivamente:** Dejá pasar tiempo entre dosis para evaluar los efectos.",
        "❌ **Evitar mezclar con:** Otros estimulantes (aumenta el riesgo cardíaco), IMAOs (riesgo de crisis hipertensiva), y antidepresivos (riesgo de síndrome serotoninérgico).",
      ],
      alerts: "La pasta base de anfetamina ('speed') del mercado ilegal suele estar muy adulterada con cafeína y otros aditivos. Esto hace que la dosificación precisa sea imposible y aumente los efectos secundarios indeseados."
    }
  },
  {
    title: "Poppers (Nitritos de Alquilo)",
    aliases: ["Rush", "Oro líquido"],
    category: ["Otro"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=6757&t=l',
    chemicalFormula: 'C₅H₁₁NO₂',
    content: {
      description: "Son compuestos químicos (principalmente nitrito de amilo, butilo o isobutilo) que se inhalan. Actúan como vasodilatadores, relajando los músculos lisos y provocando una sensación de euforia y mareo que dura unos pocos minutos.",
      effects: {
        positive: ["Euforia y desinhibición de corta duración", "Relajación muscular (especialmente anal y vaginal)", "Intensificación de las percepciones y el orgasmo", "Sensación de calor y rubor facial"],
        negative: ["Dolor de cabeza intenso", "Mareos, náuseas, desmayos", "Aumento de la presión intraocular", "Irritación de la piel y las vías respiratorias"],
      },
      duration: {
        total: "2 - 5 minutos",
        onset: "Inmediato (segundos)",
        peak: "30 - 60 segundos",
      },
      dosage: {
        inhalation: "Se inhala directamente de la botella, una o dos veces por fosa nasal.",
        warning: "Nunca se debe ingerir. Es altamente tóxico y puede ser mortal si se bebe. La inhalación excesiva puede llevar a la metahemoglobinemia, una condición sanguínea peligrosa.",
      },
      risks: [
        "Peligro extremo si se ingiere.",
        "Quemaduras químicas en la piel si hay contacto directo.",
        "Caída brusca de la presión arterial, con riesgo de desmayo y accidentes.",
        "Interacción extremadamente peligrica con medicamentos para la disfunción eréctil (Viagra, Cialis), pudiendo causar un colapso cardiovascular fatal.",
      ],
      guidelines: [
        "🚫 **NUNCA INGERIR:** Es veneno si se bebe.",
        "💊 **NO MEZCLAR CON VIAGRA/CIALIS:** La combinación puede ser mortal.",
        "💨 **Ventilación:** Usar en un espacio bien ventilado.",
        "🔥 **Inflamable:** Mantener alejado del fuego, cigarrillos y mecheros.",
        " seated **Sentado es más seguro:** Para evitar caídas si te mareás.",
      ],
      alerts: "La calidad y composición de los poppers puede variar. Algunos productos pueden contener solventes más tóxicos. Evitar el contacto directo con la piel para prevenir quemaduras."
    }
  },
  {
    title: "GHB / GBL",
    aliases: ["G", "Éxtasis líquido", "Gina"],
    category: ["Depresor"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=10413&t=l',
    chemicalFormula: 'C₄H₈O₃',
    content: {
      description: "El GHB (gamma-hidroxibutirato) es un potente depresor del sistema nervioso central. El GBL y el 1,4-BD son precursores que el cuerpo convierte en GHB. Produce euforia y desinhibición, pero la dosis es crítica.",
      effects: {
        positive: ["Euforia, sociabilidad, aumento de la libido", "Relajación y bienestar", "Sensibilidad táctil aumentada"],
        negative: ["Mareos, somnolencia, náuseas y vómitos", "Confusión, pérdida de coordinación", "Pérdida del conocimiento ('quedarse G-dormido')"],
      },
      duration: {
        total: "1.5 - 3 horas",
        onset: "10 - 20 minutos",
        peak: "45 - 90 minutos",
      },
      dosage: {
        oral: "Dosis baja: 0.5-1 mL | Dosis media: 1-2 mL | Dosis alta: >2 mL",
        warning: "LA DOSIS ES CRUCIAL. La diferencia entre la dosis eufórica y la sobredosis es de apenas unos mililitros. Usar una jeringa o gotero para medir es OBLIGATORIO. El GBL es más potente que el GHB.",
      },
      risks: [
        "Riesgo muy alto de sobredosis, que lleva a la pérdida de consciencia y depresión respiratoria.",
        "El vómito durante la inconsciencia puede causar asfixia.",
        "Alto potencial de dependencia física con síndrome de abstinencia severo.",
        "Amnesia y vulnerabilidad a la agresión sexual.",
      ],
      guidelines: [
        "💉 **MEDIR CON PRECISIÓN:** Siempre usar una jeringa de 1ml. Nunca 'un chorrito' o 'una tapita'.",
        "🚫 **NO MEZCLAR CON ALCOHOL:** Esta combinación es extremadamente peligrosa y aumenta drásticamente el riesgo de sobredosis mortal.",
        "⏳ **ESPERAR ANTES DE REDOSIFICAR:** Esperar al menos 2 horas. La mayoría de las sobredosis ocurren por redosificar demasiado pronto.",
        "🧑‍🤝‍🧑 **Informar a amigxs:** Si consumís, que alguien de confianza lo sepa y esté atento.",
        "😴 **Posición de seguridad:** Si alguien pierde el conocimiento, ponerlo de costado para evitar que se ahogue si vomita y llamar a emergencias.",
      ],
      alerts: "Nunca se sabe si lo que se compra es GHB o GBL, y su concentración es desconocida, lo que hace la dosificación aún más peligrosa. Siempre empezar con una dosis de prueba muy baja (ej. 0.5 ml) para testear la potencia."
    }
  },
  {
    title: "Pasta Base / Paco",
    aliases: ["Base", "Paco", "Basuco"],
    category: ["Estimulante"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=5760&t=l',
    chemicalFormula: 'Mezcla variable',
    content: {
      description: "Residuo de la extracción de cocaína, mezclado con adulterantes tóxicos. Es un estimulante de efecto muy corto, intenso y altamente adictivo. Su consumo conlleva altísimos riesgos para la salud física y mental.",
      effects: {
        positive: ["Euforia intensa y fugaz."],
        negative: ["Paranoia severa", "Ansiedad y agresividad", "Alucinaciones", "Insomnio", "Pérdida extrema de peso", "Deseo compulsivo de consumir."],
      },
      duration: {
        total: "5 - 15 minutos",
        onset: "Inmediato (segundos)",
        peak: "1 - 5 minutos",
      },
      dosage: {
        inhalation: "Se fuma en pipa.",
        warning: "No hay dosis segura. Es una sustancia extremadamente dañina y con un potencial de dependencia devastador. El foco debe estar en la reducción de daños y la búsqueda de ayuda.",
      },
      risks: ["Daño pulmonar severo", "Riesgo cardiovascular extremo", "Deterioro neurológico", "Desnutrición", "Problemas dentales graves ('boca de paco')", "Alta vulnerabilidad social."],
      guidelines: [
        "Este no es un consumo para 'cuidar', sino una situación de alto riesgo. Las pautas se centran en la supervivencia y el contacto con ayuda:",
        "💧 **Hidratate:** Tomar agua es fundamental.",
        "🩹 **Cuidá heridas:** Las quemaduras en labios y dedos son comunes. Mantenerlas limpias.",
        "🤝 **Buscá ayuda:** Hablar con centros de salud, dispositivos territoriales o redes de acompañamiento es el paso más importante. No estás solx.",
        "🍴 **Si es posible, comé algo:** Aunque no haya apetito, el cuerpo necesita energía.",
      ],
      alerts: "La composición es desconocida y muy tóxica. Contiene solventes, ácidos y otros químicos peligrosos. El principal objetivo de la reducción de daños aquí es mantener a la persona con vida y conectarla con el sistema de salud y apoyo social."
    }
  },
  {
    title: "DMT / Ayahuasca",
    aliases: ["Dimitri", "Yagé", "Daime"],
    category: ["Psicodélico"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=6089&t=l',
    chemicalFormula: 'C₁₂H₁₆N₂',
    content: {
      description: "El DMT (Dimetiltriptamina) es un potente psicodélico. Se puede consumir vaporizado (efecto corto e intenso) o como parte de la Ayahuasca, un brebaje que combina una planta con DMT con otra que contiene un IMAO, permitiendo su efecto vía oral y prolongándolo.",
      effects: {
        positive: ["Profundas experiencias místicas", "Disolución del ego", "Visiones geométricas y fractales complejas", "Contacto con 'entidades'"],
        negative: ["Ansiedad y miedo abrumador ('viaje de terror')", "Desorientación total", "Náuseas, vómitos y diarrea (común y esperado con Ayahuasca, 'la purga')"],
      },
      duration: {
        total: "Vaporizado: 5-20 mins | Ayahuasca: 4-8 hs",
        onset: "Vaporizado: Segundos | Ayahuasca: 30-90 mins",
        peak: "Vaporizado: 2-10 mins | Ayahuasca: 2-4 hs",
      },
      dosage: {
        warning: "La dosificación es muy variable. Con Ayahuasca, la potencia del brebaje es desconocida. Vaporizado, se necesitan balanzas de miligramos para dosis precisas (15-50 mg).",
      },
      risks: ["Principalmente psicológicos. La experiencia puede ser extremadamente intensa.", "Con Ayahuasca, el riesgo físico principal son las interacciones medicamentosas."],
      guidelines: [
        "🧠 **Set & Setting:** Absolutamente crucial. Un entorno seguro y una mente preparada son indispensables.",
        "🧑‍🤝‍🧑 **Cuidador/Guía:** Es altamente recomendable, especialmente con DMT vaporizado, donde la persona queda incapacitada.",
        "🤢 **Ayahuasca:** La 'purga' (vómitos) es parte de la experiencia para muchos. Estar preparado para ello.",
      ],
      alerts: "CRÍTICO CON AYAHUASCA: La presencia de IMAOs la hace mortalmente peligrosa si se combina con antidepresivos (ISRS, tricíclicos), otros estimulantes (MDMA, anfetaminas), y ciertos alimentos (quesos añejos, embutidos). Es indispensable investigar y respetar la dieta previa y posterior."
    }
  },
  {
    title: "Mescalina (San Pedro / Peyote)",
    aliases: ["Cactus", "San Pedro", "Peyote"],
    category: ["Psicodélico"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=4076&t=l',
    chemicalFormula: 'C₁₁H₁₇NO₃',
    content: {
      description: "Psicodélico que se encuentra de forma natural en cactus como el Peyote y el San Pedro. Produce alteraciones profundas en la percepción, el ánimo y la conciencia.",
      effects: {
        positive: ["Conexión con la naturaleza", "Introspección profunda", "Euforia", "Sinestesia", "Visuales con ojos abiertos y cerrados"],
        negative: ["Náuseas y vómitos intensos (considerado una 'purga')", "Ansiedad y confusión", "Aumento del ritmo cardíaco", "Sensación de frío"],
      },
      duration: {
        total: "8 - 12 horas",
        onset: "45 - 120 minutos",
        peak: "4 - 6 horas",
      },
      dosage: {
        oral: "Dosis baja: 100-200 mg | Dosis media: 200-400 mg | Dosis alta: >400 mg (de mescalina pura).",
        warning: "La dosificación con cactus es muy imprecisa, ya que la concentración de mescalina varía mucho entre plantas y según la preparación. Empezar con una porción pequeña es crucial.",
      },
      risks: ["El principal riesgo es psicológico: un 'mal viaje' puede ser muy angustiante.", "Malestar físico intenso (náuseas, vómitos) al principio.", "Riesgo de deshidratación.", "Identificación incorrecta del cactus."],
      guidelines: [
        "🧠 **Set & Setting:** Fundamental. Estar en un lugar seguro y tranquilo es clave.",
        "🧑‍🤝‍🧑 **Compañía:** Contar con un cuidador sobrio es muy recomendable, especialmente en la naturaleza.",
        "💧 **Hidratación:** Beber agua es importante, sobre todo si hay vómitos.",
        "🍴 **Ayuno:** Ayunar unas 6 horas antes puede reducir la intensidad de las náuseas.",
      ],
      alerts: "La recolección de Peyote es ilegal en muchos lugares y es una práctica sagrada para comunidades indígenas que debe ser respetada. El cactus San Pedro es más común y accesible."
    }
  },
  {
    title: "Salvia Divinorum",
    aliases: ["Salvia", "Ska Pastora", "Hierba de los dioses"],
    category: ["Disociativo", "Psicodélico"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=128563&t=l',
    chemicalFormula: 'C₂₃H₂₈O₈',
    content: {
      description: "Planta con potentes propiedades psicoactivas, cuyo principio activo es la Salvinorina A. Produce una experiencia disociativa muy intensa y de corta duración. No es un psicodélico clásico y no actúa sobre los receptores de serotonina.",
      effects: {
        positive: ["Experiencias de disolución del ego", "Visiones surreales", "Cambios profundos en la percepción de la realidad", "Risa incontrolable."],
        negative: ["Miedo intenso, pánico", "Pérdida total del control motor", "Incapacidad para comunicarse", "Sensación de ser un objeto inanimado", "Disforia. No es una sustancia recreativa o social."],
      },
      duration: {
        total: "Fumada: 5 - 15 minutos",
        onset: "Fumada: Inmediato (15-60 segundos)",
        peak: "Fumada: 1 - 5 minutos",
      },
      dosage: {
        inhalation: "Se usan extractos (10x, 20x, etc.). Se debe empezar con una cantidad mínima.",
        warning: "Es extremadamente potente. La experiencia es abrumadora y la pérdida de control es casi total. Es OBLIGATORIO tener un cuidador sobrio.",
      },
      risks: ["El principal riesgo es conductual: moverse sin control, caerse, golpearse.", "La experiencia puede ser psicológicamente aterradora."],
      guidelines: [
        "🧑‍🤝‍🧑 **CUIDADOR OBLIGATORIO:** La persona que consume queda totalmente incapacitada para cuidar de sí misma.",
        "🛋️ **Lugar seguro:** Consumir sentado o acostado, lejos de objetos peligrosos, ventanas o balcones.",
        "🔥 **Evitar fuego:** Usar un encendedor tipo soplete y alejarlo inmediatamente.",
        "🤏 **Dosis mínima:** Empezar con la menor cantidad posible de un extracto para entender sus efectos.",
      ],
      alerts: "No tiene NADA que ver con el cannabis u otros psicodélicos. La experiencia no suele ser eufórica o placentera en un sentido tradicional. No subestimar esta sustancia."
    }
  },
  {
    title: "Iboga / Ibogaína",
    aliases: ["Iboga"],
    category: ["Psicodélico", "Disociativo", "Otro"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=197067&t=l',
    chemicalFormula: 'C₂₀H₂₆N₂O',
    content: {
      description: "Alcaloide psicoactivo extraído de la raíz del arbusto Tabernanthe iboga. Produce una experiencia introspectiva extremadamente larga y profunda. Se ha investigado por su potencial para interrumpir adicciones, pero conlleva riesgos físicos significativos.",
      effects: {
        positive: ["Introspección profunda tipo 'revisión de vida'", "Disolución de patrones de pensamiento adictivos", "Experiencias visionarias."],
        negative: ["Ataxia severa (incapacidad para moverse)", "Náuseas y vómitos", "Sensibilidad extrema a la luz y el sonido", "Insomnio", "Ansiedad", "Despersonalización."],
      },
      duration: {
        total: "24 - 36 horas o más",
        onset: "45 - 180 minutos",
        peak: "Larga meseta de muchas horas",
      },
      dosage: {
        warning: "NO ES UNA SUSTANCIA PARA USO RECREATIVO. Su uso debe ser siempre en un contexto clínico o ceremonial con supervisión médica y psicológica experimentada. La automedicación es extremadamente peligrosa.",
      },
      risks: ["RIESGO CARDÍACO SIGNIFICATIVO. Puede causar arritmias fatales (prolongación del intervalo QT). Es cardiotóxica.", "Riesgo de muerte, especialmente en personas con condiciones cardíacas preexistentes o al mezclarla con otras sustancias."],
      guidelines: [
        "🩺 **SUPERVISIÓN MÉDICA:** Es indispensable y no negociable. Nunca consumir sin un profesional de la salud experimentado.",
        "❤️ **ECG PREVIO:** Realizar un electrocardiograma y un chequeo médico completo es un requisito absoluto para descartar problemas cardíacos.",
        "💊 **Interacciones:** Tiene interacciones peligrosas con muchísimos medicamentos. Se requiere una revisión exhaustiva de la medicación actual.",
      ],
      alerts: "La mayoría de las muertes asociadas a la ibogaína se deben a condiciones médicas no detectadas o al uso sin supervisión profesional. Su uso para tratar adicciones debe ser en un centro especializado y legal."
    }
  },
  {
    title: "Fentanilo y Análogos",
    aliases: ["Fenta", "China White", "Droga Zombie"],
    category: ["Depresor", "Otro"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=3345&t=l',
    chemicalFormula: 'C₂₂H₂₈N₂O',
    content: {
      description: "Opioide sintético extremadamente potente, hasta 100 veces más que la morfina. Su presencia en el mercado ilegal, a menudo como adulterante, ha provocado una crisis de sobredosis a nivel mundial. El riesgo de muerte es altísimo.",
      effects: {
        positive: ["Euforia intensa", "Analgesia (alivio del dolor) potente", "Sedación profunda."],
        negative: ["Depresión respiratoria severa (la causa de muerte)", "Somnolencia extrema, pérdida de conocimiento", "Confusión, mareos", "Náuseas y vómitos", "Coloración azulada en labios y uñas (cianosis)."],
      },
      duration: {
        total: "30 - 90 minutos",
        onset: "Inmediato (inyectado/fumado) a minutos (nasal)",
        peak: "Muy breve, lo que induce a la redosificación compulsiva",
      },
      dosage: {
        warning: "NO EXISTE UNA DOSIS SEGURA EN EL MERCADO ILEGAL. Una cantidad tan pequeña como 2 miligramos (equivalente a unos granos de sal) puede ser mortal. La dosificación es imposible de controlar sin equipo de laboratorio.",
      },
      risks: ["SOBREDOSIS MORTAL. Es el riesgo principal y es extremadamente alto.", "Altísimo potencial de dependencia física y psicológica.", "Puede estar presente en otras drogas (cocaína, pastillas falsificadas) sin que el usuario lo sepa."],
      guidelines: [
        "🆘 **LLEVÁ NALOXONA:** Es un antagonista opioide que puede revertir una sobredosis. Es la herramienta más importante. Aprendé a usarla.",
        "🧪 **TESTEÁ TUS SUSTANCIAS:** Usá tiras reactivas de fentanilo para analizar muestras antes de consumir.",
        "🧑‍🤝‍🧑 **NUNCA CONSUMAS A SOLAS:** Si algo sale mal, necesitás que alguien llame a emergencias (107/911).",
        "🤏 **EMPEZÁ CON UNA DOSIS MÍNIMA:** Si vas a consumir una sustancia nueva, probá una cantidad ínfima (la punta de una llave) y esperá.",
        "🚨 **SEÑALES DE SOBREDOSIS:** Respiración lenta o ausente, piel fría y húmeda, labios azules, no responde a estímulos. Llamá a emergencias inmediatamente y administrá naloxona si la tenés.",
      ],
      alerts: "El fentanilo es el principal responsable de la crisis de opioides en Norteamérica. Su presencia en Sudamérica está en aumento. Se encuentra principalmente adulterando cocaína, heroína y, lo más peligroso, en pastillas falsificadas que imitan a ansiolíticos (como Xanax/Alprazolam) u otros opioides (como Oxicodona)."
    }
  },
  {
    title: "Opioides (Codeína, Oxicodona)",
    aliases: ["Oxi", "Jarabe", "Cody", "Percocet"],
    category: ["Depresor"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=5284603&t=l',
    chemicalFormula: 'C₁₈H₂₁NO₄',
    content: {
      description: "Son medicamentos depresores del sistema nervioso central utilizados para tratar el dolor. Tienen un alto potencial de generar dependencia y un riesgo significativo de sobredosis por depresión respiratoria.",
      effects: {
        positive: ["Alivio del dolor (analgesia)", "Euforia, sensación de bienestar", "Relajación y reducción de la ansiedad."],
        negative: ["Somnolencia, confusión", "Estreñimiento crónico", "Náuseas y vómitos", "Depresión respiratoria (respiración lenta y superficial)."],
      },
      duration: {
        total: "4 - 6 horas (para oxicodona de liberación inmediata)",
        onset: "15 - 30 minutos (oral)",
        peak: "1 - 2 horas",
      },
      dosage: {
        warning: "Deben usarse únicamente bajo estricta prescripción médica. Las pastillas del mercado ilegal tienen dosis desconocidas y un altísimo riesgo de estar falsificadas con fentanilo.",
      },
      risks: ["Alto potencial de dependencia física y psicológica.", "Sobredosis mortal, especialmente si se mezclan con otros depresores como alcohol o benzodiacepinas.", "Síndrome de abstinencia severo."],
      guidelines: [
        "🚫 **NO MEZCLAR CON ALCOHOL O BENZOS:** Esta combinación multiplica el riesgo de depresión respiratoria y muerte.",
        "👨‍⚕️ **Uso médico:** Utilizarlos solo si fueron recetados y seguir las indicaciones al pie de la letra.",
        "🆘 **Naloxona:** Si consumís opioides, es recomendable tener naloxona a mano.",
        "🚗 **No conducir:** No operes maquinaria pesada ni conduzcas bajo sus efectos.",
      ],
      alerts: "EL MAYOR PELIGRO ACTUAL son las pastillas falsificadas. Una pastilla que se vende como oxicodona puede no contenerla y estar hecha con fentanilo, lo que puede causar una sobredosis fatal con un solo comprimido. Sin un análisis de laboratorio, es imposible saberlo."
    }
  },
  {
    title: "Pregabalina",
    aliases: ["Lyrica", "Pregaba"],
    category: ["Depresor", "Otro"],
    structureImage: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=5486976&t=l',
    chemicalFormula: 'C₈H₁₇NO₂',
    content: {
      description: "Medicamento anticonvulsivo y ansiolítico que actúa como depresor del sistema nervioso central. No es una benzodiacepina, pero tiene un potencial de abuso y dependencia.",
      effects: {
        positive: ["Reducción de la ansiedad", "Sensación de euforia y desinhibición", "Aumento de la sociabilidad."],
        negative: ["Mareos, somnolencia", "Visión borrosa, falta de coordinación", "Confusión y dificultad para pensar con claridad", "Edema (hinchazón) periférico."],
      },
      duration: {
        total: "4 - 8 horas",
        onset: "30 - 90 minutos",
        peak: "2 - 4 horas",
      },
      dosage: {
        warning: "Debe usarse bajo prescripción médica. En el uso recreativo, la tolerancia se desarrolla rápidamente, llevando a un aumento de la dosis y los riesgos.",
      },
      risks: ["Dependencia física y psicológica con un síndrome de abstinencia.", "Riesgo de caídas y accidentes por la pérdida de coordinación.", "Potencia peligrosamente los efectos de otros depresores."],
      guidelines: [
        "🚫 **NO MEZCLAR CON OTROS DEPRESORES:** La combinación con opioides, alcohol o benzodiacepinas es particularmente peligrosa y aumenta significativamente el riesgo de sobredosis por depresión respiratoria.",
        "👨‍⚕️ **Seguir indicaciones médicas:** No superar la dosis recetada.",
        "📉 **Retirada gradual:** No suspender el consumo de forma brusca para evitar el síndrome de abstinencia.",
      ],
      alerts: "Aunque a veces se percibe como más 'segura' que las benzodiacepinas, la pregabalina es una sustancia con riesgos considerables, especialmente en combinación con otros depresores. Su capacidad para potenciar los efectos de los opioides la convierte en un factor de riesgo en sobredosis."
    }
  }
];

// === REAGENT TESTING DATA ===

export const REAGENT_TESTS: ReagentTest[] = [
  {
    name: "Marquis",
    description: "El reactivo más común y versátil. Detecta principalmente anfetaminas, MDMA, opioides y cathinonas.",
    substances: [
      { substance: "MDMA", reaction: "Violeta oscuro a negro", color: "#2D1B4E" },
      { substance: "Anfetamina / Speed", reaction: "Naranja a marrón", color: "#8B4513" },
      { substance: "Metanfetamina", reaction: "Naranja a rojo", color: "#FF4500" },
      { substance: "2C-B", reaction: "Amarillo a verde", color: "#9ACD32" },
      { substance: "Cocaína", reaction: "Sin cambio o amarillo muy leve", color: "#F5F5DC" },
      { substance: "LSD", reaction: "Sin cambio", color: "#FFFFFF" },
      { substance: "Heroína", reaction: "Violeta a púrpura", color: "#8B008B" },
      { substance: "DXM", reaction: "Gris a negro", color: "#2F4F4F" },
    ]
  },
  {
    name: "Mandelin",
    description: "Útil para diferenciar entre MDMA y sustancias adulterantes como cathinonas sintéticas (bath salts).",
    substances: [
      { substance: "MDMA", reaction: "Negro", color: "#000000" },
      { substance: "Anfetamina", reaction: "Verde a marrón", color: "#556B2F" },
      { substance: "Metanfetamina", reaction: "Verde a marrón", color: "#6B8E23" },
      { substance: "2C-B", reaction: "Verde", color: "#228B22" },
      { substance: "Metilona (bk-MDMA)", reaction: "Marrón a negro", color: "#3E2723" },
      { substance: "MDPV", reaction: "Naranja", color: "#FFA500" },
    ]
  },
  {
    name: "Mecke",
    description: "Detecta principalmente opioides y cathinonas. Complementa bien a Marquis y Mandelin.",
    substances: [
      { substance: "MDMA", reaction: "Azul oscuro a negro", color: "#191970" },
      { substance: "Heroína", reaction: "Verde a azul oscuro", color: "#006400" },
      { substance: "Codeína", reaction: "Verde a azul", color: "#4682B4" },
      { substance: "MDPV", reaction: "Amarillo verdoso", color: "#ADFF2F" },
      { substance: "PMA/PMMA", reaction: "Azul oscuro a negro", color: "#000033" },
    ]
  },
  {
    name: "Simon's",
    description: "Reactivo de dos pasos que distingue entre MDMA y MDA. También detecta metanfetamina.",
    substances: [
      { substance: "MDMA", reaction: "Azul (paso 1), sin cambio (paso 2)", color: "#0000FF" },
      { substance: "MDA", reaction: "Sin cambio en ambos pasos", color: "#F5F5F5" },
      { substance: "Metanfetamina", reaction: "Azul", color: "#4169E1" },
      { substance: "Anfetamina", reaction: "Sin cambio", color: "#FFFFF0" },
    ]
  },
  {
    name: "Froehde",
    description: "Similar a Marquis, pero útil para diferenciar opioides y anfetaminas.",
    substances: [
      { substance: "MDMA", reaction: "Negro", color: "#000000" },
      { substance: "Anfetamina", reaction: "Verde", color: "#008000" },
      { substance: "Heroína", reaction: "Púrpura", color: "#800080" },
      { substance: "2C-B", reaction: "Amarillo a verde", color: "#FFD700" },
    ]
  },
  {
    name: "Ehrlich",
    description: "Detecta indoles (LSD, DMT, psilocibina). Esencial para testar psicodélicos.",
    substances: [
      { substance: "LSD", reaction: "Púrpura", color: "#9370DB" },
      { substance: "Psilocibina/Psilocina", reaction: "Púrpura", color: "#8A2BE2" },
      { substance: "DMT", reaction: "Púrpura", color: "#9400D3" },
      { substance: "NBOMe (25I, 25C, etc.)", reaction: "Sin cambio", color: "#FFFFFF" },
      { substance: "DOx (DOB, DOC, etc.)", reaction: "Sin cambio", color: "#F5F5F5" },
    ]
  },
  {
    name: "Hofmann",
    description: "Complementa a Ehrlich para confirmar LSD. Reacciona con indoles pero no con todos.",
    substances: [
      { substance: "LSD", reaction: "Azul a verde", color: "#1E90FF" },
      { substance: "Psilocibina", reaction: "Azul", color: "#4169E1" },
      { substance: "NBOMe", reaction: "Sin cambio o amarillo", color: "#FFFACD" },
    ]
  }
];

export const TESTING_RESOURCES: TestingResource[] = [
  {
    name: "ARDA (Asociación de Reducción de Daños de Argentina)",
    type: "organization",
    website: "https://arda.org.ar",
    description: "La primera ONG de Argentina dedicada a la reducción de daños. Realizan intervenciones y testeo colorimétrico de sustancias en espacios de ocio nocturno y fiestas.",
    contact: "Instagram: @arda_arg"
  },
  {
    name: "PAF! Un Puntapié al Fundamento (Intercambios A.C.)",
    type: "organization",
    website: "https://intercambios.org.ar",
    description: "Proyecto de Intercambios Asociación Civil. Pioneros en Argentina con stands de reducción de daños y análisis de sustancias en fiestas electrónicas y festivales masivos.",
    contact: "Instagram: @paf.oficial"
  },
  {
    name: "ArgenPills",
    type: "organization",
    website: "https://argenpills.org",
    description: "Comunidad online y foro referente sobre reducción de daños en el país. Comparten reportes y reviews sobre sustancias (pastillas, cristales) que circulan en Argentina y orientan sobre reactivos.",
    contact: "Foro online / Instagram: @argenpills"
  },
  {
    name: "Test Kits (Compra Local e Internacional)",
    type: "online",
    website: "MercadoLibre / TestKitPlus.com",
    description: "Aunque no hay laboratorios públicos de acceso libre, se fomenta el autotesteo. Se consiguen reactivos (Marquis, Ehrlich, etc.) online en Argentina (ML) o importándolos (EZ Test, Bunk Police).",
    contact: "Buscar 'Reactivos colorimétricos testeo' en ML"
  }
];

export const INSTITUTIONAL_TESTING = [
  {
    name: "CENATOXA - Universidad de Buenos Aires (UBA)",
    type: "Laboratorio Universitario",
    description: "Centro de Asesoramiento Toxicológico Analítico (Facultad de Farmacia y Bioquímica). Disponen de cromatografía gaseosa y espectrometría de masas para análisis de composición precisos.",
    contact: "consultas@ffyb.uba.ar | +54 11 5287-4000"
  },
  {
    name: "Universidad Nacional de Rosario (UNR) / CEADS",
    type: "Laboratorio / Investigación",
    description: "La Facultad de Ciencias Bioquímicas posee laboratorios capacitados (CG/EM) para perfilado de sustancias. El CEADS fomenta históricamente cruces con la reducción de daños.",
    contact: "Facultad de Cs. Bioquímicas y Farmacéuticas - UNR"
  },
  {
    name: "CIM - UNLP / CONICET (La Plata)",
    type: "Laboratorio Oficial",
    description: "El Centro de Investigaciones del Medioambiente presta servicios de análisis de perfiles moleculares y cannabinoides mediante cromatografía (HPLC).",
    contact: "cim@quimica.unlp.edu.ar"
  },
  {
    name: "ARDA (Asociación de Reducción de Daños de Argentina)",
    type: "Asociación Civil",
    description: "Pioneros en reducción de daños. Asesoran a usuarios, militan por un cambio en la ley de drogas y promueven la instalación de laboratorios de testeo estatales de acceso público.",
    contact: "Instagram: @arda_arg | Sitio: arda.org.ar"
  },
  {
    name: "PAF! Un Puntapié al Fundamento (Intercambios)",
    type: "Proyecto de Reducción de Daños",
    description: "Comandos de intervención en fiestas electrónicas. Cuentan con stands de testeo colorimétrico in situ para descartar adulterantes peligrosos en el momento.",
    contact: "Instagram: @paf.oficial"
  },
  {
    name: "ArgenPills",
    type: "Comunidad / Foro",
    description: "Comunidad online de referencia en Argentina. Recopilan reportes de usuarios sobre reactivos y pastillas circulantes, democratizando la información de riesgos.",
    contact: "Foro: argenpills.org"
  }
];

export const TESTING_GUIDE = {
  intro: "El testeo de sustancias es una herramienta fundamental de reducción de daños. Te permite identificar qué contiene realmente una pastilla, polvo o papel, reduciendo significativamente los riesgos de consumo.",

  whyTest: [
    "**Adulteración es común:** Muchas sustancias vendidas como 'éxtasis' o 'LSD' contienen otras drogas más peligrosas o no contienen nada de lo que dicen.",
    "**Dosis variables:** Las pastillas pueden tener dosis muy altas o muy bajas.",
    "**Sustancias desconocidas:** Cathinonas sintéticas, fentanilo, NBOMe y otras sustancias peligrosas se venden como otras cosas.",
    "**Seguridad:** Saber qué vas a consumir te permite tomar decisiones más informadas y reducir riesgos."
  ],

  howToTest: [
    {
      step: 1,
      title: "Preparar el área",
      description: "Trabaja en un lugar bien iluminado, con superficie blanca (plato de cerámica blanco ideal). Usa guantes si es posible."
    },
    {
      step: 2,
      title: "Tomar una muestra pequeña",
      description: "Solo necesitás una cantidad muy pequeña (tamaño de grano de arroz o menos). Raspá o triturá la sustancia para exponer el interior."
    },
    {
      step: 3,
      title: "Aplicar el reactivo",
      description: "Colocá 1-2 gotas del reactivo sobre la muestra. NO pongas la sustancia dentro del frasco del reactivo."
    },
    {
      step: 4,
      title: "Observar la reacción",
      description: "El cambio de color suele ser inmediato (segundos). Comparar con la tabla de colores del kit o con referencias en línea."
    },
    {
      step: 5,
      title: "Usar múltiples reactivos",
      description: "Un solo reactivo NO es suficiente. Usá al menos 2-3 reactivos diferentes para confirmar. Por ejemplo: Marquis + Mandelin + Mecke para MDMA."
    },
    {
      step: 6,
      title: "Interpretar con precaución",
      description: "Los reactivos NO te dicen pureza o dosis exacta. Solo indican presencia/ausencia de ciertas sustancias. Un resultado negativo NO garantiza seguridad total."
    }
  ],

  recommendations: [
    "🔬 **Usá siempre múltiples reactivos:** Nunca confíes en un solo test.",
    "📸 **Documentá:** Sacá fotos de las reacciones para comparar después.",
    "⏱️ **Esperá unos segundos:** Algunas reacciones son lentas.",
    "🧪 **Guardá correctamente:** Los reactivos tienen fecha de vencimiento. Guardarlos en lugar fresco y oscuro.",
    "🚫 **Los test tienen limitaciones:** No detectan todos los adulterantes y no miden pureza.",
    "💡 **Consultá con expertos:** Llevá tus sustancias a servicios de análisis como ArgenPills para un análisis más completo (GC/MS)."
  ],

  commonAdulterants: [
    { substance: "NBOMe (25I-NBOMe, etc.)", risk: "Extremadamente peligroso. Vendido como LSD. Puede causar convulsiones y muerte en dosis altas. Ehrlich NO reacciona con NBOMe." },
    { substance: "PMA/PMMA", risk: "Vendido como MDMA. Mucho más tóxico, tarda más en hacer efecto (riesgo de sobredosis por redosificar)." },
    { substance: "Cathinonas (MDPV, Metilona, etc.)", risk: "Vendidas como MDMA. Efectos más estimulantes, mayor riesgo cardíaco y psicosis." },
    { substance: "Fentanilo", risk: "Opioide sintético ultra-potente. Puede estar en cualquier cosa. Riesgo altísimo de sobredosis fatal." },
    { substance: "N-etilpentilona", risk: "Vendida como MDMA. Efectos más cortos, mayor ansiedad, mayor riesgo de dosificación compulsiva." },
    { substance: "Cafeína/Metanfetamina en éxtasis", risk: "Aumentan efectos estimulantes, carga cardíaca y riesgo de deshidratación." }
  ]
};

// === LOCAL RESOURCES DATABASE ===

export const LOCAL_RESOURCES: LocalResource[] = [
  // National Hotlines
  {
    name: "Línea 141 - Atención a Consumos Problemáticos",
    type: "hotline",
    province: "Nacional",
    phone: "141",
    description: "Línea gratuita nacional de SEDRONAR para orientación, contención y derivación en casos de consumo problemático de sustancias. Atención las 24 horas.",
    services: ["Orientación", "Contención telefónica", "Derivación a centros de tratamiento", "Información para familiares"],
    hours: "24 horas, todos los días",
    free: true
  },
  {
    name: "Línea 135 - Salud Mental",
    type: "hotline",
    province: "Ciudad Autónoma de Buenos Aires",
    phone: "135",
    description: "Línea gratuita de atención en crisis de salud mental del Gobierno de la Ciudad de Buenos Aires. Atención especializada para situaciones de consumo y crisis.",
    services: ["Atención en crisis", "Orientación psicológica", "Derivación a hospitales", "Seguimiento post-crisis"],
    hours: "24 horas, todos los días",
    free: true
  },
  {
    name: "SAME - Emergencias Médicas",
    type: "hotline",
    province: "Nacional",
    phone: "107",
    description: "Sistema de Atención Médica de Emergencias. Llamar en casos de sobredosis, intoxicación o emergencia médica relacionada con consumos.",
    services: ["Emergencias médicas", "Ambulancias", "Atención de sobredosis", "Traslados hospitalarios"],
    hours: "24 horas, todos los días",
    free: true
  },

  // Buenos Aires Province & CABA
  {
    name: "Hospital Borda - Unidad de Internación de Agudos",
    type: "hospital",
    province: "Ciudad Autónoma de Buenos Aires",
    city: "Buenos Aires",
    address: "Ramón Carrillo 375, Parque Patricios",
    phone: "011 4305-5555",
    description: "Hospital psiquiátrico con unidad especializada en adicciones. Internación breve, consultas ambulatorias y programas de seguimiento.",
    services: ["Internación aguda", "Desintoxicación", "Consultas ambulatorias", "Grupos terapéuticos", "Psiquiatría"],
    hours: "Guardia 24hs, consultorios externos de lunes a viernes",
    free: true
  },
  {
    name: "Hospital Torcuato de Alvear - Servicio de Adicciones",
    type: "hospital",
    province: "Ciudad Autónoma de Buenos Aires",
    city: "Buenos Aires",
    address: "Warnes 2630, Villa Crespo",
    phone: "011 4581-2255",
    description: "Hospital público con servicio especializado en adicciones. Internación, Hospital de Día y consultas externas.",
    services: ["Internación", "Hospital de Día", "Consultorios externos", "Grupos terapéuticos", "Familia"],
    hours: "Guardia 24hs",
    free: true
  },
  {
    name: "Centro CEDECOR - SEDRONAR",
    type: "clinic",
    province: "Buenos Aires",
    city: "Mar del Plata",
    phone: "0800-333-1665",
    description: "Centro de Día para el abordaje de consumos problemáticos. Modalidad ambulatoria con equipos interdisciplinarios.",
    services: ["Atención ambulatoria", "Grupos terapéuticos", "Orientación familiar", "Talleres", "Seguimiento individual"],
    free: true
  },

  // Córdoba
  {
    name: "Hospital Neuropsiquiátrico Provincial",
    type: "hospital",
    province: "Córdoba",
    city: "Córdoba",
    address: "Av. Vélez Sársfield 1395",
    phone: "0351 468-1300",
    description: "Hospital con servicio de adicciones. Internación, consultas externas y programas ambulatorios.",
    services: ["Internación", "Consultas externas", "Desintoxicación", "Hospital de Día", "Grupos"],
    hours: "Guardia 24hs",
    free: true
  },
  {
    name: "Programa Provincial de Prevención y Asistencia de las Adicciones",
    type: "clinic",
    province: "Córdoba",
    city: "Córdoba",
    phone: "0351 434-3258",
    description: "Red provincial de centros de atención para consumos problemáticos. Derivación y coordinación territorial.",
    services: ["Derivación a centros", "Orientación", "Programas ambulatorios", "Prevención comunitaria"],
    free: true
  },

  // Santa Fe
  {
    name: "Hospital Mira y López",
    type: "hospital",
    province: "Santa Fe",
    city: "Santa Fe",
    address: "Blas Parera 8300",
    phone: "0342 489-3368",
    description: "Hospital psiquiátrico con unidad de adicciones. Internación, consultas y programas terapéuticos.",
    services: ["Internación", "Consultas externas", "Desintoxicación", "Grupos terapéuticos"],
    hours: "Guardia 24hs",
    free: true
  },

  // Mendoza
  {
    name: "Centro Integral de Adicciones - Hospital El Sauce",
    type: "clinic",
    province: "Mendoza",
    city: "Guaymallén",
    phone: "0261 449-9200",
    description: "Centro especializado en tratamiento de adicciones. Modalidad ambulatoria e internación.",
    services: ["Internación", "Consultas", "Hospital de Día", "Grupos", "Atención familiar"],
    free: true
  },

  // Tucumán
  {
    name: "Hospital del Carmen - Servicio de Adicciones",
    type: "hospital",
    province: "Tucumán",
    city: "San Miguel de Tucumán",
    address: "Av. Aconquija 1050",
    phone: "0381 450-6000",
    description: "Hospital general con servicio de adicciones. Consultas externas e internación breve.",
    services: ["Consultas externas", "Internación breve", "Desintoxicación", "Derivación"],
    hours: "Lunes a viernes 8-13hs",
    free: true
  },

  // NGOs and Community Organizations
  {
    name: "FONGA - Fundación Nuestros Gurises en Acción",
    type: "ngo",
    province: "Ciudad Autónoma de Buenos Aires",
    city: "Buenos Aires",
    website: "https://www.fonga.org.ar",
    description: "ONG que trabaja en prevención y asistencia a jóvenes en situación de vulnerabilidad. Programas de reducción de daños y acompañamiento.",
    services: ["Reducción de daños", "Talleres", "Acompañamiento", "Asesoramiento", "Prevención comunitaria"],
    free: true
  },
  {
    name: "Intercambios A.C.",
    type: "ngo",
    province: "Ciudad Autónoma de Buenos Aires",
    city: "Buenos Aires",
    website: "https://www.intercambios.org.ar",
    phone: "011 4363-2358",
    description: "Asociación civil pionera en reducción de daños en Argentina. Programas de intercambio de jeringas, testeo de sustancias y capacitación.",
    services: ["Intercambio de jeringas", "Testeo de VIH/Hepatitis", "Capacitación", "Asesoramiento", "Materiales de prevención"],
    free: true
  },
  {
    name: "Mamisepuede",
    type: "ngo",
    province: "Ciudad Autónoma de Buenos Aires",
    city: "Buenos Aires",
    website: "https://www.instagram.com/mamisepuede.ok/",
    description: "Organización de reducción de daños con presencia en eventos y festivales. Testeo de sustancias, información y acompañamiento.",
    services: ["Testeo de sustancias", "Información en eventos", "Acompañamiento", "Talleres", "Materiales educativos"],
    free: true
  },
  {
    name: "ArgenPills",
    type: "ngo",
    province: "Nacional",
    website: "https://argenpills.org",
    description: "Principal organización de análisis y reducción de daños en Argentina. Base de datos de pastillas analizadas, alertas territoriales y testeo gratuito.",
    services: ["Testeo de sustancias (GC/MS)", "Alertas de adulteración", "Base de datos de análisis", "Información", "Talleres"],
    free: true
  },

  // Therapy and Support Groups
  {
    name: "Narcóticos Anónimos Argentina",
    type: "community_center",
    province: "Nacional",
    website: "https://na.org.ar",
    phone: "0800-333-4720",
    description: "Comunidad de recuperación basada en los 12 pasos. Reuniones en todo el país, gratuitas y anónimas.",
    services: ["Grupos de autoayuda", "Apadrinamiento", "Reuniones semanales", "Apoyo entre pares"],
    free: true
  },
  {
    name: "Alcohólicos Anónimos Argentina",
    type: "community_center",
    province: "Nacional",
    website: "https://aa.org.ar",
    description: "Comunidad de recuperación del alcoholismo basada en los 12 pasos. Reuniones gratuitas en todo el país.",
    services: ["Grupos de autoayuda", "Apadrinamiento", "Reuniones semanales", "Apoyo entre pares"],
    free: true
  },

  // Additional Provincial Resources
  {
    name: "Programa Provincial de Adicciones de Salta",
    type: "clinic",
    province: "Salta",
    city: "Salta",
    phone: "0387 431-3333",
    description: "Red provincial de centros de atención. Derivación, consultas y programas ambulatorios.",
    services: ["Derivación", "Consultas", "Programas ambulatorios", "Prevención"],
    free: true
  },
  {
    name: "Centro de Día Municipal - Rosario",
    type: "community_center",
    province: "Santa Fe",
    city: "Rosario",
    description: "Centro municipal de atención a consumos problemáticos. Modalidad de Hospital de Día con equipos interdisciplinarios.",
    services: ["Hospital de Día", "Talleres", "Grupos terapéuticos", "Atención psicológica", "Orientación familiar"],
    free: true
  },
  {
    name: "Centro Provincial de Atención a las Adicciones - Neuquén",
    type: "clinic",
    province: "Neuquén",
    city: "Neuquén",
    description: "Centro especializado en adicciones. Atención ambulatoria, consultas e internación breve.",
    services: ["Internación breve", "Consultas externas", "Hospital de Día", "Grupos", "Familia"],
    free: true
  }
];

export const RESOURCE_TYPES = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'hospital', label: 'Hospitales' },
  { value: 'clinic', label: 'Centros/Clínicas' },
  { value: 'hotline', label: 'Líneas telefónicas' },
  { value: 'ngo', label: 'ONGs' },
  { value: 'community_center', label: 'Centros comunitarios' },
  { value: 'therapy', label: 'Terapia/Apoyo' },
] as const;