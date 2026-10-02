// -----------------------------------------------------------
// 🗄️ FlowMind 2.0 — Task/Subtask repository (SQLite/Drizzle)
// TaskContext'in tek veri erişim katmanı. Tüm mutasyonlar burada;
// UI katmanı sadece bu fonksiyonları çağırır, SQL bilmez.
// -----------------------------------------------------------

import { eq } from 'drizzle-orm';

import type { Task } from '../models/taskModel';
import { toDateOnlyISO } from '../utils/dateUtils';

import { db } from './client';
import { subtasks, tasks } from './schema';

// Diğer tüm tarih alanları (deadline vb.) "YYYY-MM-DD" formatında tutulduğu
// için completedAt/cancelledAt da aynı formatla tutulur (bkz. utils/dateUtils.ts).
function today(): string {
  return toDateOnlyISO(new Date());
}

// 🔎 Tüm ana görevleri, alt görevleriyle birlikte döndürür (context'in
// aynaladığı tam anlık görüntü — status'e göre filtre yapılmaz, filtreleme
// View katmanında yapılır).
export async function getAllTasksWithSubtasks(): Promise<Task[]> {
  const rows = await db.query.tasks.findMany({ with: { subtasks: true } });
  return rows as Task[];
}

export async function createTask(input: {
  title: string;
  category: Task['category'];
  deadline?: string;
}): Promise<void> {
  await db.insert(tasks).values({
    title: input.title,
    category: input.category,
    deadline: input.deadline,
  });
}

// ✏️ Ana görev başlığı/son tarihi düzenleme (checkbox/iptal/reaktivasyon bu fonksiyonu kullanmaz)
export async function updateTask(input: { id: number; title: string; deadline?: string }): Promise<void> {
  await db
    .update(tasks)
    .set({ title: input.title, deadline: input.deadline ?? null, updatedAt: today() })
    .where(eq(tasks.id, input.id));
}

// ✅ "Tamamla" checkbox'ı — iki yönlü toggle (yalnızca completedAt'e dokunur)
export async function toggleTaskCompletion(id: number): Promise<void> {
  const [current] = await db.select().from(tasks).where(eq(tasks.id, id));
  if (!current) return;

  const nextStatus = current.status === 'completed' ? 'pending' : 'completed';
  await db
    .update(tasks)
    .set({
      status: nextStatus,
      completedAt: nextStatus === 'completed' ? today() : null,
      updatedAt: today(),
    })
    .where(eq(tasks.id, id));
}

// 🗑️ "İptal Et" — SOFT delete: kayıt veritabanında kalır, sadece durumu değişir
export async function cancelTask(id: number): Promise<void> {
  await db
    .update(tasks)
    .set({ status: 'cancelled', cancelledAt: today(), updatedAt: today() })
    .where(eq(tasks.id, id));
}

// ♻️ "Yeniden Aktifleştir" — alt görevlere HİÇBİR ŞEKİLDE dokunulmaz (cascade yok)
export async function reactivateTask(id: number): Promise<void> {
  await db
    .update(tasks)
    .set({ status: 'pending', completedAt: null, cancelledAt: null, updatedAt: today() })
    .where(eq(tasks.id, id));
}

export async function addSubtask(parentId: number, title: string): Promise<void> {
  await db.insert(subtasks).values({ taskId: parentId, title });
}

export async function toggleSubtaskCompletion(subtaskId: number): Promise<void> {
  const [current] = await db.select().from(subtasks).where(eq(subtasks.id, subtaskId));
  if (!current) return;

  const nextStatus = current.status === 'completed' ? 'pending' : 'completed';
  await db
    .update(subtasks)
    .set({
      status: nextStatus,
      completedAt: nextStatus === 'completed' ? today() : null,
      updatedAt: today(),
    })
    .where(eq(subtasks.id, subtaskId));
}

export async function editSubtask(input: {
  subtaskId: number;
  title: string;
  deadline?: string;
}): Promise<void> {
  await db
    .update(subtasks)
    .set({ title: input.title, deadline: input.deadline ?? null, updatedAt: today() })
    .where(eq(subtasks.id, input.subtaskId));
}

// 🔥 Gerçek/kalıcı silme — tek istisna: alt görev çöp kutusu (iz bırakmaz)
export async function hardDeleteSubtask(subtaskId: number): Promise<void> {
  await db.delete(subtasks).where(eq(subtasks.id, subtaskId));
}
