import React, { useState, useEffect } from 'react';
import {
  getReminders,
  toggleReminder,
  updateReminderInterval,
  checkReminders,
  markReminderTriggered,
  type Reminder,
} from '../services/remindersService';

// Icons
const BellIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

const ClockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const getTypeIcon = (type: Reminder['type']) => {
  const iconMap = {
    hydration: '💧',
    rest: '🛋️',
    nutrition: '🍎',
    break: '⏸️',
    custom: '📝',
  };
  return iconMap[type] || '🔔';
};

const getTypeColor = (type: Reminder['type']) => {
  const colorMap = {
    hydration: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    rest: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    nutrition: 'bg-green-500/10 text-green-400 border-green-500/30',
    break: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    custom: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  };
  return colorMap[type] || 'bg-gray-500/10 text-gray-400 border-gray-500/30';
};

const ReminderCard: React.FC<{
  reminder: Reminder;
  onToggle: () => void;
  onIntervalChange: (minutes: number) => void;
}> = ({ reminder, onToggle, onIntervalChange }) => {
  const [customInterval, setCustomInterval] = useState(reminder.intervalMinutes.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const newInterval = parseInt(customInterval);
    if (newInterval > 0 && newInterval <= 1440) {
      onIntervalChange(newInterval);
      setIsEditing(false);
    }
  };

  const getTimeUntilNext = (): string => {
    if (!reminder.enabled || !reminder.lastTriggered) return 'Desactivado';

    const now = Date.now();
    const nextTrigger = reminder.lastTriggered + (reminder.intervalMinutes * 60 * 1000);
    const diff = nextTrigger - now;

    if (diff <= 0) return 'Listo para activar';

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `En ${hours}h ${mins}m`;
    }
    return `En ${mins}m`;
  };

  return (
    <div className={`border rounded-lg p-4 ${getTypeColor(reminder.type)}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 text-3xl">
            {getTypeIcon(reminder.type)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base mb-1">{reminder.title}</h3>
            <p className="text-sm opacity-90 mb-2">{reminder.message}</p>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 opacity-75">
                <ClockIcon />
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={customInterval}
                      onChange={(e) => setCustomInterval(e.target.value)}
                      min="1"
                      max="1440"
                      className="w-16 px-1.5 py-0.5 bg-gray-900/50 border border-gray-600 rounded text-white"
                    />
                    <span>min</span>
                    <button
                      onClick={handleSave}
                      className="ml-1 px-2 py-0.5 bg-blue-600 hover:bg-blue-700 rounded text-white"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => {
                        setCustomInterval(reminder.intervalMinutes.toString());
                        setIsEditing(false);
                      }}
                      className="px-2 py-0.5 bg-gray-600 hover:bg-gray-700 rounded text-white"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="hover:underline"
                  >
                    Cada {reminder.intervalMinutes} min
                  </button>
                )}
              </div>

              {reminder.enabled && (
                <div className="text-xs opacity-75">
                  {getTimeUntilNext()}
                </div>
              )}
            </div>
          </div>
        </div>

        <label className="flex-shrink-0 relative inline-block w-12 h-6 cursor-pointer">
          <input
            type="checkbox"
            checked={reminder.enabled}
            onChange={onToggle}
            className="sr-only peer"
          />
          <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );
};

export const CareReminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setReminders(getReminders());
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Check reminders periodically
  useEffect(() => {
    if (!notificationsEnabled) return;

    const interval = setInterval(() => {
      const due = checkReminders();
      due.forEach(reminder => {
        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(reminder.title, {
            body: reminder.message,
            icon: '/icon.png',
            badge: '/icon.png',
            tag: reminder.id,
          });
        }
        // Mark as triggered
        markReminderTriggered(reminder.id);
        // Refresh state
        setReminders(getReminders());
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [notificationsEnabled]);

  const handleToggle = (id: string) => {
    toggleReminder(id);
    setReminders(getReminders());
  };

  const handleIntervalChange = (id: string, minutes: number) => {
    updateReminderInterval(id, minutes);
    setReminders(getReminders());
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Tu navegador no soporta notificaciones.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      setNotificationsEnabled(permission === 'granted');

      if (permission === 'granted') {
        new Notification('Recordatorios Activados', {
          body: '¡Listo! Recibirás recordatorios de cuidado.',
          icon: '/icon.png',
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const activeReminders = reminders.filter(r => r.enabled);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
          <BellIcon />
          Recordatorios de Cuidado
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Configurá recordatorios automáticos para hidratación, descanso y alimentación
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Notification Permission Banner */}
          {notificationPermission !== 'granted' && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-2xl">🔔</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-300 mb-1">
                    Activá las notificaciones
                  </h3>
                  <p className="text-sm text-blue-300/80 mb-3">
                    Para recibir recordatorios cuando estés en otra pestaña o app, necesitamos tu permiso para enviar notificaciones.
                  </p>
                  <button
                    onClick={requestNotificationPermission}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Permitir Notificaciones
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Status Summary */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-300">Estado</h3>
                <p className="text-2xl font-bold text-white mt-1">
                  {activeReminders.length} {activeReminders.length === 1 ? 'activo' : 'activos'}
                </p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-medium text-gray-300">Notificaciones</h3>
                <p className={`text-sm font-semibold mt-1 ${notificationsEnabled ? 'text-green-400' : 'text-gray-500'}`}>
                  {notificationsEnabled ? '✓ Habilitadas' : '✕ Deshabilitadas'}
                </p>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <p className="text-sm text-amber-300">
              <strong>💡 Consejo:</strong> Los recordatorios son especialmente útiles durante experiencias psicoactivas.
              Hidratarse, descansar y alimentarse de forma regular reduce riesgos y mejora el bienestar.
            </p>
          </div>

          {/* Reminders List */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-200">Tus Recordatorios</h2>
            {reminders.map(reminder => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onToggle={() => handleToggle(reminder.id)}
                onIntervalChange={(minutes) => handleIntervalChange(reminder.id, minutes)}
              />
            ))}
          </div>

          {/* Usage Tips */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Cómo usar los recordatorios</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• <strong className="text-gray-300">Activá/desactivá:</strong> Usa el interruptor para habilitar o deshabilitar cada recordatorio</li>
              <li>• <strong className="text-gray-300">Ajustá intervalos:</strong> Hacé clic en "Cada X min" para cambiar la frecuencia</li>
              <li>• <strong className="text-gray-300">Notificaciones:</strong> Deben estar habilitadas para recibir alertas fuera de la app</li>
              <li>• <strong className="text-gray-300">Personalización:</strong> Ajustá los tiempos según tus necesidades individuales</li>
            </ul>
          </div>

          {/* Safety Note */}
          <div className="border-t border-gray-700 pt-4">
            <p className="text-xs text-gray-500 text-center">
              Los recordatorios son orientativos. Escuchá tu cuerpo y ajustá según tus necesidades.
              Si te sentís mal, buscá asistencia médica inmediatamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
