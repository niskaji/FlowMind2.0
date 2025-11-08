// ✅ src/models/taskModel.ts
// FlowMind MVVM yapısına uygun, TypeScript model dosyası

// --------------------------------------------------
// 🔹 Görev Durum Tipleri
// --------------------------------------------------
export type TaskStatus = 'pending' | 'completed' | 'cancelled' | 'incomplete' | 'partial';

// --------------------------------------------------
// 🔹 Alt Görev Modeli
// --------------------------------------------------
export interface Subtask {
  id: string;
  title: string;
  status: TaskStatus;
}

// --------------------------------------------------
// 🔹 Ana Görev Modeli
// --------------------------------------------------
export interface Task {
  id: string;
  title: string;
  category: 'short' | 'medium' | 'long';
  status: TaskStatus;
  subtasks?: Subtask[];
}

// --------------------------------------------------
// 🔹 Global State Modeli
// --------------------------------------------------
export interface TaskState {
  tasks: Task[];
  removedTasks: Task[];
}

// --------------------------------------------------
// 🔹 Reducer Eylemleri
// --------------------------------------------------
export type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'REMOVE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'RESTORE_TASK'; payload: string }
  | { type: 'SYNC_TASKS'; payload: TaskState }
  | { type: 'CLEAR_ALL' }
  | { type: 'ADD_SUBTASK'; payload: { parentId: string; title: string } }
  | { type: 'TOGGLE_SUBTASK'; payload: { parentId: string; subtaskId: string } }
  | { type: 'REMOVE_SUBTASK'; payload: { parentId: string; subtaskId: string } }
  | { type: 'EDIT_SUBTASK'; payload: { parentId: string; subtaskId: string; title: string } };

// --------------------------------------------------
// 🔹 Context Tipi
// --------------------------------------------------
export interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
}

// --------------------------------------------------
// 🔹 Başlangıç Mock Verileri (Analiz ekranı için yeterli)
// --------------------------------------------------
export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Yeni Özellik Geliştirme',
    category: 'short',
    status: 'pending',
    subtasks: [
      { id: '1-1', title: 'Arayüz Tasarımı', status: 'completed' },
      { id: '1-2', title: 'Kodlama', status: 'pending' },
      { id: '1-3', title: 'Test Süreci', status: 'pending' },
    ],
  },
  {
    id: '2',
    title: 'Analiz Raporu Hazırlığı',
    category: 'medium',
    status: 'completed',
    subtasks: [
      { id: '2-1', title: 'Veri Toplama', status: 'completed' },
      { id: '2-2', title: 'Grafik Oluşturma', status: 'completed' },
    ],
  },
  {
    id: '3',
    title: 'Proje Revizyon Planı',
    category: 'long',
    status: 'pending',
    subtasks: [
      { id: '3-1', title: 'Toplantı Planı', status: 'pending' },
      { id: '3-2', title: 'Revizyon Taslağı', status: 'pending' },
      { id: '3-3', title: 'Onay Süreci', status: 'pending' },
    ],
  },
];
