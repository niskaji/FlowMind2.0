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
import type { Task } from '../../models/taskModel';
import { Colors } from '../../styles/colors';
import {
  formatDateTR,
  getRemainingTimeLabel,
  isPastDeadline,
  parseDateOnlyISO,
} from '../../utils/dateUtils';
import DeadlinePicker from '../DeadlinePicker/DeadlinePicker';

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
  const [editedDeadline, setEditedDeadline] = useState<string | undefined>(
    task.deadline ?? undefined,
  );
  const [newSubtask, setNewSubtask] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState<number | null>(null);
  const [editedSubtaskTitle, setEditedSubtaskTitle] = useState('');
  const [editedSubtaskDeadline, setEditedSubtaskDeadline] = useState<string | undefined>(undefined);

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
  // 🔒 Alt görevleri olan bir ana görev, TÜM alt görevler tamamlanana kadar kilitli kalır
  const activeSubtasks = task.subtasks ?? [];
  const hasSubtasks = activeSubtasks.length > 0;
  const allSubtasksCompleted = hasSubtasks
    ? activeSubtasks.every(s => s.status === 'completed')
    : true;
  const isCheckboxLocked = hasSubtasks && !allSubtasksCompleted;

  const toggleComplete = () => {
    if (isCheckboxLocked) return;
    dispatch({ type: 'TOGGLE_TASK', payload: task.id });
  };
  const removeTask = () => dispatch({ type: 'REMOVE_TASK', payload: task.id });

  const saveEdit = () => {
    const safeTitle = editedTitle.trim();
    if (!safeTitle) return setEditing(false);
    dispatch({
      type: 'UPDATE_TASK',
      payload: { ...task, title: safeTitle, deadline: editedDeadline },
    });
    setEditing(false);
  };

  // ------------------------------------------------------------
  // ➕ Alt görev ekleme
  // ------------------------------------------------------------
  const addSubtask = () => {
    const title = newSubtask.trim();
    if (!title) return;

    dispatch({ type: 'ADD_SUBTASK', payload: { parentId: task.id, title } });
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
  const toggleSubtask = (subtaskId: number) => {
    dispatch({ type: 'TOGGLE_SUBTASK', payload: { parentId: task.id, subtaskId } });
  };

  const removeSubtask = (subtaskId: number) => {
    dispatch({ type: 'REMOVE_SUBTASK', payload: { parentId: task.id, subtaskId } });
  };

  const saveSubtaskEdit = (subtaskId: number) => {
    dispatch({
      type: 'EDIT_SUBTASK',
      payload: {
        parentId: task.id,
        subtaskId,
        title: editedSubtaskTitle.trim(),
        deadline: editedSubtaskDeadline,
      },
    });
    setEditingSubtaskId(null);
    setEditedSubtaskTitle('');
    setEditedSubtaskDeadline(undefined);
  };

  // ------------------------------------------------------------
  // 📊 Progress hesaplama
  // ------------------------------------------------------------
  const completedSubtasks = activeSubtasks.filter(s => s.status === 'completed').length;
  const progress =
    activeSubtasks.length > 0
      ? completedSubtasks / activeSubtasks.length
      : task.status === 'completed'
        ? 1
        : 0;

  // ⚠️ Süresi geçen görevler için görsel uyarı
  const isOverdue = !!task.deadline && isPastDeadline(task.deadline);
  const maxSubtaskDeadline = task.deadline ? parseDateOnlyISO(task.deadline) : undefined;

  // ------------------------------------------------------------
  // 🎨 Görsel yapı (View)
  // ------------------------------------------------------------
  return (
    <Animated.View style={[styles.card, styles.shadow, { transform: [{ scale: subAnim }] }]}>
      {/* Üst Satır */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={toggleComplete}
          disabled={isCheckboxLocked}
          style={[styles.checkbox, isCheckboxLocked && styles.checkboxLocked]}
        >
          {task.status === 'completed' && <FontAwesome name="check" size={14} color="#3E2E23" />}
          {isCheckboxLocked && <FontAwesome name="lock" size={11} color={Colors.midGray} />}
        </TouchableOpacity>

        {editing ? (
          <TextInput
            value={editedTitle}
            onChangeText={setEditedTitle}
            style={styles.titleInput}
            autoFocus
          />
        ) : (
          <Text
            style={[
              styles.taskTitle,
              task.status === 'completed' && styles.titleCompleted,
              isOverdue && styles.titleOverdue,
            ]}
          >
            {task.title}
          </Text>
        )}

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            if (editing) {
              saveEdit();
            } else {
              setEditedTitle(task.title);
              setEditedDeadline(task.deadline ?? undefined);
              setEditing(true);
            }
          }}
        >
          <FontAwesome name={editing ? 'check' : 'pencil'} size={16} color="#70573E" />
        </TouchableOpacity>

        <TouchableOpacity onPress={removeTask} style={styles.iconButton}>
          <FontAwesome name="trash" size={16} color="#8B3A2B" />
        </TouchableOpacity>
      </View>

      {/* ✏️ Düzenleme modunda son tarih seçimi */}
      {editing && (
        <View style={styles.deadlineEditRow}>
          <DeadlinePicker value={editedDeadline} onChange={setEditedDeadline} />
        </View>
      )}

      {/* 📅 Son tarih ve kalan süre (tek satır) */}
      {!editing && task.deadline && (
        <Text style={[styles.deadlineText, isOverdue && styles.deadlineTextOverdue]}>
          📅 {formatDateTR(task.deadline)} · {getRemainingTimeLabel(task.deadline)}
          {isOverdue ? ' ⚠️' : ''}
        </Text>
      )}

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
        {activeSubtasks.map(item => {
          const isSubOverdue = !!item.deadline && isPastDeadline(item.deadline);

          return (
            <View key={item.id}>
              <View style={styles.subtaskRow}>
                <TouchableOpacity
                  onPress={() => toggleSubtask(item.id)}
                  style={[
                    styles.subCheckbox,
                    item.status === 'completed' && styles.checkboxChecked,
                  ]}
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
                    style={[
                      styles.subtaskText,
                      item.status === 'completed' && styles.titleCompleted,
                      isSubOverdue && styles.titleOverdue,
                    ]}
                  >
                    {item.title}
                  </Text>
                )}

                <TouchableOpacity
                  onPress={() => {
                    if (editingSubtaskId === item.id) {
                      saveSubtaskEdit(item.id);
                    } else {
                      setEditingSubtaskId(item.id);
                      setEditedSubtaskTitle(item.title);
                      setEditedSubtaskDeadline(item.deadline ?? undefined);
                    }
                  }}
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

              {/* ✏️ Düzenleme modunda alt görev son tarih seçimi (ana görev deadline'ını geçemez) */}
              {editingSubtaskId === item.id && (
                <View style={styles.subDeadlineEditRow}>
                  <DeadlinePicker
                    value={editedSubtaskDeadline}
                    onChange={setEditedSubtaskDeadline}
                    maximumDate={maxSubtaskDeadline}
                  />
                </View>
              )}

              {/* 📅 Alt görev son tarih ve kalan süre (tek satır) */}
              {editingSubtaskId !== item.id && item.deadline && (
                <Text style={[styles.subDeadlineText, isSubOverdue && styles.deadlineTextOverdue]}>
                  📅 {formatDateTR(item.deadline)} · {getRemainingTimeLabel(item.deadline)}
                  {isSubOverdue ? ' ⚠️' : ''}
                </Text>
              )}
            </View>
          );
        })}
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
