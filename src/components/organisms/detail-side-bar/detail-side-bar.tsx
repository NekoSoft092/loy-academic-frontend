import { useState } from 'react';

export interface INotification {
    id: string;
    type: 'workflow' | 'article' | 'system' | 'alert';
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
    author?: string;
    icon: string;
    actionUrl?: string;
    metadata?: {
        workflowId?: string;
        articleId?: string;
        topic?: string;
    };
}

export interface DetailSideBarProps {
    type: 'workflow' | 'message' | 'notifications';
}

const notificationExamples: INotification[] = [
    // Notificación de flujo completado
    {
        id: '1',
        type: 'workflow',
        title: '✓ Flujo Completado',
        description: 'El flujo "Investigación Inicial Cambio Medioambiental" ha sido ejecutado exitosamente',
        timestamp: '2026-04-24T14:30:00',
        read: false,
        icon: '🔬',
        actionUrl: '/workflows/initial-env-research',
        metadata: {
            workflowId: 'initial-env-research'
        }
    },
    // Notificación de flujo en progreso
    {
        id: '2',
        type: 'workflow',
        title: '⏳ Flujo en Progreso',
        description: 'El análisis de "Investigación Inicial Cambio Medioambiental" está en proceso. Se espera 5 minutos más.',
        timestamp: '2026-04-24T14:15:00',
        read: false,
        icon: '⚙️',
        metadata: {
            workflowId: 'initial-env-research'
        }
    },
    // Notificación de nuevo artículo
    {
        id: '3',
        type: 'article',
        title: '📰 Nuevo Artículo',
        description: 'Andrés Tavera publicó: "Un nuevo estado en tiempos de emergencia"',
        timestamp: '2026-04-24T12:45:00',
        read: false,
        author: 'Andrés Tavera',
        icon: '📄',
        actionUrl: '/article/nuevo-estado-emergencia',
        metadata: {
            articleId: 'nuevo-estado-emergencia',
            topic: 'Política'
        }
    },
    // Notificación de tema relacionado
    {
        id: '4',
        type: 'article',
        title: '🔗 Artículo Relacionado',
        description: 'Se encontró un artículo relacionado a tu búsqueda: "Crisis Climática y Política"',
        timestamp: '2026-04-24T11:20:00',
        read: true,
        author: 'María López',
        icon: '🌍',
        actionUrl: '/article/crisis-climatica-politica',
        metadata: {
            articleId: 'crisis-climatica-politica',
            topic: 'Cambio Climático'
        }
    },
    // Notificación de alerta
    {
        id: '5',
        type: 'alert',
        title: '⚠️ Alerta de Información',
        description: 'Nuevos datos del IPCC sobre cambio climático disponibles',
        timestamp: '2026-04-23T18:00:00',
        read: true,
        icon: '🔴',
        actionUrl: '/data/ipcc-climate-2026',
        metadata: {
            topic: 'Cambio Climático'
        }
    },
    // Notificación de sistema
    {
        id: '6',
        type: 'system',
        title: '🔔 Actualización del Sistema',
        description: 'Se ha actualizado la base de datos de fuentes. 152 nuevos artículos indexados.',
        timestamp: '2026-04-23T10:30:00',
        read: true,
        icon: '⚡'
    }
];

export function DetailSideBar({ type }: DetailSideBarProps): JSX.Element {
    const [notifications] = useState<INotification[]>(notificationExamples);

    const getNotificationColor = (notificationType: INotification['type']): string => {
        switch(notificationType) {
            case 'workflow': return 'bg-blue-100 border-l-4 border-blue-500';
            case 'article': return 'bg-green-100 border-l-4 border-green-500';
            case 'alert': return 'bg-red-100 border-l-4 border-red-500';
            case 'system': return 'bg-gray-100 border-l-4 border-gray-500';
            default: return 'bg-gray-100';
        }
    };

    const formatTime = (timestamp: string): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Hace unos segundos';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return date.toLocaleDateString('es-ES');
    };

    return (
        <section className="bg-base-200 p-4 pt-20 h-full overflow-hidden" style={{ width: '30%', minWidth: '0px', maxWidth: '500px' }}>
            { (type === 'notifications') && (
                <div className="overflow-x-hidden h-full">
                    <h2 className="text-2xl font-bold mb-4">Notificaciones</h2>
                    <div className="space-y-3 overflow-y-auto pr-2" style={{ height: 'calc(100% - 50px)' }}>
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 rounded-lg ${getNotificationColor(notification.type)} ${!notification.read ? 'opacity-100' : 'opacity-70'} cursor-pointer hover:shadow-md transition-shadow break-words`}
                            >
                                <div className="flex justify-between items-start mb-2 gap-2">
                                    <div className="flex gap-2 flex-1 min-w-0">
                                        <span className="text-xl flex-shrink-0">{notification.icon}</span>
                                        <h3 className="font-bold text-sm break-words">{notification.title}</h3>
                                    </div>
                                    {!notification.read && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-700 mb-2 break-words">{notification.description}</p>
                                {notification.author !== undefined && notification.author !== null && (
                                    <p className="text-xs text-gray-600 mb-1 break-words">Por: <span className="font-semibold">{notification.author}</span></p>
                                )}
                                {notification.metadata?.topic !== null && notification.metadata?.topic !== undefined && (
                                    <span className="inline-block bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs mb-2 break-words">
                                        {notification.metadata.topic}
                                    </span>
                                )}
                                <p className="text-xs text-gray-600">{formatTime(notification.timestamp)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}