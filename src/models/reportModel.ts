// -----------------------------------------------------------
// 📑 FlowMind 2.0 — Raporlama Modeli
// Tipler + saf filtre/sıralama yardımcıları, ve gerçek SQLite sorgusuyla
// çalışan getReportResults(). "İptal Edilen Alt Görev" satırları hiçbir yerde
// SAKLANMAZ — CANLI olarak, alt görevin kendi durumu + ana görevin güncel
// durumu üzerinden (JOIN anında) sınıflandırılır (bkz. fonksiyon içi not).
// -----------------------------------------------------------

import { inArray } from 'drizzle-orm';

import { db } from '../db/client';
import { tasks } from '../db/schema';
import { isDateAfter, parseDateOnlyISO } from '../utils/dateUtils';

export type ReportCategory = 'short' | 'medium' | 'long';
export type ReportRecordType = 'main' | 'subtask';
export type ReportRecordStatus = 'completed' | 'cancelled';

export interface ReportRecord {
  id: string;
  taskId: number; // "Yeniden Aktifleştir" butonunun hedeflediği ana görev id'si
  title: string;
  category: ReportCategory;
  type: ReportRecordType;
  status: ReportRecordStatus;
  date: string; // "YYYY-MM-DD"
  // İptal edilmiş bir kayıt, kendi deadline'ı geçtikten SONRA mı iptal edildi?
  // (status='completed' kayıtlar için her zaman false — bkz. getReportResults)
  isOverdueCancel: boolean;
}

export type ReportCategoryFilter = 'all' | ReportCategory;
export type ReportTypeFilter = 'all' | ReportRecordType;
export type ReportStatusFilter = 'all' | ReportRecordStatus;
export type ReportDateRangeFilter = 'all' | 'week' | 'month' | 'year';
export type ReportSortKey = 'category' | 'type' | 'status' | 'date';

export interface ReportFilters {
  category: ReportCategoryFilter;
  type: ReportTypeFilter;
  status: ReportStatusFilter;
  dateRange: ReportDateRangeFilter;
}

export const DEFAULT_REPORT_FILTERS: ReportFilters = {
  category: 'all',
  type: 'all',
  status: 'all',
  dateRange: 'all',
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function matchesDateRange(dateISO: string, range: ReportDateRangeFilter): boolean {
  if (range === 'all') return true;

  const recordDate = parseDateOnlyISO(dateISO);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = (today.getTime() - recordDate.getTime()) / MS_PER_DAY;
  if (diffDays < 0) return false;

  if (range === 'week') return diffDays <= 7;
  if (range === 'month') return diffDays <= 31;
  return diffDays <= 366; // 'year'
}

const CATEGORY_ORDER: Record<ReportCategory, number> = { short: 0, medium: 1, long: 2 };
const TYPE_ORDER: Record<ReportRecordType, number> = { main: 0, subtask: 1 };
const STATUS_ORDER: Record<ReportRecordStatus, number> = { completed: 0, cancelled: 1 };

function sortRecords(records: ReportRecord[], sortKey: ReportSortKey): ReportRecord[] {
  const sorted = [...records];

  sorted.sort((a, b) => {
    switch (sortKey) {
      case 'category':
        return CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category];
      case 'type':
        return TYPE_ORDER[a.type] - TYPE_ORDER[b.type];
      case 'status':
        return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      case 'date':
      default:
        return parseDateOnlyISO(b.date).getTime() - parseDateOnlyISO(a.date).getTime();
    }
  });

  return sorted;
}

// 🔎 İzole sorgu fonksiyonu — View bu fonksiyonu çağırır, sonuçların
// gerçek SQLite tablolarından geldiğini bilmesine gerek yoktur.
export async function getReportResults(
  filters: ReportFilters,
  sortKey: ReportSortKey,
): Promise<ReportRecord[]> {
  // 🔸 Ana görev kayıtları — sadece tamamlanmış/iptal edilmiş olanlar raporlanır
  const reportableTasks = await db.query.tasks.findMany({
    where: inArray(tasks.status, ['completed', 'cancelled']),
  });

  const mainRecords: ReportRecord[] = reportableTasks.map(t => {
    const isCancelled = t.status === 'cancelled';
    const date = (isCancelled ? t.cancelledAt : t.completedAt) ?? t.createdAt.slice(0, 10);

    return {
      id: `task-${t.id}`,
      taskId: t.id,
      title: t.title,
      category: t.category,
      type: 'main',
      status: t.status as ReportRecordStatus,
      date,
      isOverdueCancel: isCancelled && !!t.deadline && isDateAfter(date, t.deadline),
    };
  });

  // 🔸 Alt görev kayıtları — kendi durumu + ana görevin GÜNCEL durumu birlikte
  // değerlendirilir. Bir alt görev şu iki durumdan birinde raporlanabilir:
  //   1) kendisi tamamlanmışsa ('completed') — ana görevin durumundan bağımsız
  //   2) tamamlanmamışsa AMA ana görevi iptal edilmişse — "iptal edilmiş"
  //      sayılır. Bu SAKLANAN bir değer değil, sorgu anında (canlı) türetilir;
  //      ana görev yeniden aktifleştirilirse bu satır otomatik kaybolur.
  const allSubtasks = await db.query.subtasks.findMany({ with: { task: true } });

  const subtaskRecords: ReportRecord[] = allSubtasks
    .filter(s => s.status === 'completed' || s.task.status === 'cancelled')
    .map(s => {
      const isCompleted = s.status === 'completed';
      const date = (isCompleted ? s.completedAt : s.task.cancelledAt) ?? s.createdAt.slice(0, 10);

      return {
        id: `subtask-${s.id}`,
        taskId: s.taskId,
        title: s.title,
        category: s.task.category,
        type: 'subtask' as const,
        status: (isCompleted ? 'completed' : 'cancelled') as ReportRecordStatus,
        date,
        // Alt görevin KENDİ deadline'ı esas alınır (ana görevinki değil).
        isOverdueCancel: !isCompleted && !!s.deadline && isDateAfter(date, s.deadline),
      };
    });

  const allRecords = [...mainRecords, ...subtaskRecords];

  const filtered = allRecords.filter(record => {
    if (filters.category !== 'all' && record.category !== filters.category) return false;
    if (filters.type !== 'all' && record.type !== filters.type) return false;
    if (filters.status !== 'all' && record.status !== filters.status) return false;
    if (!matchesDateRange(record.date, filters.dateRange)) return false;
    return true;
  });

  return sortRecords(filtered, sortKey);
}
