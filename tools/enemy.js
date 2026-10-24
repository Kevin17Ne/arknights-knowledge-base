// usage: node tools/enemy.js [keyword] [level]
const fs=require('fs');
const arr=JSON.parse(fs.readFileSync(__dirname+'/../99-原始资料/敌人一览_数据.wiki','utf8'));
const [,,kw,level]=process.argv;
let r=arr;
if(kw) r=r.filter(e=>(e.name||'').includes(kw)||(e.enemyRace||'').includes(kw));
if(level) r=r.filter(e=>e.enemyLevel===level);
console.log(r.length+' results');
for(const e of r.slice(0,40)) console.log([e.name,e.enemyLevel,e.enemyRace,e.damageType,e.motion,'攻'+e.attack,'防'+e.defence,'抗'+e.resistance,'血'+e.endure].join(' | '));
