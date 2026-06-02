import { TabType } from '../types';
import { 
  BookOpen, 
  FileCode, 
  Play, 
  AlertTriangle, 
  MessageSquare,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  roadmapCompleteness: number;
}

export default function Sidebar({ activeTab, setActiveTab, roadmapCompleteness }: SidebarProps) {
  const menuItems = [
    {
      id: 'plan' as TabType,
      label: 'Información Básica',
      subtitle: 'Roadmap & Next.js Steps',
      icon: BookOpen,
      color: 'bg-blue-500',
      textActive: 'text-blue-500'
    },
    {
      id: 'contract' as TabType,
      label: 'Diseño de Contratos',
      subtitle: 'Zod & API Expectation',
      icon: FileCode,
      color: 'bg-emerald-500',
      textActive: 'text-emerald-500'
    },
    {
      id: 'suite' as TabType,
      label: 'Pruebas Playwright',
      subtitle: 'E2E Visual Expectations',
      icon: Play,
      color: 'bg-indigo-500',
      textActive: 'text-indigo-500'
    },
    {
      id: 'failure' as TabType,
      label: 'Failure Sandbox',
      subtitle: 'Error Boundary Simulation',
      icon: AlertTriangle,
      color: 'bg-rose-500',
      textActive: 'text-rose-500'
    },
    {
      id: 'ai' as TabType,
      label: 'Consultoría IA Copilot',
      subtitle: 'Gemini Expert Chat',
      icon: MessageSquare,
      color: 'bg-amber-500',
      textActive: 'text-amber-500'
    }
  ];

  return (
    <aside id="app-sidebar" className="w-80 bg-white border-r border-neutral-200 flex flex-col h-full shrink-0">
      {/* Branding Header */}
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 bg-blue-50 text-blue-500 rounded-md">
            <Layers className="h-5 w-auto" />
          </span>
          <span className="font-mono text-xs font-semibold tracking-wider text-neutral-400 uppercase">
            EDD Suite
          </span>
        </div>
        <div className="font-extrabold text-2xl tracking-tighter text-neutral-900 flex items-center">
          EDD.SYSTEM <span className="text-blue-500 font-light mx-2">/</span>
        </div>
        <p className="text-xs text-neutral-500 mt-1 font-medium">
          Expectation-Driven Development
        </p>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        <p className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase px-3 mb-2">
          Módulos del Sistema
        </p>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 relative overflow-hidden group ${
                isActive 
                  ? 'bg-neutral-50 border-neutral-200 border shadow-xs' 
                  : 'hover:bg-neutral-50 border border-transparent'
              }`}
            >
              {isActive && (
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.color}`} />
              )}
              
              <div className={`p-2 rounded-lg transition-colors duration-200 ${
                isActive ? `${item.color} text-white` : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200'
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold truncate ${isActive ? 'text-neutral-900' : 'text-neutral-700'}`}>
                    {item.label}
                  </span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />}
                </div>
                <span className="text-xs text-neutral-400 truncate block mt-0.5 font-medium">
                  {item.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Progress & Next.js Release Card */}
      <div className="p-4 border-t border-neutral-100 bg-neutral-50 space-y-3">
        <div className="bg-white p-3.5 border border-neutral-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-neutral-600">Progreso EDD</span>
            <span className="text-xs font-bold text-blue-600">{Math.round(roadmapCompleteness)}%</span>
          </div>
          <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${roadmapCompleteness}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 bg-neutral-900 rounded-xl text-white flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">PLATAFORMA</div>
            <div className="text-xs font-semibold mt-0.5">Next.js v14.2 & v15</div>
          </div>
          <span className="px-2 py-0.5 text-[9px] font-bold tracking-wide bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/30">
            APP ROUTER
          </span>
        </div>
      </div>
    </aside>
  );
}
