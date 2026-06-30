import React, { useState, useEffect } from 'react';
import {
  getReminders,
  toggleReminder,
  updateReminderInterval,
  checkReminders,
  markReminderTriggered,
  type Reminder,
} from '../services/remindersService';
import { PageHeader, tint } from './ui';

const BellIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
);
const ClockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);

const getTypeIcon = (type: Reminder['type']) => ({ hydration: '💧', rest: '🛋️', nutrition: '🍎', break: '⏸️', custom: '📝' }[type] || '🔔');

const getTypeColor = (type: Reminder['type']): string => ({ hydration: 'var(--color-blue)', rest: 'var(--color-violet)', nutrition: 'var(--color-green)', break: 'var(--color-amber)', custom: 'var(--text-muted)' }[type] || 'var(--text-muted)');

const ReminderCard: React.FC<{ reminder: Reminder; onToggle: () => void; onIntervalChange: (minutes: number) => void }> = ({ reminder, onToggle, onIntervalChange }) => {
  const [customInterval, setCustomInterval] = useState(reminder.intervalMinutes.toString());
  const [isEditing, setIsEditing] = useState(false);
  const handleSave = () => { const n = parseInt(customInterval); if (n > 0 && n <= 1440) { onIntervalChange(n); setIsEditing(false); } };
  const getTimeUntilNext = (): string => {
    if (!reminder.enabled || !reminder.lastTriggered) return 'Desactivado';
    const diff = (reminder.lastTriggered + reminder.intervalMinutes * 60000) - Date.now();
    if (diff <= 0) return 'Listo para activar';
    const minutes = Math.floor(diff / 60000); const hours = Math.floor(minutes / 60);
    return hours > 0 ? `En ${hours}h ${minutes % 60}m` : `En ${minutes}m`;
  };

  const color = getTypeColor(reminder.type);
  return (
    <div className="p-4 transition-colors duration-200" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-1)'; }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-lg" style={{ background: tint(color), borderRadius: 'var(--radius-md)' }}>{getTypeIcon(reminder.type)}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-[15px] mb-0.5" style={{ color: 'var(--text-primary)' }}>{reminder.title}</h3>
            <p className="text-sm mb-2" style={{ color: 'var(--text-tertiary)' }}>{reminder.message}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <div className="flex items-center gap-1.5"><ClockIcon />
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <input type="number" value={customInterval} onChange={(e) => setCustomInterval(e.target.value)} min="1" max="1440" className="w-16 px-1.5 py-0.5" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '12px' }} />
                    <span>min</span>
                    <button onClick={handleSave} className="ml-1 px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-primary)', color: '#fff', fontSize: '12px' }}>✓</button>
                    <button onClick={() => { setCustomInterval(reminder.intervalMinutes.toString()); setIsEditing(false); }} className="px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-3)', color: 'var(--text-secondary)', fontSize: '12px' }}>✕</button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditing(true)} style={{ color: 'var(--accent-primary)' }}>Cada {reminder.intervalMinutes} min</button>
                )}
              </div>
              {reminder.enabled && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{getTimeUntilNext()}</div>}
            </div>
          </div>
        </div>
        <label className="flex-shrink-0 relative inline-block w-12 h-6 cursor-pointer">
          <input type="checkbox" checked={reminder.enabled} onChange={onToggle} className="sr-only peer" />
          <div style={{ background: reminder.enabled ? 'var(--accent-primary)' : 'var(--surface-3)', borderRadius: '999px', width: '48px', height: '24px', position: 'relative', transition: 'background var(--transition-fast)' }}>
            <div style={{ position: 'absolute', top: '2px', left: reminder.enabled ? '26px' : '2px', width: '20px', height: '20px', background: '#fff', borderRadius: '50%', transition: 'left var(--transition-fast)' }} />
          </div>
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
    if ('Notification' in window) { setNotificationPermission(Notification.permission); setNotificationsEnabled(Notification.permission === 'granted'); }
  }, []);

  useEffect(() => {
    if (!notificationsEnabled) return;
    const interval = setInterval(() => {
      const due = checkReminders();
      due.forEach(r => {
        if ('Notification' in window && Notification.permission === 'granted') new Notification(r.title, { body: r.message, icon: '/icon.png', badge: '/icon.png', tag: r.id });
        markReminderTriggered(r.id);
        setReminders(getReminders());
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [notificationsEnabled]);

  const handleToggle = (id: string) => { toggleReminder(id); setReminders(getReminders()); };
  const handleIntervalChange = (id: string, minutes: number) => { updateReminderInterval(id, minutes); setReminders(getReminders()); };
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) { alert('Tu navegador no soporta notificaciones.'); return; }
    try { const p = await Notification.requestPermission(); setNotificationPermission(p); setNotificationsEnabled(p === 'granted'); if (p === 'granted') new Notification('Recordatorios Activados', { body: '¡Listo! Recibirás recordatorios de cuidado.', icon: '/icon.png' }); } catch (e) { console.error('Error requesting notification permission:', e); }
  };

  const activeReminders = reminders.filter(r => r.enabled);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <PageHeader
        eyebrow="Cuidado"
        title="Recordatorios"
        description="Configurá recordatorios automáticos para hidratación, descanso y alimentación."
        accent="var(--color-amber)"
      />

      <div className="flex-1 overflow-y-auto px-5 sm:px-7 lg:px-8 py-6">
        <div className="max-w-4xl space-y-6">
          {notificationPermission !== 'granted' && (
            <div className="p-4 sm:p-5 flex items-start gap-3" style={{ background: 'var(--color-blue-subtle)', border: '1px solid var(--color-blue-medium)', borderRadius: 'var(--radius-lg)' }}>
              <div className="flex-shrink-0 text-xl">🔔</div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Activá las notificaciones</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-tertiary)' }}>Para recibir recordatorios cuando estés en otra pestaña o app, necesitamos tu permiso para enviar notificaciones.</p>
                <button onClick={requestNotificationPermission} className="px-3.5 py-2 text-xs font-semibold" style={{ background: 'var(--accent-primary)', color: '#fff', borderRadius: 'var(--radius-md)', border: 'none' }}>Permitir notificaciones</button>
              </div>
            </div>
          )}

          {/* Status + tip */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 flex items-center justify-between" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
              <div>
                <h3 className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Activos</h3>
                <p className="text-2xl font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{activeReminders.length}</p>
              </div>
              <div className="text-right">
                <h3 className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Notificaciones</h3>
                <p className="text-sm font-semibold mt-0.5" style={{ color: notificationsEnabled ? 'var(--color-green)' : 'var(--text-muted)' }}>{notificationsEnabled ? '✓ Habilitadas' : 'Deshabilitadas'}</p>
              </div>
            </div>
            <div className="p-4" style={{ background: 'var(--color-amber-subtle)', border: '1px solid var(--color-amber-medium)', borderRadius: 'var(--radius-lg)' }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--color-amber)' }}>Consejo:</strong> Los recordatorios son especialmente útiles durante experiencias psicoactivas — hidratarse, descansar y alimentarse reduce riesgos.
              </p>
            </div>
          </div>

          {/* Reminders grid */}
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>Tus recordatorios</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {reminders.map(r => <ReminderCard key={r.id} reminder={r} onToggle={() => handleToggle(r.id)} onIntervalChange={(m) => handleIntervalChange(r.id, m)} />)}
            </div>
          </div>

          <p className="text-xs leading-relaxed pt-2" style={{ color: 'var(--text-muted)' }}>
            Los recordatorios son orientativos. Escuchá tu cuerpo y ajustá según tus necesidades. Si te sentís mal, buscá asistencia médica inmediatamente.
          </p>
        </div>
      </div>
    </div>
  );
};
