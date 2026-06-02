import React, { useState, useEffect } from 'react';
import { ExpectationTest } from '../types';
import { 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Chrome, 
  ShieldAlert, 
  Plus, 
  Trash2,
  ListFilter
} from 'lucide-react';

interface SuiteTabProps {
  expectationTests: ExpectationTest[];
  setExpectationTests: React.Dispatch<React.SetStateAction<ExpectationTest[]>>;
}

export default function SuiteTab({ expectationTests, setExpectationTests }: SuiteTabProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState<number | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(['[System] Playwright orquestrator inicializado.']);
  const [forceFailIndex, setForceFailIndex] = useState<number | null>(null);
  
  // Custom test creator inputs
  const [newDesc, setNewDesc] = useState('');
  const [newSelector, setNewSelector] = useState('button[type="submit"]');
  const [newType, setNewType] = useState<'visible' | 'textEquals' | 'countEquals' | 'statusOk'>('visible');
  const [newValue, setNewValue] = useState('true');

  const addLog = (text: string) => {
    setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  const handleRunSuite = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setCurrentTestIndex(0);
    setTerminalLogs(['[System] Arrancando batería de expectativas visuales (Playwright E2E)...']);
    
    // Reset test statuses
    setExpectationTests(prev => prev.map(t => ({ ...t, status: 'idle', log: [] })));
  };

  useEffect(() => {
    if (!isRunning || currentTestIndex === null) return;

    if (currentTestIndex >= expectationTests.length) {
      setIsRunning(false);
      setCurrentTestIndex(null);
      addLog('===================================================');
      const passedCount = expectationTests.filter(t => t.status === 'passed').length;
      addLog(`[System] Suite completada. Conclusión: ${passedCount}/${expectationTests.length} expectativas visuales cumplidas.`);
      return;
    }

    const test = expectationTests[currentTestIndex];
    
    // Set status to running
    setExpectationTests(prev => prev.map((t, idx) => {
      if (idx === currentTestIndex) {
        return { ...t, status: 'running' };
      }
      return t;
    }));

    addLog(`[Run] Iniciando expectativa #${currentTestIndex + 1}: ${test.description}`);
    addLog(`      -> Verificando selector: "${test.selector}"`);

    const timer = setTimeout(() => {
      const isFailed = currentTestIndex === forceFailIndex;
      
      setExpectationTests(prev => prev.map((t, idx) => {
        if (idx === currentTestIndex) {
          return { 
            ...t, 
            status: isFailed ? 'failed' : 'passed',
            log: [
              `[Playwright] Encontrada nodo '${test.selector}'`,
              `[Playwright] Tipo expectativa: ${test.expectationType}`,
              `[Playwright] Valor esperado: '${test.expectedValue}'`,
              `[Playwright] Resultado: ${isFailed ? 'FALLIDO' : 'SATISFECHO'}`
            ]
          };
        }
        return t;
      }));

      if (isFailed) {
        addLog(`[ERROR] Expectativa fallida: se esperaba '${test.expectedValue}' pero el nodo '${test.selector}' no lo satisface.`);
      } else {
        addLog(`[OK] Satisfecha expectativa visual: "${test.description}"`);
      }

      setCurrentTestIndex(prev => (prev !== null ? prev + 1 : null));
    }, 1200);

    return () => clearTimeout(timer);
  }, [isRunning, currentTestIndex]);

  const handleAddCustomTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || !newSelector.trim()) return;

    const newTest: ExpectationTest = {
      id: `custom-test-${Date.now()}`,
      description: newDesc.trim(),
      selector: newSelector.trim(),
      expectationType: newType,
      expectedValue: newValue.trim() || 'true',
      status: 'idle',
      log: []
    };

    setExpectationTests(prev => [...prev, newTest]);
    setNewDesc('');
    setNewSelector('');
    setNewValue('');
  };

  const handleDeleteTest = (id: string) => {
    setExpectationTests(prev => prev.filter(t => t.id !== id));
  };

  const totalPassed = expectationTests.filter(t => t.status === 'passed').length;
  const totalFailed = expectationTests.filter(t => t.status === 'failed').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Visual testing summary info card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-indigo-500" /> Web Expectation Suite
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed">
            EDD se diferencia de las metodologías tradicionales en que las pruebas visuales son 
            <strong> aserciones directas de comportamiento</strong> sobre la vista final del usuario, no sobre pruebas unitarias internas. Aquí puedes construir tu batería de pruebas para Playwright, simular ejecuciones estables e incluso forzar fallos para auditar la resiliencia.
          </p>
        </div>
        <button
          onClick={handleRunSuite}
          disabled={isRunning || expectationTests.length === 0}
          className="bg-indigo-650 hover:bg-indigo-700 font-extrabold text-sm text-yellow px-5 py-3 rounded-xl shadow-xs transition duration-150 disabled:opacity-50 flex items-center gap-2"
        >
          {isRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Orquestar Pruebas
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Playwright Tests Configuration Area */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-5 border border-neutral-200 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400">Esquema de Pruebas Playwright (E2E)</h4>
              <span className="text-xs font-mono font-medium text-neutral-500">
                {expectationTests.length} expectativas asignadas
              </span>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {expectationTests.map((test, index) => {
                const isCurrent = index === currentTestIndex;
                return (
                  <div 
                    key={test.id}
                    className={`p-3.5 border rounded-xl transition duration-150 relative ${
                      isCurrent ? 'ring-2 ring-indigo-500 bg-indigo-50/20' :
                      test.status === 'passed' ? 'border-emerald-200 bg-emerald-50/10' :
                      test.status === 'failed' ? 'border-rose-200 bg-rose-50/10' :
                      'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${
                            test.status === 'passed' ? 'bg-emerald-500' :
                            test.status === 'failed' ? 'bg-rose-500' :
                            test.status === 'running' ? 'bg-indigo-500 animate-ping' : 'bg-neutral-400'
                          }`} />
                          <span className="text-xs font-bold text-neutral-850 truncate">{test.description}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[10px] text-neutral-500 font-semibold font-mono">
                          <span>Selector: <span className="text-neutral-700 bg-neutral-100 px-1 py-0.5 rounded">{test.selector}</span></span>
                          <span>Regla: <span className="text-neutral-700 bg-neutral-100 px-1 py-0.5 rounded uppercase">{test.expectationType}</span></span>
                          <span className="text-purple-600 font-bold">Valor: {test.expectedValue}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setForceFailIndex(forceFailIndex === index ? null : index)}
                          className={`text-[9px] font-bold px-2 py-0.8 rounded-md border ${
                            forceFailIndex === index 
                              ? 'bg-rose-50 text-rose-600 border-rose-300' 
                              : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100'
                          }`}
                          title="Fuerza un fallo simulado en este paso E2E"
                        >
                          {forceFailIndex === index ? 'Provocará Fallo ✔' : 'Forzar Fallo'}
                        </button>
                        <button 
                          onClick={() => handleDeleteTest(test.id)}
                          className="text-neutral-300 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {test.log.length > 0 && (
                      <div className="mt-3 p-2 bg-neutral-900 rounded-lg text-[10px] font-mono text-cyan-400 space-y-0.5">
                        {test.log.map((logLine, lIdx) => (
                          <div key={lIdx}>{logLine}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Addition suite */}
          <div className="bg-white p-5 border border-neutral-200 rounded-2xl shadow-xs space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-800 flex items-center gap-1.5 font-sans">
              <Plus className="h-4 w-4" /> Agregar Expectativa de Flujo Visual
            </h4>

            <form onSubmit={handleAddCustomTest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-extrabold text-neutral-500 block mb-1">Descripción del Comportamiento Visual</label>
                <input 
                  type="text" 
                  placeholder="e.g. Al dar click en Guardar, debe renderizar la credencial de éxito" 
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-extrabold text-neutral-500 block mb-1">Selector CSS del Nodo</label>
                <input 
                  type="text" 
                  placeholder="e.g. form[data-testid='success-check']" 
                  value={newSelector}
                  onChange={e => setNewSelector(e.target.value)}
                  className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-extrabold text-neutral-500 block mb-1">Tipo de Expectativa</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg cursor-pointer outline-none"
                >
                  <option value="visible">Visible en Pantalla (toBeVisible)</option>
                  <option value="textEquals">Texto Equitativo (toHaveText)</option>
                  <option value="countEquals">Cuenta de Elementos (toHaveCount)</option>
                  <option value="statusOk">Status Interactivo (toBeEnabled)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] uppercase font-extrabold text-neutral-500 block mb-1">Valor Esperado</label>
                <input 
                  type="text" 
                  placeholder="e.g. true o 'Guardado'" 
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="col-span-2 bg-indigo-500 text-white font-bold text-xs p-2.5 rounded-lg hover:bg-indigo-650 shadow-xs transition"
              >
                Insertar Nueva Prueba en Suite
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Simulator Terminal & Mock Interactive Browser */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mock Browser Container */}
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-neutral-100 px-4 py-2 flex items-center gap-2 border-b border-neutral-200">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block" />
              </div>
              <div className="bg-white border rounded px-3 py-0.5 text-[9px] text-neutral-400 flex items-center gap-1.5 w-full max-w-md mx-auto truncate font-mono">
                <Chrome className="h-3 w-3 inline text-neutral-400 shrink-0" />
                <span>localhost:3000/orders?edd_simulation=true</span>
              </div>
            </div>

            <div className="p-5 h-56 bg-neutral-550 flex flex-col items-center justify-center text-center relative bg-gradient-to-br from-neutral-50 to-neutral-100">
              {isRunning ? (
                <div className="space-y-4 w-full px-4 animate-pulse">
                  <div className="flex items-center justify-center gap-3">
                    <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
                    <span className="font-extrabold text-[13px] text-neutral-800 uppercase tracking-widest font-mono">Playwright Testing Arena</span>
                  </div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-xl max-w-xs mx-auto shadow-sm">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold">NÚMERO BAJO EVALUACIÓN</span>
                    <div className="text-sm font-bold text-neutral-700 mt-1 truncate">
                      {expectationTests[currentTestIndex || 0]?.description}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {totalFailed > 0 ? (
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-xl max-w-sm flex items-center gap-3 border border-rose-200 text-left">
                      <ShieldAlert className="h-7 w-7 text-rose-600 shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs">Excepción de Expectativa Encontrada</h4>
                        <p className="text-[10.5px] mt-0.5 text-rose-500 leading-normal">Se detectó una discrepancia entre el estado visual esperado y el DOM.</p>
                      </div>
                    </div>
                  ) : totalPassed > 0 ? (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl max-w-sm flex items-center gap-3 border border-emerald-250 text-left">
                      <CheckCircle2 className="h-7 w-7 text-emerald-600 shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs">Todas las Expectativas Satisfechas</h4>
                        <p className="text-[10.5px] mt-0.5 text-emerald-600 leading-normal">Felicidades. Tu arquitectura Next.js cumple perfectamente con los contratos visuales definidos.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 max-w-xs">
                      <h4 className="font-bold text-xs text-neutral-800 uppercase tracking-wider">Simulador de Browser Playwright</h4>
                      <p className="text-xs text-neutral-500 leading-normal">Kicka el botón &quot;Orquestar Pruebas&quot; arriba para orquestar la simulación de carga.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Shell / Terminal Console */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden shadow-xs flex flex-col h-72">
            <div className="bg-neutral-900 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-neutral-400" />
                <span className="text-xs font-bold text-neutral-300 font-mono">Consola de Control Playwright</span>
              </div>
              <button 
                onClick={() => setTerminalLogs(['[System] Consola reiniciada.'])}
                className="text-[10px] hover:text-white text-neutral-500 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded font-mono"
              >
                Limpiar
              </button>
            </div>
            
            <div className="p-4 font-mono text-[11px] text-neutral-300 space-y-1.5 overflow-y-auto flex-1 bg-neutral-950">
              {terminalLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={
                    log.includes('[ERROR]') ? 'text-rose-400 font-semibold' :
                    log.includes('[OK]') ? 'text-emerald-400 font-medium' :
                    log.includes('[System]') ? 'text-blue-400 font-semibold' :
                    log.includes('[Run]') ? 'text-amber-300' : 'text-neutral-400'
                  }
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
