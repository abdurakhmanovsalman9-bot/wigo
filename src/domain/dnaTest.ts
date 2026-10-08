import { activityCategories, categoryForActivity, questionBankSize } from './dnaCatalog';

export type DnaAnswer = string | string[];
export type DnaAnswers = Record<string, DnaAnswer>;
export type DnaQuestion = {
  id: string;
  title: string;
  subtitle: string;
  choices: readonly { value: string; label: string }[];
  optional?: boolean;
  multiple?: boolean;
  maxChoices?: number;
};

const choice = (value: string, label: string) => ({ value, label });

const core: Record<string, DnaQuestion> = {
  intent: { id: 'intent', title: 'Представь: у тебя появилось свободное время. Чего хочется?', subtitle: 'Выбери то, чего сейчас не хватает больше всего.', choices: [choice('friends', 'Людей, рядом с которыми можно быть собой'), choice('plans', 'Интересных поводов выйти из дома'), choice('explore', 'Новых впечатлений — попробовать непривычное'), choice('company', 'Компании для того, что уже люблю')] },
  age: { id: 'age', title: 'Для начала — сколько тебе лет?', subtitle: 'Wigo доступен с 16 лет. В 16–17 показываем публичные события без алкоголя и взрослых форматов. Возрастная группа остаётся приватной.', choices: [choice('under16', 'Мне меньше 16'), choice('16-17', '16–17'), choice('18-24', '18–24'), choice('25-34', '25–34'), choice('35-44', '35–44'), choice('45-54', '45–54'), choice('55+', '55+')] },
  energy: { id: 'energy', title: 'После насыщенного дня хочется…', subtitle: 'Нет «правильного» уровня общительности.', choices: [choice('quiet', 'Тихой встречи и пространства'), choice('balanced', 'Немного общения и активности'), choice('lively', 'Людей, движения и впечатлений')] },
  companySize: { id: 'companySize', title: 'В какой компании легче быть собой?', subtitle: 'Выбирай комфортный старт, а не правило на всю жизнь.', choices: [choice('one', 'Один на один'), choice('small', 'Небольшая группа 3–5 человек'), choice('large', 'Большая компания')] },
  familiarity: { id: 'familiarity', title: 'С кем комфортно знакомиться?', subtitle: 'Твою границу можно изменить позже.', choices: [choice('friends', 'Пока только знакомые'), choice('friendsOfFriends', 'Друзья друзей'), choice('newPeople', 'Открыт(а) новым людям')] },
  connection: { id: 'connection', title: 'Как обычно завязывается хороший контакт?', subtitle: 'Представь приятную первую встречу.', choices: [choice('talk', 'Через спокойный разговор'), choice('activity', 'Когда вместе что-то делаем'), choice('mix', 'Немного того и другого')] },
  values: { id: 'values', title: 'После встречи ты думаешь: «Вот с этим человеком хочется ещё». Почему?', subtitle: 'Выбери до двух вещей, которые для тебя особенно важны.', multiple: true, maxChoices: 2, choices: [choice('kindness', 'Слушает и бережно относится к людям'), choice('humor', 'Рядом легко смеяться и не притворяться'), choice('reliability', 'Держит слово и уважает договорённости'), choice('curiosity', 'С ним интересно узнавать новое'), choice('openness', 'Можно быть разными и уважать друг друга'), choice('calm', 'Рядом спокойно, без давления')] },
  worldview: { id: 'worldview', title: 'Вы смотрите на важную тему по-разному. Что тебе комфортнее?', subtitle: 'Представь обычный разговор с новым знакомым.', choices: [choice('curious', 'Узнать, как он к этому пришёл — мне интересно'), choice('respectful', 'Оставить каждому своё мнение и сменить тему'), choice('aligned', 'Для близкого общения мне важны похожие взгляды')] },
  planningStyle: { id: 'planningStyle', title: 'Как рождается удачный план?', subtitle: 'Ритм встреч важнее ярлыка «спонтанный».', choices: [choice('now', 'Решаю в тот же день'), choice('week', 'За пару дней'), choice('planned', 'Люблю планировать заранее')] },
  budget: { id: 'budget', title: 'Какой план можно выбрать, не переживая о расходах?', subtitle: 'Бюджет на одного человека за встречу. Можно пропустить или поменять позже.', optional: true, choices: [choice('free', 'Сейчас лучше бесплатные планы'), choice('under5', 'До 5 000 ₸'), choice('5to10', '5 000–10 000 ₸'), choice('10to20', '10 000–20 000 ₸'), choice('over20', 'Больше 20 000 ₸'), choice('flexible', 'Смотрю на конкретный план')] },
  payment: { id: 'payment', title: 'Если встреча платная, как удобнее договориться?', subtitle: 'Проще обсудить заранее — без неловкости и ожиданий.', optional: true, choices: [choice('split', 'Каждый оплачивает своё'), choice('equal', 'Делим общий счёт поровну'), choice('invite', 'Приглашающий предлагает оплатить'), choice('alternate', 'Можно по очереди'), choice('talk', 'Договоримся по ситуации')] },
  time: { id: 'time', title: 'Когда чаще получается встретиться?', subtitle: 'Можно выбрать два окна.', multiple: true, maxChoices: 2, choices: [choice('weekdayEvening', 'Будни вечером'), choice('weekdayDay', 'Будни днём'), choice('weekendDay', 'Выходные днём'), choice('weekendEvening', 'Выходные вечером'), choice('flexible', 'Время меняется')] },
  category: { id: 'category', title: 'Что хочется попробовать вместе?', subtitle: 'Выбери до трёх направлений — дальше уточним одно из них.', multiple: true, maxChoices: 3, choices: activityCategories.map(({ id, label }) => choice(id, label)) },
  companyPreference: { id: 'companyPreference', title: 'Есть ли пожелание к компании на первой встрече?', subtitle: 'Можно пропустить. Выбирай свой комфорт, ничего объяснять не нужно.', optional: true, choices: [choice('any', 'Главное — общие интересы'), choice('mixed', 'Мне нравится смешанная компания'), choice('women', 'Комфортнее в женской компании'), choice('men', 'Комфортнее в мужской компании'), choice('smallTrusted', 'Сначала маленькая группа знакомых людей')] },
  boundaries: { id: 'boundaries', title: 'Последний штрих: что поможет тебе чувствовать себя комфортно?', subtitle: 'Можно выбрать любое количество условий или пропустить.', optional: true, multiple: true, maxChoices: 5, choices: [choice('public', 'Публичное место для первой встречи'), choice('noAlcohol', 'Событие без алкоголя'), choice('quiet', 'Можно разговаривать без громкой музыки'), choice('accessible', 'Доступная площадка без барьеров'), choice('daylight', 'Встреча в светлое время суток'), choice('none', 'Особых пожеланий сейчас нет')] },
};

