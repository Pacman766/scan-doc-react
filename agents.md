## Проект scan-doc-react — справка для агентов

### Назначение
Одностраничное React‑приложение для сканирования и управления страницами документов в составе портала Leader.

### Технологический стек
- React 18, TypeScript
- Redux Toolkit, React‑Redux
- React‑Bootstrap
- Webpack, react-scripts (CRA)
- Jest, @testing-library/*
- Axios (работа с API)

### Быстрый старт
1. Node 18+ и npm установлены.
2. Установка зависимостей:
   - `npm ci` (рекомендуется) или `npm i`
3. Запуск разработки: `npm start`
   - Откроется `http://localhost:3000`
   - Проксирование API настроено на `http://atum.minsk.isida.by:11480` (см. `package.json: proxy`).

### Сборка
- Продакшен‑сборка: `npm run build`
- Результат в папке `build/` (минифицированные бандлы с хешами).

### Тесты
- Запуск тестов: `npm test`
- Конфигурация: `src/jest.config.js`, `src/setupTests.js`, библиотеки `@testing-library/*`.

### Структура проекта (основное)
- `public/` — статические ресурсы (HTML, изображения-инструкции `jpg/`).
- `src/`
  - `components/` — UI‑компоненты:
    - `MainWindow.tsx`, `Navigation.tsx`, `ScanPanel.tsx`, `ScannedPages.tsx`, `ScannedPage.tsx`
    - кнопки: `buttonDefault/`, `buttonOutline/`
    - сервисные элементы: `Sidebar.tsx`, `VerticalSeparator.tsx`, `SettingsDialog.tsx`, `settingsDropdown/`
  - `store/` — Redux‑хранилище:
    - `slices/`: `configSlice.ts`, `filesSlice.ts`, `scaleSlice.ts`, `scannerSlice.ts`
    - `api/`: `configApi.ts` (работа с конфигом/бэкендом через Axios)
  - `hooks/` — пользовательские хуки (`useScanFiles`, `useConfig`, `useChangeImgSize`, `useIntersectionObserver`).
  - `types/` — типы доменной модели (скан‑файлы, сканер, конфиг и пр.).
  - `utils/Files.ts` — утилиты для работы с файлами/страницами.
  - `App.tsx`, `index.tsx` — входные точки приложения.

### Конфигурация и окружение
- Прокси к API задан в `package.json` → `proxy: "http://atum.minsk.isida.by:11480"`.
- Переменные окружения CRA: `REACT_APP_*` (через `.env`, если потребуется).
- Стили: базово `bootstrap` и локальные CSS (`App.css`, `index.css`).

### Сборочный пайплайн (рекомендация для интеграции)
1. Выполнить `npm ci && npm run build`.
2. Разместить содержимое `build/` в соответствующем каталоге фронтенда портала (по правилам сборки проекта Leader).

### Полезные файлы
- `package.json` — зависимости, скрипты, прокси.
- `webpack.config.js`, `tsconfig.json` — конфигурации сборки и TypeScript.
- `public/jpg/api_page-000*.jpg` — иллюстрации интерфейса/API.

### Контакты/заметки
- При недоступности API проверьте прокси и CORS.
- Состояние приложения хранится в Redux с декомпозицией по слайсам.

