# كاميرا الحقيقة (Caméra de la Vérité / Vérité Climat)
## عقد الواجهات البرمجية وتكامل البيانات (API Contract & Data Protocol Specification)
### النسخة: MVP 1.0 — الوثيقة التعاقدية المرجعية

---

## فهرس المحتويات

1. [المواصفات والاتفاقيات العامة (Conventions & Protocols)](#1-المواصفات-والاتفاقيات-العامة-conventions--protocols)
2. [نموذج الاستجابة القياسي (Standard Response Envelope)](#2-نموذج-الاستجابة-القياسي-standard-response-envelope)
3. [رموز الحالة وأكواد الأخطاء القياسية (HTTP & Business Error Codes)](#3-رموز-الحالة-وأكواد-الأخطاء-القياسية-http--business-error-codes)
4. [واجهات الادعاءات ومحاكاة الكاميرا (Claims & Viewfinder Endpoints)](#4-واجهات-الادعاءات-ومحاكاة-الكاميرا-claims--viewfinder-endpoints)
5. [واجهات بطاقة التحقق والتقييم العلمي (Verification & Fact-Checking Endpoints)](#5-واجهات-بطاقة-التحقق-والتقييم-العلمي-verification--fact-checking-endpoints)
6. [واجهات مستودع المصادر والحدود المعرفية (Sources & Boundaries Endpoints)](#6-واجهات-مستودع-المصادر-والحدود-المعرفية-sources--boundaries-endpoints)
7. [واجهات آلة حالة الجبل الجليدي (Iceberg State Endpoints)](#7-واجهات-آلة-حالة-الجبل-الجليدي-iceberg-state-endpoints)
8. [واجهات محاكاة مسارات 2050 (Transitions 2050 Simulation Endpoints)](#8-واجهات-محاكاة-مسارات-2050-transitions-2050-simulation-endpoints)
9. [واجهات شهادة حامل الكاميرا والجلسة (Certificate & Session Endpoints)](#9-واجهات-شهادة-حامل-الكاميرا-والجلسة-certificate--session-endpoints)
10. [الملحق أ — كائنات نقل البيانات المشتركة (Appendix A: Shared DTOs)](#10-الملحق-أ--كائنات-نقل-البيانات-المشتركة-appendix-a-shared-dtos)
11. [الملحق ب — مصفوفة الربط بالشاشات الست ومصادر Ressources.md (Appendix B: Screen & Source Mapping)](#11-الملحق-ب--مصفوفة-الربط-بالشاشات-الست-ومصادر-ressourcesmd-appendix-b-screen--source-mapping)

---

## 1. المواصفات والاتفاقيات العامة (Conventions & Protocols)

### 1.1 طبيعة الواجهة البرمجية وبيئة التشغيل
وفقاً لمقررات `cahier_charge.md` و `architecture.md`، يعمل تطبيق **«كاميرا الحقيقة»** كتطبيق صفحة واحدة خفيف (Lightweight SPA). تُمثل الواجهات المعرفة في هذا المستند العقد البرمجي الصارم (API Data Contract) الذي يربط مكونات واجهة المستخدم (Frontend UI Components) بمحرك البيانات المحلي (Local Data Engine / Static API Service)، وهي مهيأة للعمل الفوري بنمطين:
1. **نمط الإنتاج المستقل (Zero-Runtime Backend)**: يُنفذ هذا العقد بالكامل عبر محرك محلي في المتصفح يقرأ بيانات JSON الثابتة والمهيكلة من مسار الأصول الداخلي مع زمن استجابة شبه فوري (< 30ms).
2. **نمط خادم الخدمات الثابتة (Mock / Headless REST API)**: يمكن تشغيل هذا العقد عبر خادم تطوير محلي أو Edge Function دون تعديل سطر واحد في كود العميل.

### 1.2 مسارات العناوين والإصدارات (Base URL & Versioning)

```text
Production (Local Engine) : /api/v1
Development (Vite Dev)    : http://localhost:5173/api/v1
Static Fallback Directory : /data/v1/
```

### 1.3 المصادقة والتفويض (Authentication & Authorization)
* **Zero-Auth Protocol**: جميع المسارات مفتوحة للعموم (`Public`) بدون اشتراط توفير رموز مرور أو مفاتيح Bearer JWT، تنفيذاً للشرط الصارم: «لا تسجيل دخول، لا APIs خارجية، ولا أدوار إدارية معقدة».
* **أطراف الطلب**: الطرف الوحيد المخول هو **«حامل الكاميرا» (Porteur de Caméra)**، وتُدار جلسته كجلسة استكشافية مجهولة الهوية تحترم خصوصية المستخدم بنسبة 100% (Zero-PII).

### 1.4 لغة البيانات والترميز
* **الترميز**: UTF-8 لجميع التبادلات النصية.
* **لغة المحتوى**: نصوص الادعاءات والمصادر والشروح العلمية باللغة الفرنسية (وفقاً لمنطوق المصادر الأصلية في فرنسا: ADEME, IPCC, HCC). العناوين وحقول البيانات التقنية بالإنجليزية القياسية، مع دعم النصوص التفسيرية بالعربية في الوثيقة للتدقيق والمطابقة.

---

## 2. نموذج الاستجابة القياسي (Standard Response Envelope)

تعتمد كافة الاستجابات هيكل تغليف موحد وثابت (Uniform Envelope) لضمان اتساق المعالجة في الواجهة الأمامية:

### 2.1 بنية الاستجابة الناجحة (Success Envelope)

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "timestamp": "2026-11-16T12:00:00.000Z",
    "version": "v1.0"
  }
}
```

### 2.2 بنية استجابة الخطأ (Error Envelope)

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERR_CODE",
    "message": "Description claire de l'erreur en français",
    "details": {
      "field": "Détails techniques de l'anomalie"
    }
  },
  "meta": {
    "timestamp": "2026-11-16T12:00:00.000Z",
    "version": "v1.0"
  }
}
```

---

## 3. رموز الحالة وأكواد الأخطاء القياسية (HTTP & Business Error Codes)

### 3.1 رموز حالة HTTP المدعومة

| كود الحالة | الاستخدام في النظام |
| :--- | :--- |
| `200 OK` | نجاح استرجاع بيانات الادعاء، أو المصدر، أو نتيجة التحقق، أو توليد الشهادة. |
| `400 Bad Request` | إرسال مدخلات غير مطابقة أو فقدان معرف الادعاء أو تشويه نص التأكيد. |
| `404 Not Found` | الادعاء المطلوب أو المصدر غير مسجل في مستودع البيانات المعتمد. |
| `422 Unprocessable` | محاولة مخالفة قواعد التدفق الخطي (مثل محاولة تصوير ادعاء قبل تأكيد الادعاء السابق في الشاشة 4). |

### 3.2 أكواد الأخطاء المنطقية (Domain Error Codes)

| كود الخطأ البرمجي | حالة HTTP | التوصيف والمعنى المنطقي |
| :--- | :--- | :--- |
| `CLAIM_NOT_FOUND` | 404 | الادعاء المطلوب غير موجود في قاعدة بيانات الشاشات. |
| `SOURCE_NOT_FOUND` | 404 | المصدر المستعلم عنه غير مسجل في قائمة المصادر العشرة المعتمدة. |
| `INVALID_SCREEN_FLOW` | 422 | محاولة الوصول لادعاء لا يتبع الشاشة الحالية أو خرق التتابع الخطي الصارم. |
| `OCR_CONFIRMATION_FAILED` | 400 | فشل التحقق من مطابقة النص المقروء أو غياب موافقة المستخدم. |
| `CONTEXT_LENS_REQUIRED` | 422 | محاولة تصوير ادعاء الشاشة 5 دون سحب عدسة السياق. |
| `INSUFFICIENT_EVIDENCE` | 200 (مع معالجة Fallback) | حالة تفعيل قاعدة الحياد عند نقص الدليل المباشر (تُرجع بطاقة محايدة دون خطأ خادم). |

---

## 4. واجهات الادعاءات ومحاكاة الكاميرا (Claims & Viewfinder Endpoints)

### 4.1 استرجاع قائمة الادعاءات حسب الشاشة
`GET /claims`

* **الهدف**: استرجاع بيانات الادعاءات المخصصة لشاشة معينة لتجهيز محدد الكاميرا.
* **الأمان**: Public.
* **معاملات الاستعلام (Query Parameters)**:
  - `screenId` (اختياري، رقمي من 1 إلى 6): تصفية الادعاءات الخاصة بشاشة محددة.
  - `limit` (افتراضي 10): الحد الأقصى للنتائج.

#### مثال الطلب:
`GET /api/v1/claims?screenId=2`

#### استجابة النجاح (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "claim-renewables-01",
      "screenId": 2,
      "sequenceOrder": 1,
      "rawText": "Les énergies renouvelables ne servent à rien pour freiner le réchauffement.",
      "category": "option_attenuation",
      "indicators": {
        "sourceIndicator": {
          "name": "Source",
          "hint": "IPCC / ADEME (Synthèses scientifiques)",
          "status": "yellow"
        },
        "evidenceIndicator": {
          "name": "Preuve",
          "hint": "Données historiques 2010-2019 disponibles",
          "status": "green"
        },
        "contextIndicator": {
          "name": "Contexte",
          "hint": "Moyenne mondiale vs réseaux locaux",
          "status": "yellow"
        }
      }
    }
  ],
  "error": null,
  "meta": {
    "total": 1,
    "screen": 2
  }
}
```

---

### 4.2 استرجاع تفاصيل ادعاء فردي
`GET /claims/:id`

* **الهدف**: استرجاع بيانات ادعاء وحيد لتجهيزه داخل إطار الكاميرا البصرية.
* **الأمان**: Public.
* **معاملات المسار (Path Parameters)**:
  - `id` (نصي): المعرف الفريد للادعاء (مثل `claim-renewables-01`, `claim-inaction-01`, `claim-tech-save-02`, `claim-ev-context-01`).

#### استجابة النجاح (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "claim-inaction-01",
    "screenId": 4,
    "sequenceOrder": 1,
    "rawText": "Nous n'avons pas à agir : la France ne représente que 1% des émissions mondiales.",
    "category": "observation_historique",
    "inactionDiscoursePattern": "Le déni de responsabilité / Rejeter la faute (Bon Pote #3)",
    "indicators": {
      "sourceIndicator": {
        "name": "Source",
        "hint": "Réseau Action Climat / HCC / IPCC",
        "status": "yellow"
      },
      "evidenceIndicator": {
        "name": "Preuve",
        "hint": "Émissions territoriales vs Empreinte carbone globale",
        "status": "green"
      },
      "contextIndicator": {
        "name": "Contexte",
        "hint": "Responsabilité historique et émissions par habitant",
        "status": "green"
      }
    }
  },
  "error": null,
  "meta": null
}
```

---

### 4.3 محاكاة التقاط الكاميرا وتأكيد النص (Camera Scan Trigger)
`POST /claims/:id/scan`

* **الهدف**: محاكاة التقاط الكاميرا (Shutter click)، تطبيق تأثير الوميض البصري، وتأكيد نص الادعاء وفق حدود التعرف البصري (OCR Disclaimer).
* **الأمان**: Public.
* **جسم الطلب (Request Body)**:

```json
{
  "userConfirmedText": "Les énergies renouvelables ne servent à rien pour freiner le réchauffement.",
  "shutterTriggerType": "button_click"
}
```

#### استجابة النجاح (`200 OK`):
```json
{
  "success": true,
  "data": {
    "claimId": "claim-renewables-01",
    "scanTimestamp": "2026-11-16T12:05:00.000Z",
    "status": "scanned_ready_to_reveal",
    "ocrDisclaimer": {
      "isMatchingExact": true,
      "disclaimerText": "La reconnaissance visuelle et la détection textuelle ne constituent en aucun cas une preuve de véracité ou de fausseté de l'affirmation.",
      "userConfirmed": true
    },
    "animationDirective": {
      "shutterFlashDurationMs": 150,
      "nextScreenId": 3
    }
  },
  "error": null,
  "meta": null
}
```

---

## 5. واجهات بطاقة التحقق والتقييم العلمي (Verification & Fact-Checking Endpoints)

### 5.1 كشف التقييم وبطاقة التحقق الرباعية
`POST /claims/:id/verify`

* **الهدف**: توليد وعرض بطاقة التحقق الرسمية بأركانها الأربعة وتحديد الحكم العلمي والسبب ولحظة الوعي (Aha moment) وتحديث الجبل الجليدي.
* **الأمان**: Public.
* **جسم الطلب (Request Body)**:

```json
{
  "includeFullContext": true
}
```

#### استجابة النجاح (`200 OK`) — مثال كشف ادعاء الطاقات المتجددة (الشاشتان 2 و 3):
```json
{
  "success": true,
  "data": {
    "claimId": "claim-renewables-01",
    "evaluation": "trompeur",
    "evaluationLabelFr": "Trompeur",
    "reasonFr": "Les énergies renouvelables constituent l'un des leviers d'atténuation les plus efficaces et leur coût s'est effondré de manière spectaculaire.",
    "ahaInsightFr": "Les indicateurs de preuve et de source suggéraient déjà une solide assise scientifique : le solaire et l'éolien ont réduit les émissions réelles de manière mesurable.",
    "actionablePositiveInsightFr": "Le déploiement des énergies décarbonées, couplé à la sobriété et à l'efficacité énergétique, offre des bénéfices économiques et environnementaux immédiats.",
    "verificationCard": {
      "source": {
        "entity": "Groupe d'experts intergouvernemental sur l'évolution du climat (IPCC / GIEC)",
        "sourceCategory": "scientifique_institutionnel",
        "documentTitle": "Sixième rapport d'évaluation (AR6) - Groupe de travail III (Atténuation)",
        "publicationDate": "2022-2023",
        "officialUrl": "https://www.ipcc.ch/"
      },
      "whatWeFound": {
        "findingQuote": "Le coût unitaire de l'énergie solaire photovoltaïque a chuté de 85 % et celui de l'éolien de 55 % entre 2010 et 2019, avec une multiplication exponentielle de leur capacité installée.",
        "exactReference": "AR6 WG3 Summary for Policymakers (SPM), Figure SPM.3 & Section C.4",
        "directLink": "https://www.ipcc.ch/report/ar6/wg3/"
      },
      "contextAndLimits": {
        "period": "2010 - 2019 (Tendances historiques observées)",
        "geographicScope": "Moyenne mondiale consolidée",
        "scenarioOrModel": "Trajectoires d'atténuation compatibles avec 1.5°C et 2°C",
        "confidenceLevel": "Degré de confiance très élevé (Very High Confidence)"
      },
      "whatWeDoNotKnow": "Le rapport ne préjuge pas des conditions d'intégration topographiques et des équilibres d'acceptabilité locale spécifiques à chaque réseau communal sans étude d'impact dédiée.",
      "neutralFallbackTriggered": false
    },
    "icebergImpact": {
      "previousMeltIndex": 50,
      "newMeltIndex": 65,
      "stateTransition": "first_scan_melt",
      "visualFeedback": "melt_burst_minor"
    }
  },
  "error": null,
  "meta": null
}
```

---

### 5.2 تطبيق عدسة السياق على ادعاءات الطبقة العميقة (Context Lens - Screen 5)
`POST /claims/:id/context-lens`

* **الهدف**: فحص الادعاء متعدد الأبعاد (مثل السيارات الكهربائية) وتطبيق عدسة السياق والعدالة الاجتماعية لاستخلاص تقييم «يحتاج سياقاً» (`necessite_contexte`).
* **الأمان**: Public.
* **جسم الطلب (Request Body)**:

```json
{
  "lensSliderPosition": 100,
  "contextDimensions": [
    "lifecycle_battery",
    "national_electricity_mix",
    "social_justice_access"
  ]
}
```

#### استجابة النجاح (`200 OK`) — الشاشة 5 (السياق والطبقة العميقة):
```json
{
  "success": true,
  "data": {
    "claimId": "claim-ev-context-01",
    "rawText": "La voiture électrique pollue autant que la voiture thermique.",
    "evaluation": "necessite_contexte",
    "evaluationLabelFr": "Nécessite du contexte",
    "reasonFr": "En France, sur l'ensemble de son cycle de vie, un véhicule électrique émet 2 à 3 fois moins de gaz à effet de serre qu'un véhicule thermique, mais cette performance dépend du mix électrique et de la taille de la batterie.",
    "socialJusticeDimension": {
      "principle": "Justice sociale et transition juste",
      "insightFr": "La transition vers le véhicule électrique ne doit pas creuser les inégalités économiques : les ménages ruraux et modestes nécessitent des aides ciblées et un développement massif des transports en commun pour éviter toute précarité de mobilité.",
      "supportingSources": ["Réseau Action Climat", "ADEME", "HCC"]
    },
    "verificationCard": {
      "source": {
        "entity": "ADEME & Haut Conseil pour le climat (HCC)",
        "sourceCategory": "institutionnel",
        "documentTitle": "Avis sur le véhicule électrique & Rapport annuel de neutralité",
        "publicationDate": "2022-2026 (Rapport HCC n°8 du 9 juillet 2026)",
        "officialUrl": "https://www.ademe.fr/"
      },
      "whatWeFound": {
        "findingQuote": "Une berline électrique roulant en France rembourse sa « dette carbone » de fabrication dès 15 000 à 30 000 km, et réduit l'empreinte carbone globale d'environ 65 % par rapport à un équivalent essence.",
        "exactReference": "ADEME - Étude ACV des véhicules électriques (2022) / HCC Rapport 2026 p. 84",
        "directLink": "https://data.ademe.fr/"
      },
      "contextAndLimits": {
        "period": "2022 - 2026",
        "geographicScope": "France métropolitaine (Mix électrique largement décarboné)",
        "scenarioOrModel": "Analyse du Cycle de Vie (ACV complète du berceau à la tombe)",
        "confidenceLevel": "Fiabilité méthodologique haute pour le périmètre français"
      },
      "whatWeDoNotKnow": "Ces résultats ne peuvent être directement extrapolés aux pays dont le mix électrique dépend majoritairement du charbon (ex. Pologne, Inde) sans réajustement des facteurs d'émissions.",
      "neutralFallbackTriggered": false
    },
    "icebergImpact": {
      "previousMeltIndex": 65,
      "newMeltIndex": 35,
      "stateTransition": "context_recovering",
      "visualFeedback": "freeze_consolidation_partial"
    }
  },
  "error": null,
  "meta": null
}
```

---

### 5.3 تفعيل قاعدة الحياد عند نقص الأدلة المباشرة (Neutral Fallback Protocol)
في حال استدعاء التحقق على ادعاء أو عبارة لم يرد لها سند قطعي في المصادر المتاحة:

```json
{
  "success": true,
  "data": {
    "claimId": "claim-unverified-sample",
    "evaluation": "non_verifie",
    "evaluationLabelFr": "Non vérifié dans nos sources",
    "reasonFr": "Nous n'avons pas pu vérifier cette formulation à partir des sources présentées.",
    "verificationCard": {
      "source": {
        "entity": "Sources scientifiques du projet (IPCC / ADEME / HCC)",
        "sourceCategory": "scientifique_institutionnel",
        "documentTitle": "Corpus de référence du projet Vérité Climat",
        "publicationDate": "2026",
        "officialUrl": "https://www.ipcc.ch/"
      },
      "whatWeFound": {
        "findingQuote": "Aucun extrait textuel ou donnée quantitative directe ne correspond exactement aux termes de cette affirmation dans les rapports indexés.",
        "exactReference": "Corpus complet Ressources.md",
        "directLink": ""
      },
      "contextAndLimits": {
        "period": "Toutes périodes",
        "geographicScope": "Non applicable",
        "scenarioOrModel": "Absence de correspondance directe",
        "confidenceLevel": "Indéterminé"
      },
      "whatWeDoNotKnow": "L'absence de mention dans notre corpus ne permet pas de qualifier cette assertion de fausse ou de vraie.",
      "neutralFallbackTriggered": true
    }
  },
  "error": null,
  "meta": null
}
```

---

## 6. واجهات مستودع المصادر والحدود المعرفية (Sources & Boundaries Endpoints)

### 6.1 استرجاع قائمة المصادر المعتمدة
`GET /sources`

* **الهدف**: استرجاع قائمة المصادر الرسمية العشرة مع تصنيفاتها وحدود استخدامها الصارمة المنصوص عليها في `Ressources.md`.
* **الأمان**: Public.

#### استجابة النجاح (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "ipcc",
      "officialName": "Intergovernmental Panel on Climate Change (IPCC / GIEC)",
      "category": "scientifique_institutionnel",
      "roleFr": "Source de référence suprême pour l'évaluation scientifique collégiale et synthétique.",
      "keyCaveatFr": "Distinguer observations et projections. Les chiffres pré-COP26 doivent rester datés.",
      "url": "https://www.ipcc.ch/"
    },
    {
      "id": "ademe",
      "officialName": "Agence de la transition écologique (ADEME)",
      "category": "institutionnel",
      "roleFr": "Source institutionnelle pour les données, scénarios et bilans français.",
      "keyCaveatFr": "Ne pas généraliser les ratios français au reste du monde ; citer la page ou l'étude.",
      "url": "https://www.ademe.fr/"
    },
    {
      "id": "ademe_open_data",
      "officialName": "Portail Open Data de l'ADEME (Base Carbone, ALDO, Bilans GES)",
      "category": "outil_interactif",
      "roleFr": "Facteurs d'émission et bilans organisationnels mesurables.",
      "keyCaveatFr": "Données ALDO estimatives et locales ; les bilans ne sont pas une moyenne nationale.",
      "url": "https://data.ademe.fr/"
    },
    {
      "id": "transitions_2050",
      "officialName": "ADEME - Transitions 2050",
      "category": "institutionnel",
      "roleFr": "Modélisation de 4 chemins prospectifs pour la France vers la neutralité carbone.",
      "keyCaveatFr": "Modèles exploratoires basés sur des hypothèses ; pas une prévision certaine ni un dogme.",
      "url": "https://data-transitions2050.ademe.fr/"
    },
    {
      "id": "rac",
      "officialName": "Réseau Action Climat (RAC)",
      "category": "pedagogique_mediatique",
      "roleFr": "Décryptage de l'urgence climatique et des solutions d'atténuation (rapport AR6).",
      "keyCaveatFr": "Distinguer les synthèses scientifiques des plaidoyers politiques de l'ONG. Éviter la culpabilisation.",
      "url": "https://reseauactionclimat.org/"
    },
    {
      "id": "nos_gestes_climat",
      "officialName": "Nos Gestes Climat (ADEME / ABC)",
      "category": "outil_interactif",
      "roleFr": "Simulateur d'empreinte carbone personnelle et leviers d'action.",
      "keyCaveatFr": "Estimation dépendante des choix de l'utilisateur, pas un audit officiel ni un jugement moral.",
      "url": "https://nosgestesclimat.fr/"
    },
    {
      "id": "climate_qa",
      "officialName": "Climate Q&A (Ekimetrics sur Hugging Face)",
      "category": "outil_interactif",
      "roleFr": "Outil d'interrogation et de recherche sémantique des rapports du GIEC/IPBES.",
      "keyCaveatFr": "Moteur d'extraction nécessitant de vérifier l'extrait original ; pas un juge autonome.",
      "url": "https://huggingface.co/spaces/Ekimetrics/climate-question-answering"
    },
    {
      "id": "hcc",
      "officialName": "Haut Conseil pour le climat (HCC)",
      "category": "institutionnel",
      "roleFr": "Évaluation indépendante des politiques publiques françaises sur le climat.",
      "keyCaveatFr": "Distinguer rigoureusement empreinte carbone globale et émissions territoriales.",
      "url": "https://www.hautconseilclimat.fr/"
    },
    {
      "id": "cned",
      "officialName": "Centre national d'enseignement à distance (CNED)",
      "category": "pedagogique_mediatique",
      "roleFr": "Modules pédagogiques sur le climat et typologie des allégations.",
      "keyCaveatFr": "Outil d'initiation et de catégorisation, pas un vérificateur automatique.",
      "url": "https://climat.cned.fr/formations"
    },
    {
      "id": "bon_pote",
      "officialName": "Bon Pote",
      "category": "pedagogique_mediatique",
      "roleFr": "Grille d'analyse des 12 discours de l'inaction climatique.",
      "keyCaveatFr": "Permet d'identifier un schéma d'argumentation sans pour autant prouver qu'il est faux.",
      "url": "https://bonpote.com/"
    }
  ],
  "error": null,
  "meta": {
    "totalSources": 10
  }
}
```

---

## 7. واجهات آلة حالة الجبل الجليدي (Iceberg State Endpoints)

### 7.1 استرجاع الحالة اللحظية للجبل الجليدي
`GET /iceberg/state`

* **الهدف**: تزويد ويدجت الجبل الجليدي ببيانات حالته البصرية، مؤشر الذوبان، والنص التفسيري الحيادي المخصص للمعينات البصرية.
* **الأمان**: Public.

#### استجابة النجاح (`200 OK`):
```json
{
  "success": true,
  "data": {
    "meltIndex": 50,
    "visualStage": "initial_cracked",
    "statusMessageFr": "L'iceberg reflète l'état actuel de l'information : fissuré sous le poids des discours contradictoires.",
    "icebergColorPalette": {
      "baseIceColor": "#E0F2FE",
      "crackWarningColor": "#EF4444",
      "solidGlowColor": "#10B981"
    },
    "noGuiltDisclaimer": "Cet indicateur mesure la solidité de la connaissance collective et non la responsabilité morale de l'utilisateur."
  },
  "error": null,
  "meta": null
}
```

---

## 8. واجهات محاكاة مسارات 2050 (Transitions 2050 Simulation Endpoints)

### 8.1 استرجاع مسارات التحول الأربعة لفرنسا (الشاشة 6)
`GET /transitions-2050/pathways`

* **الهدف**: تزويد شريط محاكاة الشاشة 6 بالمسارات النموذجية الأربعة لتقرير ADEME Transitions 2050 لتحقيق الحياد الكربوني في 2050.
* **الأمان**: Public.

#### استجابة النجاح (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "s1-generation-frugale",
      "title": "S1 — Génération Frugale",
      "tagline": "Sobriété forte, réduction de la consommation matérielle et alimentaire.",
      "keyAssumptions": "Baisse de 50% de la consommation de viande, division par deux des surfaces construites.",
      "energyMix": "100% renouvelable, très forte baisse de la demande énergétique globale.",
      "feasibilityContext": "Nécessite des transformations culturelles et d'organisation collective profondes."
    },
    {
      "id": "s2-cooperation-territoriale",
      "title": "S2 — Coopération Territoriale",
      "tagline": "Gouvernance locale partagée, réindustrialisation ciblée et économie circulaire.",
      "keyAssumptions": "Partage des biens, rénovation thermique massive, circuits courts territoriaux.",
      "energyMix": "Fort développement solaire et biomasse encadrée, maintien de l'activité.",
      "feasibilityContext": "Implique une forte coordination entre territoires ruraux et métropoles."
    },
    {
      "id": "s3-technologies-vertes",
      "title": "S3 — Technologies Vertes",
      "tagline": "Développement technologique vert, électrification massive et maintien des usages.",
      "keyAssumptions": "Véhicules électriques généralisés, numérisation optimisée, efficacité poussée.",
      "energyMix": "Nucléaire maintenu et renouvelables compétitives à grande échelle.",
      "feasibilityContext": "Pression accrue sur les métaux stratégiques et les chaînes logistiques mondiales."
    },
    {
      "id": "s4-pari-reparateur",
      "title": "S4 — Pari Réparateur",
      "tagline": "Maintien de la croissance matérielle compensé par la capture massive de carbone.",
      "keyAssumptions": "Déploiement massif du captage et stockage du CO2 (CSC), régimes alimentaires peu modifiés.",
      "energyMix": "Nucléaire de nouvelle génération, biocarburants et technologies de pointe.",
      "feasibilityContext": "Vulnérabilité face aux incertitudes technologiques du stockage géologique du carbone."
    }
  ],
  "error": null,
  "meta": {
    "source": "ADEME - Transitions 2050",
    "methodologyWarning": "Ces scénarios sont des explorations prospectives basées sur des hypothèses cohérentes, et non des prévisions univoques."
  }
}
```

---

## 9. واجهات شهادة حامل الكاميرا والجلسة (Certificate & Session Endpoints)

### 9.1 إصدار شهادة حامل الكاميرا (Screen 6)
`POST /certificate/generate`

* **الهدف**: توليد بيانات شهادة الإنجاز الرسمية «شهادة حامل الكاميرا» (Certificat de Porteur de Caméra) بناءً على الادعاءات التي تم فحصها وسياق الجبل الجليدي المتماسك.
* **الأمان**: Public.
* **جسم الطلب (Request Body)**:

```json
{
  "capturedClaimIds": [
    "claim-renewables-01",
    "claim-inaction-01",
    "claim-tech-save-02",
    "claim-ev-context-01"
  ],
  "selected2050PathwayId": "s2-cooperation-territoriale"
}
```

#### استجابة النجاح (`200 OK`):
```json
{
  "success": true,
  "data": {
    "certificateId": "CERT-VCLIMAT-2026-9481",
    "issuedAt": "2026-11-16T12:15:00.000Z",
    "recipientTitle": "Porteur de Caméra Éclairé",
    "verifiedClaimsCount": 4,
    "icebergFinalStatus": {
      "meltIndex": 0,
      "state": "solid_consolidated",
      "badgeTitle": "Iceberg Consolidé",
      "badgeIconSvg": "assets/svg/iceberg-stable.svg"
    },
    "coreLearningSummaryFr": "Vous avez su dépasser les raccourcis simplificateurs, identifier les sources fiables (GIEC, ADEME, HCC), contextualiser les leviers d'action et constater que des solutions collectives concrètes existent pour bâtir un avenir désirable.",
    "shareableSummaryText": "J'ai complété le parcours Vérité Climat : j'ai vérifié 4 affirmations clés avec les données du GIEC et de l'ADEME. Un avenir positif et décarboné est possible !",
    "actions": {
      "downloadPngUrl": "#canvas-export",
      "replayUrl": "/api/v1/session/reset"
    }
  },
  "error": null,
  "meta": null
}
```

---

### 9.2 إعادة تعيين الجلسة وإعادة اللعب (Session Reset Endpoint)
`POST /session/reset`

* **الهدف**: تصفير حالة الجلسة المحلية وإعادة المستخدم من الشاشة 6 إلى الشاشة 2 بمشهد جديد وحزمة ادعاءات مدعومة.
* **الأمان**: Public.

#### استجابة النجاح (`200 OK`):
```json
{
  "success": true,
  "data": {
    "sessionReset": true,
    "redirectToScreen": 2,
    "newScenePack": "scene_pack_b",
    "initialClaimId": "claim-buildings-insulation-01",
    "resetIcebergIndex": 50
  },
  "error": null,
  "meta": {
    "message": "Session réinitialisée avec succès pour une nouvelle exploration."
  }
}
```

---

## 10. الملحق أ — كائنات نقل البيانات المشتركة (Appendix A: Shared DTOs)

توضح هذه الواجهات البرمجية (TypeScript Interfaces) العقد الصارم المشترك لكائنات البيانات في النظام:

```typescript
// DTO للادعاء
export interface ClaimDTO {
  id: string;
  screenId: number;
  sequenceOrder?: number;
  rawText: string;
  category: 'observation_historique' | 'projection_conditionnelle' | 'option_attenuation' | 'option_adaptation';
  inactionDiscoursePattern?: string;
  indicators: {
    sourceIndicator: IndicatorDTO;
    evidenceIndicator: IndicatorDTO;
    contextIndicator: IndicatorDTO;
  };
}

// DTO للمؤشر التمهيدي
export interface IndicatorDTO {
  name: string;
  hint: string;
  status: 'green' | 'yellow' | 'red';
}

// DTO لبطاقة التحقق الرباعية
export interface VerificationCardDTO {
  source: {
    entity: string;
    sourceCategory: 'scientifique_institutionnel' | 'pedagogique_mediatique' | 'outil_interactif';
    documentTitle: string;
    publicationDate: string;
    officialUrl: string;
  };
  whatWeFound: {
    findingQuote: string;
    exactReference: string;
    directLink: string;
  };
  contextAndLimits: {
    period: string;
    geographicScope: string;
    scenarioOrModel: string;
    confidenceLevel: string;
  };
  whatWeDoNotKnow: string;
  neutralFallbackTriggered: boolean;
}

// DTO لحالة الجبل الجليدي
export interface IcebergStateDTO {
  meltIndex: number;
  visualStage: 'initial_cracked' | 'first_scan_melt' | 'sequenced_melt' | 'context_recovering' | 'solid_consolidated';
  statusMessageFr: string;
}

// DTO لشهادة حامل الكاميرا
export interface CertificateDTO {
  certificateId: string;
  issuedAt: string;
  recipientTitle: string;
  verifiedClaimsCount: number;
  icebergFinalStatus: {
    meltIndex: number;
    state: string;
    badgeTitle: string;
  };
  shareableSummaryText: string;
}
```

---

## 11. الملحق ب — مصفوفة الربط بالشاشات الست ومصادر Ressources.md (Appendix B: Screen & Source Mapping)

| الشاشة وفق `cahier_charge.md` | المسارات البرمجية المرتبطة في API Contract | المصادر المستدعاة ومحتواها الفعلي المعتمد من `Ressources.md` |
| :--- | :--- | :--- |
| **الشاشة 1: البداية (Onboarding)** | `GET /iceberg/state` | شاشة تمهيدية لتعريف دور حامل الكاميرا ومهمة فحص المعلومات. |
| **الشاشة 2: الكاميرا — المشهد الأول** | `GET /claims?screenId=2`, `POST /claims/:id/scan` | ادعاء الطاقات المتجددة ومقارنته بتقييم **IPCC AR6** و **ADEME**. |
| **الشاشة 3: النتيجة — أول كشف (لحظة Aha)** | `POST /claims/:id/verify` | بطاقة التحقق الرباعية وسند **IPCC WG3 (C.4)** ودرجة الثقة العالية. |
| **الشاشة 4: مفترق الطرق (ادعاء واحد متتابع)** | `GET /claims/:id`, `POST /claims/:id/verify` | ادعاءان متتابعان: تفكيك التقاعس وسند **Réseau Action Climat** و **IPCC**. |
| **الشاشة 5: السياق (الطبقة العميقة)** | `POST /claims/:id/context-lens` | تقييم «يحتاج سياقاً» للسيارات الكهربائية وسند **ADEME**, **HCC**, و **Nos Gestes Climat**. |
| **الشاشة 6: الذروة والختام** | `GET /transitions-2050/pathways`, `POST /certificate/generate`, `POST /session/reset` | مسارات **Transitions 2050** الأربعة، وتماسك الجبل، وتوليد شهادة حامل الكاميرا. |

---
*عقد الواجهات البرمجية جاهز ومكتمل لتوجيه خطتي الـ Backend والـ Frontend.*
