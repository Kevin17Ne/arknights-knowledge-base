// usage: node tools/skilldb.js [关键词]
const fs=require('fs');
const files=['skills_6star.json','skills_mid.json'];
let d=[];
for(const f of files){try{d=d.concat(JSON.parse(fs.readFileSync(__dirname+'/../99-原始资料/'+f,'utf8')))}catch(e){}}
if(!d.length){console.log('数据未就绪');process.exit(1)}
const kw=process.argv[2]||'';
const sel=kw?d.filter(o=>o.name.includes(kw)||(o.branch||'').includes(kw)||(o.cls||'').includes(kw)):d;
console.log('库内 '+d.length+' 名干员，匹配 '+sel.length);
for(const o of sel.slice(0,12)){
  console.log('### '+o.name+'（'+(o.cls||'')+'-'+(o.branch||'')+'）');
  for(const s of o.skills||[]) console.log('- '+s.name+'｜'+s.rec+'/'+s.trig+'｜初始'+s.sp0+' 消耗'+s.spc+(s.dur?' 持续'+s.dur:'')+'｜'+(s.desc||'').slice(0,120));
}
