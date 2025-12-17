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
    hydration: 'bg-white/[0.02] text-white/90 border-white/[0.06]',
    rest: 'bg-white/[0.02] text-white/90 border-white/[0.06]',
    nutrition: 'bg-white/[0.02] text-white/90 border-white/[0.06]',
    break: 'bg-white/[0.02] text-white/90 border-white/[0.06]',
    custom: 'bg-white/[0.02] text-white/90 border-white/[0.06]',
  };
  return colorMap[type] || 'bg-white/[0.02] text-white/90 border-white/[0.06]';
};

const getTypeBorderColor = (type: Reminder['type']) => {
  const colorMap = {
    hydration: 'border-l-blue-500/40',
    rest: 'border-l-purple-500/40',
    nutrition: 'border-l-green-500/40',
    break: 'border-l-yellow-500/40',
    custom: 'border-l-gray-500/40',
  };
  return colorMap[type] || 'border-l-gray-500/40';
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
    <div
      className={`hover-glow border rounded-[var(--radius-md)] border-l-2 p-5 sm:p-6 ${getTypeColor(reminder.type)} ${getTypeBorderColor(reminder.type)}`}
      style={{ transition: `all var(--t-med) var(--ease)` }}
    >
      <div className="flex items-start justify-between gap-4">
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
      <div className="p-6 sm:p-8 border-b border-gray-800">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-100 flex items-center gap-2">
          <BellIcon />
          <span className="hidden sm:inline">Recordatorios de Cuidado</span>
          <span className="sm:hidden">Recordatorios</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Configurá recordatorios automáticos para hidratación, descanso y alimentación
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 lg:p-12">
        <div className="max-w-3xl mx-auto space-y-8 lg:space-y-10">
          {/* Notification Permission Banner */}
          {notificationPermission !== 'granted' && (
            <div
              className="border border-l-2 border-l-blue-500/40 rounded-[var(--radius-md)] p-5 sm:p-6"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border)', animation: 'fadeIn 0.4s ease-out' }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-2xl">🔔</div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>
                    Activá las notificaciones
                  </h3>
                  <p className="editorial text-sm mb-3" style={{ color: 'var(--muted)' }}>
                    Para recibir recordatorios cuando estés en otra pestaña o app, necesitamos tu permiso para enviar notificaciones.
                  </p>
                  <button
                    onClick={requestNotificationPermission}
                    className="px-4 py-2 text-white rounded-[var(--radius-sm)] text-sm font-medium"
                    style={{
                      background: 'var(--accent)',
                      transition: `all var(--t-fast) var(--ease)`
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Permitir Notificaciones
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Status Summary */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-5 sm:p-6">
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
          <div
            className="border border-l-2 border-l-yellow-500/40 rounded-[var(--radius-md)] p-5 sm:p-6"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
          >
            <p className="editorial text-sm" style={{ color: 'var(--muted)' }}>
              <strong style={{ color: 'var(--text)' }}>💡 Consejo:</strong> Los recordatorios son especialmente útiles durante experiencias psicoactivas.
              Hidratarse, descansar y alimentarse de forma regular reduce riesgos y mejora el bienestar.
            </p>
          </div>

          {/* Reminders List */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>Tus Recordatorios</h2>
            {reminders.map((reminder, idx) => (
              <div
                key={reminder.id}
                style={{ animation: `fadeIn 0.4s ease-out ${idx * 0.1}s both` }}
              >
                <ReminderCard
                  reminder={reminder}
                  onToggle={() => handleToggle(reminder.id)}
                  onIntervalChange={(minutes) => handleIntervalChange(reminder.id, minutes)}
                />
              </div>
            ))}
          </div>

          {/* Usage Tips */}
          <div
            className="border rounded-[var(--radius-md)] p-5 sm:p-6"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
          >
            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>Cómo usar los recordatorios</h3>
            <ul className="editorial space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
              <li>• <strong style={{ color: 'var(--text)' }}>Activá/desactivá:</strong> Usa el interruptor para habilitar o deshabilitar cada recordatorio</li>
              <li>• <strong style={{ color: 'var(--text)' }}>Ajustá intervalos:</strong> Hacé clic en "Cada X min" para cambiar la frecuencia</li>
              <li>• <strong style={{ color: 'var(--text)' }}>Notificaciones:</strong> Deben estar habilitadas para recibir alertas fuera de la app</li>
              <li>• <strong style={{ color: 'var(--text)' }}>Personalización:</strong> Ajustá los tiempos según tus necesidades individuales</li>
            </ul>
          </div>

          {/* Safety Note */}
          <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
            <p className="editorial text-xs text-center" style={{ color: 'var(--faint)' }}>
              Los recordatorios son orientativos. Escuchá tu cuerpo y ajustá según tus necesidades.
              Si te sentís mal, buscá asistencia médica inmediatamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
