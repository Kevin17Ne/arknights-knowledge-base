const [,,page,filter]=process.argv;
fetch('https://prts.wiki/api.php?action=parse&page='+encodeURIComponent(page)+'&prop=text&format=json&formatversion=2')
 .then(r=>r.json()).then(d=>{
  if(d.error){console.log('ERR',d.error.info);process.exit(1)}
  const h=d.parse.text;
  const re=/<a[^>]*?title="([^"]+)"/g; let m; const out=[];
  while((m=re.exec(h))){ if(!filter||m[1].includes(filter)) out.push(m[1]); }
  const u=[...new Set(out)];
  console.log(u.length+' titles'); console.log(u.join(' | ').slice(0,4000));
 })
