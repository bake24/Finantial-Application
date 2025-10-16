# Руководство по внесению вклада

Спасибо за интерес к проекту Bitcoin Loan App! Мы приветствуем вклад от сообщества.

## 🚀 Как внести вклад

### 1. Форк и клонирование

```bash
# Сделайте форк репозитория на GitHub

# Клонируйте свой форк
git clone https://github.com/YOUR_USERNAME/bitcoin-loan-app.git
cd bitcoin-loan-app

# Добавьте upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/bitcoin-loan-app.git
```

### 2. Создание ветки

```bash
# Обновите main ветку
git checkout main
git pull upstream main

# Создайте feature ветку
git checkout -b feature/your-feature-name

# Или для исправления ошибки:
git checkout -b fix/bug-description
```

### 3. Внесение изменений

```bash
# Внесите свои изменения

# Проверьте типы
npm run type-check

# Проверьте линтинг
npm run lint

# Убедитесь, что приложение работает
npm run dev
```

### 4. Коммит

Следуйте конвенции коммитов:

```bash
# Формат: type(scope): subject

# Типы:
# feat: новая функциональность
# fix: исправление ошибки
# docs: изменения в документации
# style: форматирование, отсутствие изменений в коде
# refactor: рефакторинг кода
# test: добавление тестов
# chore: обновление зависимостей, конфигурации

# Примеры:
git commit -m "feat(loan): add early repayment calculation"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs(readme): update installation instructions"
```

### 5. Push и Pull Request

```bash
# Push в ваш форк
git push origin feature/your-feature-name

# Создайте Pull Request на GitHub
# Опишите ваши изменения
# Свяжите с соответствующим Issue, если есть
```

## 📋 Чек-лист перед PR

- [ ] Код следует архитектуре FSD
- [ ] Добавлены TypeScript типы
- [ ] Код прошел линтинг (`npm run lint`)
- [ ] TypeScript проверка пройдена (`npm run type-check`)
- [ ] Приложение успешно собирается (`npm run build`)
- [ ] Проверена работа в dev режиме (`npm run dev`)
- [ ] Добавлена документация (если нужно)
- [ ] Коммит следует конвенции
- [ ] PR имеет понятное описание

## 🏗️ Структура проекта

Ознакомьтесь с [ARCHITECTURE.md](./ARCHITECTURE.md) для понимания структуры проекта.

### Основные принципы:

1. **FSD архитектура**: Следуйте слоям (shared → entities → features → widgets → pages)
2. **TypeScript**: Все новые файлы должны быть типизированы
3. **Tailwind CSS**: Используйте утилитарные классы
4. **Public API**: Экспортируйте через `index.ts`

## 🎨 Стиль кода

### TypeScript

```typescript
// ✅ Хорошо: явные типы, интерфейсы
interface LoanData {
  amount: number;
  term: number;
}

function calculateLoan(data: LoanData): number {
  return data.amount * data.term;
}

// ❌ Плохо: any, без типов
function calculateLoan(data: any) {
  return data.amount * data.term;
}
```

### React компоненты

```typescript
// ✅ Хорошо: FC с типами, экспорт интерфейсов
export interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};

// ❌ Плохо: без типов
export const Button = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};
```

### Импорты

```typescript
// ✅ Хорошо: используйте alias
import { Button } from '@/shared/ui';
import { useUserStore } from '@/entities/user';

// ❌ Плохо: относительные пути
import { Button } from '../../../shared/ui/Button';
```

## 🧪 Тестирование

Если добавляете тесты (приветствуется!):

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## 📝 Документация

При добавлении новой функциональности:

1. Обновите README.md (если нужно)
2. Добавьте JSDoc комментарии к функциям
3. Обновите ARCHITECTURE.md (для значительных изменений)

```typescript
/**
 * Рассчитывает ежемесячный платеж по займу
 * @param principal - Сумма займа в BTC
 * @param months - Срок займа в месяцах
 * @returns Ежемесячный платеж в BTC
 */
export function calculateMonthlyPayment(
  principal: number,
  months: number
): number {
  // ...
}
```

## 🐛 Сообщение об ошибках

При создании Issue:

1. Используйте понятный заголовок
2. Опишите шаги для воспроизведения
3. Укажите ожидаемое и фактическое поведение
4. Добавьте скриншоты (если применимо)
5. Укажите версию браузера/Node.js

### Шаблон Issue:

```markdown
## Описание
Краткое описание проблемы

## Шаги для воспроизведения
1. Перейти на страницу X
2. Кликнуть на Y
3. Увидеть ошибку

## Ожидаемое поведение
Что должно произойти

## Фактическое поведение
Что произошло на самом деле

## Окружение
- OS: macOS 13.0
- Browser: Chrome 120
- Node.js: 18.17.0
```

## 💡 Идеи для вклада

### Хорошие первые задачи:

- Добавить тесты для существующих компонентов
- Улучшить документацию
- Добавить валидацию форм
- Улучшить доступность (a11y)
- Добавить анимации переходов
- Оптимизировать производительность

### Более сложные задачи:

- Реализовать реальную интеграцию с API
- Добавить аутентификацию через JWT
- Реализовать историю займов
- Добавить уведомления
- Реализовать экспорт данных
- Добавить интернационализацию (i18n)

## 📞 Связь

- GitHub Issues: для багов и фич
- GitHub Discussions: для вопросов и идей

## 📜 Code of Conduct

Будьте вежливы и уважительны к другим участникам. Мы создаем дружелюбное сообщество для всех.

## 🎉 Спасибо!

Каждый вклад ценен, будь то код, документация, или баг-репорты. Спасибо за помощь в улучшении Bitcoin Loan App!

