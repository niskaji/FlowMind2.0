// -----------------------------------------------------------
// 📋 FlowMind 2.0 — TaskCard Component
// MVVM prensibine uygun hale getirilmiş sürüm.
// Görsel (View) ve stil (Style) katmanları ayrıştırıldı.
// -----------------------------------------------------------

import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  InteractionManager,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTaskContext } from '../../context/TaskContext';
import { useSmartScroll } from '../../hooks/useSmartScroll';
import type { Subtask, Task, TaskStatus } from '../../models/taskModel';

import { styles } from './TaskCard.styles';

interface TaskCardProps {
  task: Task;
  autoFocusRef?: React.RefObject<TextInput>;
  onSubtaskAdded?: () => void;
}

export default function TaskCard({ task, autoFocusRef, onSubtaskAdded }: TaskCardProps) {
  // ------------------------------------------------------------
  // 🧩 Context (ViewModel) bağlantısı
  // ------------------------------------------------------------
  const { dispatch } = useTaskContext();

  // ------------------------------------------------------------
  // 🧠 Local state yönetimi
  // ------------------------------------------------------------
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [newSubtask, setNewSubtask] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editedSubtaskTitle, setEditedSubtaskTitle] = useState('');

  // ------------------------------------------------------------
  // 🧭 ScrollView referansları
  // ------------------------------------------------------------
  const subtaskListRef = useRef<ScrollView>(null);
  const subAnim = useRef(new Animated.Value(1)).current;
  const inputRef = useRef<TextInput | null>(null);

  // Smart scroll davranışı (alt görev eklendiğinde otomatik kayma)
  const { onContentSizeChange } = useSmartScroll(subtaskListRef, {
    autoScrollToEnd: true,
    resetOnFocus: false,
    toEndAnimated: true,
  });

  // Odağı parent'tan kontrol edebilmek için
  useEffect(() => {
    if (autoFocusRef && inputRef.current) {
      autoFocusRef.current = inputRef.current;
    }
  }, [autoFocusRef]);

  // ------------------------------------------------------------
  // 🔖 Kategori isimlendirme tablosu
  // ------------------------------------------------------------
  const kategoriAdi: Record<Task['category'], string> = {
    short: 'Kısa Vade',
    medium: 'Orta Vade',
    long: 'Uzun Vade',
  };

  // ------------------------------------------------------------
  // 🧩 Ana görev aksiyonları
  // ------------------------------------------------------------
  const toggleComplete = () => dispatch({ type: 'TOGGLE_TASK', payload: task.id });
  const removeTask = () => dispatch({ type: 'REMOVE_TASK', payload: task.id });

  const saveEdit = () => {
    const safeTitle = editedTitle.trim();
    if (!safeTitle) return setEditing(false);
    dispatch({ type: 'UPDATE_TASK', payload: { ...task, title: safeTitle } });
    setEditing(false);
  };

  // ------------------------------------------------------------
  // ➕ Alt görev ekleme
  // ------------------------------------------------------------
  const addSubtask = () => {
    const title = newSubtask.trim();
    if (!title) return;

    const newSub: Subtask = {
      id: Date.now().toString(),
      title,
      status: 'pending' as TaskStatus,
    };

    const updated: Task = {
      ...task,
      subtasks: [...(task.subtasks ?? []), newSub],
    };

    dispatch({ type: 'UPDATE_TASK', payload: updated });
    setNewSubtask('');

    // Küçük feed-back animasyonu
    Animated.sequence([
      Animated.timing(subAnim, { toValue: 1.05, duration: 120, useNativeDriver: true }),
      Animated.spring(subAnim, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
    ]).start();

    // Odak + scroll
    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          inputRef.current?.focus();
          subtaskListRef.current?.scrollToEnd({ animated: true });
        }, 140);
      });
    });

    onSubtaskAdded?.();
  };

  // ------------------------------------------------------------
  // ✅ Alt görev durum değiştirme / düzenleme / silme
  // ------------------------------------------------------------
  const toggleSubtask = (subtaskId: string) => {
    const updated: Task = {
      ...task,
      subtasks: task.subtasks?.map(s =>
        s.id === subtaskId
          ? {
              ...s,
              status:
                s.status === 'completed' ? ('pending' as TaskStatus) : ('completed' as TaskStatus),
            }
          : s,
      ),
    } as Task;
    dispatch({ type: 'UPDATE_TASK', payload: updated });
  };

  const removeSubtask = (subtaskId: string) => {
    const updated: Task = {
      ...task,
      subtasks: task.subtasks?.filter(s => s.id !== subtaskId),
    } as Task;
    dispatch({ type: 'UPDATE_TASK', payload: updated });
  };

  const saveSubtaskEdit = (subtaskId: string) => {
    const updated: Task = {
      ...task,
      subtasks: task.subtasks?.map(s =>
        s.id === subtaskId ? { ...s, title: editedSubtaskTitle.trim() } : s,
      ),
    } as Task;
    dispatch({ type: 'UPDATE_TASK', payload: updated });
    setEditingSubtaskId(null);
    setEditedSubtaskTitle('');
  };

  // ------------------------------------------------------------
  // 📊 Progress hesaplama
  // ------------------------------------------------------------
  const completedSubtasks = task.subtasks?.filter(s => s.status === 'completed').length;
  const progress =
    task.subtasks && task.subtasks.length > 0
      ? completedSubtasks! / task.subtasks.length
      : task.status === 'completed'
        ? 1
        : 0;

  // ------------------------------------------------------------
  // 🎨 Görsel yapı (View)
  // ------------------------------------------------------------
  return (
    <Animated.View style={[styles.card, styles.shadow, { transform: [{ scale: subAnim }] }]}>
      {/* Üst Satır */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleComplete} style={styles.checkbox}>
          {task.status === 'completed' && <FontAwesome name="check" size={14} color="#3E2E23" />}
        </TouchableOpacity>

        {editing ? (
          <TextInput
            value={editedTitle}
            onChangeText={setEditedTitle}
            style={styles.titleInput}
            autoFocus
          />
        ) : (
          <Text style={[styles.taskTitle, task.status === 'completed' && styles.titleCompleted]}>
            {task.title}
          </Text>
        )}

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => (editing ? saveEdit() : setEditing(true))}
        >
          <FontAwesome name={editing ? 'check' : 'pencil'} size={16} color="#70573E" />
        </TouchableOpacity>

        <TouchableOpacity onPress={removeTask} style={styles.iconButton}>
          <FontAwesome name="trash" size={16} color="#8B3A2B" />
        </TouchableOpacity>
      </View>

      {/* Kategori & Progress */}
      <Text style={styles.categoryLabel}>Kategori: {kategoriAdi[task.category]}</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>%{Math.round(progress * 100)} tamamlandı</Text>

      {/* Alt görev listesi */}
      <ScrollView
        ref={subtaskListRef}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        onContentSizeChange={onContentSizeChange}
        contentContainerStyle={styles.subtasksContainer}
      >
        {task.subtasks?.map(item => (
          <View key={item.id} style={styles.subtaskRow}>
            <TouchableOpacity
              onPress={() => toggleSubtask(item.id)}
              style={[styles.subCheckbox, item.status === 'completed' && styles.checkboxChecked]}
            >
              {item.status === 'completed' && (
                <FontAwesome name="check" size={12} color="#3E2E23" />
              )}
            </TouchableOpacity>

            {editingSubtaskId === item.id ? (
              <TextInput
                value={editedSubtaskTitle}
                onChangeText={setEditedSubtaskTitle}
                autoFocus
                style={styles.subInputEdit}
              />
            ) : (
              <Text
                style={[styles.subtaskText, item.status === 'completed' && styles.titleCompleted]}
              >
                {item.title}
              </Text>
            )}

            <TouchableOpacity
              onPress={() =>
                editingSubtaskId === item.id
                  ? saveSubtaskEdit(item.id)
                  : (setEditingSubtaskId(item.id), setEditedSubtaskTitle(item.title))
              }
              style={styles.iconButton}
            >
              <FontAwesome
                name={editingSubtaskId === item.id ? 'check' : 'pencil'}
                size={14}
                color="#70573E"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => removeSubtask(item.id)} style={styles.iconButton}>
              <FontAwesome name="trash" size={14} color="#8B3A2B" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* ➕ Alt görev ekleme alanı */}
      <View style={styles.addSubtaskRow}>
        <TextInput
          ref={inputRef}
          placeholder="Alt Görev Ekle..."
          placeholderTextColor="#8B816A"
          value={newSubtask}
          onChangeText={setNewSubtask}
          onSubmitEditing={addSubtask}
          style={styles.subInput}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={addSubtask} style={styles.iconButton}>
          <FontAwesome name="plus" size={14} color="#70573E" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
