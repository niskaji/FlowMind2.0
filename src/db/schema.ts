// -----------------------------------------------------------
// 🗄️ FlowMind 2.0 — Drizzle şeması (SQLite)
// Şema değiştiğinde: `npm run db:generate` çalıştır — mevcut veri kaybolmaz.
// -----------------------------------------------------------

import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable(
  'tasks',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    category: text('category', { enum: ['short', 'medium', 'long'] }).notNull(),
    status: text('status', { enum: ['pending', 'completed', 'cancelled'] })
      .notNull()
      .default('pending'),
    deadline: text('deadline'), // "YYYY-MM-DD"
    completedAt: text('completedAt'), // "YYYY-MM-DD" — Tamamla/Yeniden Aktifleştir ile set/clear
    cancelledAt: text('cancelledAt'), // "YYYY-MM-DD" — İptal Et/Yeniden Aktifleştir ile set/clear
    createdAt: text('createdAt')
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text('updatedAt')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  table => ({
    categoryIdx: index('tasks_category_idx').on(table.category),
    statusIdx: index('tasks_status_idx').on(table.status),
  }),
);

export const subtasks = sqliteTable(
  'subtasks',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    taskId: integer('taskId')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    // Alt görevler tek başına iptal edilemez (trash = gerçek/kalıcı silme),
    // bu yüzden sadece 2 durum yeterli — bkz. plan: "İptal Edilen Alt Görevler"
    // canlı JOIN sınıflandırmasıyla (bkz. taskRepository.ts) hesaplanır.
    status: text('status', { enum: ['pending', 'completed'] })
      .notNull()
      .default('pending'),
    deadline: text('deadline'),
    completedAt: text('completedAt'),
    createdAt: text('createdAt')
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text('updatedAt')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  table => ({
    taskIdIdx: index('subtasks_taskId_idx').on(table.taskId),
  }),
);

export const tasksRelations = relations(tasks, ({ many }) => ({
  subtasks: many(subtasks),
}));

export const subtasksRelations = relations(subtasks, ({ one }) => ({
  task: one(tasks, { fields: [subtasks.taskId], references: [tasks.id] }),
}));