const paymentOne: DnaQuestion = {
  id: 'paymentOne', title: 'Если встречаетесь вдвоём, как комфортнее с оплатой?',
  subtitle: 'Любой вариант нормален. Лучше знать ожидания заранее.', optional: true,
  choices: [choice('split', 'Каждый оплачивает своё'), choice('offer', 'Мне приятно предложить оплатить'), choice('accept', 'Мне комфортно принять приглашение'), choice('alternate', 'Можно по очереди'), choice('talk', 'Спокойно договоримся на месте')],
};

const intentDetails: Record<string, DnaQuestion> = {
  friends: { id: 'intent:friends', title: 'Какая новая связь тебе ближе?', subtitle: 'Подберём обстановку, где знакомиться легче.', choices: [choice('deep', 'Неспешное знакомство'), choice('shared', 'Дружба через общее занятие'), choice('casual', 'Лёгкое общение без ожиданий')] },
  plans: { id: 'intent:plans', title: 'Каких планов не хватает?', subtitle: 'Не обязательно выбирать один стиль навсегда.', choices: [choice('regular', 'Регулярных встреч'), choice('special', 'Ярких событий'), choice('simple', 'Простых поводов выйти из дома')] },
  explore: { id: 'intent:explore', title: 'Насколько далеко хочется выйти из привычного?', subtitle: 'Новый опыт может быть очень мягким.', choices: [choice('gentle', 'Начать с малого'), choice('medium', 'Попробовать пару новых форматов'), choice('bold', 'Удиви меня')] },
  company: { id: 'intent:company', title: 'Какая компания для любимого дела нужна?', subtitle: 'Так легче найти подходящий темп.', choices: [choice('beginner', 'Тех, кто тоже начинает'), choice('regular', 'Постоянную компанию'), choice('mentor', 'Опытных людей, у кого можно учиться')] },
};

type ActivityVariant = 'first' | 'pace' | 'company' | 'depth' | 'cost';
const variants: readonly ActivityVariant[] = ['first', 'pace', 'company', 'depth', 'cost'];

