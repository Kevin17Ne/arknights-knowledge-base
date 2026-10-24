// usage: node tools/dmg.js <干员> <倍率%> <敌防> <敌抗> [物|法] [敌血]
const fs=require('fs');
const d=JSON.parse(fs.readFileSync(__dirname+'/../99-原始资料/stats_6star.json','utf8'));
const [,,name,multStr,defStr,resStr,type,hpStr]=process.argv;
const op=d.find(x=>x.name===name)||d.find(x=>x.name.includes(name));
if(!op){console.log('未找到干员');process.exit(1)}
const mult=parseFloat(multStr)||100, DEF=parseFloat(defStr)||0, RES=parseFloat(resStr)||0, HP=parseFloat(hpStr)||0;
const typ=(type==='法')?'法':'物';
let atk=parseInt(op.atk)||0;
let modAtk=0; const mm=(op.mod||'').match(/atk:(\d+)/); if(mm) modAtk=parseInt(mm[1]);
atk += (parseInt(op.trust_atk)||0) + modAtk; // 满信赖+模组攻击
const A = atk * mult/100;
let dmg;
if(typ==='物') dmg=Math.max(0.05*A, A-DEF);
else dmg=Math.max(0.05*A, 0.01*A*Math.max(0,100-RES));
console.log(op.name+'（'+op.cls+'-'+op.branch+'）攻击'+atk+' 倍率'+mult+'% → 基本伤害'+A.toFixed(1));
console.log(typ+'伤害 = '+dmg.toFixed(1)+'   （敌防'+DEF+' 敌抗'+RES+'）');
if(HP>0) console.log('需要命中 '+Math.ceil(HP/dmg)+' 次');
