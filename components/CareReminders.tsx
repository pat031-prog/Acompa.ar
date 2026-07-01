import React, { useState, useEffect } from 'react';
import {
  getReminders,
  toggleReminder,
  updateReminderInterval,
  checkReminders,
  markReminderTriggered,
  type Reminder,
} from '../services/remindersService';
import { Kicker, Display, MonoLabel, Toggle } from './ui';
import { Bell, Clock, Check, X } from 'lucide-react';

const getTypeIcon = (type: Reminder['type']) => ({ hydration: '💧', rest: '🛋️', nutrition: '🍎', break: '⏸️', custom: '📝' }[type] || '🔔');
const getTypeColor = (type: Reminder['type']): string => ({ hydration: 'var(--color-blue)', rest: 'var(--color-violet)', nutrition: 'var(--color-green)', break: 'var(--color-amber)', custom: 'var(--text-muted)' }[type] || 'var(--text-muted)');

const surfaceCard: React.CSSProperties = { background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '2rem' };

const ReminderCard: React.FC<{ reminder: Reminder; onToggle: () => void; onIntervalChange: (m: number) => void }> = ({ reminder, onToggle, onIntervalChange }) => {
  const [customInterval, setCustomInterval] = useState(reminder.intervalMinutes.toString());
  const [isEditing, setIsEditing] = useState(false);
  const handleSave = () => { const n = parseInt(customInterval); if (n > 0 && n <= 1440) { onIntervalChange(n); setIsEditing(false); } };
  const color = getTypeColor(reminder.type);

  return (
    <div className="flex items-center gap-4 sm:gap-5 p-5 sm:p-6 transition-opacity" style={{ ...surfaceCard, opacity: reminder.enabled ? 1 : 0.5 }}>
      <div className="flex items-center justify-center flex-shrink-0" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-primary)', border: `1px solid ${color}` }}>
        <span style={{ fontSize: '20px', lineHeight: 1 }}>{getTypeIcon(reminder.type)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{reminder.title}</h3>
        <p className="text-sm mt-1 truncate" style={{ color: 'var(--text-tertiary)' }}>{reminder.message}</p>
        <div className="flex items-center gap-1.5 mt-2.5" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
          <span style={{ color }}><Clock size={14} /></span>
          {isEditing ? (
            <span className="flex items-center gap-1.5">
              <input type="number" value={customInterval} onChange={(e) => setCustomInterval(e.target.value)} min="1" max="1440" className="w-14 px-2 py-0.5" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-medium)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '10px' }}>min</span>
              <button onClick={handleSave} style={{ color: 'var(--accent-primary)' }}><Check size={15} /></button>
              <button onClick={() => { setCustomInterval(reminder.intervalMinutes.toString()); setIsEditing(false); }} style={{ color: 'var(--text-muted)' }}><X size={15} /></button>
            </span>
          ) : (
            <button onClick={() => setIsEditing(true)} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>Cada {reminder.intervalMinutes} min</button>
          )}
        </div>
      </div>
      <Toggle checked={reminder.enabled} onChange={onToggle} />
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
    <div className="h-full w-full overflow-y-auto no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-2xl mx-auto w-full px-6 md:px-10 pt-10" style={{ paddingBottom: '120px' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Kicker className="mb-3">Cuidado</Kicker>
            <Display size="lg" upper>Recordatorios</Display>
          </div>
          <span style={{ color: 'var(--accent-primary)' }}><Bell size={24} /></span>
        </div>

        {/* Coral hero stat */}
        <div className="p-8 md:p-10 mb-8" style={{ background: 'var(--accent-primary)', color: 'var(--accent-ink)', borderRadius: '2.5rem' }}>
          <div className="flex items-end justify-between gap-6">
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(3.5rem, 10vw, 5rem)', lineHeight: 0.85, letterSpacing: '-0.04em' }}>{String(activeReminders.length).padStart(2, '0')}</div>
              <div className="mt-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7 }}>Activos de {String(reminders.length).padStart(2, '0')}</div>
            </div>
            <div className="text-right">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7 }}>Notificaciones</div>
              <div className="mt-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', textTransform: 'uppercase' }}>{notificationsEnabled ? 'On' : 'Off'}</div>
            </div>
          </div>
          {notificationPermission !== 'granted' && (
            <button onClick={requestNotificationPermission} className="mt-6 w-full flex items-center justify-center gap-2 transition-colors" style={{ padding: '14px', borderRadius: '999px', background: 'var(--bg-primary)', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              <Bell size={16} /> Permitir notificaciones
            </button>
          )}
        </div>

        {/* List */}
        <MonoLabel>Tus recordatorios · {reminders.length}</MonoLabel>
        <div className="flex flex-col gap-3 mt-4">
          {reminders.map((r) => (
            <ReminderCard key={r.id} reminder={r} onToggle={() => handleToggle(r.id)} onIntervalChange={(m) => handleIntervalChange(r.id, m)} />
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 p-6" style={{ borderLeft: '2px solid var(--accent-primary)' }}>
          <MonoLabel>Consejo</MonoLabel>
          <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>
            Durante experiencias psicoactivas, hidratarse, descansar y alimentarse de forma regular reduce riesgos y mejora el bienestar. Los recordatorios son orientativos: escuchá tu cuerpo y, si te sentís mal, buscá asistencia médica.
          </p>
        </div>
      </div>
    </div>
  );
};
