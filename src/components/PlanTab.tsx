import React, { useState } from 'react';
import { RoadmapItem } from '../types';
import { 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Info, 
  Terminal, 
  Compass, 
  TrendingUp, 
  Workflow,
  ClipboardCheck,
  Check,
  Building2,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';

interface PlanTabProps {
  roadmapItems: RoadmapItem[];
  setRoadmapItems: React.Dispatch<React.SetStateAction<RoadmapItem[]>>;
  roadmapCompleteness: number;
}

export default function PlanTab({ roadmapItems, setRoadmapItems, roadmapCompleteness }: PlanTabProps) {
  const [newItemText, setNewItemText] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [itemSection, setItemSection] = useState<'foundations' | 'testing' | 'contracts' | 'failures'>('foundations');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Enterprise Onboarding Base States
  const [empresaNombre, setEmpresaNombre] = useState('Acme Corp');
  const [empresaTelefono, setEmpresaTelefono] = useState('+34 600 000 000');
  const [empresaCorreo, setEmpresaCorreo] = useState('contacto@acme.com');
  const [onboardingCompletado, setOnboardingCompletado] = useState(false);
  const [onboardingErrors, setOnboardingErrors] = useState<Record<string, string>>({});

  const handleToggle = (id: string) => {
    setRoadmapItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: RoadmapItem = {
      id: `custom-${Date.now()}`,
      text: newItemText.trim(),
      section: itemSection,
      description: newItemDesc.trim() || 'Tarea agregada por el usuario.',
      completed: false
    };

    setRoadmapItems(prev => [...prev, newItem]);
    setNewItemText('');
    setNewItemDesc('');
  };

  const handleDeleteItem = (id: string) => {
    setRoadmapItems(prev => prev.filter(item => item.id !== id));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 3000);
  };

  // Onboarding Submit and EDD Validation Simulation
  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (empresaNombre.trim().length < 3) {
      errors.nombre = 'El nombre de la empresa debe tener al menos 3 caracteres (Expectativa Zod mínima).';
    }
    if (!/^\+?[0-9\s-]{8,20}$/.test(empresaTelefono.trim())) {
      errors.telefono = 'Teléfono inválido. Debe contener entre 8 y 20 caracteres numéricos (e.g., +34 600 000 000).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresaCorreo.trim())) {
      errors.correo = 'El correo electrónico provisto debe cumplir con un formato RFC válido.';
    }

    if (Object.keys(errors).length > 0) {
      setOnboardingErrors(errors);
      return;
    }

    setOnboardingErrors({});
    setOnboardingCompletado(true);
  };

  const envBoilerplate = `# .env.local\nNEXT_PUBLIC_API_URL="http://localhost:3000"\nGEMINI_API_KEY="AI_STUDIO_KEY"\nPLAYWRIGHT_TEST_PORT=3000`;
  const nextConfigBoilerplate = `// next.config.mjs\n/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  reactStrictMode: true,\n  // Estricto control de headers esperados\n  async headers() {\n    return [\n      {\n        source: '/api/:path*',\n        headers: [\n          { key: 'Strict-Transport-Security', value: 'max-age=31536000' }\n        ]\n      }\n    ];\n  }\n};\nexport default nextConfig;`;

  // Filter items into sections
  const foundations = roadmapItems.filter(i => i.section === 'foundations');
  const contracts = roadmapItems.filter(i => i.section === 'contracts');
  const testing = roadmapItems.filter(i => i.section === 'testing');
  const failures = roadmapItems.filter(i => i.section === 'failures');

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Onboarding Empresarial Widget Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md font-bold">
              Primera Definición - Paso 1
            </span>
            <h3 className="text-lg font-black text-neutral-900 mt-1.5 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-500" /> Onboarding Empresarial de Datos Base
            </h3>
            <p className="text-xs text-neutral-500">
              Captura las propiedades clave de tu organización para estructurar tus contratos de onboarding asíncronos.
            </p>
          </div>
          
          <div className="shrink-0">
            {onboardingCompletado ? (
              <span className="px-3 py-1 bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 className="h-4 w-4" /> ONBOARDING COMPLETADO
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold rounded-lg flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> CONFIGURACIÓN PENDIENTE
              </span>
            )}
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Form to capture values */}
          <div className="lg:col-span-7 space-y-4">
            {!onboardingCompletado ? (
              <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-neutral-400 block">Nombre de Empresa</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                        <Building2 className="h-3.5 w-3.5" />
                      </div>
                      <input 
                        type="text" 
                        value={empresaNombre}
                        onChange={e => setEmpresaNombre(e.target.value)}
                        placeholder="e.g. Acme S.A."
                        className="pl-9 w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-blue-500 font-semibold"
                        required
                      />
                    </div>
                    {onboardingErrors.nombre && (
                      <p className="text-[10px] text-rose-500 font-medium">{onboardingErrors.nombre}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-neutral-400 block">Teléfono Corporativo</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                        <Phone className="h-3.5 w-3.5" />
                      </div>
                      <input 
                        type="text" 
                        value={empresaTelefono}
                        onChange={e => setEmpresaTelefono(e.target.value)}
                        placeholder="e.g. +34 600000000"
                        className="pl-9 w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-blue-500 font-mono"
                        required
                      />
                    </div>
                    {onboardingErrors.telefono && (
                      <p className="text-[10px] text-rose-500 font-medium">{onboardingErrors.telefono}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-neutral-400 block">Correo de Contacto</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                        <Mail className="h-3.5 w-3.5" />
                      </div>
                      <input 
                        type="email" 
                        value={empresaCorreo}
                        onChange={e => setEmpresaCorreo(e.target.value)}
                        placeholder="e.g. admin@empresa.com"
                        className="pl-9 w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    {onboardingErrors.correo && (
                      <p className="text-[10px] text-rose-500 font-medium">{onboardingErrors.correo}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-lg shadow-xs transition duration-155 flex items-center gap-1.5"
                  >
                    Guardar Onboarding Base <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3.5">
                <div className="flex items-center gap-2">
                  <div className="p-1 px-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-xs text-neutral-800 uppercase tracking-wider">Información Básica Guardada con Éxito</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-neutral-700">
                  <div className="bg-white p-3 border border-neutral-100 rounded-lg space-y-1">
                    <span className="text-[9px] uppercase font-extrabold text-neutral-400 block">Empresa</span>
                    <span className="text-neutral-900 font-bold block">{empresaNombre}</span>
                  </div>
                  <div className="bg-white p-3 border border-neutral-100 rounded-lg space-y-1">
                    <span className="text-[9px] uppercase font-extrabold text-neutral-400 block">Teléfono</span>
                    <span className="text-neutral-900 font-mono tracking-tight block">{empresaTelefono}</span>
                  </div>
                  <div className="bg-white p-3 border border-neutral-100 rounded-lg space-y-1">
                    <span className="text-[9px] uppercase font-extrabold text-neutral-400 block">Email Corporativo</span>
                    <span className="text-neutral-900 block">{empresaCorreo}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-[10.5px] text-neutral-500 font-medium leading-relaxed">
                    Las propiedades han sido enlazadas al planificador.
                  </span>
                  <button 
                    onClick={() => setOnboardingCompletado(false)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-neutral-200 px-3 py-1 rounded-md transition"
                  >
                    Modificar Datos
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: EDD Contract Schema Preview */}
          <div className="lg:col-span-5 bg-neutral-950 rounded-2xl p-4 border border-neutral-800 text-left h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2 shrink-0">
                <span className="text-[10px] font-bold text-blue-400 tracking-widest font-mono">ONBOARDING_CONTRACT.TS</span>
                <span className="text-[9px] font-bold font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded border border-blue-500/10">ZOD VALIDATION</span>
              </div>
              <pre className="text-[10.5px] font-mono text-cyan-400 leading-normal overflow-x-auto select-all max-h-[140px]">
                <code>{`import { z } from 'zod';

export const OnboardingSchema = z.object({
  nombre: z.string().min(3, { message: "Min 3 char" }),
  telefono: z.string().regex(/^[0-9\\s-+]+$/),
  correo: z.string().email(),
});`}</code>
              </pre>
            </div>

            <div className="border-t border-neutral-850 pt-3.5 mt-3 text-[10px] text-neutral-400 font-medium">
              <p>Esperado estado del frontend:</p>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1">
                  <span className={`h-2.5 w-2.5 rounded-full ${empresaNombre.trim().length >= 3 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="font-mono text-neutral-300">NameOk</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`h-2.5 w-2.5 rounded-full ${/^\+?[0-9\s-]{8,20}$/.test(empresaTelefono.trim()) ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="font-mono text-neutral-300">PhoneOk</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`h-2.5 w-2.5 rounded-full ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresaCorreo.trim()) ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="font-mono text-neutral-300">MailOk</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Introduction Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
            <Compass className="h-4 w-4" />
            ¿Qué es Expected-Driven Development?
          </div>
          <p className="text-neutral-600 text-sm leading-relaxed">
            <strong>Expected-Driven Development (EDD)</strong> es un patrón de diseño centrado en contratos y expectativas. En lugar de codificar la interfaz directamente, se definen los <strong>contratos de datos de entrada/salida (schemas)</strong> y las <strong>experiencias de flujo visual esperadas</strong>. 
          </p>
          <p className="text-neutral-600 text-sm leading-relaxed">
            Al tener contratos con Zod y Playwright listos, el código del cliente y servidor se autocontienen, reduciendo las fallas inesperadas y garantizando resiliencia ante errores.
          </p>
        </div>
        <div className="bg-neutral-50 p-4 border border-neutral-200 rounded-xl max-w-xs w-full">
          <h4 className="font-bold text-xs text-neutral-800 uppercase tracking-wider mb-2">PILARES EDD EN NEXT.JS</h4>
          <ul className="text-xs text-neutral-600 space-y-2 font-medium">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Contract Validation (Zod)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> UI Skeletons & Boundaries
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> E2E Visual Playwright Tests
            </li>
          </ul>
        </div>
      </div>

      {/* Grid of Strategy Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col">
          <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center font-extrabold text-sm mb-4">
            01
          </div>
          <h3 className="font-bold text-base text-neutral-900 mb-2">Definición de Contratos</h3>
          <p className="text-xs text-neutral-500 leading-relaxed mb-4">
            Utiliza esquemas de validación Zod y tipos estáticos compartidos para certificar la entrada/salida de APIs de Next.js antes de prototipar.
          </p>
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mt-auto">Recomendado de inmediato</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col">
          <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center font-extrabold text-sm mb-4">
            02
          </div>
          <h3 className="font-bold text-base text-neutral-900 mb-2">Fallo Esperado Sólido</h3>
          <p className="text-xs text-neutral-500 leading-relaxed mb-4">
            Diseña componentes skeleton e implementa Error Boundaries integrales para cada módulo asíncrono para manejar cuellos de botella de red.
          </p>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-auto">Resiliencia activa</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col">
          <div className="w-8 h-8 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center font-extrabold text-sm mb-4">
            03
          </div>
          <h3 className="font-bold text-base text-neutral-900 mb-2">Visual E2E Suite</h3>
          <p className="text-xs text-neutral-500 leading-relaxed mb-4">
            Configura orquestadores de pruebas que verifiquen estados intermedios y de éxito basándose estrictamente en las expectativas del UI del usuario.
          </p>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mt-auto">Playwright-ready</span>
        </div>
      </div>

      {/* Plan de acción & Metrics Section */}
      <div className="bg-neutral-900 rounded-2xl p-6 text-white grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Action Plan: Roadmap de Prácticas EDD</h2>
            <span className="text-xs font-mono text-neutral-400">Roadmap Personalizado</span>
          </div>

          <div className="space-y-4">
            {/* Foundations Section */}
            <div>
              <h3 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-2">Fase 1: Foundations & Next Setup</h3>
              <div className="space-y-2">
                {foundations.map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition duration-150">
                    <button 
                      onClick={() => handleToggle(item.id)}
                      className={`mt-0.5 shrink-0 h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                        item.completed ? 'bg-blue-500 border-blue-500 text-white' : 'border-neutral-500 hover:border-neutral-300'
                      }`}
                    >
                      {item.completed && <Check className="h-3 w-3 stroke-[3]" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold truncate ${item.completed ? 'line-through text-neutral-400' : 'text-neutral-100'}`}>
                          {item.text}
                        </span>
                        <button onClick={() => handleDeleteItem(item.id)} className="text-neutral-500 hover:text-rose-400 p-0.5">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contracts Section */}
            <div>
              <h3 className="text-xs font-bold text-emerald-400 tracking-wider uppercase mt-4 mb-2">Fase 2: Schema Contracts</h3>
              <div className="space-y-2">
                {contracts.map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition duration-150">
                    <button 
                      onClick={() => handleToggle(item.id)}
                      className={`mt-0.5 shrink-0 h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                        item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-500 hover:border-neutral-300'
                      }`}
                    >
                      {item.completed && <Check className="h-3 w-3 stroke-[3]" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold truncate ${item.completed ? 'line-through text-neutral-400' : 'text-neutral-100'}`}>
                          {item.text}
                        </span>
                        <button onClick={() => handleDeleteItem(item.id)} className="text-neutral-500 hover:text-rose-400 p-0.5">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testing & Failure Section */}
            <div>
              <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase mt-4 mb-2">Fase 3: E2E Visual Suite & Failures</h3>
              <div className="space-y-2">
                {[...testing, ...failures].map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition duration-150">
                    <button 
                      onClick={() => handleToggle(item.id)}
                      className={`mt-0.5 shrink-0 h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                        item.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-neutral-500 hover:border-neutral-300'
                      }`}
                    >
                      {item.completed && <Check className="h-3 w-3 stroke-[3]" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold truncate ${item.completed ? 'line-through text-neutral-400' : 'text-neutral-100'}`}>
                          {item.text}
                        </span>
                        <button onClick={() => handleDeleteItem(item.id)} className="text-neutral-500 hover:text-rose-400 p-0.5">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form to add Custom Action Task */}
          <form onSubmit={handleAddItem} className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-neutral-200">Añadir tu propia directiva de proyecto</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="Título del paso (e.g. Configurar Auth)" 
                value={newItemText}
                onChange={e => setNewItemText(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-blue-500 transition"
              />
              <select
                value={itemSection}
                onChange={e => setItemSection(e.target.value as any)}
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500 transition cursor-pointer"
              >
                <option value="foundations">Foundations (Fase 1)</option>
                <option value="contracts">Contracts (Fase 2)</option>
                <option value="testing">Testing (Fase 3)</option>
                <option value="failures">Failures & Boundaries (Fase 3)</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Breve descripción del paso..." 
                value={newItemDesc}
                onChange={e => setNewItemDesc(e.target.value)}
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-blue-500 transition"
              />
              <button 
                type="submit"
                className="bg-white text-neutral-900 font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-neutral-200 transition shrink-0 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Agregar
              </button>
            </div>
          </form>
        </div>

        {/* Predictability Stat Card & Info Básica */}
        <div className="flex flex-col gap-6 justify-between">
          
          {/* Info Básica Segment */}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
            <h4 className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">INFORMACIÓN BÁSICA</h4>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Next.js Target</span>
                <span className="font-bold text-neutral-100">v14.2 (App Router)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">TypeScript</span>
                <span className="font-bold text-neutral-100 font-mono">v5.8.2 Strict</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Validation Core</span>
                <span className="font-bold text-emerald-400 font-mono">Zod Standard</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">E2E Engine</span>
                <span className="font-bold text-indigo-400 font-mono">Playwright</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-center items-center text-center h-full">
            <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider mb-2">ENTREGA DE PROYECTO</div>
            <div className="text-6xl font-black text-blue-400 tracking-tight my-2">
              {Math.min(100, Math.round(50 + (roadmapCompleteness / 2)))}%
            </div>
            <span className="text-xs font-bold text-neutral-200">Predictibilidad General Esperada</span>
            <p className="text-xs text-neutral-400 max-w-[200px] mt-2 italic leading-relaxed">
              Basada en su cumplimiento de contratos y configuraciones del Action Plan.
            </p>
            <div className="mt-4 p-3 bg-neutral-800/80 rounded-xl flex items-center gap-2 border border-neutral-700 w-full text-left">
              <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" />
              <div className="text-[11px] text-neutral-300 font-semibold leading-normal">
                Completas las validaciones de Zod reducen colisiones de QA en un 60%
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
            <h4 className="text-xs font-bold text-neutral-300">Siguiente Paso:</h4>
            <code className="text-[11px] text-emerald-400 block font-mono bg-black/40 p-2.5 rounded-lg">
              npx create-next-app@latest --ts
            </code>
          </div>
        </div>
      </div>

      {/* Code Boilerplate Reference */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-neutral-500" />
          <h3 className="font-bold text-lg text-neutral-900">Archivos Básicos para configurar Next.js con EDD</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-neutral-900 px-4 py-2 flex items-center justify-between border-b border-neutral-800">
              <span className="text-neutral-300 text-xs font-mono">Variables del Entorno (.env.local)</span>
              <button 
                onClick={() => copyToClipboard(envBoilerplate, 'env')}
                className="text-neutral-400 hover:text-white font-mono text-[11px] bg-neutral-800/50 px-2 py-0.5 rounded border border-neutral-700"
              >
                {copiedText === 'env' ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-normal">
              <code>{envBoilerplate}</code>
            </pre>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-neutral-900 px-4 py-2 flex items-center justify-between border-b border-neutral-800">
              <span className="text-neutral-300 text-xs font-mono">Configuración de Next.js (headers correctos)</span>
              <button 
                onClick={() => copyToClipboard(nextConfigBoilerplate, 'next')}
                className="text-neutral-400 hover:text-white font-mono text-[11px] bg-neutral-800/50 px-2 py-0.5 rounded border border-neutral-700"
              >
                {copiedText === 'next' ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-cyan-400 overflow-x-auto leading-normal">
              <code>{nextConfigBoilerplate}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
