import { enable, isEnabled, disable } from 'tauri-plugin-autostart-api';

export interface SettingOption {
  id: string
  name: string
  enabled: boolean
  description: string
  type?: 'toggle' | 'select' | 'text' | 'number'
  options?: { label: string; value: string }[]
  toggle?: () => any | Promise<any>
  value?: string
}

export interface SettingSection {
  id: string
  title: string
  icon: string
  description?: string
  settings: SettingOption[]
}

export const SettingsList: SettingSection[] = [
  {
    id: 'privacy-security',
    title: 'Privacidad y Seguridad',
    icon: '🔒',
    description: 'Controla tu privacidad y seguridad',
    settings: [
      {
        id: 'profile-visibility',
        name: 'Visibilidad del Perfil',
        description: 'Controla quién puede ver tu perfil',
        enabled: true,
        type: 'select',
        options: [
          { label: 'Público', value: 'public' },
          { label: 'Solo contactos', value: 'contacts' },
          { label: 'Privado', value: 'private' }
        ]
      },
      {
        id: 'research-article-default-privacy',
        name: 'Privacidad Predeterminada de Artículos',
        description: 'Define si tus artículos son públicos o privados por defecto',
        enabled: false,
        type: 'select',
        options: [
          { label: 'Público', value: 'public' },
          { label: 'Restringido', value: 'restricted' },
          { label: 'Solo invitados', value: 'invited' }
        ]
      },
      {
        id: 'collaboration-permissions',
        name: 'Permisos de Colaboración',
        description: 'Permitir que otros estudiantes colaboren en tus artículos',
        enabled: true,
      },
      {
        id: 'two-factor-authentication',
        name: 'Autenticación de Dos Factores',
        description: 'Protege tu cuenta con 2FA',
        enabled: false,
      },
      {
        id: 'activity-history-tracking',
        name: 'Registro de Historial de Actividades',
        description: 'Registrar actividades en flujos de trabajo',
        enabled: true,
      },
    ]
  },
  {
    id: 'notifications',
    title: 'Notificaciones y Alertas',
    icon: '🔔',
    description: 'Gestiona tus preferencias de notificaciones',
    settings: [
      {
        id: 'notifications',
        name: 'Notificaciones de Escritorio',
        description: 'Habilitar notificaciones del sistema',
        enabled: true,
      },
      {
        id: 'ai-assistant-notifications',
        name: 'Notificaciones de Asistentes IA',
        description: 'Alertas cuando los asistentes responden',
        enabled: true,
      },
      {
        id: 'workflow-completion-alerts',
        name: 'Alertas de Finalización de Flujos',
        description: 'Notificaciones cuando workflows se completan',
        enabled: true,
      },
      {
        id: 'research-collaboration-notifications',
        name: 'Notificaciones de Colaboración en Artículos',
        description: 'Alertas cuando comentan en tus artículos',
        enabled: true,
      },
      {
        id: 'subject-update-notifications',
        name: 'Notificaciones de Actualizaciones de Materias',
        description: 'Alertas sobre cambios en tus materias',
        enabled: true,
      },
      {
        id: 'learning-progress-reminders',
        name: 'Recordatorios de Progreso de Aprendizaje',
        description: 'Recordatorios diarios/semanales',
        enabled: false,
        type: 'select',
        options: [
          { label: 'Desactivado', value: 'disabled' },
          { label: 'Diario', value: 'daily' },
          { label: 'Semanal', value: 'weekly' },
          { label: 'Mensual', value: 'monthly' }
        ]
      },
      {
        id: 'mentor-messages-notifications',
        name: 'Notificaciones de Mensajes de Mentores',
        description: 'Alertas de respuestas de asistentes',
        enabled: true,
      },
      {
        id: 'notification-sound',
        name: 'Sonidos de Notificación',
        description: 'Reproducir sonidos para notificaciones',
        enabled: true,
      },
    ]
  },
  {
    id: 'learning-experience',
    title: 'Experiencia de Aprendizaje',
    icon: '📚',
    description: 'Personaliza tu experiencia de aprendizaje',
    settings: [
      {
        id: 'learning-mode-difficulty',
        name: 'Nivel de Dificultad',
        description: 'Nivel de contenido que deseas recibir',
        enabled: true,
        type: 'select',
        options: [
          { label: 'Principiante', value: 'beginner' },
          { label: 'Intermedio', value: 'intermediate' },
          { label: 'Avanzado', value: 'advanced' }
        ]
      },
      {
        id: 'ai-assistant-response-style',
        name: 'Estilo de Respuesta del Asistente',
        description: 'Cómo quieres que responda tu asistente IA',
        enabled: true,
        type: 'select',
        options: [
          { label: 'Detallada', value: 'detailed' },
          { label: 'Concisa', value: 'concise' },
          { label: 'Socrática', value: 'socratic' },
          { label: 'Paso a paso', value: 'step-by-step' }
        ]
      },
      {
        id: 'language-preference',
        name: 'Idioma Preferido',
        description: 'Idioma para asistentes y materiales',
        enabled: true,
        type: 'select',
        options: [
          { label: 'Español', value: 'es' },
          { label: 'Inglés', value: 'en' },
          { label: 'Portugués', value: 'pt' }
        ]
      },
      {
        id: 'dark-mode',
        name: 'Modo Oscuro',
        description: 'Tema oscuro para reducir fatiga visual',
        enabled: false,
      },
      {
        id: 'auto-save-workflows',
        name: 'Guardado Automático',
        description: 'Guardar automáticamente progreso en flujos',
        enabled: true,
      },
      {
        id: 'offline-mode-available',
        name: 'Modo Offline',
        description: 'Habilitar acceso offline a contenido',
        enabled: true,
      },
    ]
  },
  {
    id: 'workflows-assistants',
    title: 'Flujos de Trabajo y Asistentes',
    icon: '🤖',
    description: 'Configura tus asistentes y flujos de trabajo',
    settings: [
      {
        id: 'default-assistant-visibility',
        name: 'Visibilidad de Asistentes por Defecto',
        description: 'Control sobre qué asistentes ves',
        enabled: true,
      },
      {
        id: 'workflow-auto-suggestions',
        name: 'Sugerencias Automáticas de Flujos',
        description: 'Recomendaciones basadas en tus materias',
        enabled: true,
      },
      {
        id: 'ai-personality',
        name: 'Personalidad del Asistente',
        description: 'Tono y estilo del asistente',
        enabled: true,
        type: 'select',
        options: [
          { label: 'Formal', value: 'formal' },
          { label: 'Casual', value: 'casual' },
          { label: 'Motivador', value: 'motivational' },
          { label: 'Paciente', value: 'patient' }
        ]
      },
      {
        id: 'workflow-scheduling',
        name: 'Programación de Tareas',
        description: 'Programación automática de flujos recurrentes',
        enabled: false,
      },
      {
        id: 'assistant-memory',
        name: 'Memoria del Asistente',
        description: 'Permitir que asistentes recuerden contexto',
        enabled: true,
      },
      {
        id: 'batch-processing-workflows',
        name: 'Procesamiento en Lote',
        description: 'Procesar múltiples flujos en paralelo',
        enabled: true,
      },
    ]
  },
  {
    id: 'research-publications',
    title: 'Investigación y Publicaciones',
    icon: '📄',
    description: 'Gestiona tus artículos y publicaciones',
    settings: [
      {
        id: 'default-article-visibility',
        name: 'Visibilidad Predeterminada de Artículos',
        description: 'Público / Restringido / Solo invitados',
        enabled: true,
        type: 'select',
        options: [
          { label: 'Público', value: 'public' },
          { label: 'Restringido', value: 'restricted' },
          { label: 'Solo invitados', value: 'invited' }
        ]
      },
      {
        id: 'article-comments-permission',
        name: 'Permisos de Comentarios',
        description: 'Quién puede comentar en tus artículos',
        enabled: true,
        type: 'select',
        options: [
          { label: 'Públicos', value: 'public' },
          { label: 'Solo usuarios verificados', value: 'verified' },
          { label: 'Desactivados', value: 'disabled' }
        ]
      },
      {
        id: 'citation-settings',
        name: 'Formato de Citas',
        description: 'Formato preferido de referencias',
        enabled: true,
        type: 'select',
        options: [
          { label: 'APA', value: 'apa' },
          { label: 'MLA', value: 'mla' },
          { label: 'Chicago', value: 'chicago' },
          { label: 'IEEE', value: 'ieee' }
        ]
      },
      {
        id: 'peer-review-notifications',
        name: 'Notificaciones de Revisión por Pares',
        description: 'Alertas para revisión de artículos',
        enabled: true,
      },
      {
        id: 'research-collaboration-requests',
        name: 'Solicitudes de Colaboración',
        description: 'Permitir colaboración en artículos',
        enabled: true,
      },
      {
        id: 'version-control-research',
        name: 'Control de Versiones',
        description: 'Mantener historial de versiones',
        enabled: true,
      },
      {
        id: 'research-analytics',
        name: 'Estadísticas de Artículos',
        description: 'Ver lecturas y descargas de tus artículos',
        enabled: true,
      },
    ]
  },
  {
    id: 'subjects-management',
    title: 'Gestión de Materias',
    icon: '📖',
    description: 'Organiza tus materias y asignaturas',
    settings: [
      {
        id: 'subject-organization',
        name: 'Orden de Visualización',
        description: 'Cómo ordenar tus materias',
        enabled: true,
        type: 'select',
        options: [
          { label: 'Por nombre', value: 'name' },
          { label: 'Por progreso', value: 'progress' },
          { label: 'Por fecha', value: 'date' }
        ]
      },
      {
        id: 'subject-notifications-granular',
        name: 'Notificaciones por Materia',
        description: 'Alertas específicas para cada materia',
        enabled: true,
      },
      {
        id: 'subject-schedule-reminders',
        name: 'Recordatorios de Horario',
        description: 'Recordatorios de clases y sesiones',
        enabled: true,
      },
      {
        id: 'subject-resource-sync',
        name: 'Sincronización de Recursos',
        description: 'Sincronizar automáticamente recursos',
        enabled: true,
      },
    ]
  },
  {
    id: 'data-sharing',
    title: 'Privacidad de Datos y Compartición',
    icon: '🔐',
    description: 'Controla cómo se comparten tus datos',
    settings: [
      {
        id: 'share-learning-data',
        name: 'Compartir Datos de Aprendizaje',
        description: 'Usar datos para mejorar asistentes',
        enabled: false,
      },
      {
        id: 'share-research-insights',
        name: 'Compartir Conclusiones de Investigación',
        description: 'Compartir insights anonimizados',
        enabled: false,
      },
      {
        id: 'ai-training-consent',
        name: 'Consentimiento de Entrenamiento de IA',
        description: 'Permitir usar tus escritos en entrenamientos',
        enabled: false,
      },
      {
        id: 'research-recommendations',
        name: 'Recomendaciones Personalizadas',
        description: 'Recibir recomendaciones según tu historial',
        enabled: true,
      },
    ]
  },
  {
    id: 'integrations-connectivity',
    title: 'Integraciones y Conectividad',
    icon: '🔗',
    description: 'Conecta con otros servicios',
    settings: [
      {
        id: 'calendar-integration',
        name: 'Integración de Calendario',
        description: 'Conectar Google Calendar, Outlook, etc.',
        enabled: false,
      },
      {
        id: 'email-digest-frequency',
        name: 'Frecuencia de Resumen por Email',
        description: 'Resúmenes automáticos por correo',
        enabled: false,
        type: 'select',
        options: [
          { label: 'Desactivado', value: 'disabled' },
          { label: 'Diario', value: 'daily' },
          { label: 'Semanal', value: 'weekly' },
          { label: 'Mensual', value: 'monthly' }
        ]
      },
      {
        id: 'rss-feed-export',
        name: 'Exportar Feed RSS',
        description: 'RSS feed de tus publicaciones',
        enabled: false,
      },
      {
        id: 'api-access',
        name: 'Acceso API',
        description: 'Permitir acceso API para terceros',
        enabled: false,
      },
      {
        id: 'webhook-notifications',
        name: 'Webhooks de Notificaciones',
        description: 'Webhooks para eventos importantes',
        enabled: false,
      },
    ]
  },
  {
    id: 'performance-ai',
    title: 'Rendimiento e IA',
    icon: '⚡',
    description: 'Optimiza el rendimiento y comportamiento de IA',
    settings: [
      {
        id: 'ai-response-timeout',
        name: 'Tiempo Máximo de Respuesta',
        description: 'Segundos para esperar respuestas de IA',
        enabled: true,
        type: 'select',
        options: [
          { label: '30 segundos', value: '30' },
          { label: '60 segundos', value: '60' },
          { label: '120 segundos', value: '120' },
          { label: 'Sin límite', value: 'unlimited' }
        ]
      },
      {
        id: 'batch-size-processing',
        name: 'Tamaño de Lote de Procesamiento',
        description: 'Cantidad de items a procesar',
        enabled: true,
        type: 'select',
        options: [
          { label: '5 items', value: '5' },
          { label: '10 items', value: '10' },
          { label: '25 items', value: '25' },
          { label: '50 items', value: '50' }
        ]
      },
      {
        id: 'cache-ai-responses',
        name: 'Cachear Respuestas de IA',
        description: 'Cachear respuestas frecuentes',
        enabled: true,
      },
      {
        id: 'quality-vs-speed',
        name: 'Calidad vs Velocidad',
        description: 'Preferencia de resultado',
        enabled: true,
        type: 'select',
        options: [
          { label: 'Máxima calidad', value: 'quality' },
          { label: 'Balance', value: 'balanced' },
          { label: 'Mayor velocidad', value: 'speed' }
        ]
      },
    ]
  },
  {
    id: 'accessibility',
    title: 'Accesibilidad',
    icon: '♿',
    description: 'Mejora la accesibilidad de la interfaz',
    settings: [
      {
        id: 'font-size',
        name: 'Tamaño de Fuente',
        description: 'Ajusta el tamaño del texto',
        enabled: true,
        type: 'select',
        options: [
          { label: 'Pequeño', value: 'small' },
          { label: 'Normal', value: 'normal' },
          { label: 'Grande', value: 'large' },
          { label: 'Muy grande', value: 'xlarge' }
        ]
      },
      {
        id: 'text-to-speech',
        name: 'Lectura en Voz Alta',
        description: 'Leer contenido en voz alta',
        enabled: false,
      },
      {
        id: 'high-contrast-mode',
        name: 'Modo de Alto Contraste',
        description: 'Mayor contraste para mejor visibilidad',
        enabled: false,
      },
      {
        id: 'keyboard-shortcuts',
        name: 'Atajos de Teclado',
        description: 'Habilitar navegación por teclado',
        enabled: true,
      },
      {
        id: 'reduce-animations',
        name: 'Reducir Animaciones',
        description: 'Minimizar animaciones',
        enabled: false,
      },
    ]
  },
  {
    id: 'account-management',
    title: 'Administración de Cuenta',
    icon: '👤',
    description: 'Gestiona tu cuenta y datos',
    settings: [
      {
        id: 'connected-accounts',
        name: 'Cuentas Conectadas',
        description: 'Gestionar cuentas OAuth/integradas',
        enabled: true,
      },
      {
        id: 'session-management',
        name: 'Gestión de Sesiones',
        description: 'Ver y cerrar sesiones activas',
        enabled: true,
      },
      {
        id: 'data-export',
        name: 'Exportar Datos',
        description: 'Exportar toda tu información',
        enabled: true,
      },
      {
        id: 'backup-frequency',
        name: 'Frecuencia de Copias de Seguridad',
        description: 'Copias automáticas de tu contenido',
        enabled: true,
        type: 'select',
        options: [
          { label: 'Diario', value: 'daily' },
          { label: 'Semanal', value: 'weekly' },
          { label: 'Mensual', value: 'monthly' }
        ]
      },
      {
        id: 'account-deletion',
        name: 'Eliminar Cuenta',
        description: 'Opción para eliminar permanentemente',
        enabled: false,
      },
    ]
  },
  {
    id: 'developer-advanced',
    title: 'Desarrollador y Avanzado',
    icon: '⚙️',
    description: 'Opciones avanzadas y para desarrolladores',
    settings: [
      {
        id: 'developer-mode',
        name: 'Modo Desarrollador',
        description: 'Habilitar herramientas de desarrollo',
        enabled: false,
      },
      {
        id: 'auto-start',
        name: 'Inicio Automático',
        description: 'Habilitar el inicio automático',
        enabled: false,
        toggle: async () => {
          const isEnable = await isEnabled()
          if (isEnable) {
            await disable()
          } else {
            await enable()
          }
        },
      },
      {
        id: 'dark-mode',
        name: 'Noticias Resumen',
        description: 'Activar resumen de noticias diario',
        enabled: false,
        toggle: async () => {
          // const newMode = ui('mode') === 'dark' ? 'light' : 'dark'
          // await ui('mode', newMode)
        },
      },
    ]
  }
]
