import React, { useState, useEffect } from 'react';
import {
  getReminders,
  toggleReminder,
  updateReminderInterval,
  checkReminders,
  markReminderTriggered,
  type Reminder,
} from '../services/remindersService';
import { Callout, Chip } from './ui/Section';

const ClockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
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

const getTimeUntilNext = (reminder: Reminder): string => {
  if (!reminder.enabled || !reminder.lastTriggered) return 'Inactivo';

  const now = Date.now();
  const nextTrigger = reminder.lastTriggered + (reminder.intervalMinutes * 60 * 1000);
  const diff = nextTrigger - now;

  if (diff <= 0) return 'Ahora';

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
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
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(reminder.title, {
            body: reminder.message,
            icon: '/icon.png',
            badge: '/icon.png',
            tag: reminder.id,
          });
        }
        markReminderTriggered(reminder.id);
        setReminders(getReminders());
      });
    }, 30000);

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
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full p-6 sm:p-8 lg:p-10 space-y-8">
        {/* Header */}
        <div>
          <h1
            className="text-2xl sm:text-3xl font-semibold"
            style={{
              color: 'var(--text)',
              lineHeight: 'var(--line-height-heading)'
            }}
          >
            Recordatorios de Cuidado
          </h1>
          <p className="editorial text-sm mt-2" style={{ color: 'var(--muted)' }}>
            Configurá notificaciones para hidratación, descanso y alimentación
          </p>
        </div>

        {/* Notification Permission Banner */}
        {notificationPermission !== 'granted' && (
          <Callout variant="info" icon="🔔">
            <strong>Activá las notificaciones</strong> para recibir recordatorios cuando estés en otra pestaña o app.
            <button
              onClick={requestNotificationPermission}
              className="mt-3 px-4 py-2 text-white rounded-[var(--radius-sm)] text-sm font-medium inline-block"
              style={{
                background: 'var(--accent)',
                transition: `all var(--t-fast) var(--ease)`
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Permitir Notificaciones
            </button>
          </Callout>
        )}

        {/* Preset Quick Toggles */}
        <div>
          <h2
            className="text-sm font-semibold mb-3"
            style={{ color: 'var(--text)' }}
          >
            Activar / Desactivar
          </h2>
          <div className="flex flex-wrap gap-2">
            {reminders.map((reminder) => (
              <button
                key={reminder.id}
                onClick={() => handleToggle(reminder.id)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium active:scale-95"
                style={{
                  background: reminder.enabled ? 'var(--surface-3)' : 'var(--surface-1)',
                  borderColor: reminder.enabled ? 'var(--accent)' : 'var(--border)',
                  color: reminder.enabled ? 'var(--text)' : 'var(--muted)',
                  transition: `all var(--t-fast) var(--ease)`
                }}
              >
                <span>{getTypeIcon(reminder.type)}</span>
                <span>{reminder.title}</span>
                <span className="text-xs opacity-75">
                  {reminder.intervalMinutes}min
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Schedule */}
        {activeReminders.length > 0 && (
          <div>
            <h2
              className="text-sm font-semibold mb-3"
              style={{ color: 'var(--text)' }}
            >
              Próximos ({activeReminders.length})
            </h2>
            <div className="space-y-3">
              {activeReminders.map((reminder, idx) => (
                <div
                  key={reminder.id}
                  className="flex items-center gap-4 p-4 rounded-lg border-l-2"
                  style={{
                    background: 'var(--surface-1)',
                    borderColor: 'var(--border)',
                    borderLeftColor: 'var(--accent)',
                    animation: `fadeIn 0.2s ease-out ${idx * 0.05}s both`
                  }}
                >
                  <div className="flex-shrink-0 text-2xl">
                    {getTypeIcon(reminder.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: 'var(--text)' }}
                    >
                      {reminder.title}
                    </h3>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: 'var(--muted)' }}
                    >
                      Cada {reminder.intervalMinutes} min
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-2 text-xs font-medium"
                    style={{ color: 'var(--accent)' }}
                  >
                    <ClockIcon />
                    <span>{getTimeUntilNext(reminder)}</span>
                  </div>
                  <button
                    onClick={() => handleToggle(reminder.id)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs rounded-md active:scale-95"
                    style={{
                      background: 'var(--surface-2)',
                      color: 'var(--muted)',
                      transition: `all var(--t-fast) var(--ease)`
                    }}
                  >
                    Pausar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Care Rationale */}
        <Callout variant="neutral" icon="💡">
          <p className="editorial text-sm" style={{ color: 'var(--muted)' }}>
            <strong style={{ color: 'var(--text)' }}>Por qué son importantes:</strong> Los recordatorios regulares de hidratación, descanso y alimentación son fundamentales durante experiencias psicoactivas. Reducen riesgos y mejoran el bienestar general.
          </p>
        </Callout>

        {/* Quick tip */}
        <div
          className="text-center p-4 rounded-lg"
          style={{
            background: 'var(--surface-1)',
            borderTop: `1px solid var(--border)`
          }}
        >
          <p className="editorial text-xs" style={{ color: 'var(--faint)' }}>
            Los recordatorios son orientativos. Escuchá tu cuerpo y ajustá según tus necesidades.
            Si te sentís mal, buscá asistencia médica inmediatamente.
          </p>
        </div>
      </div>
    </div>
  );
};
