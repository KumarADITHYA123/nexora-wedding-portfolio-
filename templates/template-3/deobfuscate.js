const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('obfuscated.js', 'utf-8');

const p1 = code.slice(0, 39736) + ';';
const p2 = code.slice(39736, 42303) + ';';
const setupCode = p1 + '\n' + p2;

const context = {};
vm.createContext(context);
vm.runInContext(setupCode, context);

// Register all aliases
const regex1 = /(\w+)\s*=\s*_0x3d84/g;
let m;
while ((m = regex1.exec(code)) !== null) {
  context[m[1]] = context['_0x3d84'];
}
const regex2 = /(\w+)\s*=\s*_0xe454/g;
while ((m = regex2.exec(code)) !== null) {
  context[m[1]] = context['_0xe454'];
}

// Find aliases of aliases (2nd level)
for (const k of Object.keys(context)) {
  const reg = new RegExp(`(\\w+)\\s*=\\s*${k}`, 'g');
  while ((m = reg.exec(code)) !== null) {
    context[m[1]] = context[k];
  }
}

console.log('Registered aliases:', Object.keys(context).length);

// Now match any func(expression) where func is in context
const aliasNames = Object.keys(context).filter(k => k.startsWith('_0x')).join('|');
const callRegex = new RegExp(`(${aliasNames})\\(([-+*0x0-9a-f ]+)\\)`, 'g');

let deob = code;
let count = 0;

deob = deob.replace(callRegex, (match, fnName, argExpr) => {
  try {
    const val = vm.runInContext(argExpr, context);
    if (typeof val === 'number') {
      const res = context[fnName](val);
      if (typeof res === 'string') {
        count++;
        return JSON.stringify(res);
      }
    }
  } catch (e) {}
  return match;
});

console.log(`Successfully replaced ${count} string lookups!`);
fs.writeFileSync('deobfuscated.js', deob, 'utf-8');
