const fs = require('fs');
const js = fs.readFileSync('deobfuscated.js', 'utf-8');

const regex = /Listener\]\(([^,]+),\s*([^,\)]+)/g;
let m;
while ((m = regex.exec(js)) !== null) {
  console.log('Listener arg1:', m[1].slice(0, 40), '| arg2:', m[2].slice(0, 40));
}
