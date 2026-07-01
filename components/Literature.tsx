import React from 'react';
import { PageHeader, Panel, Pill, Display } from './ui';

const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
);

interface Article {
    title: string;
    author: string;
    source: string;
    year: string;
    type: 'Paper Científico' | 'Ciencias Sociales' | 'Nota / Artículo';
    url: string;
    summary: string;
}

const LITERATURE_DATA: Article[] = [
    // Reducción de daños general
    {
        title: "Intervenciones de reducción de daños en usuarios de drogas",
        author: "Varios Autores",
        source: "Gaceta Sanitaria",
        year: "2016",
        type: "Paper Científico",
        url: "https://www.gacetasanitaria.org/es-intervenciones-reduccion-danos-usuarios-drogas-articulo-S0213911116300838",
        summary: "Revisión de políticas como intercambio de jeringuillas y tratamientos de sustitución; evidencia de reducción de VIH y sobredosis en Europa."
    },
    {
        title: "El movimiento de reducción de daños",
        author: "Intercambios Asociación Civil",
        source: "Intercambios A.C.",
        year: "Documento",
        type: "Ciencias Sociales",
        url: "https://www.intercambios.org.ar/assets/files/El_movimiento_de_reduccion_de_da%C3%B1os.pdf",
        summary: "Historia del movimiento en Argentina impulsado desde ONGs; enfocado en vulnerabilidades sociales y salud colectiva."
    },
    {
        title: "Reducción de Riesgos y Daños desde la Salud Colectiva",
        author: "Publicación Académica",
        source: "Revista Plaza Pública (UNICEN)",
        year: "2020",
        type: "Ciencias Sociales",
        url: "https://ojs2.fch.unicen.edu.ar/ojs-3.1.0/index.php/plaza-publica/article/download/1717/1578",
        summary: "Abordaje integral en Argentina, integrando derechos humanos y abordajes adaptados a los contextos locales."
    },

    // Análisis sociológicos consumo drogas
    {
        title: "Consumo problemático de sustancias en Argentina",
        author: "Revista Iise",
        source: "UNSJ",
        year: "Reciente",
        type: "Ciencias Sociales",
        url: "https://ojs.unsj.edu.ar/index.php/reviise/article/view/698",
        summary: "Análisis con prevalencia alta en cocaína; muestra brechas por Nivel Socioeconómico (NSE) pese al uso inicial en altos ingresos."
    },
    {
        title: "Contextos de socialización y consumo de drogas",
        author: "SciELO",
        source: "SciELO",
        year: "2014",
        type: "Ciencias Sociales",
        url: "http://scielo.isciii.es/scielo.php?script=sci_arttext&pid=S1132-05592014000100008",
        summary: "Estudio sobre factores familiares y autoestima en adolescentes españoles, aplicable a las dinámicas en Latinoamérica."
    },
    {
        title: "La dimensión temporal del consumo",
        author: "Salud Colectiva",
        source: "Revistas UNLa",
        year: "Reciente",
        type: "Ciencias Sociales",
        url: "https://revistas.unla.edu.ar/saludcolectiva/article/view/860",
        summary: "Investigación cualitativa sobre policonsumo en el Área Metropolitana de Buenos Aires (AMBA); influencias de género y edad."
    },
    {
        title: "Práctica social de harm reduction en Argentina",
        author: "NCBI / PMC",
        source: "Pubmed Central",
        year: "2016",
        type: "Paper Científico",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4864616/",
        summary: "Investigación etnográfica que explora el enfoque 'latino' único en la implementación de la reducción de daños en el país."
    },

    // Cannabis específico
    {
        title: "Análisis políticas cannabis Argentina/Uruguay",
        author: "Revista Semillas",
        source: "Unicatólica",
        year: "Reciente",
        type: "Ciencias Sociales",
        url: "https://www.revistas.unicatolica.edu.co/revista/index.php/semillas/article/view/610",
        summary: "Comparativa de manuales de reducción de daños y el reconocimiento sociológico de los placeres recreativos."
    },
    {
        title: "Cannabis, regulación y territorio",
        author: "SEDICI",
        source: "Repositorio UNLP",
        year: "Reciente",
        type: "Ciencias Sociales",
        url: "https://sedici.unlp.edu.ar/bitstream/handle/10915/184158/Documento_completo.pdf-PDFA.pdf?sequence=1",
        summary: "Tesis sobre la sustitución de sustancias nocivas vía ONGs y el impacto territorial de las nuevas regulaciones."
    },
    {
        title: "Imaginarios sobre marihuana en jóvenes",
        author: "OAD / SEDRONAR",
        source: "Gobierno de Argentina",
        year: "2016",
        type: "Ciencias Sociales",
        url: "https://www.argentina.gob.ar/sites/default/files/2020/11/oad_2016._razones_de_consumono_consumo_de_marihuana_en_jovenes_escolarizados_no_consumidores_residentes_en_amba.pdf",
        summary: "Estudio oficial sobre los discursos sociales, razones de consumo y no consumo en jóvenes escolares del AMBA."
    },

    // Psicodélicos, hongos y DMT
    {
        title: "Hongos psilocibios: patrimonio biocultural",
        author: "SciELO Colombia",
        source: "SciELO",
        year: "2021",
        type: "Paper Científico",
        url: "http://www.scielo.org.co/scielo.php?script=sci_arttext&pid=S0123-37692021000200037",
        summary: "Estudio sobre etnomicología mazateca, usos tradicionales y la revalorización del potencial terapéutico de los hongos psilocibios."
    },
    {
        title: "El caso cannabis y psicodélicos",
        author: "Salud Colectiva",
        source: "Revistas UNLa",
        year: "Reciente",
        type: "Ciencias Sociales",
        url: "https://revistas.unla.edu.ar/saludcolectiva/article/view/2493",
        summary: "Análisis crítico que contrasta el modelo prohibicionista histórico frente a la creciente evidencia científica en el tratamiento clínico."
    },
    {
        title: "La ciencia detrás de la microdosificación con hongos",
        author: "Échele Cabeza",
        source: "Acción Técnica Social",
        year: "Sitio Web",
        type: "Nota / Artículo",
        url: "https://www.echelecabeza.com/la-ciencia-detras-de-la-microdosificacion-con-hongos-mas-alla-del-efecto-placebo/",
        summary: "Artículo accesible sobre los beneficios observacionales y la posible reducción de otros consumos mediante microdosis."
    },
    {
        title: "Diseño sociocultural DMT",
        author: "Repositorio TDX",
        source: "TDX",
        year: "Tesis",
        type: "Ciencias Sociales",
        url: "https://www.tdx.cat/bitstream/handle/10803/129328/em1de1.pdf?sequence=1",
        summary: "Tesis profunda sobre los imaginarios mediáticos plurales y la estructura del uso sociocultural y ritualístico de DMT."
    }
];

