# كاميرا الحقيقة (Caméra de la Vérité / Vérité Climat)
# دليل المهام التنفيذية — المرحلة 5 (Phase 5 Tasks: Screen 6 — Climax, 2050 Simulation & Certificate)

## بيئة العمل: React + Vite + TypeScript + Tailwind CSS

---

## 1. نظرة عامة (Phase 5 Overview)

### 1.1 الهدف الأساسي
تنفيذ **الشاشة 6 (الذروة والختام)**:
- شريط محاكاة مسارات `Transitions 2050` الأربعة (slider).
- مشهد تماسك الجبل الجليدي (0% melt).
- توليد شهادة « Porteur de Caméra Éclairé ».
- زر « Partager mon certificat » و « Rejouer » (إعادة تعيين الجلسة).

### 1.2 الالتزامات
- **≤ 3 عناصر تفاعلية**.
- **لغة فرنسية**.
- **حيادية وإيجابية**.

---

## 2. بنية ملفات المرحلة 5 (Phase 5 Target Structure)

```text
defi-principale-2023-Noujoum/
├── src/
│   ├── screens/
│   │   └── Screen6Climax.tsx
│   └── App.tsx  (محدّث: توجيه 6)
```

---

## 3. قائمة المهام التفصيلية (Detailed Phase 5 Task List)

### المجموعة 1: الشاشة 6 (Screen 6 — Climax)
- [x] **المهمة 5.1**: إنشاء `src/screens/Screen6Climax.tsx`:
  - جلب مسارات 2050 (`GET /transitions-2050/pathways`).
  - شريط سحب (slider) لاختيار مسار (S1-S4) مع عرض فرضياته.
  - IcebergWidget (solid_consolidated, 0% melt) مع بريق.
  - زر « Générer mon certificat » → `POST /certificate/generate` → عرض الشهادة.
  - عرض شهادة (recipientTitle, verifiedClaimsCount, shareableSummaryText).
  - زر « Rejouer » → `POST /session/reset` → العودة للشاشة 2.

### المجموعة 2: توجيه App
- [x] **المهمة 5.2**: تحديث `src/App.tsx` لتوجيه الشاشة 6.

---

## 4. خطوات التحقق (Phase 5 Handshake Checkpoint)

```bash
npm run typecheck
npm run build
```

### معايير القبول (DoD)
- [x] الشاشة 6 منجزة.
- [x] slider يعرض 4 مسارات.
- [x] شهادة تُولّد وتُعرض.
- [x] زر Rejouer يعيد إلى الشاشة 2.
- [x] الجبل الجليدي متماسك (0%).
- [x] اجتياز typecheck و build.
