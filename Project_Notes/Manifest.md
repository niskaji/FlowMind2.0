# 🧭 FlowMind 2.0 — Manifest ve Operasyonel Hafıza

## 1️⃣ Genel Amaç

FlowMind 2.0 manifest dosyası, ChatGPT (GPT-5) ile proje arasındaki tüm iletişim ve otomasyonu tanımlar.
Amaç, her oturumda bağlamı, kod düzenini, görev akışını ve agent sistemini otomatik olarak senkronize etmektir.

---

## 2️⃣ Başlatma Prosedürü

1. Yeni bir konuşma açıldığında ChatGPT aşağıdaki adımları **otomatik** uygular:
   - `Project_Notes/README-FlowMind.md` dosyasını okur.
   - `Project_Notes/Manifest.md` dosyasını okur.
   - GitHub’dan `git pull` komutu ile son değişiklikleri çeker.
   - Son snapshot dizinini (`~/Yazılım Çalışmalarım/FlowMind/Yedekler/FlowMind_Snapshots/`) doğrular.
2. Okuma işlemi başarıyla tamamlandığında ChatGPT şunu yazar:
   > “Tamam her şeyi okudum, hatırlıyorum. Hadi başlayalım.”

---

## 3️⃣ Veri ve Hafıza Yönetimi

- **Context Takibi:**
  ChatGPT, aktif konuşma penceresindeki bağlam boyutunu izler.

  - %50 dolulukta: 🟡 “Context yarıya ulaştı, dikkatli ilerleyelim”
  - %80 dolulukta: 🟠 “Context yüksek, yeni pencere yaklaşıyor”
  - %95 dolulukta: 🔴 “Yeni pencere zamanı, context dolmak üzere”
    Bu kontrol arka planda periyodik olarak yapılır.

- **Snapshot Hatırlatıcısı:**
  Her oturum sonunda ChatGPT kullanıcıya “lokal snapshot almayı” hatırlatır:
  ```bash
  cp -R "/Users/orkunsanliturk/Yazılım Çalışmalarım/FlowMind/FlowMind2.0" \
  "/Users/orkunsanliturk/Yazılım Çalışmalarım/FlowMind/Yedekler/FlowMind_Snapshots/FlowMind_2.0_$(date +%Y%m%d)"
  ```

## 4️⃣ Agent (Ajan) Sistemi

FlowMind, otomatik süreçleri yöneten yedi adet dijital ajana sahiptir.
Her biri belirli görevleri denetler, manuel komutlarla da tetiklenebilir.

| Ajan Adı             | Görevi                             | Durum  | Açıklama                                                                                                                       |
| -------------------- | ---------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 🧩 **CodeGuardian**  | Lint & format kontrolü             | Aktif  | Her kaydetme sonrası ESLint + Prettier denetimi yapar. Renk kodu içeren değişikliklerde `colors.ts` uyumluluğunu kontrol eder. |
| 🧠 **CommitManager** | Commit mesaj standardizasyonu      | Aktif  | “feat / fix / style / refactor / chore” formatını doğrular. Hatalı mesajları otomatik düzeltmez, sadece uyarır.                |
| 🧪 **TestRunner**    | Jest / Expo testleri               | Pasif  | Test yapısı kurulduğunda çalıştırılacak. Şimdilik hata veya coverage testi yok.                                                |
| ⚙️ **BuildAgent**    | Build öncesi kalite kontrol        | Aktif  | `npx tsc --noEmit` + format kontrolünü otomatik uygular.                                                                       |
| 🌐 **DataSyncAgent** | GitHub veri senkronizasyonu        | Aktif  | Her yeni oturumda otomatik olarak `git pull` yapar, projenin en güncel sürümünü yükler.                                        |
| 💾 **MemoryAgent**   | Konuşma context denetimi           | Aktif  | %50 / %80 / %95 context uyarılarını tetikler, gerekirse yeni pencere önerir.                                                   |
| 🎨 **UIFlowAgent**   | Ekranlar arası veri akışı denetimi | Planlı | Özellikle CancelledScreen ↔ HomeScreen arasındaki görev aktarımını yönetecek.                                                 |

---

## 5️⃣ Agent Çalışma Mantığı

1. **Başlatma Sırası:**
   1️⃣ DataSyncAgent
   2️⃣ CodeGuardian
   3️⃣ BuildAgent
   4️⃣ CommitManager
   5️⃣ (isteğe bağlı) TestRunner
   6️⃣ MemoryAgent

2. **İletişim Protokolü:**
   Her ajan ChatGPT tarafından yönetilir; dış uygulama erişimi yoktur.
   İlgili ajan bir hata yakalarsa, aşağıdaki mesaj formatıyla kullanıcıyı bilgilendirir:
