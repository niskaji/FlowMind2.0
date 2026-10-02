// -----------------------------------------------------------
// 🧠 FlowMind 2.0 — TaskContext
// Global görev durum yönetimi (Context + Reducer).
// Kalıcılık SQLite/Drizzle üzerinden sağlanır (bkz. src/db/taskRepository.ts).
// dispatch, ilgili DB yazma işlemini yapar, ardından TÜM görevleri yeniden
// çeker ve SYNC_TASKS ile state'i günceller — tek gerçek kaynak her zaman
// veritabanıdır (optimistic update yok, sürüklenme riski sıfır).
// -----------------------------------------------------------

import { createContext, ReactNode, useCallback, useContext, useEffect, useReducer } from 'react';

import * as taskRepository from '../db/taskRepository';
import { TaskAction, TaskContextType, TaskState } from '../models/taskModel';

// 🧩 1️⃣ Başlangıç state — uygulama açılışında DB'den doldurulur
const initialState: TaskState = {
  tasks: [],
};

// 🧩 2️⃣ Context oluştur
const TaskContext = createContext<TaskContextType>({
  state: initialState,
  dispatch: () => undefined,
});

// 🧩 3️⃣ Reducer — sadece DB'den gelen anlık görüntüyü uygular
function reducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SYNC_TASKS':
      return { ...state, tasks: action.payload.tasks ?? [] };
    default:
      return state;
  }
}

// 🧩 4️⃣ Provider
export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, rawDispatch] = useReducer(reducer, initialState);

  const refresh = useCallback(async () => {
    const tasks = await taskRepository.getAllTasksWithSubtasks();
    rawDispatch({ type: 'SYNC_TASKS', payload: { tasks } });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const dispatch: TaskContextType['dispatch'] = useCallback(
    action => {
      (async () => {
        switch (action.type) {
          case 'ADD_TASK':
            await taskRepository.createTask(action.payload);
            break;
          case 'REMOVE_TASK':
            await taskRepository.cancelTask(action.payload);
            break;
          case 'TOGGLE_TASK':
            await taskRepository.toggleTaskCompletion(action.payload);
            break;
          case 'UPDATE_TASK':
            await taskRepository.updateTask({
              id: action.payload.id,
              title: action.payload.title,
              deadline: action.payload.deadline ?? undefined,
            });
            break;
          case 'REACTIVATE_TASK':
            await taskRepository.reactivateTask(action.payload);
            break;
          case 'ADD_SUBTASK':
            await taskRepository.addSubtask(action.payload.parentId, action.payload.title);
            break;
          case 'TOGGLE_SUBTASK':
            await taskRepository.toggleSubtaskCompletion(action.payload.subtaskId);
            break;
          case 'REMOVE_SUBTASK':
            await taskRepository.hardDeleteSubtask(action.payload.subtaskId);
            break;
          case 'EDIT_SUBTASK':
            await taskRepository.editSubtask({
              subtaskId: action.payload.subtaskId,
              title: action.payload.title,
              deadline: action.payload.deadline,
            });
            break;
          case 'SYNC_TASKS':
            rawDispatch(action);
            return;
          default:
            break;
        }
        await refresh();
      })().catch(error => {
        console.error('🧠 TaskContext dispatch hatası:', error);
      });
    },
    [refresh],
  );

  return <TaskContext.Provider value={{ state, dispatch }}>{children}</TaskContext.Provider>;
}

// 🪄 5️⃣ Hook
export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTaskContext, TaskProvider içinde kullanılmalı!');
  return context;
};