const TYPE_COLOR: Record<Article['type'], string> = {
    'Paper Científico': 'var(--color-blue)',
    'Ciencias Sociales': 'var(--color-violet)',
    'Nota / Artículo': 'var(--accent-primary)',
};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
    const color = TYPE_COLOR[article.type];
    return (
        <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block h-full"
            style={{ textDecoration: 'none' }}
        >
            <Panel
                interactive
                tab={<ExternalLinkIcon className="w-[18px] h-[18px]" />}
                cut="lg"
                className="flex flex-col h-full p-6 pr-14"
            >
                <div>
                    <Pill as="span" active color={color}>{article.type}</Pill>
                </div>

                <Display size="md" upper className="mt-4" style={{ letterSpacing: '-0.005em' }}>
                    {article.title}
                </Display>

                <div className="mt-2.5" style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {article.author} · {article.source}, {article.year}
                </div>

                <p className="mt-3.5 flex-1" style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--text-tertiary)' }}>
                    {article.summary}
                </p>

                <span className="inline-flex items-center gap-1.5 mt-6" style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
                    Leer documento <ExternalLinkIcon className="w-3.5 h-3.5" />
                </span>
            </Panel>
        </a>
    );
};

export const Literature: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
            <PageHeader
                eyebrow="Lecturas"
                title="Literatura y Evidencia"
                description="Papers científicos, artículos de ciencias sociales y publicaciones sobre reducción de daños y políticas de drogas."
                accent="var(--accent-primary)"
            />

            <div className="flex-1 px-5 sm:px-7 lg:px-8" style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-6)' }}>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {LITERATURE_DATA.map((article, idx) => (
                        <ArticleCard key={idx} article={article} />
                    ))}
                </div>

                <div className="mt-10 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <p className="text-center" style={{ fontSize: '12px', lineHeight: 1.65, color: 'var(--text-muted)', maxWidth: '60ch', margin: '0 auto' }}>
                        Esta sección está en construcción. Próximamente incorporaremos un buscador de papers académicos y artículos archivados.
                    </p>
                </div>
            </div>
        </div>
    );
};
