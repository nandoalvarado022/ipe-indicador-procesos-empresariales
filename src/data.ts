import { RoadmapItem, ApiContract, ExpectationTest } from './types';

export const initialRoadmapItems: RoadmapItem[] = [
  {
    id: 'plan-1',
    text: 'Configurar Next.js & TypeScript',
    section: 'foundations',
    description: 'Iniciar la app usando create-next-app, habilitando Tailwind y el App Router.',
    completed: true,
  },
  {
    id: 'plan-2',
    text: 'Definir Contratos de Datos y Esquemas Zod',
    section: 'contracts',
    description: 'Establecer los esquemas de datos globales en src/schemas/ antes de implementar cualquier UI.',
    completed: true,
  },
  {
    id: 'plan-3',
    text: 'Implementar Rutas API con Validación Estricta',
    section: 'contracts',
    description: 'Garantizar que cada endpoint valide req.json() o searchParams contra esquemas Zod en Next.js Middleware/Routes.',
    completed: false,
  },
  {
    id: 'plan-4',
    text: 'Configurar Playwright para Tests Visuales Continuos',
    section: 'testing',
    description: 'Establecer los escenarios de prueba E2E enfocados en expectativas visuales concretas del usuario.',
    completed: false,
  },
  {
    id: 'plan-5',
    text: 'Crear Error Boundaries y Skeleton Skeletons',
    section: 'failures',
    description: 'Diseñar el manejo elegante de fallos esperados (como microservicios deshabilitados o alta latencia de bases de datos).',
    completed: false,
  },
  {
    id: 'plan-6',
    text: 'Mocking Determinista en Testing visual',
    section: 'testing',
    description: 'Configurar respuestas simuladas para evaluar estados límite de la UI bajo Playwright sin pegarle a producción.',
    completed: false,
  }
];

export const initialApiContracts: ApiContract[] = [
  {
    id: 'contract-user',
    path: '/api/users',
    method: 'POST',
    title: 'Registro de Usuarios',
    properties: [
      { name: 'email', type: 'string', required: true, description: 'Correo electrónico válido', validationMsg: 'Debe ser un email válido.' },
      { name: 'age', type: 'number', required: false, description: 'Edad del usuario', validationMsg: 'Debe ser mayor de 18 años.' },
      { name: 'isAdmin', type: 'boolean', required: true, description: 'Nivel de privilegio', validationMsg: 'Opciones: true o false' }
    ],
    expectedResponse: '{\n  "success": true,\n  "userId": "usr_94a7d2b",\n  "createdAt": "2026-06-02T18:03:00Z"\n}'
  },
  {
    id: 'contract-order',
    path: '/api/orders',
    method: 'GET',
    title: 'Historial de Ordenes',
    properties: [
      { name: 'userId', type: 'string', required: true, description: 'ID de usuario autenticado', validationMsg: 'Debe comenzar con usr_' },
      { name: 'limit', type: 'number', required: false, description: 'Límite de resultados', validationMsg: 'Debe ser entre 1 y 100.' }
    ],
    expectedResponse: '{\n  "orders": [\n    { "id": "ord_1", "total": 120.50, "status": "entregado" }\n  ]\n}'
  }
];

export const initialExpectationTests: ExpectationTest[] = [
  {
    id: 'test-1',
    description: 'Debido a la carga lenta, debe renderizar primero un Skeleton de tabla',
    selector: '[data-testid="orders-skeleton"]',
    expectationType: 'visible',
    expectedValue: 'true',
    status: 'idle',
    log: []
  },
  {
    id: 'test-2',
    description: 'El encabezado del dashboard debe contener el título "EDD.SYSTEM"',
    selector: '[data-testid="dashboard-header"]',
    expectationType: 'textEquals',
    expectedValue: 'EDD.SYSTEM',
    status: 'idle',
    log: []
  },
  {
    id: 'test-3',
    description: 'El contenedor de errores debe mostrarse cuando la API devuelve estado de error 500',
    selector: '[data-testid="error-banner"]',
    expectationType: 'visible',
    expectedValue: 'true',
    status: 'idle',
    log: []
  },
  {
    id: 'test-4',
    description: 'El botón de "Iniciar Secuencia" debe estar activo y clickeable',
    selector: '[data-testid="start-btn"]',
    expectationType: 'statusOk',
    expectedValue: 'interactive',
    status: 'idle',
    log: []
  }
];
