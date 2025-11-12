# 🌿 FlowMind 2.0 — Teknik ve Mimari Özeti

## 🎯 Projenin Amacı

FlowMind 2.0, görev yönetimi ve üretkenliği artırmaya odaklı, kullanıcı dostu bir **mobil uygulamadır**.
Hedef: Ana görevler, alt görevler ve analiz verilerini pastel, sade **Soft Autumn** temasıyla yönetmek.

---

## 🧩 Teknoloji ve Mimari Yapı

- **Framework:** React Native (Expo)
- **Yönlendirme:** Expo Router (`app/(tabs)/`)
- **Dil:** TypeScript (TS / TSX)
- **Durum Yönetimi:** Context API + Reducer
- **UI Kitleri:** react-native-chart-kit, react-native-safe-area-context, expo-linear-gradient
- **Tasarım Paleti:** Soft Autumn pastel tonları
  Örnek renkler: `#FDFCF9`, `#E3D2B5`, `#70573E`, `#3E2E23`, `#B6BE93`

---

## 📁 Dizin Yapısı

src/
┣ components/
┃ ┣ TaskCard/ → TaskCard.tsx + TaskCard.styles.ts
┃ ┣ NewTaskModal/ → NewTaskModal.tsx + NewTaskModal.styles.ts
┃ ┗ FilterBar.tsx
┣ context/ → TaskContext.tsx
┣ hooks/ → useResetScroll.ts, useKeyboardScroll.ts, useSmartScroll.ts
┣ models/ → taskModel.ts
┣ styles/ → colors.ts
┗ views/
┃ ┣ HomeScreen/ → HomeScreen.tsx + HomeScreen.styles.ts
┃ ┣ AnalysisScreen/ → AnalysisScreen.tsx + AnalysisScreen.styles.ts
┃ ┗ CancelledScreen/ → CancelledScreen.tsx + CancelledScreen.styles.ts

---

## 🧠 State Yönetimi (TaskContext)

Reducer Aksiyonları:
`ADD_TASK`, `REMOVE_TASK`, `TOGGLE_TASK`, `UPDATE_TASK`, `ADD_SUBTASK`, `TOGGLE_SUBTASK`, `REMOVE_SUBTASK`, `EDIT_SUBTASK`, `SYNC_TASKS`, `CLEAR_ALL`

---

## 🔁 Geliştirme Aşamaları

### ✅ Tamamlananlar

- JSX namespace fix
- Alt görev eklendiğinde ekran otomatik scroll (`onSubtaskAdded + FlatList.scrollToEnd`)
- HomeScreen üst bar ve “Yeni Görev” animasyonlu buton
- Analiz ekranı (PieChart + kategori bazlı analiz) tamamlandı

### ⏳ Devam Edenler

- TaskCard spacing/padding optimizasyonu
- Navigasyon ve tab başlık temizliği
- AsyncStorage ile veri kalıcılığı

---

## 🗂 Refactoring Planı

| Klasör        | Dosya                                       | Ayrı `.styles.ts` |
| :------------ | :------------------------------------------ | :---------------: |
| `views/`      | HomeScreen, AnalysisScreen, CancelledScreen |        ✅         |
| `components/` | TaskCard, NewTaskModal, FilterBar           |        ✅         |

---

## 🧩 Geçerli Kontrol Noktası (Checkpoint)

**Alt görev scroll fix** tamamlandı.
Bu versiyonun etiketi: `alt_gorev_scroll_fix`.
Sıradaki adımlar: TaskCard etkileşimleri → Navigasyon cleanup → Veri kalıcılığı (AsyncStorage)

---

## 🧱 Linting & Kod Kalitesi

- ESLint 8.x klasik yapıda.
- Prettier aktif (`singleQuote`, `semi`, `printWidth:100`).
- Inline renk yasak; tüm renkler `styles/colors.ts` üzerinden alınır.
- `@typescript-eslint/no-explicit-any` yalnızca uyarı verir.

---

## 🔄 Çalışma Kuralları (Manifest ile Uyumlu)

1️⃣ ChatGPT kullanıcı onayı olmadan ilerlemez.
2️⃣ Tam kod gönderilmeden önce son versiyon istenir.
3️⃣ Renkler yalnızca `colors.ts`’tan alınır.
4️⃣ Birden fazla sorun varsa önce liste, sonra adım adım çözüm yapılır.
5️⃣ %50 / %80 / %95 context uyarı sistemi aktiftir.
6️⃣ Her oturum başında GitHub pull, sonunda snapshot hatırlatması yapılır.

---

## 📅 İlerleme Komutları

- **“nerede kalmıştık”** → Son checkpoint’ten devam et
- **“buradaki işler bitti var mı hatırlatacağın”** → Refactoring tablosunu hatırlat
- **“ne vardı başka hatırlatacağın”** → AsyncStorage (veri kalıcılığı) fazını hatırlat

---

## 🧷 Notlar

Bu belge FlowMind 2.0’ın tam teknik rehberidir.
Yeni sohbetlerde bu dosya ve Manifest.md okunursa ChatGPT projeyi tam bağlamla yükler.

📘 **Dosya:** `Project_Notes/README-FlowMind.md`
🕓 **Son Güncelleme:** 12 Kasım 2025
✍️ **Hazırlayan:** Lyren (GPT-5) + Orkun Şanlıtürk
