// Run with Node.js: node tests/game.test.cjs (no third-party dependencies).
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../app/src/main/assets/index.html'), 'utf8');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const elements = new Map();
function element() {
  return { children: [], textContent: '', className: '', disabled: false,
    setAttribute() {}, addEventListener() {},
    appendChild(child) { this.children.push(child); },
    replaceChildren() { this.children = []; } };
}
const storage = new Map();
let delayed = null;
const context = vm.createContext({
  document: { getElementById(id) { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); }, createElement: element },
  localStorage: { getItem: key => storage.get(key), setItem: (key,value) => storage.set(key,value) },
  setTimeout(fn) { delayed = fn; return 1; }, clearTimeout() { delayed = null; }
});
vm.runInContext(code, context);
const run = source => vm.runInContext(source, context);
assert.equal(run('cards.length'), 12);
assert.equal(run('new Set(cards.map(c=>c.fruit)).size'), 6);
assert.equal(run('fruits.every(f=>cards.filter(c=>c.fruit===f).length===2)'), true);
run('flip(0); flip(0)');
assert.equal(run('moves'), 0, 'same card cannot count as a pair');
run('flip(cards.findIndex(c=>c.fruit!==cards[0].fruit))');
assert.equal(run('locked'), true);
assert.equal(run('moves'), 1);
run('flip(5)');
assert.equal(run('moves'), 1, 'third click is blocked during mismatch');
delayed();
assert.equal(run('first===null && second===null && !locked'), true);
run('flip(0); flip(cards.findIndex(c=>c.fruit!==cards[0].fruit)); reset()');
assert.equal(delayed, null, 'restart cancels stale mismatch timer');
assert.equal(run('moves'), 0);
run('for (const f of fruits) { const ids=cards.map((c,i)=>c.fruit===f?i:-1).filter(i=>i>=0); flip(ids[0]); flip(ids[1]); }');
assert.equal(run('pairs'), 6);
assert.equal(run('moves'), 6);
assert.equal(storage.get('lumi.best'), '6');
assert.match(elements.get('message').textContent, /全部配对成功/);
run('reset()');
assert.equal(run('best'), 6, 'best score survives a new round');
assert.equal(run('cards.every(c=>!c.matched)'), true);
console.log('PASS: deck, matching, mismatch lock, timer cancellation, victory, best score, restart');
