'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { createBuildPlan } from '@/lib/api-client';
import {
  Hammer,
  ArrowLeft,
  Wrench,
  Package,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
  Bot,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';

export default function PlanPage() {
  return (
    <Suspense fallback={<div className="px-4 pt-6 pb-8 text-center text-[#9CA3AF]">Laden...</div>}>
      <PlanContent />
    </Suspense>
  );
}

// ───── Plan data per template type ─────

interface PlanData {
  title: string;
  difficulty: string;
  estimatedHours: string;
  totalCost: number;
  tools: string[];
  materials: { name: string; brand: string; price: number }[];
  steps: { order: number; title: string; description: string; safety: string | null }[];
}

const PLANS: Record<string, PlanData> = {
  wall: {
    title: 'Muur schilderen',
    difficulty: 'Beginner',
    estimatedHours: '3-5 uur',
    totalCost: 155,
    tools: ['Verfroller', 'Kwast (50mm)', 'Afplaktape', 'Afdekzeil', 'Verfbak', 'Roerstaaf'],
    materials: [
      { name: 'Muurverf (5L)', brand: 'Flexa', price: 44.99 },
      { name: 'Grondverf (2.5L)', brand: 'Flexa', price: 29.99 },
      { name: 'Afplaktape', brand: 'Tesa', price: 8.99 },
      { name: 'Afdekfolie 4\u00D75m', brand: 'Gamma', price: 4.99 },
    ],
    steps: [
      { order: 1, title: 'Voorbereiding', description: 'Ruimte leegmaken en meubels afdekken met folie.', safety: 'Draag werkhandschoenen bij het verplaatsen van meubels.' },
      { order: 2, title: 'Muur reinigen', description: 'Stof en vuil verwijderen met een vochtige doek. Laat goed drogen.', safety: null },
      { order: 3, title: 'Afplakken', description: 'Randen, kozijnen en plinten afplakken met tape.', safety: null },
      { order: 4, title: 'Grondverf aanbrengen', description: 'Eerste laag grondverf aanbrengen met roller voor betere hechting.', safety: 'Zorg voor goede ventilatie bij het werken met verf.' },
      { order: 5, title: 'Laten drogen', description: 'Minimaal 4 uur laten drogen voordat je verder gaat.', safety: null },
      { order: 6, title: 'Eerste laag muurverf', description: 'Eerste laag muurverf aanbrengen met roller in gelijkmatige banen.', safety: 'Draag beschermende kleding tegen verfspatten.' },
      { order: 7, title: 'Tweede laag muurverf', description: 'Na droging tweede laag aanbrengen voor een dekkend resultaat.', safety: null },
      { order: 8, title: 'Afwerking', description: 'Tape voorzichtig verwijderen en details bijwerken met kwast.', safety: null },
    ],
  },
  floor: {
    title: 'Laminaat leggen',
    difficulty: 'Gemiddeld',
    estimatedHours: '6-10 uur',
    totalCost: 450,
    tools: ['Decoupeerzaag', 'Rolmaat', 'Klopblok', 'Trekijzer', 'Potlood', 'Afstandhouders'],
    materials: [
      { name: 'Laminaat (20m\u00B2)', brand: 'Quick-Step', price: 279.00 },
      { name: 'Ondervloer PE-schuim', brand: 'Gamma', price: 34.99 },
      { name: 'Plinten (12 stuks)', brand: 'Gamma', price: 59.88 },
      { name: 'Overgangsprofielen', brand: 'Praxis', price: 18.99 },
    ],
    steps: [
      { order: 1, title: 'Acclimatiseren', description: 'Laminaat 48 uur in de ruimte laten liggen om te wennen aan temperatuur en vochtigheid.', safety: null },
      { order: 2, title: 'Oude vloer verwijderen', description: 'Bestaande vloerbedekking verwijderen en ondergrond controleren op oneffenheden.', safety: 'Draag een stofmasker bij het verwijderen van oude vloerbedekking.' },
      { order: 3, title: 'Ondervloer leggen', description: 'PE-schuim ondervloer uitrollen met overlappende naden. Eventueel vochtscherm toevoegen.', safety: null },
      { order: 4, title: 'Eerste rij leggen', description: 'Begin bij de langste muur. Gebruik afstandhouders van 8-10mm langs de muur.', safety: null },
      { order: 5, title: 'Volgende rijen klikken', description: 'Klik de planken in elkaar onder een hoek van 20-30\u00B0. Verspringende naden van min. 30cm.', safety: 'Gebruik gehoorbescherming bij het zagen van laminaat.' },
      { order: 6, title: 'Laatste rij op maat', description: 'Meet de laatste rij nauwkeurig op en zaag op maat met de decoupeerzaag.', safety: 'Draag een veiligheidsbril bij het zagen.' },
      { order: 7, title: 'Plinten bevestigen', description: 'Plinten op maat zagen en bevestigen. Afstandhouders verwijderen.', safety: null },
      { order: 8, title: 'Overgangsprofielen', description: 'Overgangsprofielen plaatsen bij deuropeningen en aansluitingen.', safety: null },
    ],
  },
  shelves: {
    title: 'Planken ophangen',
    difficulty: 'Beginner',
    estimatedHours: '1-2 uur',
    totalCost: 65,
    tools: ['Boormachine', 'Waterpas', 'Potlood', 'Rolmaat', 'Kruiskopschroevendraaier'],
    materials: [
      { name: 'Wandplank 80cm', brand: 'IKEA', price: 14.99 },
      { name: 'Plankdragers (2 stuks)', brand: 'Gamma', price: 12.98 },
      { name: 'Pluggen + schroeven', brand: 'Fischer', price: 6.99 },
    ],
    steps: [
      { order: 1, title: 'Positie bepalen', description: 'Bepaal de gewenste hoogte en markeer met potlood. Gebruik een waterpas voor een rechte lijn.', safety: null },
      { order: 2, title: 'Leidingen checken', description: 'Controleer met een leidingzoeker of er geen leidingen of kabels in de muur zitten.', safety: 'Boor NOOIT zonder eerst te controleren op leidingen en kabels!' },
      { order: 3, title: 'Gaten boren', description: 'Boor de gaten op de gemarkeerde punten. Gebruik de juiste boor voor je muurtype (steen/beton/gips).', safety: 'Draag een veiligheidsbril en stofmasker bij het boren.' },
      { order: 4, title: 'Pluggen plaatsen', description: 'Duw de pluggen in de gaten en tik ze eventueel zacht aan met een hamer.', safety: null },
      { order: 5, title: 'Dragers monteren', description: 'Schroef de plankdragers stevig vast. Controleer nogmaals met waterpas.', safety: null },
      { order: 6, title: 'Plank plaatsen', description: 'Leg de plank op de dragers en bevestig eventueel met schroeven van onderen.', safety: null },
    ],
  },
  bathroom: {
    title: 'Badkamer tegelen',
    difficulty: 'Gevorderd',
    estimatedHours: '20-30 uur',
    totalCost: 1200,
    tools: ['Tegelsnijder', 'Tandspaanspatel', 'Rubberen spatel', 'Waterpas', 'Kruisjes', 'Tegelwiggen', 'Emmer', 'Mixer'],
    materials: [
      { name: 'Wandtegels 60x30 (10m\u00B2)', brand: 'Praxis', price: 349.00 },
      { name: 'Tegellijm (25kg)', brand: 'Weber', price: 24.99 },
      { name: 'Voegmortel (5kg)', brand: 'Weber', price: 14.99 },
      { name: 'Waterdichte folie', brand: 'Gamma', price: 49.99 },
      { name: 'Kitkoker sanitair', brand: 'Bison', price: 8.99 },
      { name: 'Tegelkruisjes 2mm', brand: 'Gamma', price: 4.99 },
    ],
    steps: [
      { order: 1, title: 'Muur voorbereiden', description: 'Oude tegels verwijderen, muur egaliseren en stofvrij maken.', safety: 'Draag een veiligheidsbril, stofmasker en werkhandschoenen bij het verwijderen van tegels.' },
      { order: 2, title: 'Waterdichte laag', description: 'Breng waterdichte folie of coating aan in de natte zones (douche, bad).', safety: null },
      { order: 3, title: 'Startlijn bepalen', description: 'Gebruik waterpas en lat om een perfect horizontale startlijn te markeren.', safety: null },
      { order: 4, title: 'Lijm aanbrengen', description: 'Breng tegellijm aan met tandspaanspatel. Werk in secties van max. 1m\u00B2.', safety: null },
      { order: 5, title: 'Tegels plaatsen', description: 'Druk tegels stevig aan en gebruik kruisjes voor gelijkmatige voegen.', safety: null },
      { order: 6, title: 'Tegels snijden', description: 'Snijd randtegels op maat met de tegelsnijder. Meet nauwkeurig!', safety: 'Draag een veiligheidsbril bij het snijden van tegels.' },
      { order: 7, title: 'Laten drogen', description: 'Laat de lijm minimaal 24 uur uitharden.', safety: null },
      { order: 8, title: 'Voegen', description: 'Breng voegmortel aan met rubberen spatel. Verwijder kruisjes eerst.', safety: null },
      { order: 9, title: 'Kitten', description: 'Kit alle hoeken en aansluitingen met sanitairkit. Gebruik kitstrip voor een strak resultaat.', safety: 'Zorg voor goede ventilatie bij het kitten.' },
    ],
  },
  kitchen: {
    title: 'Keuken achterwand',
    difficulty: 'Gemiddeld',
    estimatedHours: '4-6 uur',
    totalCost: 280,
    tools: ['Tegelsnijder', 'Tandspaanspatel', 'Rubberen spatel', 'Waterpas', 'Kruisjes', 'Potlood'],
    materials: [
      { name: 'Spatwandtegels (3m\u00B2)', brand: 'Praxis', price: 89.00 },
      { name: 'Tegellijm (10kg)', brand: 'Weber', price: 16.99 },
      { name: 'Voegmortel (2kg)', brand: 'Weber', price: 9.99 },
      { name: 'Kitkoker keuken', brand: 'Bison', price: 7.99 },
    ],
    steps: [
      { order: 1, title: 'Muur voorbereiden', description: 'Muur ontvetten en stofvrij maken. Markeer de hoogte tussen aanrecht en bovenkastjes.', safety: null },
      { order: 2, title: 'Tegelindeling plannen', description: 'Plan de indeling zodat je zo min mogelijk hoeft te snijden. Begin vanuit het midden.', safety: null },
      { order: 3, title: 'Lijm aanbrengen', description: 'Breng tegellijm aan op de muur met een tandspaanspatel.', safety: null },
      { order: 4, title: 'Tegels plaatsen', description: 'Plaats tegels vanaf de onderkant. Gebruik kruisjes voor gelijkmatige voegen.', safety: null },
      { order: 5, title: 'Randtegels snijden', description: 'Snijd rand- en hoektegels op maat. Let op stopcontacten!', safety: 'Schakel de stroom uit voordat je rondom stopcontacten werkt.' },
      { order: 6, title: 'Voegen en kitten', description: 'Na 24 uur drogen: voeg aan en kit de randen af met keukenkit.', safety: null },
    ],
  },
  garden: {
    title: 'Schutting plaatsen',
    difficulty: 'Gemiddeld',
    estimatedHours: '8-12 uur',
    totalCost: 550,
    tools: ['Schop', 'Waterpas', 'Rolmaat', 'Accuboormachine', 'Hamer', 'Schroeven'],
    materials: [
      { name: 'Betonpalen 10x10 (6 stuks)', brand: 'Gamma', price: 179.40 },
      { name: 'Tuinschermen 180x180 (5 stuks)', brand: 'Gamma', price: 249.95 },
      { name: 'Beton (8 zakken)', brand: 'Gamma', price: 55.92 },
      { name: 'U-beugels (6 stuks)', brand: 'Praxis', price: 23.94 },
    ],
    steps: [
      { order: 1, title: 'Erfgrens bepalen', description: 'Controleer de erfgrens met je buren. Markeer de lijn met een touw.', safety: null },
      { order: 2, title: 'Gaten graven', description: 'Graaf gaten van 60cm diep op gelijke afstand (ca. 180cm). Controleer op kabels/leidingen!', safety: 'Bel voor je graaft altijd het Kadaster (0800-0080) voor een KLIC-melding.' },
      { order: 3, title: 'Palen plaatsen', description: 'Plaats de betonpalen in de gaten. Controleer met waterpas of ze recht staan.', safety: null },
      { order: 4, title: 'Beton storten', description: 'Giet beton rondom de palen en laat minimaal 24 uur uitharden.', safety: 'Draag werkhandschoenen bij het werken met beton (etsend).' },
      { order: 5, title: 'Schermen plaatsen', description: 'Schuif de tuinschermen tussen de betonpalen of bevestig met U-beugels.', safety: 'Til schermen met twee personen — ze zijn zwaar!' },
      { order: 6, title: 'Afwerking', description: 'Controleer stabiliteit en eventueel nog extra bevestigen. Eventueel behandelen met houtbeschermer.', safety: null },
    ],
  },
};

function PlanContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'wall';
  const customDesc = searchParams.get('desc') || '';

  const isCustom = type === 'custom';
  const templatePlan = PLANS[type] || PLANS.wall;

  const [plan, setPlan] = useState<PlanData>(isCustom ? templatePlan : templatePlan);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // For custom plans, try to generate via AI
  useEffect(() => {
    if (!isCustom || !customDesc) return;
    let cancelled = false;

    async function generate() {
      setAiLoading(true);
      setAiError(null);
      try {
        const result = await createBuildPlan({
          description: customDesc,
          skill_level: 'beginner',
        });
        if (!cancelled) {
          setPlan({
            title: result.title || customDesc,
            difficulty: result.difficulty === 'makkelijk' ? 'Beginner' : result.difficulty === 'gemiddeld' ? 'Gemiddeld' : 'Gevorderd',
            estimatedHours: result.estimated_hours ? `${result.estimated_hours} uur` : 'Onbekend',
            totalCost: result.total_cost_est || 0,
            tools: result.steps.flatMap((s) => s.tools).filter((v, i, a) => a.indexOf(v) === i),
            materials: result.steps.flatMap((s) =>
              s.materials.map((m) => ({ name: m.name, brand: m.unit || '', price: m.estimated_price })),
            ).filter((v, i, a) => a.findIndex((x) => x.name === v.name) === i),
            steps: result.steps.map((s) => ({
              order: s.order,
              title: s.title,
              description: s.description,
              safety: s.safety_warnings.length > 0 ? s.safety_warnings.join(' ') : null,
            })),
          });
        }
      } catch {
        if (!cancelled) {
          setAiError('AI-generatie is momenteel niet beschikbaar. Hieronder zie je een standaard bouwplan als voorbeeld.');
        }
      } finally {
        if (!cancelled) setAiLoading(false);
      }
    }

    generate();
    return () => { cancelled = true; };
  }, [isCustom, customDesc]);

  const toggleStep = (order: number) => {
    setCompletedSteps((prev) =>
      prev.includes(order) ? prev.filter((s) => s !== order) : [...prev, order],
    );
  };

  const progress = plan.steps.length > 0 ? completedSteps.length / plan.steps.length : 0;

  const difficultyColors: Record<string, { bg: string; text: string }> = {
    Beginner: { bg: '#D5F5E3', text: '#27AE60' },
    Gemiddeld: { bg: '#FEF3C7', text: '#F59E0B' },
    Gevorderd: { bg: '#FEE2E2', text: '#EF4444' },
  };
  const dc = difficultyColors[plan.difficulty] || difficultyColors.Gemiddeld;

  return (
    <div>
      <PageHeader
        title={aiLoading ? 'Plan genereren...' : plan.title}
        subtitle="Stap-voor-stap instructies"
        icon={Hammer}
        gradient={['#E17055', '#D63031']}
      />

      <div className="px-4 md:px-8 space-y-4 pb-8">
        <Link
          href="/bouw"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1A1A2E] transition-colors"
        >
          <ArrowLeft size={16} />
          Terug naar projecten
        </Link>

        {/* AI loading state */}
        {aiLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-2 border-[#E17055] p-6 flex flex-col items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-[#E17055]/10 flex items-center justify-center">
              <Loader2 size={24} className="text-[#E17055] animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[#1A1A2E]">AI genereert je bouwplan...</p>
              <p className="text-xs text-[#6B7280] mt-1">&ldquo;{customDesc}&rdquo;</p>
            </div>
          </motion.div>
        )}

        {/* AI error */}
        {aiError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-[#FEF3C7] rounded-xl p-3"
          >
            <Bot size={18} className="text-[#92400E] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[#92400E]">{aiError}</p>
          </motion.div>
        )}

        {/* Custom plan context */}
        {isCustom && customDesc && !aiLoading && (
          <div className="flex items-start gap-3 bg-[#E17055]/5 rounded-xl p-3 border border-[#E17055]/20">
            <Bot size={18} className="text-[#E17055] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-[#E17055]">Jouw beschrijving</p>
              <p className="text-sm text-[#1A1A2E] mt-0.5">{customDesc}</p>
            </div>
          </div>
        )}

        {!aiLoading && (
          <>
            {/* Meta badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: dc.bg, color: dc.text }}
              >
                {plan.difficulty}
              </span>
              <span className="text-xs text-[#6B7280]">{'\u23F1'} {plan.estimatedHours}</span>
              {plan.totalCost > 0 && (
                <span className="text-xs text-[#6B7280]">{'\uD83D\uDCB0'} ~{'\u20AC'}{plan.totalCost}</span>
              )}
            </div>

            {/* Progress bar */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#1A1A2E]">Voortgang</span>
                <span className="text-sm font-medium text-[#E17055]">
                  {completedSteps.length}/{plan.steps.length} stappen
                </span>
              </div>
              <div className="h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #E17055, #D63031)' }}
                />
              </div>
            </div>

            {/* Tools */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wrench size={16} className="text-[#E17055]" />
                <h3 className="text-sm font-bold text-[#1A1A2E]">Gereedschap</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {plan.tools.map((tool) => (
                  <span key={tool} className="px-2.5 py-1 rounded-lg bg-[#F3F4F6] text-xs text-[#1A1A2E]">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Package size={16} className="text-[#E17055]" />
                <h3 className="text-sm font-bold text-[#1A1A2E]">Materialen</h3>
              </div>
              <div className="space-y-2">
                {plan.materials.map((mat, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#F3F4F6] last:border-0">
                    <div>
                      <span className="text-sm font-medium text-[#1A1A2E]">{mat.name}</span>
                      {mat.brand && <span className="text-xs text-[#9CA3AF] ml-2">{mat.brand}</span>}
                    </div>
                    {mat.price > 0 && (
                      <span className="text-sm font-bold text-[#E17055]">{'\u20AC'}{mat.price.toFixed(2)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
              <div className="flex items-center gap-2 mb-4">
                <ListChecks size={16} className="text-[#E17055]" />
                <h3 className="text-sm font-bold text-[#1A1A2E]">Stappenplan</h3>
              </div>
              <div className="space-y-2">
                {plan.steps.map((step) => {
                  const isCompleted = completedSteps.includes(step.order);
                  const isExpanded = expandedStep === step.order;
                  return (
                    <div key={step.order} className="border border-[#F3F4F6] rounded-xl overflow-hidden">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setExpandedStep(isExpanded ? null : step.order)}
                        onKeyDown={(e) => { if (e.key === 'Enter') setExpandedStep(isExpanded ? null : step.order); }}
                        className="w-full flex items-center gap-3 p-3 text-left cursor-pointer"
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleStep(step.order); }}
                          className={clsx(
                            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                            isCompleted
                              ? 'bg-[#27AE60] text-white'
                              : 'bg-[#E17055] text-white',
                          )}
                        >
                          {isCompleted ? <Check size={14} /> : <span className="text-xs font-bold">{step.order}</span>}
                        </button>
                        <div className="flex-1 min-w-0">
                          <span className={clsx(
                            'text-sm font-medium block',
                            isCompleted ? 'text-[#9CA3AF] line-through' : 'text-[#1A1A2E]',
                          )}>
                            {step.title}
                          </span>
                          <span className="text-xs text-[#6B7280] block truncate">{step.description}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp size={14} className="text-[#9CA3AF]" />
                        ) : (
                          <ChevronDown size={14} className="text-[#9CA3AF]" />
                        )}
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 pt-0 space-y-2">
                              <p className="text-sm text-[#6B7280] pl-11">{step.description}</p>
                              {step.safety && (
                                <div className="flex items-start gap-2 bg-[#FEF3C7] rounded-lg p-2.5 ml-11">
                                  <AlertTriangle size={14} className="text-[#92400E] mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-[#92400E]">{step.safety}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
