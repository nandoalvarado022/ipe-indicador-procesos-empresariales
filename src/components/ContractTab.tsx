import React, { useState } from 'react';
import { ApiContract } from '../types';
import { 
  FileCode, 
  Plus, 
  Trash2, 
  Save, 
  FileJson, 
  Check, 
  RefreshCw, 
  Layers, 
  Cpu 
} from 'lucide-react';

interface ContractTabProps {
  apiContracts: ApiContract[];
  setApiContracts: React.Dispatch<React.SetStateAction<ApiContract[]>>;
}

export default function ContractTab({ apiContracts, setApiContracts }: ContractTabProps) {
  const [selectedContractId, setSelectedContractId] = useState<string>(apiContracts[0]?.id || '');
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'zod' | 'route' | 'action' | 'client'>('zod');

  // Input bindings for adding a custom contract
  const [customTitle, setCustomTitle] = useState('');
  const [customPath, setCustomPath] = useState('/api/products');
  const [customMethod, setCustomMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('POST');
  const [customResponse, setCustomResponse] = useState('{\n  "success": true,\n  "id": "prod_1",\n  "message": "Guardado correctamente"\n}');
  
  // Custom Property bindings
  const [propName, setPropName] = useState('');
  const [propType, setPropType] = useState<'string' | 'number' | 'boolean' | 'enum'>('string');
  const [propRequired, setPropRequired] = useState(true);
  const [propDesc, setPropDesc] = useState('');
  const [propValMsg, setPropValMsg] = useState('');
  const [tempProps, setTempProps] = useState<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'enum';
    required: boolean;
    description: string;
    validationMsg: string;
  }[]>([]);

  const activeContract = apiContracts.find(c => c.id === selectedContractId) || apiContracts[0];

  const handleAddProperty = () => {
    if (!propName.trim()) return;
    setTempProps(prev => [...prev, {
      name: propName.trim().replace(/\s+/g, '_'),
      type: propType,
      required: propRequired,
      description: propDesc.trim() || `Atributo ${propName}`,
      validationMsg: propValMsg.trim() || 'Formato de campo incorrecto.'
    }]);
    setPropName('');
    setPropDesc('');
    setPropValMsg('');
  };

  const handleRemoveProperty = (index: number) => {
    setTempProps(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customPath.trim()) return;

    const newContract: ApiContract = {
      id: `custom-contract-${Date.now()}`,
      path: customPath,
      method: customMethod,
      title: customTitle,
      properties: tempProps.length > 0 ? tempProps : [
        { name: 'name', type: 'string', required: true, description: 'Nombre completo', validationMsg: 'Debe ingresar un nombre.' }
      ],
      expectedResponse: customResponse
    };

    setApiContracts(prev => [...prev, newContract]);
    setSelectedContractId(newContract.id);
    
    // reset form states
    setCustomTitle('');
    setCustomPath('/api/');
    setTempProps([]);
  };

  const handleDeleteContract = (id: string) => {
    const remaining = apiContracts.filter(c => c.id !== id);
    setApiContracts(remaining);
    if (selectedContractId === id) {
      setSelectedContractId(remaining[0]?.id || '');
    }
  };

  const copyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 3000);
  };

  if (!activeContract) {
    return (
      <div className="text-center p-12 bg-white rounded-2xl border border-neutral-200">
        <p className="text-neutral-500 font-medium">No hay contratos configurados. Crea uno a continuación.</p>
      </div>
    );
  }

  // GENERATE SNIPPETS MATHEMATICALLY BASED ON PROPERTIES
  const generateZodSchemaCode = () => {
    let code = `import { z } from 'zod';\n\n`;
    code += `// Expectation schema for ${activeContract.title}\n`;
    code += `export const ${activeContract.id.replace(/-/g, '_')}_Schema = z.object({\n`;
    
    activeContract.properties.forEach(prop => {
      let zodType = 'z.string()';
      if (prop.type === 'number') zodType = 'z.number()';
      if (prop.type === 'boolean') zodType = 'z.boolean()';
      if (prop.type === 'enum') zodType = `z.enum(['activo', 'inactivo', 'pendiente'])`;

      let line = `  ${prop.name}: `;
      if (!prop.required) {
        line += `${zodType}.optional(),`;
      } else {
        if (prop.type === 'string') {
          line += `${zodType}.min(1, { message: "${prop.validationMsg}" }),`;
        } else {
          line += `${zodType},`;
        }
      }
      line += ` // ${prop.description}\n`;
      code += line;
    });

    code += `});\n\n`;
    code += `export type ${activeContract.id.replace(/-/g, '_')}_Input = z.infer<typeof ${activeContract.id.replace(/-/g, '_')}_Schema>;`;
    return code;
  };

  const generateRouteCode = () => {
    const schemaName = `${activeContract.id.replace(/-/g, '_')}_Schema`;
    let code = `import { NextResponse } from 'next/server';\n`;
    code += `import { ${schemaName} } from '@/schemas/contracts';\n\n`;
    code += `export async function ${activeContract.method}(request: Request) {\n`;
    code += `  try {\n`;
    
    if (activeContract.method === 'GET') {
      code += `    // Parse Search Params\n`;
      code += `    const { searchParams } = new URL(request.url);\n`;
      code += `    const queryData = Object.fromEntries(searchParams.entries());\n\n`;
      code += `    // Validate query expectations\n`;
      code += `    const validated = ${schemaName}.safeParse(queryData);\n`;
    } else {
      code += `    const body = await request.json();\n\n`;
      code += `    // Validate payload expectations against schema contract\n`;
      code += `    const validated = ${schemaName}.safeParse(body);\n`;
    }

    code += `    if (!validated.success) {\n`;
    code += `      return NextResponse.json({\n`;
    code += `        error: 'Expectation Failed',\n`;
    code += `        details: validated.error.flatten().fieldErrors\n`;
    code += `      }, { status: 422 });\n`;
    code += `    }\n\n`;
    code += `    // Business logic safe in contract expectation\n`;
    code += `    const data = validated.data;\n`;
    code += `    \n`;
    code += `    return NextResponse.json(${activeContract.expectedResponse.split('\n').join('\n    ')});\n`;
    code += `  } catch (error) {\n`;
    code += `    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });\n`;
    code += `  }\n`;
    code += `}`;
    return code;
  };

  const generateServerActionCode = () => {
    const schemaName = `${activeContract.id.replace(/-/g, '_')}_Schema`;
    const inputType = `${activeContract.id.replace(/-/g, '_')}_Input`;
    let code = `'use server';\n\n`;
    code += `import { ${schemaName}, ${inputType} } from '@/schemas/contracts';\n\n`;
    code += `export async function saveExpectationAction(payload: ${inputType}) {\n`;
    code += `  // Validate expectations internally to block direct RPC injection\n`;
    code += `  const validated = ${schemaName}.safeParse(payload);\n\n`;
    code += `  if (!validated.success) {\n`;
    code += `    return { \n`;
    code += `      success: false, \n`;
    code += `      errors: validated.error.flatten().fieldErrors \n`;
    code += `    };\n`;
    code += `  }\n\n`;
    code += `  // At this point contract compliance is strictly certified\n`;
    code += `  const data = validated.data;\n`;
    code += `  \n`;
    code += `  // Realizar query o guardar\n`;
    code += `  return { success: true, payload: data };\n`;
    code += `}`;
    return code;
  };

  const generateClientCode = () => {
    const schemaName = `${activeContract.id.replace(/-/g, '_')}_Schema`;
    const inputType = `${activeContract.id.replace(/-/g, '_')}_Input`;
    return `'use client';\n
import React, { useState } from 'react';
import { saveExpectationAction } from '@/actions/edd';

export default function ExpectationCheckForm() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    // Send action payload complying with expectations
    const res = await saveExpectationAction(rawData as any);
    if (!res.success) {\n      setErrors(res.errors || {});\n    } else {\n      setSuccess(true);\n      setErrors({});\n    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border rounded-xl space-y-4">
      {success && <p className="text-emerald-500">Expectation Satisfied!</p>}
      {/* Dynamic input generators based on contracts render here */}
    </form>
  );
}`;
  };

  const getActiveCode = () => {
    switch (activeCodeTab) {
      case 'zod': return generateZodSchemaCode();
      case 'route': return generateRouteCode();
      case 'action': return generateServerActionCode();
      case 'client': return generateClientCode();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Contract summary */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-500" /> Contract Definition Module
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed">
            EDD requiere contratos de datos explícitos. Define tus atributos de entrada y este motor generará automáticamente tus 
            <strong> Esquemas Zod</strong>, <strong>Next.js App Router API Route Handlers</strong> port-ready y <strong>Componentes React de Clientes</strong> que garantizan el cumplimiento de requisitos del frontend.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Choose & Customize Contracts */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 border border-neutral-200 rounded-2xl shadow-xs space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400">Contratos Guardados</h4>
            
            <div className="space-y-2">
              {apiContracts.map((contract) => (
                <div 
                  key={contract.id}
                  className={`w-full group rounded-xl p-3 border transition-all flex items-center justify-between cursor-pointer ${
                    selectedContractId === contract.id 
                      ? 'bg-blue-50/50 border-blue-200 text-neutral-900 ring-1 ring-blue-50' 
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                  }`}
                  onClick={() => setSelectedContractId(contract.id)}
                >
                  <div className="min-w-0">
                    <span className="font-bold text-xs truncate block">{contract.title}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        contract.method === 'POST' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                        contract.method === 'GET' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                        'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}>
                        {contract.method}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 truncate">{contract.path}</span>
                    </div>
                  </div>
                  {apiContracts.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteContract(contract.id);
                      }}
                      className="text-neutral-300 hover:text-rose-600 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Eliminar contrato"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Create custom contract tool */}
          <div className="bg-white p-5 border border-neutral-200 rounded-2xl shadow-xs space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-800 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Diseñar Nuevo Contrato
            </h4>

            <form onSubmit={handleSaveContract} className="space-y-3.5">
              <div>
                <label className="text-[10px] uppercase font-extrabold text-neutral-500 block mb-1">Nombre del Endpoint</label>
                <input 
                  type="text" 
                  placeholder="e.g. Creación de Productos" 
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-blue-500 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-extrabold text-neutral-500 block mb-1">Método</label>
                  <select
                    value={customMethod}
                    onChange={e => setCustomMethod(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg cursor-pointer outline-none"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-extrabold text-neutral-500 block mb-1">Ruta API</label>
                  <input 
                    type="text" 
                    value={customPath}
                    onChange={e => setCustomPath(e.target.value)}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg outline-none font-mono"
                    required
                  />
                </div>
              </div>

              {/* Inner Property Builder */}
              <div className="border border-neutral-100 bg-neutral-50/50 p-3.5 rounded-xl space-y-3">
                <h5 className="text-[11px] font-bold text-neutral-700">Agregar Atributo de Entrada</h5>
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="id_producto"
                    value={propName}
                    onChange={e => setPropName(e.target.value)}
                    className="text-xs p-2 bg-white border border-neutral-200 rounded-lg outline-none focus:border-blue-500 font-mono"
                  />
                  <select
                    value={propType}
                    onChange={e => setPropType(e.target.value as any)}
                    className="text-xs p-2 bg-white border border-neutral-200 rounded-lg cursor-pointer outline-none"
                  >
                    <option value="string">Cadena (String)</option>
                    <option value="number">Número (Number)</option>
                    <option value="boolean">Booleano (Boolean)</option>
                    <option value="enum">Enum (Choice)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Error de Validación"
                    value={propValMsg}
                    onChange={e => setPropValMsg(e.target.value)}
                    className="text-xs p-2 bg-white border border-neutral-200 rounded-lg outline-none"
                  />
                  <div className="flex items-center gap-2 justify-end px-1">
                    <span className="text-[10px] text-neutral-500 font-semibold">Requerido</span>
                    <input
                      type="checkbox"
                      checked={propRequired}
                      onChange={e => setPropRequired(e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-neutral-300 rounded"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddProperty}
                  className="w-full bg-neutral-900 text-white font-bold text-xs p-2 rounded-lg hover:bg-neutral-850 transition"
                >
                  Confirmar Atributo
                </button>

                {tempProps.length > 0 && (
                  <div className="pt-2 border-t border-neutral-200 space-y-1 max-h-24 overflow-y-auto">
                    {tempProps.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] bg-neutral-100 p-1.5 rounded border">
                        <span className="font-mono text-neutral-750">{p.name} ({p.type}{p.required ? '' : '?'})</span>
                        <button type="button" onClick={() => handleRemoveProperty(idx)} className="text-neutral-400 hover:text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] uppercase font-extrabold text-neutral-500 block mb-1">Mano de Salida (JSON Respaldo)</label>
                <textarea
                  rows={2}
                  value={customResponse}
                  onChange={e => setCustomResponse(e.target.value)}
                  className="w-full font-mono text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold text-xs p-2.5 rounded-lg hover:bg-blue-600 shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Save className="h-4 w-4" /> Registrar Contrato
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Dynamic Code Generation & Contract Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
            {/* Header / Contract Title / Properties */}
            <div className="p-6 bg-neutral-50 border-b border-neutral-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Contrato de Datos Activo</span>
                  <h3 className="font-extrabold text-lg text-neutral-900 mt-0.5">{activeContract.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-400 bg-neutral-150 px-2 py-0.5 rounded">
                    {activeContract.method} {activeContract.path}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Valores Esperados (Esquema de Entrada)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeContract.properties.map((prop, idx) => (
                    <div key={idx} className="bg-white p-3 border border-neutral-200 rounded-xl flex items-start gap-2.5 shadow-5xs">
                      <div className="p-1 px-1.5 bg-neutral-100 rounded text-neutral-500">
                        <Cpu className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-neutral-800">{prop.name}</span>
                          <span className="text-[10px] text-neutral-500 bg-neutral-100 px-1 py-0.1 rounded uppercase font-bold">{prop.type}</span>
                          {prop.required ? (
                            <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.1 rounded">Requerido</span>
                          ) : (
                            <span className="text-[9px] font-bold text-neutral-400 bg-neutral-50 px-1.5 py-0.1 rounded">Opcional</span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-1">{prop.description}</p>
                        {prop.validationMsg && (
                          <div className="text-[10px] mt-1 text-rose-500 font-medium">
                            Error esperado: &quot;{prop.validationMsg}&quot;
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Generator Tabs */}
            <div className="border-b border-neutral-200 flex select-none bg-neutral-50/50">
              {[
                { id: 'zod', label: 'Zod Model (schemas.ts)' },
                { id: 'route', label: 'API Route (route.ts)' },
                { id: 'action', label: 'Server Action (actions.ts)' },
                { id: 'client', label: 'Client (component.tsx)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCodeTab(tab.id as any)}
                  className={`px-4 py-3 text-xs font-bold transition-all border-b-2 outline-none ${
                    activeCodeTab === tab.id 
                      ? 'border-blue-500 text-blue-600 bg-white' 
                      : 'border-transparent text-neutral-450 hover:text-neutral-900 bg-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Code Block display */}
            <div className="relative">
              <button
                onClick={() => copyCode(getActiveCode(), activeCodeTab)}
                className="absolute right-4 top-4 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 font-semibold rounded-lg px-2.5 py-1 text-xs shadow-md transition-all active:scale-95"
              >
                {copiedLabel === activeCodeTab ? 'Copiado!' : 'Copiar Código'}
              </button>
              
              <pre className="p-5 text-xs font-mono bg-neutral-950 text-neutral-300 leading-relaxed overflow-x-auto select-all max-h-[460px]">
                {activeCodeTab === 'zod' && (
                  <code className="text-emerald-400">{generateZodSchemaCode()}</code>
                )}
                {activeCodeTab === 'route' && (
                  <code className="text-cyan-400">{generateRouteCode()}</code>
                )}
                {activeCodeTab === 'action' && (
                  <code className="text-amber-400">{generateServerActionCode()}</code>
                )}
                {activeCodeTab === 'client' && (
                  <code className="text-blue-400">{generateClientCode()}</code>
                )}
              </pre>
            </div>
          </div>

          {/* Expected Response Payload Preview */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-neutral-800">
              <FileJson className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Salida Esperada (Contrato Satisfecho)</span>
            </div>
            <pre className="text-xs font-mono p-4 bg-neutral-50 rounded-lg text-emerald-600 overflow-x-auto border border-neutral-100">
              <code>{activeContract.expectedResponse}</code>
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
}
