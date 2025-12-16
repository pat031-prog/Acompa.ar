/**
 * Reminders Service
 * Manages care reminders using localStorage
 */

export interface Reminder {
  id: string;
  type: 'hydration' | 'rest' | 'nutrition' | 'break' | 'custom';
  title: string;
  message: string;
  intervalMinutes: number;
  enabled: boolean;
  lastTriggered?: number;
}

const REMINDERS_KEY = 'acompanar_reminders';
const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: 'hydration',
    type: 'hydration',
    title: 'Hidratación',
    message: '💧 Recordá tomar agua o bebidas isotónicas',
    intervalMinutes: 30,
    enabled: false,
  },
  {
    id: 'rest',
    type: 'rest',
    title: 'Descanso',
    message: '🛋️ Tomá un descanso, respirá profundo',
    intervalMinutes: 60,
    enabled: false,
  },
  {
    id: 'nutrition',
    type: 'nutrition',
    title: 'Alimentación',
    message: '🍎 Considerá comer algo ligero',
    intervalMinutes: 120,
    enabled: false,
  },
];

export const getReminders = (): Reminder[] => {
  try {
    const stored = localStorage.getItem(REMINDERS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_REMINDERS;
  } catch (error) {
    console.error('Error reading reminders:', error);
    return DEFAULT_REMINDERS;
  }
};

export const saveReminders = (reminders: Reminder[]): void => {
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  } catch (error) {
    console.error('Error saving reminders:', error);
  }
};

export const toggleReminder = (id: string): void => {
  const reminders = getReminders();
  const updated = reminders.map(r =>
    r.id === id ? { ...r, enabled: !r.enabled, lastTriggered: Date.now() } : r
  );
  saveReminders(updated);
};

export const updateReminderInterval = (id: string, intervalMinutes: number): void => {
  const reminders = getReminders();
  const updated = reminders.map(r =>
    r.id === id ? { ...r, intervalMinutes } : r
  );
  saveReminders(updated);
};

export const markReminderTriggered = (id: string): void => {
  const reminders = getReminders();
  const updated = reminders.map(r =>
    r.id === id ? { ...r, lastTriggered: Date.now() } : r
  );
  saveReminders(updated);
};

export const checkReminders = (): Reminder[] => {
  const reminders = getReminders();
  const now = Date.now();
  const due: Reminder[] = [];

  reminders.forEach(reminder => {
    if (!reminder.enabled) return;

    const lastTime = reminder.lastTriggered || 0;
    const intervalMs = reminder.intervalMinutes * 60 * 1000;

    if (now - lastTime >= intervalMs) {
      due.push(reminder);
    }
  });

  return due;
};