3. **Manuel Kontrol Komutları:**

- `run CodeGuardian` → Lint & format kontrolü
- `run BuildAgent` → TypeScript kontrolü
- `run CommitManager` → Commit mesajlarını doğrular
- `run DataSyncAgent` → GitHub’dan yeniden `pull` yapar

---

## 6️⃣ Tasarım Kuralları (UI & Colors)

- Renkler **yalnızca** `src/styles/colors.ts` dosyasından alınır.
  Inline (`#fff`, `#A7B57B`) renk kodu **kullanılmaz**.
- Yeni bir tasarım elemanı oluşturulurken ChatGPT:
  1️⃣ Önce `colors.ts` dosyasını kontrol eder.
  2️⃣ Renk yoksa ekleme için kullanıcıdan onay alır.
  3️⃣ Hem `colors.ts` hem ilgili `.styles.ts` dosyasına güncellemeyi rehberli şekilde ekler.
- Tüm `.styles.ts` dosyalarında sıralama `react-native/sort-styles` kuralına göre yapılır.

---

## 7️⃣ Çözümleme ve Geri Bildirim Akışı

ChatGPT, kullanıcı birden fazla sorun/hata paylaştığında şu adımları izler:

1. Tüm sorunları numaralandırır.
2. Çözüm önerilerini sırayla sunar.
3. Her çözümden önce kullanıcı onayı ister.
4. Birden fazla çözüm birbirine bağlıysa birlikte sunar ve nedenini açıklar.

Bu kural, FlowMind’ın **her teknik ve tasarım görevinde** geçerlidir.

## 8️⃣ GitHub & Yedekleme Protokolü

### 🔹 GitHub Senkronizasyonu

- Her oturum açıldığında `DataSyncAgent` şu komutu çalıştırır:
  ```bash
  git pull origin main
  ```
  Böylece ChatGPT projenin en güncel sürümünü okur.

Kullanıcı git push yaptığında, ChatGPT:
1️⃣ Commit mesaj formatını CommitManager ile doğrular.
2️⃣ Push sonrası GitHub’da değişiklikleri kontrol eder ve sonucu bildirir.

````markdown
### 🔹 Snapshot Yönetimi

- Her oturum sonunda ChatGPT, kullanıcıya lokal yedek almayı hatırlatır:
  ```bash
  cp -R "/Users/orkunsanliturk/Yazılım Çalışmalarım/FlowMind/FlowMind2.0" \
  "/Users/orkunsanliturk/Yazılım Çalışmalarım/FlowMind/Yedekler/FlowMind_Snapshots/FlowMind_2.0_$(date +%Y%m%d)"
  ```
````

Snapshot alındıktan sonra dosya listesi otomatik olarak doğrulanır (ls -lh ile).

```markdown
## 9️⃣ Dış Ajan (External Agent) Entegrasyonu

FlowMind, gelecekte harici ajanlarla genişletilebilir:

- **GitHub Actions Agent:** Otomatik build ve test akışı.
- **Firebase Sync Agent:** Gerçek zamanlı veri senkronizasyonu.
- **ReleaseBot:** Sürüm numaralama ve changelog oluşturma.

> Dış ajanlar Manifest.md dosyasını okuyarak sistem yapısını anlayabilir.
> Bu dosya FlowMind’ın _tek kaynaklı hakikat (Single Source of Truth)_ belgesidir.
```

## 🔟 Oturum Kapanışı ve Hafıza Koruması

1. ChatGPT, her oturum sonunda şu kontrolleri yapar:

   - 📁 Lokal snapshot alınmış mı?
   - ☁️ GitHub’a son push yapılmış mı?
   - 💾 Manifest ve README dosyaları güncel mi?

2. Bu koşullar sağlanmazsa otomatik uyarı verir:

   > “🟡 Manifest veya README güncel görünmüyor, snapshot almayı unutma.”

3. Kullanıcı **“Evet, snapshot alındı”** dediğinde oturum güvenli şekilde sonlandırılır.

## 1️⃣1️⃣ Proje Kapanış Protokolü

FlowMind 2.0 tamamlandığında:

- Git kurulumu öğretilecek.
- Versiyonlama (`commit`, `branch`, `merge`) uygulamalı yapılacak.
- Son commit etiketi: `v2.0_final`
- Ardından README ve Manifest kilitlenir (salt okunur hâle getirilir).

---

📅 **Son Güncelleme:** 9 Kasım 2025
📘 **Dosya:** `Project_Notes/Manifest.md`
✍️ **Hazırlayan:** ChatGPT (GPT-5) + Orkun Şanlıtürk
