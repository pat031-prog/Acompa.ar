import React, { useState, useEffect } from 'react';
import { Kicker, Display, DarkCard, DataBlock, RailItem, CoralButton, Pill } from './ui';
import { motion, AnimatePresence } from 'motion/react';
import { listContainer, listItem, detailVariants } from './motion';
import { BookMarked, ExternalLink, ArrowLeft } from 'lucide-react';

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

const Detail: React.FC<{ article: Article; index: number; onBack: () => void }> = ({ article, index, onBack }) => (
    <AnimatePresence mode="wait">
        <motion.div
            key={article.title}
            variants={detailVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-2xl mx-auto w-full"
        >
            <div className="flex justify-between items-center mb-8 pt-2 md:pt-0">
                <button onClick={onBack} className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ border: '1px solid rgba(0,0,0,0.15)', color: 'var(--accent-ink)', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    <ArrowLeft size={15} /> Volver
                </button>
                <span className="hidden md:inline" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase' }}>#{String(index).padStart(2, '0')} · {article.year}</span>
                <div className="rounded-full flex items-center gap-2 px-4 py-2" style={{ background: 'var(--bg-primary)', color: 'var(--accent-primary)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{article.type}</span>
                </div>
            </div>

            <div className="text-center md:text-left mb-10">
                <Display size="lg" upper color="var(--accent-ink)">{article.title}</Display>
                <p className="mt-4" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7 }}>{article.author} · {article.source}, {article.year}</p>
            </div>

            <DarkCard className="p-7 md:p-9">
                <div className="space-y-6">
                    <DataBlock label="Síntesis">
                        <p className="leading-relaxed" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>{article.summary}</p>
                    </DataBlock>
                    <div className="pt-2">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
                            <CoralButton><ExternalLink size={16} /> Leer documento</CoralButton>
                        </a>
                    </div>
                </div>
            </DarkCard>
        </motion.div>
    </AnimatePresence>
);

export const Literature: React.FC = () => {
    const [selectedType, setSelectedType] = useState<Article['type'] | 'All'>('All');
    const [selected, setSelected] = useState<Article | null>(LITERATURE_DATA[0]);
    const [mobileDetail, setMobileDetail] = useState(false);

    const types: (Article['type'] | 'All')[] = ['All', 'Paper Científico', 'Ciencias Sociales', 'Nota / Artículo'];
    const filtered = selectedType === 'All' ? LITERATURE_DATA : LITERATURE_DATA.filter(a => a.type === selectedType);

    useEffect(() => {
        if (!selected || !filtered.some(a => a.title === selected.title)) {
            setSelected(filtered.length > 0 ? filtered[0] : null);
        }
    }, [filtered, selected]);

    const select = (a: Article) => { setSelected(a); setMobileDetail(true); };

    return (
        <div className="flex flex-col md:flex-row h-full w-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            {/* ── Rail ── */}
            <div className={`w-full md:w-1/3 min-h-0 flex-1 md:flex-none flex-col p-6 md:p-10 relative ${mobileDetail ? 'hidden md:flex' : 'flex'}`} style={{ borderRight: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center justify-between mb-6">
                    <Kicker>Lecturas</Kicker>
                    <span style={{ color: 'var(--accent-primary)' }}><BookMarked size={22} /></span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {types.map(t => (
                        <Pill key={t} color={t === 'All' ? 'var(--accent-primary)' : TYPE_COLOR[t]} active={selectedType === t} onClick={() => setSelectedType(t)}>{t === 'All' ? 'Todas' : t}</Pill>
                    ))}
                </div>

                <motion.div variants={listContainer} initial="initial" animate="animate" className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar pt-2" style={{ paddingBottom: '120px' }}>
                    {filtered.map(a => (
                        <motion.div variants={listItem} key={a.title}>
                            <RailItem active={selected?.title === a.title} onClick={() => select(a)} layoutId="lit-pill" sub={`${a.source} · ${a.year}`}>
                                {a.title}
                            </RailItem>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* ── Detail (coral) ── */}
            <div className={`w-full md:w-2/3 min-h-0 flex-1 md:flex-none ${mobileDetail ? 'flex' : 'hidden md:flex'}`}>
                {selected ? (
                    <div className="w-full min-h-0 p-6 md:p-12 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar rounded-t-[var(--radius-panel-mobile)] md:rounded-l-[var(--radius-panel-desktop)] md:rounded-tr-none" style={{ background: 'var(--accent-primary)', color: 'var(--accent-ink)', paddingBottom: '120px' }}>
                        <Detail article={selected} index={LITERATURE_DATA.findIndex(a => a.title === selected.title) + 1} onBack={() => setMobileDetail(false)} />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10" style={{ color: 'var(--text-muted)' }}>
                        <BookMarked size={28} /><p className="mt-4">Elegí una lectura.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
