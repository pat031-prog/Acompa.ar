import React, { useState, useEffect } from 'react';
import {
  getReminders,
  toggleReminder,
  updateReminderInterval,
  checkReminders,
  markReminderTriggered,
  type Reminder,
} from '../services/remindersService';
import { PageHeader, SectionLabel, IndexNum, RuledRow, InlineNote, Toggle, CircleThumb, Display, tint } from './ui';

const ClockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);

const getTypeIcon = (type: Reminder['type']) => ({ hydration: '💧', rest: '🛋️', nutrition: '🍎', break: '⏸️', custom: '📝' }[type] || '🔔');

const getTypeColor = (type: Reminder['type']): string => ({ hydration: 'var(--color-blue)', rest: 'var(--color-violet)', nutrition: 'var(--color-green)', break: 'var(--color-amber)', custom: 'var(--text-muted)' }[type] || 'var(--text-muted)');

const ReminderRow: React.FC<{ reminder: Reminder; index: number; first: boolean; onToggle: () => void; onIntervalChange: (minutes: number) => void }> = ({ reminder, index, first, onToggle, onIntervalChange }) => {
  const [customInterval, setCustomInterval] = useState(reminder.intervalMinutes.toString());
  const [isEditing, setIsEditing] = useState(false);
  const handleSave = () => { const n = parseInt(customInterval); if (n > 0 && n <= 1440) { onIntervalChange(n); setIsEditing(false); } };

  const color = getTypeColor(reminder.type);
  return (
    <RuledRow first={first}>
      <div className="flex items-center gap-4 sm:gap-5 py-5 transition-opacity" style={{ opacity: reminder.enabled ? 1 : 0.5 }}>
        <IndexNum size={22} color="var(--accent-weak)">{String(index + 1).padStart(2, '0')}</IndexNum>
        <CircleThumb size={40} color={tint(color)}>
          <span style={{ fontSize: '17px', lineHeight: 1 }}>{getTypeIcon(reminder.type)}</span>
        </CircleThumb>
        <div className="flex-1 min-w-0">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{reminder.title}</h3>
          <p className="text-sm mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>{reminder.message}</p>
          <div className="flex items-center gap-1.5 mt-2" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            <span style={{ color }}><ClockIcon /></span>
            {isEditing ? (
              <span className="flex items-center gap-1.5">
                <input type="number" value={customInterval} onChange={(e) => setCustomInterval(e.target.value)} min="1" max="1440" className="w-14 px-2 py-0.5" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '12px' }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '10px' }}>min</span>
                <button onClick={handleSave} style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>✓</button>
                <button onClick={() => { setCustomInterval(reminder.intervalMinutes.toString()); setIsEditing(false); }} style={{ color: 'var(--text-muted)' }}>✕</button>
              </span>
            ) : (
              <button onClick={() => setIsEditing(true)} className="transition-colors" style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>Cada {reminder.intervalMinutes} min</button>
            )}
          </div>
        </div>
        <Toggle checked={reminder.enabled} onChange={onToggle} />
      </div>
    </RuledRow>
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
        accent="var(--accent-primary)"
      />

      <div className="flex-1 overflow-y-auto px-5 sm:px-7 lg:px-8">
        <div className="max-w-3xl">
          {/* Status strip — a ruled row, not a box */}
          <div className="flex items-end justify-between gap-6 py-7" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="flex items-end gap-10">
              <div>
                <IndexNum size={44} color="var(--accent-primary)">{String(activeReminders.length).padStart(2, '0')}</IndexNum>
                <div className="mt-2" style={{ fontFamily: 'var(--font-heading)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Activos</div>
              </div>
              <div className="pb-1.5">
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: notificationsEnabled ? 'var(--color-green)' : 'var(--text-tertiary)' }}>{notificationsEnabled ? 'Habilitadas' : 'Deshabilitadas'}</div>
                <div className="mt-2" style={{ fontFamily: 'var(--font-heading)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Notificaciones</div>
              </div>
            </div>
            {notificationPermission !== 'granted' && (
              <button onClick={requestNotificationPermission} className="flex-shrink-0 transition-colors" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: 'var(--accent-primary)', background: 'transparent', border: '1px solid var(--accent-primary)', borderRadius: 'var(--radius-pill)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = tint('var(--accent-primary)', 'subtle'); }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                Permitir notificaciones
              </button>
            )}
          </div>

          {/* Reminders — ruled list */}
          <div className="pt-9">
            <SectionLabel count={reminders.length} accent="var(--accent-primary)">Tus recordatorios</SectionLabel>
            <div className="mt-2">
              {reminders.map((r, i) => (
                <ReminderRow key={r.id} reminder={r} index={i} first={i === 0} onToggle={() => handleToggle(r.id)} onIntervalChange={(m) => handleIntervalChange(r.id, m)} />
              ))}
            </div>
          </div>

          {/* Consejo — inline note, no box */}
          <div className="mt-11">
            <InlineNote label="Consejo">
              Los recordatorios son especialmente útiles durante experiencias psicoactivas — hidratarse, descansar y alimentarse de forma regular reduce riesgos y mejora el bienestar.
            </InlineNote>
          </div>

          <p className="text-xs leading-relaxed mt-10 pb-8" style={{ color: 'var(--text-muted)', maxWidth: '60ch' }}>
            Los recordatorios son orientativos. Escuchá tu cuerpo y ajustá según tus necesidades. Si te sentís mal, buscá asistencia médica inmediatamente.
          </p>
        </div>
      </div>
    </div>
  );
};
