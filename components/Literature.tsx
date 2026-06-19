import React from 'react';

const BookIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
);

const ExternalLinkIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
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

export const Literature: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-primary)]">
            {/* Editorial Header */}
            <div className="p-6 sm:p-8" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-3 mb-3">
                    <span style={{ color: 'var(--color-blue)' }}><BookIcon /></span>
                    <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>LECTURAS</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                </div>
                <h1 style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
                    fontWeight: 700, letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                    lineHeight: 1.2
                }}>
                    Literatura y Evidencia
                </h1>
                <div style={{ width: '40px', height: '3px', background: 'var(--accent-primary)', margin: '10px 0 6px' }} />
                <p style={{
                    fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: '15px',
                    color: 'var(--text-tertiary)', lineHeight: 1.6,
                }}>
                    Papers científicos, artículos de ciencias sociales y publicaciones sobre reducción de daños y políticas de drogas.
                </p>
            </div>

            {/* Article List */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-10 py-8">
                <div className="max-w-4xl mx-auto space-y-12">
                    {LITERATURE_DATA.map((article, idx) => (
                        <article key={idx} className="relative pl-5 sm:pl-8" style={{ borderLeft: '2px solid rgba(255,255,255,0.08)' }}>

                            {/* Type Category */}
                            <div className="mb-3">
                                <span style={{
                                    display: 'inline-block',
                                    background: 'rgba(199,112,92,0.1)',
                                    color: 'var(--accent-primary)',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    padding: '4px 10px',
                                    borderRadius: 'var(--radius-pill)',
                                    border: '1px solid rgba(199,112,92,0.2)',
                                }}>
                                    {article.type}
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="mb-2" style={{
                                fontFamily: 'var(--font-editorial)',
                                fontSize: 'clamp(1.15rem, 4vw, 1.4rem)',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                lineHeight: 1.4,
                            }}>
                                {article.title}
                            </h2>

                            {/* Metadata */}
                            <div className="mb-4" style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: '13px', color: 'var(--text-muted)' }}>
                                <span>{article.author}</span>
                                <span className="mx-2">—</span>
                                <span>{article.source}, {article.year}</span>
                            </div>

                            {/* Summary */}
                            <p className="mb-5 leading-relaxed" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                                {article.summary}
                            </p>

                            {/* Link */}
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 transition-colors"
                                style={{
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-primary)',
                                    borderBottom: '1px solid var(--text-primary)',
                                    paddingBottom: '4px',
                                    paddingTop: '4px'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--text-primary)'; }}
                            >
                                LEER DOCUMENTO <ExternalLinkIcon />
                            </a>
                        </article>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="mt-16 pt-8 max-w-4xl mx-auto" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <p className="text-center" style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: '12px', color: 'var(--text-muted)' }}>
                        Esta sección está en construcción. Próximamente incorporaremos un buscador de papers académicos y artículos archivados.
                    </p>
                </div>
            </div>
        </div>
    );
};
