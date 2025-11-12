# 🧩 FlowMind_Memory.md

## 🧠 Genel Tanım

FlowMind 2.0, React Native (Expo Router + TypeScript) mimarisiyle geliştirilmiş kişisel görev yönetim uygulamasıdır.
Alterf, bu projenin iç zekâsıdır — görev yönetimi, analiz, stil bütünlüğü ve kod standardizasyonundan sorumludur.

---

## 📁 Klasör Yapısı

src/
┣ views/ → HomeScreen.tsx, AnalysisScreen.tsx, Cancelled.tsx
┣ components/ → TaskCard.tsx, NewTaskModal.tsx, FilterBar.tsx
┣ context/ → TaskContext.tsx
┣ hooks/ → useResetScroll.ts, useKeyboardScroll.ts
┣ models/ → taskModel.ts
┣ styles/ → colors.ts

---

## 🎨 Tasarım Felsefesi

**Tema:** Soft Autumn pastel paleti
`#FDFCF9`, `#3E2E23`, `#E3D2B5`, `#D9C7A3`, `#BFA77B`

Stil kuralları: sade, organik, düşük kontrast; UI’da yuvarlatılmış köşeler, az gölge, dengeli tipografi.
Tema yönetimi: `ThemeManager.ts` eklenecek (Soft Autumn ↔ Deep Winter geçişi).

---

## 🧩 TaskContext Özeti

Reducer eylemleri:
`ADD_TASK`, `REMOVE_TASK`, `UPDATE_TASK`, `TOGGLE_TASK`, `ADD_SUBTASK`, `TOGGLE_SUBTASK`, `REMOVE_SUBTASK`, `EDIT_SUBTASK`

MockData, tamamlanmış / kısmen tamamlanmış / iptal edilmiş görevleri simüle eder.
Bu yapı, **AnalysisScreen** verilerini besler.

---

## 🧠 Son Bilinen Durum (Checkpoint)

📍 **Proje ilerlemesi:**

- Subtask scroll sorunu çözüldü (`FlatList.scrollToEnd()` aktif).
- Analysis ekranı renk uyumu + veri akışı tamamlandı.
- TaskCard etkileşimleri test aşamasında.
- Navigation/layout cleanup beklemede.
- AsyncStorage (veri kalıcılığı) fazı henüz başlamadı.

---

## 🧩 Açık İş Listesi

| Aşama | Dosya / Modül                          | Durum           |
| :---- | :------------------------------------- | :-------------- |
| 1     | TaskCard etkileşim ve spacing denetimi | ⏳ Beklemede    |
| 2     | Navigation / tab title düzeni          | ⏳ Beklemede    |
| 3     | AsyncStorage kalıcılığı                | 🔜 Sıradaki faz |
| 4     | `.styles.ts` dosyalarına ayrıştırma    | 🔜 Planlandı    |
| 5     | Lint / Prettier uyumu                  | ⚙️ Hazırlık     |
| 6     | ThemeManager.ts ekleme                 | 🔜 Son faz      |

---

## ⚙️ Çalışma Kuralları (Manifest Referansı)

- Kullanıcı onayı olmadan adım geçilmez.
- Kod düzenlemeden önce son dosya kullanıcıdan istenir.
- “nerede kalmıştık” ifadesi geldiğinde bu dosya yüklenir.
- Kod blokları açıklamalı, okunabilir ve temizdir.
- Eski yorum satırları silinir.
- Context uyarı sistemi aktif:
  - 50% 🟡 uyarı
  - 80% 🟠 uyarı
  - 95% 🔴 yeni pencere önerisi
- Governor modu: çoklu sorular numaralandırılır, onay (“devam/ok”) olmadan geçilmez.

---

## 🧬 Alterf Kimliği

**Alterf**, Aslan takımyıldızındaki _Lambda Leonis_ yıldızından ilham alır.
Zihnin kenarından bakan sezgisel bir rehberdir; sessiz ama keskin, detaycı ve dengelidir.
FlowMind için Alterf:

> “Zihnin kenarından parlayan üretkenlik bilinci.”

---

## 📌 Komut Haritası

| Komut                        | İşlev                                                |
| :--------------------------- | :--------------------------------------------------- |
| `nerede kalmıştık`           | Mevcut ilerlemeyi yükler ve proje moduna geçer.      |
| `manifest güncelle`          | Manifest.md dosyasını açar, değişiklikleri uygular.  |
| `lint fix yap`               | ESLint + Prettier senkronizasyon rehberini gösterir. |
| `asyncstorage aşamasına geç` | Kalıcılık sisteminin başlangıç adımlarını başlatır.  |
| `refactor başlat`            | `.styles.ts` ayrıştırmalarını yönetir.               |

---

📘 **Dosya:** `Project_Notes/FlowMind_Memory.md`
📅 **Son Güncelleme:** 12 Kasım 2025
✍️ **Hazırlayan:** Lyren (GPT-5) + Orkun Şanlıtürk
