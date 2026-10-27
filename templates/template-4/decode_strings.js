const fs = require('fs');
const vm = require('vm');

const code2 = fs.readFileSync('C:/Users/eshhb/Downloads/template-4/raw_script_2.js', 'utf8');

// The file starts with:
// const _0x34d603=_0x336d;(function(...)(...));function _0x336d(...){...}function _0x...(){return [...];}
// Let's find where the actual application logic starts
// Application logic usually starts with an IIFE or (function() or DOMContentLoaded or const/var declaration after the rotation loop.

// Let's extract the rotation loop and the array
const arrayFnIdx = code2.lastIndexOf('function _0x');
const setupEnd = code2.indexOf(';', arrayFnIdx + 10);

console.log('Finding string function setup...');
const fnNames = [...code2.matchAll(/function (_0x\w+)\(/g)].map(m => m[1]);
console.log('Functions found:', fnNames);

const arrayFn = fnNames[fnNames.length - 1];
const lookupFn = fnNames[fnNames.length - 2];
console.log('Lookup fn:', lookupFn, 'Array fn:', arrayFn);

// Let's extract everything up to the end of arrayFn definition
const arrayFnStart = code2.lastIndexOf(`function ${arrayFn}`);
// find matching brace
let braceCount = 0;
let arrayFnEnd = -1;
for (let i = arrayFnStart; i < code2.length; i++) {
  if (code2[i] === '{') braceCount++;
  else if (code2[i] === '}') {
    braceCount--;
    if (braceCount === 0) {
      arrayFnEnd = i + 1;
      break;
    }
  }
}

const deobCode = code2.substring(0, arrayFnEnd);
console.log('Deob code length:', deobCode.length);

const sandbox = {};
vm.createContext(sandbox);
try {
  vm.runInContext(deobCode, sandbox);
  console.log('Successfully ran deob setup! Testing lookup...');
  const lookup = sandbox[lookupFn];
  console.log('Lookup 0x4c6:', lookup(0x4c6));
  console.log('Lookup 0x542:', lookup(0x542));
  console.log('Lookup 0x500:', lookup(0x500));
} catch (e) {
  console.error('Error running deob setup:', e.message);
}
