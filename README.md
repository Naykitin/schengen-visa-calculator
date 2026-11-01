# Schengen Visa Calculator (90/180 Rule) 🇪🇺✈️

An open-source, privacy-first mobile web application and PWA for tracking, calculating, and planning Schengen area stays according to the official **90 days within any 180-day period** rule (EU Regulation 2016/399).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI Tests](https://github.com/Naykitin/schengen-visa-calculator/actions/workflows/ci.yml/badge.svg)](https://github.com/Naykitin/schengen-visa-calculator/actions)

---

## 🌟 Возможности (Features)

- **Математически точный расчет 90/180:** Полное соответствие официальному Шенгенскому кодексу о границах (Regulation EU 2016/399). День въезда и выезда считаются днями пребывания.
- **Интерактивный дашборд:** Наглядный счетчик оставшихся дней, индикатор «в Шенгене / вне Шенгена», график заполненности 90-дневного лимита.
- **Умный планировщик будущих поездок:**
  - *«Когда я смогу поехать на N дней?»* — автопоиск ближайшей даты въезда без нарушений.
  - *«Проверить даты»* — валидация планируемой поездки с точным указанием дня возможного оверстея.
- **Календарный вид:** Интерактивный календарь с цветовой индикацией поездок, планов и контролем 180-дневного окна на любой выбранный день.
- **Офлайн и Local-First:**
  - Данные хранятся в защищенной памяти устройства через `IndexedDB` с поддержкой Persistent Storage API (`navigator.storage.persist()`).
  - Данные не стираются браузером и не передаются на сторонние серверы.
- **Резервное копирование:** Экспорт и импорт истории поездок в JSON-файл в один клик.
- **PWA (Мобильное приложение):** Устанавливается на главный экран iPhone (Safari -> «На экран «Домой»») и Android (Chrome -> «Установить приложение»), работает офлайн.

---

## 🛠️ Стек технологий (Tech Stack)

- **Frontend:** React 19, TypeScript, Vite
- **Стилизация:** Tailwind CSS, Lucide Icons
- **Хранилище:** IndexedDB (`idb-keyval`) + LocalStorage fallback
- **Тестирование:** Vitest
- **Хостинг:** Cloudflare Pages (100% Free)
- **CI/CD:** GitHub Actions

---

## 🌿 GitFlow Модель ветвления

В репозитории принята стандартная модель **GitFlow**:
- `main` — Стабильные релизы в продакшн (тегируются `v1.0.0`, `v1.1.0` и т.д.).
- `develop` — Основная ветка активной разработки.
- `feature/*` — Ветки разработки отдельных функций (создаются от `develop` и вливаются обратно в `develop`).
- `hotfix/*` — Срочные исправления для ветки `main`.

---

## 🚀 Локальный запуск (Local Development)

### Требования
- Node.js 18+ (рекомендуется 20+)
- npm 9+

### Команды
```bash
# Клонирование репозитория
git clone https://github.com/Naykitin/schengen-visa-calculator.git
cd schengen-visa-calculator

# Установка зависимостей
npm install

# Запуск локального сервера разработки
npm run dev

# Запуск тестов расчета 90/180
npm test

# Сборка для продакшена
npm run build
```

---

## ☁️ Размещение на Cloudflare Pages (Бесплатно)

1. Зайдите в [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Перейдите в раздел **Workers & Pages** -> **Create application** -> вкладка **Pages**
3. Нажмите **Connect to Git** и выберите репозиторий `Naykitin/schengen-visa-calculator`
4. В настройках сборки укажите:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Production branch:** `main` (или `develop` для превью)
5. Нажмите **Save and Deploy**. Cloudflare автоматически соберет проект и выдаст бесплатный URL вида `*.pages.dev` с SSL-сертификатом и глобальным CDN.

---

## 📄 Лицензия (License)

Проект распространяется под свободной пермиссивной лицензией **[MIT](LICENSE)**. Вы можете свободно использовать, модифицировать, форкать и распространять этот код.
