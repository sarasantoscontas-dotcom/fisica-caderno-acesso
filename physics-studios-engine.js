/* Motores independentes: pesquisa, semestre e provas. */
(()=>{"use strict";
const seed=window.PHY_STUDIOS_SEED,copy=x=>JSON.parse(JSON.stringify(x));
const date=()=>{const d=new Date(),f=n=>String(n).padStart(2,"0");return d.getFullYear()+"-"+f(d.getMonth()+1)+"-"+f(d.getDate())};
const plus=(s,n)=>{const d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const diff=(a,b)=>Math.round((new Date(b+"T12:00:00")-new Date(a+"T12:00:00"))/86400000);
const all={};for(const c of seed.configs){
 const key="fisica-studio-"+c.id+"-v1",initial=c.id==="pesquisa"?{project:copy(seed.init.research)}:c.id==="semestre"?{courses:copy(seed.init.semesterCourses),semester:copy(seed.init.semester)}:{tests:copy(seed.init.tests),preferences:copy(seed.init.exam)};
 const fresh=()=>({settings:{title:c.title,description:c.description},features:Object.fromEntries(c.features.map(f=>[f.id,copy(f)])),...copy(initial),updated:date()});
 let d=fresh();try{const old=JSON.parse(localStorage.getItem(key)||"null");if(old?.features){d={...d,...old,settings:{...d.settings,...old.settings},features:{...d.features,...old.features}}}}catch(e){}
 all[c.id]={key,c,fresh,d};
}
const obj=id=>all[id],state=id=>obj(id)?.d,config=id=>obj(id)?.c;
const save=id=>{const o=obj(id);if(!o)return false;o.d.updated=date();try{localStorage.setItem(o.key,JSON.stringify(o.d));return true}catch(e){return false}};
const set=(id,area,key,value)=>{const d=state(id);if(!d?.[area])return false;d[area][key]=String(value??"").slice(0,25000);return save(id)};
const feature=(id,fid)=>state(id)?.features?.[fid];
const featureSet=(id,fid,key,value)=>{const f=feature(id,fid);if(!f||!["notes","title","description"].includes(key))return false;f[key]=String(value??"").slice(0,25000);return save(id)};
const entrySet=(id,fid,eid,key,value)=>{const e=feature(id,fid)?.entries?.find(x=>x.id===eid);if(!e||!["title","detail","status","checked","due","priority"].includes(key))return false;e[key]=key==="checked"?!!value:String(value??"").slice(0,9000);return save(id)};
const entryAdd=(id,fid)=>{const f=feature(id,fid);if(!f)return null;const e={id:"entry-"+Date.now().toString(36)+"-"+Math.round(Math.random()*9999),title:"Nova atividade acadêmica",detail:"Escreva a atividade e sua justificativa.",status:"A fazer",checked:false,due:date(),priority:"Normal"};f.entries.push(e);save(id);return e};
const entryRemove=(id,fid,eid)=>{const f=feature(id,fid);if(!f)return false;f.entries=f.entries.filter(e=>e.id!==eid);return save(id)};
const rowSet=(id,field,rid,key,value)=>{const a=state(id)?.[field],r=a?.find(x=>x.id===rid);if(!r||!["name","semester","credits","hours","stage","prerequisite","goal","grade","attendance","notes","title","subject","date","weight","status"].includes(key))return false;r[key]=String(value??"").slice(0,9000);return save(id)};
const rowAdd=(id,field)=>{const d=state(id);if(!d?.[field])return null;const r=field==="courses"?{id:"disc-"+Date.now(),name:"Nova disciplina",semester:d.semester?.term||"2026/2",credits:4,hours:60,stage:"Planejada",prerequisite:"Verificar PPC",goal:"Definir objetivos",grade:"",attendance:"",notes:""}:{id:"av-"+Date.now(),title:"Nova avaliação",subject:"Disciplina de Física",date:plus(date(),14),weight:2,status:"Planejada",topics:[{id:"topic-"+Date.now(),name:"Novo assunto",mastery:1,importance:2,tasks:"Descrever exercícios e revisões."}]};d[field].push(r);save(id);return r};
const rowRemove=(id,field,rid)=>{const d=state(id);if(!d?.[field])return false;d[field]=d[field].filter(r=>r.id!==rid);return save(id)};
const topicSet=(testId,tid,key,value)=>{const t=state("provas")?.tests.find(x=>x.id===testId)?.topics?.find(x=>x.id===tid);if(!t||!["name","mastery","importance","tasks"].includes(key))return false;t[key]=["mastery","importance"].includes(key)?Math.max(key==="mastery"?0:1,Math.min(3,Number(value)||0)):String(value??"");return save("provas")};
const topicAdd=tid=>{const t=state("provas")?.tests.find(x=>x.id===tid);if(!t)return false;t.topics.push({id:"topic-"+Date.now(),name:"Novo assunto de Física",mastery:1,importance:2,tasks:"Definir exercícios e dificuldade."});return save("provas")};
const reset=id=>{const o=obj(id);if(!o)return false;o.d=o.fresh();return save(id)};
const clear=id=>{const o=obj(id);if(!o)return false;const d=o.d;d.settings={title:"",description:""};Object.values(d.features).forEach(f=>{f.notes="";f.entries=[]});if(id==="pesquisa")d.project={};if(id==="semestre"){d.courses=[];d.semester={}}if(id==="provas"){d.tests=[];d.preferences={}}return save(id)};
const backup=id=>JSON.stringify({type:"fisica-studio-"+id,date:date(),data:state(id)},null,2);
const restore=(id,txt)=>{const b=JSON.parse(txt),o=obj(id);if(!o||b.type!=="fisica-studio-"+id||!b.data?.features)throw Error("Backup incompatível");o.d={...o.fresh(),...b.data,features:{...o.fresh().features,...b.data.features}};return save(id)};
const priority=(test,topic,clock=date())=>{const days=diff(clock,test.date),score=(3-Number(topic.mastery||0))*5+Number(topic.importance||2)*3+Math.max(0,35-days)/4;return {days,score,label:score>=23?"Atenção especial":score>=16?"Revisar com prioridade":"Consolidar"}};
function plan(clock=date()){
 const prefs=state("provas").preferences||{},tests=state("provas").tests.filter(t=>t.date>=clock).sort((a,b)=>a.date.localeCompare(b.date));
 const rows=[];for(const t of tests)for(const topic of t.topics||[]){const pr=priority(t,topic,clock);rows.push({testId:t.id,exam:t.title,subject:t.subject,examDate:t.date,topic:topic.name,mastery:Number(topic.mastery)||0,importance:Number(topic.importance)||2,task:topic.tasks,priority:pr.label,score:pr.score})}
 rows.sort((a,b)=>b.score-a.score||a.examDate.localeCompare(b.examDate));
 const maxDay=Math.min(120,Math.max(0,tests.length?diff(clock,tests[tests.length-1].date):28)),dailyLimit=Math.max(1,Math.min(5,Number(prefs.dailyLimit)||2));
 const slots={};for(let i=0;i<=maxDay;i++){const day=plus(clock,i);if(new Date(day+"T12:00:00").getDay()!==0)slots[day]=0}
 const schedule=[];for(const r of rows){const desired=r.mastery<=1?[0,2,5,9,14,21,28]:r.mastery===2?[0,4,11,20]:[0,7,17];
  for(const off of desired){if(plus(clock,off)>=r.examDate)continue;let chosen=null;for(let j=0;j<7;j++){const day=plus(clock,off+j);if(day>=r.examDate)break;if(day in slots&&slots[day]<dailyLimit&&!schedule.some(s=>s.date===day&&s.testId===r.testId&&s.topic===r.topic)){chosen=day;break}}
   if(chosen){slots[chosen]++;schedule.push({...r,date:chosen,duration:Number(prefs.sessionMinutes)||40,phase:off===0?"Diagnóstico":"Revisão espaçada"})}
  }
 }
 schedule.sort((a,b)=>a.date.localeCompare(b.date)||b.score-a.score);
 const grouped={};for(const r of rows){const key=r.subject;if(!grouped[key])grouped[key]={name:key,weight:0,topics:[]};grouped[key].weight+=r.score;grouped[key].topics.push(r)}
 return {today:clock,tests,ranked:rows,schedule,subjectPriorities:Object.values(grouped).sort((a,b)=>b.weight-a.weight),preferences:prefs};
}
window.PHY_STUDIOS={config,state,all:()=>seed.configs,save,set,feature,featureSet,entrySet,entryAdd,entryRemove,rowSet,rowAdd,rowRemove,topicSet,topicAdd,reset,clear,backup,restore,priority,plan,date,plus,diff};
})();