function activityChoices(categoryId: string): DnaQuestion {
  const category = activityCategories.find((item) => item.id === categoryId) ?? activityCategories[0];
  return { id: `activity:${category.id}`, title: `А что из «${category.label.toLowerCase()}» зовёт сильнее?`, subtitle: 'Конкретный интерес помогает найти событие по душе.', choices: category.activities.map((label) => choice(label, label)) };
}

function activityFollowup(activity: string, variant: ActivityVariant): DnaQuestion {
  const id = `activity:${activity}:${variant}`;
  const category = categoryForActivity(activity)?.id ?? 'culture';
  const lenses: Record<string, { first: string[]; pace: string[]; depth: string[] }> = {
    sport: { first: ['Разобраться с правилами без спешки', 'Начать с тренером или опытным участником', 'Сразу сыграть или потренироваться'], pace: ['Двигаться в удовольствие', 'Немного азарта, без гонки за результатом', 'Люблю вызов и соревнование'], depth: ['Попробовать один раз', 'Иногда встречаться ради удовольствия', 'Заниматься регулярно и развиваться'] },
    outdoors: { first: ['Короткий знакомый маршрут', 'Маршрут с ведущим и понятной подготовкой', 'Новый маршрут с полноценной подготовкой'], pace: ['Остановки, разговоры и наблюдения', 'Чередовать движение и отдых', 'Больше пройти и увидеть'], depth: ['Просто сменить обстановку', 'Узнать больше о местах вокруг', 'Сделать прогулки постоянной привычкой'] },
    food: { first: ['Знакомый вкус в новой компании', 'Попробовать то, что посоветуют', 'Выбрать необычное и сравнить впечатления'], pace: ['Неспешно посидеть и поговорить', 'Поесть, а потом прогуляться', 'Несколько мест и новых вкусов за встречу'], depth: ['Вкусно поесть без специальной темы', 'Поговорить о вкусах и рецептах', 'Разобраться в кухне или приготовить вместе'] },
    culture: { first: ['Небольшой формат, чтобы освоиться', 'С пояснениями ведущего', 'Самостоятельно смотреть и обсуждать'], pace: ['Задерживаться у того, что откликается', 'Посмотреть главное и обсудить', 'Насыщенная программа с разными впечатлениями'], depth: ['Получить впечатление', 'Обменяться личными интерпретациями', 'Разобраться в контексте и деталях'] },
    music: { first: ['Знакомое звучание и небольшой зал', 'Новый жанр с компанией', 'Хочу услышать то, чего ещё не знаю'], pace: ['Слушать спокойно', 'Слушать, общаться и немного двигаться', 'Танцевать и включаться в происходящее'], depth: ['Насладиться атмосферой', 'Обсудить музыку после встречи', 'Петь, играть или разбирать музыку вместе'] },
    learning: { first: ['Понятная вводная без подготовки', 'Занятие с ведущим и вопросами', 'Практическая задача с первой встречи'], pace: ['Время подумать и задать вопросы', 'Обсуждение и небольшая практика', 'Много практики и новых задач'], depth: ['Узнать одну полезную вещь', 'Обсуждать тему с единомышленниками', 'Учиться регулярно и делать проект'] },
    games: { first: ['Простые правила и короткая игра', 'Чтобы кто-то объяснил и помог начать', 'Сразу сыграть, даже если будет непросто'], pace: ['Игра как повод общаться', 'Интересная партия без давления', 'Азарт и серьёзная задача'], depth: ['Лёгкий вечер', 'Найти компанию для следующих игр', 'Осваивать стратегии и повышать уровень'] },
    creative: { first: ['Попробовать с готовым примером', 'Мастер-класс с подсказками', 'Свободно придумать свой результат'], pace: ['Без спешки, с вниманием к процессу', 'Успеть сделать небольшую работу', 'Интенсивно освоить новый приём'], depth: ['Получить удовольствие от процесса', 'Унести готовую вещь или работу', 'Развить навык и продолжить дома'] },
    wellbeing: { first: ['Короткая мягкая практика', 'С ведущим, который объясняет каждый шаг', 'Знакомый формат в новой компании'], pace: ['Очень спокойно, с паузами', 'Умеренный темп по самочувствию', 'Более активная практика с возможностью остановиться'], depth: ['Переключиться после дня', 'Найти приятный регулярный ритуал', 'Лучше разобраться в практике'] },
    community: { first: ['Небольшая понятная задача', 'Вместе с опытным координатором', 'Включиться в подготовку и организацию'], pace: ['Посильный вклад без спешки', 'Совместная задача и общение', 'Активный день с заметным результатом'], depth: ['Помочь один раз', 'Возвращаться к близкой мне инициативе', 'Стать частью постоянной команды'] },
  };
  const lens = lenses[category];
  const contextual = (kind: 'first' | 'pace' | 'depth', values: string[], title: string, subtitle: string): DnaQuestion => ({ id, title: `${activity}. ${title}`, subtitle, choices: lens[kind].map((label, index) => choice(values[index], label)) });
  switch (variant) {
    case 'first': return contextual('first', ['intro', 'guided', 'jump'], 'С чего хочется начать?', 'Подберём вход в занятие, который тебе комфортен.');
    case 'pace': return contextual('pace', ['slow', 'balanced', 'intense'], 'Как провести эту встречу?', 'Одно занятие может быть приятным в совершенно разном темпе.');
    case 'company': return { id, title: `${activity}. Какой контакт с компанией хочется?`, subtitle: 'Ты выбрал(а) встречи вдвоём. Уточним, что в них ценно.', choices: [choice('focus', 'Внимание друг к другу и общему делу'), choice('support', 'Чтобы помогали освоиться'), choice('independent', 'Заниматься рядом, без необходимости постоянно говорить')] };
    case 'cost': return { id, title: `${activity}. Как начать без лишних расходов?`, subtitle: 'Учитываем твой выбор бесплатных планов.', choices: [choice('free', 'Ищу полностью бесплатный формат'), choice('own', 'Можно использовать то, что уже есть'), choice('known', 'Небольшие расходы подойдут, если знать сумму заранее')] };
    case 'depth': return contextual('depth', ['watch', 'join', 'deep'], 'Что хочется унести с этой встречи?', 'Это поможет подобрать людей с похожими ожиданиями.');
  }
}

