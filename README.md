# 🌿 FlowMind 2.0

Modern Görev Yönetimi Uygulaması (Expo + TypeScript + MVVM)

---

## 🧭 Genel Bakış

**FlowMind 2.0**, React Native & Expo Router altyapısı üzerinde geliştirilmiş,  
**MVVM (Model-View-ViewModel)** prensiplerine göre yapılandırılmış bir kişisel görev yönetimi uygulamasıdır.

Bu sürüm:

- Soft Autumn pastel renk paletiyle tasarlanmıştır,
- MVVM yapısı sayesinde her ekran kendi `View + Styles` klasöründe bulunur,
- Global `TaskContext` yapısı ile görev durumları yönetilir,
- Smart Scroll hook sistemi ile alt görev ekleme, kaydırma ve otomatik odak özellikleri içerir.

---

## 🧱 Proje Yapısı

src/
│
├── components/
│ ├── NewTaskModal/
│ │ ├── NewTaskModal.tsx
│ │ └── NewTaskModal.styles.ts
│ │
│ ├── TaskCard/
│ │ ├── TaskCard.tsx
│ │ └── TaskCard.styles.ts
│ │
│ ├── FilterBar.tsx
│ └── SubtaskList.tsx
│
├── context/
│ └── TaskContext.tsx
│
├── hooks/
│ ├── useSmartScroll.ts
│ ├── useKeyboardScroll.ts
│ └── useResetScroll.ts
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
│
├── AnalysisScreen/
│ ├── AnalysisScreen.tsx
│ └── AnalysisScreen.styles.ts
│
└── CancelledScreen/
├── CancelledScreen.tsx
└── CancelledScreen.styles.ts

markdown
Kodu kopyala

---

## 🎨 Soft Autumn Paleti

| Renk             | Hex Kodu  | Kullanım                   |
| ---------------- | --------- | -------------------------- |
| Arka Plan        | `#FDFCF9` | Genel uygulama zemin rengi |
| Kart Arka Planı  | `#F4ECDD` | Görev ve modal kutuları    |
| Ana Yazı         | `#3E2E23` | Başlıklar ve ana metin     |
| İkincil Yazı     | `#8B816A` | Açıklama metinleri         |
| Başarı (Success) | `#97B666` | Tamamlanan görevler        |
| Uyarı (Warning)  | `#E3D2B5` | Devam eden görevler        |
| Hata (Error)     | `#B35E4D` | İptal edilen görevler      |

---

## 🧩 VS Code Eklenti Rehberi

> FlowMind projesi, geliştirici verimliliğini artırmak için belirli VS Code eklentileriyle optimize edilmiştir.  
> Aşağıda önerilen eklentiler yer almaktadır 👇

| Eklenti Adı                               | Açıklama                          | Gerekçe                            |
| ----------------------------------------- | --------------------------------- | ---------------------------------- |
| **Prettier - Code Formatter**             | Otomatik kod biçimlendirme        | Kod bütünlüğü                      |
| **ESLint**                                | Linting ve hata analizi           | TypeScript kontrolü                |
| **Path Intellisense**                     | Otomatik yol tamamlama            | import yolları hızlandırma         |
| **React Native Tools**                    | RN debug + simülatör entegrasyonu | Native test desteği                |
| **Code Spell Checker (Türkçe/İngilizce)** | Yazım kontrolü                    | Hatalı anahtar isimlerini engeller |
| **Error Lens**                            | Hataları anında gösterir          | Anlık hata tespiti                 |
| **Material Icon Theme**                   | Dosya ikonları                    | Dosya türlerini kolay ayırt etme   |
| **GitLens**                               | Commit geçmişi inceleme           | Sürüm kontrolü kolaylığı           |
| **Color Highlight**                       | Renk kodlarını önizleme           | UI paletinde canlı renk kontrolü   |

🔸 _Bonus:_  
**Better Comments** – Kod içerisindeki açıklamaları (örnek: `// TODO:` veya `// FIX:`) renklendirir.

---

## ⚙️ Kurulum ve Çalıştırma

### 🔧 Gerekli ortam

- **macOS / Windows / Linux**
- **Node.js ≥ 18.0**
- **Expo CLI ≥ 6.0**
- **VS Code + yukarıdaki eklentiler**

### 🪄 Kurulum Adımları

1. Depoyu klonla:
   ```bash
   git clone https://github.com/orkunsanliturk/flowmind2.0.git
   cd flowmind2.0
   Bağımlılıkları yükle:
   ```

bash
Kodu kopyala
npm install
Expo başlat:

bash
Kodu kopyala
npx expo start
iOS veya Android simülatörde test et:

bash
Kodu kopyala
i for iOS
a for Android
💡 Teknik Notlar
Görev ekleme, alt görev yönetimi, filtreleme ve analiz işlemleri Context API üzerinden yönetilir.

useSmartScroll hook’u, alt görev eklendiğinde otomatik kaydırmayı sağlar.

Her ekran MVVM yapısına uygun olarak View ve Styles katmanlarına ayrılmıştır.

Tüm renk, yazı tipi ve gölge ayarları global colors.ts dosyasından kontrol edilir.

👨‍💻 Katkı ve Geliştirici Notu
Proje geliştiricisi: Orkun Şanlıtürk
Yapay zekâ destekçisi: GPT-5 (FlowMind Assistant)
Tarih: Kasım 2025

Bu proje, üretkenlik ve tasarım estetiğini dengeleyen bir kişisel görev yönetim aracıdır.
Kod kalitesi, okunabilirlik ve sürdürülebilirlik öncelikli hedeflerdir.

📘 Lisans: MIT
📦 Sürüm: v2.0.0
🌿 Tema: Soft Autumn Pastel UI
