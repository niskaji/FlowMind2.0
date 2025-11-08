// -----------------------------------------------------------
// 🧠 FlowMind 2.0 — TaskContext
// Global görev durum yönetimi (Context + Reducer)
// -----------------------------------------------------------

import { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';

import { Task, TaskAction, TaskContextType, TaskState } from '../models/taskModel';

// 🧩 1️⃣ Başlangıç state
const initialState: TaskState = {
  tasks: [],
  removedTasks: [],
};

// 🧩 2️⃣ Context oluştur
const TaskContext = createContext<TaskContextType>({
  state: initialState,
  dispatch: () => undefined,
});

// 🧩 3️⃣ Mock (örnek) veriler — ZENGİNLEŞTİRİLMİŞ
const devMockTasks: Task[] = [
  {
    id: '1',
    title: 'UI Revizyonu Tamamla',
    category: 'short',
    status: 'completed',
    subtasks: [
      { id: '11', title: 'Yeni ikon seti ekle', status: 'completed' },
      { id: '12', title: 'Buton kenar boşluklarını düzenle', status: 'pending' },
    ],
  },
  {
    id: '2',
    title: 'FlowMind Analiz Ekranını Test Et',
    category: 'medium',
    status: 'completed',
    subtasks: [
      { id: '21', title: 'Pie Chart verilerini bağla', status: 'completed' },
      { id: '22', title: 'Tamamlanma oranını doğrula', status: 'completed' },
    ],
  },
  {
    id: '3',
    title: 'Kullanıcı Geri Bildirimleri Raporu',
    category: 'long',
    status: 'pending',
    subtasks: [
      { id: '31', title: 'Geri bildirimleri topla', status: 'completed' },
      { id: '32', title: 'Kategorilere ayır', status: 'pending' },
      { id: '33', title: 'Sonuç raporunu oluştur', status: 'pending' },
    ],
  },
  {
    id: '4',
    title: 'Performans İyileştirme',
    category: 'short',
    status: 'pending',
    subtasks: [
      { id: '41', title: 'Memoization noktalarını ekle', status: 'completed' },
      { id: '42', title: 'Re-render analizleri', status: 'pending' },
      { id: '43', title: 'List virtualization kontrolü', status: 'pending' },
      { id: '44', title: 'Batch update testi', status: 'completed' },
    ],
  },
  {
    id: '5',
    title: 'Dokümantasyon Gözden Geçirme',
    category: 'medium',
    status: 'completed',
    subtasks: [],
  },
  {
    id: '6',
    title: 'Bildirim Sistemi Tasarımı',
    category: 'long',
    status: 'pending',
    subtasks: [
      { id: '61', title: 'Push payload formatı', status: 'completed' },
      { id: '62', title: 'Retry stratejisi', status: 'completed' },
      { id: '63', title: 'Sessiz saatler', status: 'pending' },
    ],
  },
];

const devMockRemoved: Task[] = [
  {
    id: '1001',
    title: 'Eski sürüm prototipini kaldır',
    category: 'short',
    status: 'cancelled',
    subtasks: [],
  },
];

// 🧩 4️⃣ Reducer — tüm eylemlerle
function reducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'REMOVE_TASK': {
      const removedTask = state.tasks.find(t => t.id === action.payload);
      if (!removedTask) return state;
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
        removedTasks: [...state.removedTasks, removedTask],
      };
    }

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload
            ? {
                ...t,
                status: t.status === 'completed' ? 'pending' : 'completed',
              }
            : t,
        ),
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => (t.id === action.payload.id ? action.payload : t)),
      };

    case 'ADD_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.parentId
            ? {
                ...t,
                subtasks: [
                  ...(t.subtasks ?? []),
                  {
                    id: Date.now().toString(),
                    title: action.payload.title,
                    status: 'pending',
                  },
                ],
              }
            : t,
        ),
      };

    case 'TOGGLE_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.parentId
            ? {
                ...t,
                subtasks: t.subtasks?.map(s =>
                  s.id === action.payload.subtaskId
                    ? {
                        ...s,
                        status: s.status === 'completed' ? 'pending' : 'completed',
                      }
                    : s,
                ),
              }
            : t,
        ),
      };

    case 'REMOVE_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.parentId
            ? {
                ...t,
                subtasks: t.subtasks?.filter(s => s.id !== action.payload.subtaskId),
              }
            : t,
        ),
      };

    case 'EDIT_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.parentId
            ? {
                ...t,
                subtasks: t.subtasks?.map(s =>
                  s.id === action.payload.subtaskId ? { ...s, title: action.payload.title } : s,
                ),
              }
            : t,
        ),
      };

    case 'SYNC_TASKS':
      return {
        ...state,
        tasks: action.payload.tasks ?? [],
        removedTasks: action.payload.removedTasks ?? [],
      };

    case 'CLEAR_ALL':
      return initialState;

    default:
      return state;
  }
}

// 🧩 5️⃣ Provider
export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (__DEV__) {
      console.log('🧩 FlowMind 2.0: Mock veriler yüklendi');
      dispatch({
        type: 'SYNC_TASKS',
        payload: { tasks: devMockTasks, removedTasks: devMockRemoved },
      });
    }
  }, []);

  return <TaskContext.Provider value={{ state, dispatch }}>{children}</TaskContext.Provider>;
}

// 🪄 6️⃣ Hook
export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTaskContext, TaskProvider içinde kullanılmalı!');
  return context;
};
