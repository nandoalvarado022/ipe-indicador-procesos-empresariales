/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType } from './types';
import { initialRoadmapItems, initialApiContracts, initialExpectationTests } from './data';
import Sidebar from './components/Sidebar';
import PlanTab from './components/PlanTab';
import ContractTab from './components/ContractTab';
import SuiteTab from './components/SuiteTab';
import FailureTab from './components/FailureTab';
import AiTab from './components/AiTab';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('plan');
  
  // App-wide state
  const [roadmapItems, setRoadmapItems] = useState(initialRoadmapItems);
  const [apiContracts, setApiContracts] = useState(initialApiContracts);
  const [expectationTests, setExpectationTests] = useState(initialExpectationTests);

  const completedCount = roadmapItems.filter(i => i.completed).length;
  const roadmapCompleteness = roadmapItems.length > 0 
    ? (completedCount / roadmapItems.length) * 100 
    : 0;

  return (
    <div id="app-root" className="h-screen w-screen flex bg-neutral-100 overflow-hidden text-neutral-900 font-sans select-none antialiased">
      
      {/* 1. Sidebar Container */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        roadmapCompleteness={roadmapCompleteness} 
      />

      {/* 2. Main Work Content Pane */}
      <main id="app-main" className="flex-1 overflow-y-auto flex flex-col min-w-0">
        
        {/* Top Header Region */}
        <header className="px-10 pt-10 pb-6 border-b border-neutral-200 bg-white/40 backdrop-blur-md shrink-0 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest leading-none mb-1.5">
              ESTRATEGIA ENTERPRISE
            </div>
            <h1 className="text-3xl font-black text-neutral-900 leading-tight tracking-tighter">
              Expected Driven Development
            </h1>
            <p className="text-xs text-neutral-400 font-medium mt-0.5">
              Administración de contratos de datos, aserciones asíncronas y simulaciones.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-neutral-400 font-semibold block">Proyecto Conectado</span>
            <span className="text-sm font-extrabold text-neutral-900 font-mono tracking-tight flex items-center justify-end gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Enterprise-Next-App
            </span>
          </div>
        </header>

        {/* Dynamic Tab Workspace Inner Shell */}
        <div className="flex-1 p-10 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          
          {activeTab === 'plan' && (
            <PlanTab 
              roadmapItems={roadmapItems} 
              setRoadmapItems={setRoadmapItems} 
              roadmapCompleteness={roadmapCompleteness} 
            />
          )}

          {activeTab === 'contract' && (
            <ContractTab 
              apiContracts={apiContracts} 
              setApiContracts={setApiContracts} 
            />
          )}

          {activeTab === 'suite' && (
            <SuiteTab 
              expectationTests={expectationTests} 
              setExpectationTests={setExpectationTests} 
            />
          )}

          {activeTab === 'failure' && (
            <FailureTab />
          )}

          {activeTab === 'ai' && (
            <AiTab />
          )}

        </div>

        {/* Universal Footer Credit Bar */}
        <footer className="h-14 bg-white/70 border-t border-neutral-200 px-10 flex items-center justify-between shrink-0 text-[10px] font-bold text-neutral-400 font-mono tracking-wider uppercase">
          <span>SISTEMA DE ASISTENCIA EDD © 2026</span>
          <div className="flex items-center gap-1">
            <span>MODO DE DISEÑO ACTIVO:</span>
            <span className="text-blue-500">CLEAN MINIMALISM</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