function answerString(answers: DnaAnswers, id: string): string | undefined {
  const value = answers[id];
  return typeof value === 'string' && value !== 'skip' ? value : undefined;
}

function answerList(answers: DnaAnswers, id: string): string[] {
  const value = answers[id];
  return Array.isArray(value) ? value : [];
}

function selectedVariant(answers: DnaAnswers): ActivityVariant {
  if (answerString(answers, 'intent') === 'explore') return 'first';
  if (answerString(answers, 'companySize') === 'one') return 'company';
  if (answerString(answers, 'budget') === 'free') return 'cost';
  if (answerString(answers, 'energy') === 'lively') return 'pace';
  return 'depth';
}

export function getDnaFlow(answers: DnaAnswers): DnaQuestion[] {
  if (answerString(answers, 'age') === 'under16') return [core.age];
  const flow = [core.age, core.intent];
  const intent = answerString(answers, 'intent');
  if (intent && intentDetails[intent]) flow.push(intentDetails[intent]);
  flow.push(core.energy, core.companySize, core.familiarity, core.connection, core.values, core.worldview, core.planningStyle, core.budget,
    answerString(answers, 'companySize') === 'one' ? paymentOne : core.payment, core.time, core.category);
  const category = answerList(answers, 'category')[0];
  if (category) {
    flow.push(activityChoices(category));
    const activity = answerString(answers, `activity:${category}`);
    if (activity && categoryForActivity(activity)?.id === category) flow.push(activityFollowup(activity, selectedVariant(answers)));
  }
  flow.push(core.companyPreference, core.boundaries);
  return flow;
}

export function getQuestionBank(): DnaQuestion[] {
  return [
    ...Object.values(core), paymentOne, ...Object.values(intentDetails),
    ...activityCategories.flatMap((category) => [
      activityChoices(category.id),
      ...category.activities.flatMap((activity) => variants.map((variant) => activityFollowup(activity, variant))),
    ]),
  ];
}

export { questionBankSize };

export function answered(answers: DnaAnswers, question: DnaQuestion) {
  const value = answers[question.id];
  const valid = new Set(question.choices.map((option) => option.value));
  if (value === 'skip') return question.optional === true;
  return question.multiple ? Array.isArray(value) && value.length > 0 && value.length <= (question.maxChoices ?? 2) && new Set(value).size === value.length && (!value.includes('none') || value.length === 1) && value.every((item) => valid.has(item))
    : typeof value === 'string' && valid.has(value);
}

export function cleanDnaAnswers(answers: DnaAnswers): DnaAnswers {
  return Object.fromEntries(getDnaFlow(answers).filter((question) => answered(answers, question)).map((question) => [question.id, answers[question.id]]));
}
