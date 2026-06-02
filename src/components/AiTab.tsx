import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { 
  Send, 
  Sparkles, 
  Trash2, 
  MessageSquare, 
  Cpu, 
  TrendingUp, 
  FileCode, 
  RefreshCw 
} from 'lucide-react';

export default function AiTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente Experto en **Expected-Driven Development (EDD)**. Estoy listo para ayudarte a diseñar la arquitectura de tu aplicación Next.js.\n\nPuedes preguntarme sobre:\n- Cómo escribir esquemas de validación con **Zod** para Next.js Server Actions.\n- Cómo mapear flujos de usuario visuales con **Playwright**.\n- Cómo manejar elegantes skeletons asíncronos y Error Boundaries en el App Router.\n- O cualquier duda sobre el plan de acción.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/edd-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });

      if (!response.ok) {
        throw new Error('La llamada a la API falló.');
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'No obtuve una respuesta válida.'
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Ocurrió un error al contactar al Copilot: ${error.message || 'Error Desconocido'}. Por favor, verifica tu conexión o re-intenta.`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: '¡Conversación reiniciada! ¿Qué expectativa de arquitectura Next.js vamos a definir hoy?'
      }
    ]);
  };

  const presetQueries = [
    { label: 'Ejemplo de Zod en Next.js', text: 'Dame un ejemplo de un esquema Zod estricto y cómo usarlo en un api route POST en Next.js App Router.' },
    { label: 'Estructurar Playwright E2E', text: '¿Cómo puedo estructurar un caso de prueba básico de Playwright enfocado exclusivamente en expectativas visuales de usuario?' },
    { label: 'Error Boundaries en Next.js', text: 'Explícame cómo funciona el archivo error.tsx y los skeletons en el Next.js App Router para el manejo de fallos esperados.' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[500px] animate-fadeIn">
      
      {/* Consultation Chat Feed (Main Column) */}
      <div className="lg:col-span-3 bg-white border border-neutral-200 rounded-2xl flex flex-col overflow-hidden h-[540px] shadow-xs">
        {/* Chat header */}
        <div className="bg-neutral-50 px-5 py-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-amber-50 text-amber-500 rounded-lg">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-neutral-900 leading-none">Copilot EDD Experto</h3>
              <span className="text-[10px] text-neutral-450 font-semibold font-mono">Energizado por Gemini 3.5 Flash</span>
            </div>
          </div>
          <button 
            onClick={clearChat}
            className="text-neutral-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-neutral-100 transition"
            title="Limpiar conversación"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Chat message display area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                msg.role === 'user' ? 'bg-neutral-850 text-white' : 'bg-blue-50 text-blue-600'
              }`}>
                {msg.role === 'user' ? <Cpu className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-full ${
                msg.role === 'user' 
                  ? 'bg-neutral-900 text-white font-medium rounded-tr-none' 
                  : 'bg-neutral-50 text-neutral-800 border border-neutral-100 rounded-tl-none font-medium'
              }`}>
                {/* Parse simple markdown (lines with code or bullet points) */}
                <div className="space-y-2 whitespace-pre-wrap">
                  {msg.content.split('\n\n').map((paragraph, pIdx) => {
                    // Check for bullet lists
                    if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                      return (
                        <ul key={pIdx} className="list-disc pl-5 space-y-1">
                          {paragraph.split('\n').map((li, liIdx) => (
                            <li key={liIdx}>{li.replace(/^[\s\-\*]+/, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    // Handle potential markdown code blocks briefly
                    if (paragraph.includes('```')) {
                      const sections = paragraph.split('```');
                      return (
                        <div key={pIdx} className="space-y-1">
                          {sections.map((sec, sIdx) => {
                            if (sIdx % 2 === 1) {
                              return (
                                <pre key={sIdx} className="p-3 bg-neutral-950 text-emerald-400 rounded-lg overflow-x-auto font-mono text-[11px] block select-all">
                                  <code>{sec.replace(/^(typescript|javascript|json|html|css|bash)\n/, '')}</code>
                                </pre>
                              );
                            }
                            return <p key={sIdx} className="leading-relaxed">{sec}</p>;
                          })}
                        </div>
                      );
                    }
                    return <p key={pIdx} className="leading-relaxed">{paragraph}</p>;
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 max-w-[85%]">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <Sparkles className="h-4 w-4 animate-spin" />
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 text-neutral-400 text-xs italic font-semibold">
                Copilot está formulando recomendaciones de arquitectura...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input prompt bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center gap-2 shrinks-0"
        >
          <input 
            type="text" 
            placeholder="Escribe tu consulta sobre EDD (Zod, Playwright, Suspense)..." 
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-grow p-3 text-xs bg-white border border-neutral-200 outline-none rounded-xl focus:border-blue-500 font-medium"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition duration-150 disabled:opacity-50 shrink-0 shadow-xs"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Suggested prompts column */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-5 border border-neutral-200 rounded-2xl shadow-xs space-y-4 text-left">
          <span className="text-[10px] tracking-wider uppercase font-bold text-neutral-400">Consultas Rápidas</span>
          <p className="text-xs text-neutral-400 leading-normal">Selecciona una pregunta prediseñada para aprender cómo implementar EDD hoy:</p>
          
          <div className="space-y-2">
            {presetQueries.map((query, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(query.text)}
                disabled={isLoading}
                className="w-full text-left p-3.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-150 rounded-xl transition duration-150 text-xs font-semibold text-neutral-700 hover:text-neutral-900 leading-normal block"
              >
                {query.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 p-5 rounded-2xl text-white space-y-3.5 border border-neutral-800 text-left">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-amber-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Consultoría de Patrón</span>
          </div>
          <p className="text-[11px] text-neutral-300 leading-relaxed">
            Nuestra IA posee un contexto especializado en arquitectura de sistemas, diseño tolerante a fallos y validación de tipos Next.js App Router Enterprise.
          </p>
        </div>
      </div>

    </div>
  );
}
