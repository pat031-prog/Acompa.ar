import React, { useState, useEffect } from 'react';
import {
  getReminders,
  toggleReminder,
  updateReminderInterval,
  checkReminders,
  markReminderTriggered,
  type Reminder,
} from '../services/remindersService';
import { PageHeader, SectionLabel, IndexNum, RuledRow, InlineNote, Toggle, CircleThumb, Orb, DataList, tint } from './ui';

const BellIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" width={24} height={24}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
);

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
      <div className="flex items-center gap-4 sm:gap-5 py-7 transition-opacity" style={{ opacity: reminder.enabled ? 1 : 0.45 }}>
        <IndexNum size={22} color="var(--accent-weak)">{String(index + 1).padStart(2, '0')}</IndexNum>
        <CircleThumb size={44} color={tint(color)}>
          <span style={{ fontSize: '18px', lineHeight: 1 }}>{getTypeIcon(reminder.type)}</span>
        </CircleThumb>
        <div className="flex-1 min-w-0">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{reminder.title}</h3>
          <p className="text-sm mt-1 truncate" style={{ color: 'var(--text-tertiary)' }}>{reminder.message}</p>
          <div className="flex items-center gap-1.5 mt-2.5" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
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
        icon={<BellIcon />}
      />

      <div className="flex-1 overflow-y-auto px-5 sm:px-7 lg:px-8">
        <div className="max-w-3xl">
          {/* ── Status — focused hero: big orb'd count centered, spec list beside ── */}
          <div className="py-12 sm:py-14">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10 sm:gap-14">
              {/* The big ACTIVOS number, cradled in a coral orb halo */}
              <div className="relative flex flex-col items-center flex-shrink-0">
                <div aria-hidden style={{ position: 'absolute', top: '-14%', left: '50%', transform: 'translateX(-50%)', width: '180%', height: '128%', background: `radial-gradient(55% 60% at 50% 45%, ${tint('var(--accent-primary)', 'subtle')}, transparent 72%)`, pointerEvents: 'none' }} />
                <Orb
                  color="var(--accent-primary)"
                  size={148}
                  className="relative"
                  label={<IndexNum size={58} color="var(--accent-ink)">{String(activeReminders.length).padStart(2, '0')}</IndexNum>}
                />
                <div className="relative mt-4" style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Activos</div>
              </div>

              {/* Spec list — label:value data, no boxes */}
              <div className="w-full sm:flex-1 min-w-0 sm:pt-3">
                <DataList
                  items={[
                    { label: 'Recordatorios', value: String(reminders.length).padStart(2, '0') },
                    { label: 'Activos ahora', value: String(activeReminders.length).padStart(2, '0'), accent: 'var(--accent-primary)' },
                    { label: 'Notificaciones', value: notificationsEnabled ? 'Habilitadas' : 'Deshabilitadas', accent: notificationsEnabled ? 'var(--color-green)' : 'var(--text-tertiary)' },
                  ]}
                />
                {notificationPermission !== 'granted' && (
                  <button onClick={requestNotificationPermission} className="mt-6 transition-colors" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: 'var(--accent-primary)', background: 'transparent', border: '1px solid var(--accent-primary)', borderRadius: 'var(--radius-pill)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = tint('var(--accent-primary)', 'subtle'); }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    Permitir notificaciones
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Reminders — ruled list, generous rhythm ── */}
          <div className="pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="pt-8">
              <SectionLabel count={reminders.length} accent="var(--accent-primary)">Tus recordatorios</SectionLabel>
              <div className="mt-3">
                {reminders.map((r, i) => (
                  <ReminderRow key={r.id} reminder={r} index={i} first={i === 0} onToggle={() => handleToggle(r.id)} onIntervalChange={(m) => handleIntervalChange(r.id, m)} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Consejo — inline note, no box ── */}
          <div className="mt-14">
            <InlineNote label="Consejo">
              Los recordatorios son especialmente útiles durante experiencias psicoactivas — hidratarse, descansar y alimentarse de forma regular reduce riesgos y mejora el bienestar.
            </InlineNote>
          </div>

          <p className="text-xs leading-relaxed mt-12 pb-10" style={{ color: 'var(--text-muted)', maxWidth: '60ch' }}>
            Los recordatorios son orientativos. Escuchá tu cuerpo y ajustá según tus necesidades. Si te sentís mal, buscá asistencia médica inmediatamente.
          </p>
        </div>
      </div>
    </div>
  );
};
