# 🌿 FlowMind 2.0 — Teknik ve Mimari Özeti

## 🎯 Projenin Amacı

FlowMind 2.0, görev yönetimi ve üretkenliği artırmaya odaklanmış, kullanıcı dostu bir **mobil uygulamadır**.
Hedef: Ana görevler, alt görevler ve analiz verilerini pastel, sade bir Soft Autumn temasıyla yönetmek.

---

## 🧩 Teknoloji ve Mimari Yapı

- **Framework:** React Native (Expo)
- **Yönlendirme:** Expo Router (`app/(tabs)/`)
- **Dil:** TypeScript (TS / TSX)
- **Durum Yönetimi:** Context API + Reducer
- **UI Kitleri:** react-native-chart-kit, react-native-safe-area-context, expo-linear-gradient
- **Tasarım Paleti:** Soft Autumn pastel tonları
  (örnek: `#FDFCF9`, `#E3D2B5`, `#70573E`, `#3E2E23`, `#B6BE93`)

---

## 📁 Dizin Yapısı

src/
├── components/
│ ├── TaskCard/
│ │ ├── TaskCard.tsx
│ │ └── TaskCard.styles.ts
│ ├── NewTaskModal/
│ │ ├── NewTaskModal.tsx
│ │ └── NewTaskModal.styles.ts
│ └── FilterBar.tsx
│
├── context/
│ └── TaskContext.tsx
│
├── hooks/
│ ├── useResetScroll.ts
│ ├── useKeyboardScroll.ts
│ └── useSmartScroll.ts
│
├── models/
│ └── taskModel.ts
│
├── styles/
│ └── colors.ts
│
└── views/
├── HomeScreen/
│ ├── HomeScreen.tsx
│ └── HomeScreen.styles.ts
├── AnalysisScreen/
│ ├── AnalysisScreen.tsx
│ └── AnalysisScreen.styles.ts
└── CancelledScreen/
├── CancelledScreen.tsx
└── CancelledScreen.styles.ts

yaml
Kodu kopyala

---

## 🧠 State Yönetimi (TaskContext)

Reducer Actions:

- `ADD_TASK`
- `REMOVE_TASK`
- `TOGGLE_TASK`
- `UPDATE_TASK`
- `ADD_SUBTASK`
- `TOGGLE_SUBTASK`
- `REMOVE_SUBTASK`
- `EDIT_SUBTASK`
- `SYNC_TASKS`
- `CLEAR_ALL`

---

## 🔁 Geliştirme Aşamaları

### Tamamlananlar

- JSX namespace hatası düzeltildi
- Alt görev eklendiğinde ekran otomatik scroll yapıyor (`onSubtaskAdded` + `FlatList.scrollToEnd`)
- HomeScreen üst bar tasarımı, buton animasyonları ve renk senkronizasyonu tamamlandı
- Analiz ekranı (PieChart + kategori bazlı analiz) tamamlandı

### Devam Edenler

- TaskCard spacing / padding optimizasyonu
- Navigasyon ve tab başlıklarının temizlenmesi
- AsyncStorage ile veri kalıcılığı

---

## 🗂 Refactoring Planı

| Klasör        | Dosya                                                         | Ayrı `.styles.ts` Dosyası |
| ------------- | ------------------------------------------------------------- | ------------------------- |
| `views/`      | `HomeScreen.tsx`, `AnalysisScreen.tsx`, `CancelledScreen.tsx` | ✅ Evet                   |
| `components/` | `TaskCard.tsx`, `NewTaskModal.tsx`, `FilterBar.tsx`           | ✅ Evet                   |

---

## 🧩 Geçerli Kontrol Noktası (Checkpoint)

**Alt görev scroll fix** tamamlandı.
Bu versiyonun kod etiketi: `alt_gorev_scroll_fix`.

Sıradaki adım:
TaskCard etkileşimleri → navigasyon cleanup → veri kalıcılığı (AsyncStorage).

---

## 📅 İlerleme Komutları

- “nerede kalmıştık” → Son checkpoint’ten devam et
- “buradaki işler bitti var mı hatırlatacağın” → Refactoring tablosunu hatırlat
- “ne vardı başka hatırlatacağın” → Veri kalıcılığı (AsyncStorage) aşamasını hatırlat

---

# 🧾 Not

Bu belge, FlowMind 2.0 projesinin teknik ilerleme rehberidir.
Yeni konuşmalarda bu dosya, ChatGPT’nin projeyi kaldığı yerden devam ettirmesi için referans alınır.
