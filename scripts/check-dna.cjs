const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  module._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename);
};

const { getDnaFlow, getQuestionBank, cleanDnaAnswers, questionBankSize } = require('../src/domain/dnaTest.ts');
const { activityCategories } = require('../src/domain/dnaCatalog.ts');
const { buildSocialDna } = require('../src/domain/socialDna.ts');
const { rankEventsForDna } = require('../src/domain/dnaRecommendations.ts');

const bank = getQuestionBank();
assert.equal(bank.length, questionBankSize);
assert.ok(bank.length >= 500);
assert.equal(new Set(bank.map((question) => question.id)).size, bank.length);
const bankIds = new Set(bank.map((question) => question.id));
for (const intent of ['friends', 'plans', 'explore', 'company']) {
  for (const category of activityCategories) {
    for (const activity of category.activities) {
      const path = getDnaFlow({ intent, companySize: 'small', category: [category.id], [`activity:${category.id}`]: activity });
      assert.ok(path.length <= 18);
      assert.ok(path.every((question) => bankIds.has(question.id)));
    }
  }
}

const answers = {
  intent: 'explore', age: '25-34', energy: 'quiet', companySize: 'small', familiarity: 'newPeople',
  connection: 'activity', values: ['kindness', 'curiosity'], worldview: 'curious', planningStyle: 'week',
  budget: 'under5', payment: 'split', time: ['weekendDay'], category: ['sport', 'culture'],
  'activity:sport': 'Падел', 'activity:Падел:first': 'intro', companyPreference: 'any', boundaries: ['public'],
};
const flow = getDnaFlow(answers);
assert.equal(flow.length, 18);
assert.equal(flow[2].id, 'intent:explore');
assert.ok(flow.some((question) => question.id === 'activity:Падел:first'));

const changed = { ...answers, intent: 'friends', category: ['culture'], 'activity:culture': 'Театр' };
const clean = cleanDnaAnswers(changed);
assert.equal(clean['activity:sport'], undefined);
assert.equal(clean['intent:explore'], undefined);
assert.ok(getDnaFlow(changed).some((question) => question.id === 'intent:friends'));

const dna = buildSocialDna(cleanDnaAnswers(answers));
assert.equal(dna.budget, 'under5');
assert.deepEqual(dna.interests, ['Падел']);
const events = [
  { title: 'Кофе после работы', format: 'Кофе', when: 'Понедельник · 18:00', seats: 4, ageRating: '16+', alcoholPolicy: 'none', venueType: 'public' },
  { title: 'Падел для новичков', format: 'Спорт', when: 'Суббота · 12:00', seats: 4, ageRating: '16+', alcoholPolicy: 'none', venueType: 'public' },
];
assert.equal(rankEventsForDna(events, dna)[0].title, 'Падел для новичков');
console.log(`DNA check passed: ${bank.length} unique questions; 408 adaptive paths; obsolete answers removed; event ranking works.`);

const { isEventAllowed } = require('../src/domain/eventSafety.ts');
const safe = { title: 'Музей', format: 'Культура', ageRating: '16+', alcoholPolicy: 'none', venueType: 'public' };
const teen = buildSocialDna({ age: '16-17', boundaries: ['none'] });
assert.deepEqual(teen.boundaries, ['public', 'noAlcohol']);
assert.ok(isEventAllowed(safe, teen));
for (const changed of [{ alcoholPolicy: 'present' }, { ageRating: '18+' }, { venueType: 'private' }, { title: 'Дегустация вина 18+' }, { alcoholPolicy: 'unknown' }]) assert.equal(isEventAllowed({ ...safe, ...changed }, teen), false);
assert.equal(isEventAllowed(safe, { ageBand: 'under16' }), false);
assert.equal(isEventAllowed({ title: 'Без условий', format: 'Встреча' }, {}), false);
assert.equal(getDnaFlow({ age: 'under16' }).length, 1);
assert.equal(cleanDnaAnswers({ age: '16-17', worldview: 'invalid' }).worldview, undefined);
console.log('Age safety passed: teen filters, unknown metadata, under16 stop, invalid answers.');

const { answered } = require('../src/domain/dnaTest.ts');
for (const q of bank) {
  assert.ok(q.title.trim() && q.subtitle.trim() && q.choices.length >= 2);
  assert.equal(new Set(q.choices.map(c => c.value)).size, q.choices.length);
  for (const option of q.choices) assert.ok(answered({[q.id]:q.multiple?[option.value]:option.value},q));
  assert.equal(answered({[q.id]:'skip'},q),!!q.optional);
}
for (const category of activityCategories) for (const activity of category.activities) {
  const scenarios = [{intent:'explore'}, {intent:'plans',companySize:'one'}, {intent:'friends',budget:'free'}, {intent:'company',energy:'lively'}, {intent:'plans'}];
  for (const scenario of scenarios) {
    const a = {age:'16-17', companySize:'small', budget:'under5', energy:'balanced', category:[category.id], ['activity:'+category.id]:activity, ...scenario};
    const path = getDnaFlow(a);
    assert.ok(path.length <= 18);
    for (const q of path) if (!answered(a,q)) a[q.id] = q.multiple ? [q.choices[0].value] : q.choices[0].value;
    assert.ok(getDnaFlow(a).every(q => answered(a,q)));
    assert.equal(Object.keys(cleanDnaAnswers(a)).length,18);
  }
}
console.log('All choices and 510 completed activity branches passed.');
