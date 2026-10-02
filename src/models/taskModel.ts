// ✅ src/models/taskModel.ts
// FlowMind MVVM yapısına uygun, TypeScript model dosyası

// --------------------------------------------------
// 🔹 Görev Durum Tipleri
// --------------------------------------------------
// Ana görev: 3 durum — normal koşullarda veritabanından fiziksel olarak
// silinmez, "İptal Et"/"Tamamla" birer durum değişikliğidir (soft-delete).
export type TaskStatus = 'pending' | 'completed' | 'cancelled';

// Alt görev: sadece 2 durum — tek başına "iptal edilemez", çöp kutusu
// gerçek/kalıcı silmedir (hard delete). "İptal edilen alt görev" sayısı,
// ana görevi iptal edilmiş alt görevler üzerinden CANLI türetilir
// (bkz. src/db/taskRepository.ts ve AnalysisScreen.tsx).
export type SubtaskStatus = 'pending' | 'completed';

// --------------------------------------------------
// 🔹 Alt Görev Modeli
// --------------------------------------------------
export interface Subtask {
  id: number;
  title: string;
  status: SubtaskStatus;
  // 🗓️ Hedef tarih (deadline) — "YYYY-MM-DD" formatında, opsiyonel
  deadline?: string | null;
}

// --------------------------------------------------
// 🔹 Ana Görev Modeli
// --------------------------------------------------
export interface Task {
  id: number;
  title: string;
  category: 'short' | 'medium' | 'long';
  status: TaskStatus;
  subtasks?: Subtask[];
  // 🗓️ Hedef tarih (deadline) — "YYYY-MM-DD" formatında, opsiyonel
  deadline?: string | null;
}

// --------------------------------------------------
// 🔹 Global State Modeli
// --------------------------------------------------
export interface TaskState {
  tasks: Task[];
}

// --------------------------------------------------
// 🔹 Reducer Eylemleri
// --------------------------------------------------
export type TaskAction =
  | { type: 'ADD_TASK'; payload: { title: string; category: Task['category']; deadline?: string } }
  | { type: 'REMOVE_TASK'; payload: number } // soft-cancel ("İptal Et")
  | { type: 'TOGGLE_TASK'; payload: number } // "Tamamla" (iki yönlü toggle)
  | { type: 'UPDATE_TASK'; payload: Task } // başlık/son tarih düzenleme
  | { type: 'REACTIVATE_TASK'; payload: number } // "Yeniden Aktifleştir"
  | { type: 'SYNC_TASKS'; payload: TaskState }
  | { type: 'ADD_SUBTASK'; payload: { parentId: number; title: string } }
  | { type: 'TOGGLE_SUBTASK'; payload: { parentId: number; subtaskId: number } }
  | { type: 'REMOVE_SUBTASK'; payload: { parentId: number; subtaskId: number } } // hard delete
  | {
      type: 'EDIT_SUBTASK';
      payload: { parentId: number; subtaskId: number; title: string; deadline?: string };
    };

// --------------------------------------------------
// 🔹 Context Tipi
// --------------------------------------------------
export interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
}
