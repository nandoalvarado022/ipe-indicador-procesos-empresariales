import React, { useState, useEffect } from 'react';
import { FailureModesConfig } from '../types';
import { 
  AlertTriangle, 
  RefreshCw, 
  Clock, 
  Info, 
  CheckCircle, 
  XOctagon, 
  CornerDownRight 
} from 'lucide-react';

export default function FailureTab() {
  const [latencyMs, setLatencyMs] = useState<number>(0);
  const [injectError, setInjectError] = useState<boolean>(false);
  const [injectSchemaViolation, setInjectSchemaViolation] = useState<boolean>(false);
  
  // Simulated UI Box States
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{ code: number; msg: string } | null>(null);
  const [successData, setSuccessData] = useState<string | null>(null);

  const fetchSimulatedData = () => {
    setIsLoading(true);
    setIsError(false);
    setSuccessData(null);
    setErrorDetails(null);

    // Simulate Network latency
    setTimeout(() => {
      setIsLoading(false);
      
      if (injectError) {
        setIsError(true);
        setErrorDetails({
          code: 503,
          msg: 'Servicio de Historial de Órdenes temporalmente inactivo. Intentándolo de nuevo.'
        });
        return;
      }

      if (injectSchemaViolation) {
        setIsError(true);
        setErrorDetails({
          code: 422,
          msg: 'La firma de respuesta falló en el servidor - Formato del campo "total" es inválido.'
        });
        return;
      }

      setSuccessData('¡Respuesta satisfecha de la API! Total de órdenes cargadas: 24 (Cumplimiento de contrato: 100%)');
    }, latencyMs);
  };

  useEffect(() => {
    fetchSimulatedData();
  }, [latencyMs, injectError, injectSchemaViolation]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Visual summary */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-500" /> Expected Failure Sandbox
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed">
            En EDD, los errores no son excepciones imprevistas; son 
            <strong> modos de fallo esperados</strong>. Los retardos de base de datos o caídas de APIs externas se prevén utilizando Error Boundaries y cargando Skeletons por defecto. Ajusta los parámetros interactivos a continuación para ver cómo reacciona la UI asíncrona.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Parametric Toggles Area (Left) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 border border-neutral-200 rounded-2xl shadow-xs space-y-5">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">Inyectores de Caos & Retardo</h4>
            
            {/* Latency slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-500" /> Simular Latencia de API
                </span>
                <span className="text-xs font-bold font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                  {latencyMs} ms
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Verifica la transición automática a skeletons asíncronos en Next.js Suspense.</p>
              
              <div className="grid grid-cols-3 gap-2 pt-1.5">
                {[
                  { label: 'Instantáneo (0ms)', value: 0 },
                  { label: 'Red Regular (1200ms)', value: 1200 },
                  { label: 'Red Lenta (3000ms)', value: 3000 }
                ].map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setLatencyMs(preset.value)}
                    className={`text-[10px] font-bold py-2 rounded-lg border transition ${
                      latencyMs === preset.value 
                        ? 'bg-blue-50 text-blue-600 border-blue-300 shadow-sm' 
                        : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-neutral-100" />

            {/* Error Injection */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-neutral-700 block">Condición Esperada de Fallos</span>
              
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={injectError}
                    onChange={(e) => {
                      setInjectError(e.target.checked);
                      if (e.target.checked) setInjectSchemaViolation(false);
                    }}
                    className="mt-0.5 h-4 w-4 text-rose-600 border-neutral-300 rounded"
                  />
                  <div className="text-left">
                    <span className="text-xs font-bold text-neutral-850">Caída de Base de Datos (503 Service Unavailable)</span>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                      El endpoint devuelve un código error. La UI debe caer en un Error Boundary de soporte local.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={injectSchemaViolation}
                    onChange={(e) => {
                      setInjectSchemaViolation(e.target.checked);
                      if (e.target.checked) setInjectError(false);
                    }}
                    className="mt-0.5 h-4 w-4 text-rose-600 border-neutral-300 rounded"
                  />
                  <div className="text-left">
                    <span className="text-xs font-bold text-neutral-850">Violación de Esquema API (422 Unprocessable)</span>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                      El servidor manda un tipo de número donde se esperaba una cadena. Muestra la ventana de diagnóstico de contratos fallidos.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={fetchSimulatedData}
              className="w-full bg-neutral-900 text-white font-bold text-xs p-2.5 rounded-lg hover:bg-neutral-850 transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Re-evaluar Estado Visual
            </button>
          </div>
        </div>

        {/* Live UI Sandbox (Right) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs flex flex-col">
            <div className="bg-neutral-50/50 px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-700">Contenedor de Renderizado Visual</span>
              <div className="flex gap-2">
                {isLoading && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold border border-amber-200">
                    <RefreshCw className="h-3 w-3 animate-spin" /> Cargando...
                  </span>
                )}
                {isError && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-bold border border-rose-250 animate-bounce">
                    Boundary Activo
                  </span>
                )}
                {successData && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-250">
                    Satisfecho
                  </span>
                )}
              </div>
            </div>

            {/* Simulated Live Viewport block */}
            <div className="p-8 min-h-[340px] bg-neutral-50 flex items-center justify-center">
              
              {/* SKELETON LOADER STATE */}
              {isLoading ? (
                <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full animate-shimmer" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-2/3 rounded animate-shimmer" />
                      <div className="h-3 w-1/3 rounded animate-shimmer" />
                    </div>
                  </div>
                  <hr className="border-neutral-100" />
                  <div className="space-y-2.5">
                    <div className="h-8 w-full rounded-lg animate-shimmer" />
                    <div className="h-8 w-full rounded-lg animate-shimmer" />
                    <div className="h-8 w-full rounded-lg animate-shimmer" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-3 w-20 rounded animate-shimmer" />
                    <div className="h-8 w-24 rounded-lg animate-shimmer" />
                  </div>
                </div>
              ) : isError ? (
                /* ERROR BOUNDARY / SCHEMA VIOLATION PRESENTATION */
                <div className="w-full max-w-md bg-white border border-rose-250 rounded-2xl p-5 space-y-4 shadow-md text-left">
                  <div className="flex items-start gap-3.5 text-rose-600">
                    <div className="p-2 bg-rose-50 rounded-lg shrink-0 border border-rose-200">
                      <XOctagon className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm font-sans block text-neutral-900 tracking-tight">
                        {injectSchemaViolation ? 'Violación de Contrato Detectado' : 'Fallo de Red Controlado'}
                      </h4>
                      <code className="text-[10px] font-mono text-rose-500 font-bold block mt-0.5 bg-rose-50/50 px-1 py-0.2 rounded w-max">
                        HTTP Estado {errorDetails?.code}
                      </code>
                    </div>
                  </div>
                  
                  <div className="p-3.5 bg-neutral-900 rounded-xl font-mono text-[11px] text-neutral-300 leading-normal space-y-2">
                    <p className="text-neutral-200 font-semibold">{errorDetails?.msg}</p>
                    <div className="text-[10px] text-neutral-400 border-t border-neutral-800 pt-2 space-y-1">
                      <div>File: src/app/orders/error.tsx</div>
                      <div>Resolver: LocalErrorBoundaryFallback</div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      onClick={fetchSimulatedData}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-neutral-700 bg-neutral-150 hover:bg-neutral-200 transition"
                    >
                      Intentar de Nuevo
                    </button>
                    <button
                      onClick={() => {
                        setInjectError(false);
                        setInjectSchemaViolation(false);
                      }}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 transition"
                    >
                      Restaurar Todo
                    </button>
                  </div>
                </div>
              ) : (
                /* SUCCESS STATE IN EXQUISITE CLEAN MINIMALIST DESIGN */
                <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-200">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900">Historial de Transacciones</h4>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">Sincronizado vía Next.js Server Action</p>
                    </div>
                  </div>
                  <hr className="border-neutral-100" />
                  <div className="space-y-2.5">
                    {[
                      { ref: '#927341', customer: 'Andrés Alvarado', total: '$120.50', status: 'entregado' },
                      { ref: '#927342', customer: 'Lucía Méndez', total: '$45.00', status: 'entregado' }
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-neutral-400 font-bold">{row.ref}</span>
                          <span className="font-semibold text-neutral-700">{row.customer}</span>
                        </div>
                        <span className="font-bold text-neutral-900">{row.total}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10.5px] text-neutral-500 leading-normal bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 font-medium">
                    {successData}
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Quick instructions on suspense error boundary */}
          <div className="bg-white p-5 border border-neutral-200 rounded-2xl shadow-xs space-y-3 text-left">
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="h-4 w-4 text-blue-500" /> Arquitectura del Código Next.js de Fallos
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              En Next.js App Router, implementas este comportamiento uniendo componentes <code>loading.tsx</code> para los skeletons asíncronos en el nivel de carpeta del router, y <code>error.tsx</code> que actúan como Error Boundaries automáticos alrededor de las páginas del servidor de forma nativa.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
