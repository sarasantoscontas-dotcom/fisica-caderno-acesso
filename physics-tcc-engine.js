/* Meu TCC · Engine isolado e persistente.
   Não modifica state do módulo Resumos, Flashcards ou Bibliografia. */
(()=>{
"use strict";
const KEY="fisica-caderno-tcc-laboratorio-v1";
const seed=window.PHY_TCC_SEED,def=window.PHY_TCC_FEATURES;
if(!seed||!def)throw Error("TCC: conteúdo base não carregado");
const clone=x=>JSON.parse(JSON.stringify(x));
const fresh=()=>({...clone(seed),features:Object.fromEntries(def.features.map(f=>[f.id,clone(f)])),snapshots:[],timelineNotes:[],updated:new Date().toISOString(),lastResults:null,version:2});
let model=fresh();
try{
 const previous=JSON.parse(localStorage.getItem(KEY)||"null");
 if(previous&&typeof previous==="object"&&previous.metadata&&Array.isArray(previous.sections)){
  model={...model,...previous,metadata:{...model.metadata,...previous.metadata},simulation:{...model.simulation,...previous.simulation},sections:previous.sections,features:{...model.features,...previous.features},bibliography:Array.isArray(previous.bibliography)?previous.bibliography:model.bibliography,snapshots:Array.isArray(previous.snapshots)?previous.snapshots:[]};
 }
}catch(e){/* default preserved if stored data is invalid */}
const state=()=>model;
const save=()=>{model.updated=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(model));return true}catch(e){return false}};
const reset=()=>{model=fresh();save()};
const clear=()=>{
 model.metadata=Object.fromEntries(Object.keys(seed.metadata).map(k=>[k,""]));
 model.sections=seed.sections.map(x=>({...x,body:""}));
 model.bibliography=[];
 model.features=Object.fromEntries(def.features.map(f=>[f.id,{...clone(f),notes:"",entries:[]}]));
 model.lastResults=null;model.snapshots=[];model.timelineNotes=[];save();
};
const h=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const feature=id=>model.features[id]||null;
const section=id=>model.sections.find(s=>s.id===id);
const updateMeta=(key,value)=>{if(Object.prototype.hasOwnProperty.call(model.metadata,key)){model.metadata[key]=String(value);save();return true}return false};
const updateBody=(id,value)=>{const s=section(id);if(s){s.body=String(value);save();return true}return false};
const updateParam=(key,value)=>{if(!["m","k","b","x0","v0","T","h"].includes(key))return false;const n=Number(String(value).trim().replace(",","."));if(!Number.isFinite(n))return false;model.simulation[key]=n;save();return true};
const updateEntry=(id,entryId,key,value)=>{
 const f=feature(id),e=f?.entries.find(e=>e.id===entryId);
 if(!e||!["title","detail","status","due","checked"].includes(key))return false;
 e[key]=key==="checked"?Boolean(value):String(value);save();return true;
};
const addEntry=(id)=>{
 const f=feature(id);if(!f)return null;
 const e={id:"user-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7),title:"Nova atividade de "+f.title,detail:"Defina a aplicação científica desta atividade, critérios de conclusão e vínculos com seu TCC de Física.",status:"A fazer",due:"",checked:false};
 f.entries.push(e);save();return e;
};
const removeEntry=(id,eid)=>{const f=feature(id);if(!f)return false;const old=f.entries.length;f.entries=f.entries.filter(e=>e.id!==eid);if(old===f.entries.length)return false;save();return true};
const shiftStatus=(id,eid,next)=>{if(!["A fazer","Em andamento","Em revisão","Pronto"].includes(next))return false;return updateEntry(id,eid,"status",next)};
const updateFeatureNote=(id,value)=>{const f=feature(id);if(!f)return false;f.notes=String(value);save();return true};
const addRef=()=>{
 const row={id:"user-ref-"+Date.now().toString(36),author:"Autoria a conferir",title:"Nova referência do projeto",year:"a conferir",url:"",topic:"Assunto relacionado à Física",status:"A consultar",notes:"Escreva como esta obra sustenta sua pesquisa."};
 model.bibliography.push(row);save();return row;
};
const updateRef=(id,key,value)=>{
 const row=model.bibliography.find(r=>r.id===id);
 if(!row||!["author","title","year","url","topic","status","notes"].includes(key))return false;
 row[key]=String(value);save();return true;
};
const removeRef=id=>{const n=model.bibliography.length;model.bibliography=model.bibliography.filter(r=>r.id!==id);save();return model.bibliography.length!==n};
const snapshot=()=>{
 const copy={id:"ver-"+Date.now().toString(36),date:new Date().toISOString(),title:model.metadata.title||"TCC sem título",metadata:clone(model.metadata),sections:clone(model.sections),simulation:clone(model.simulation),bibliography:clone(model.bibliography)};
 model.snapshots.unshift(copy);model.snapshots=model.snapshots.slice(0,12);save();return copy;
};
const restoreSnapshot=id=>{
 const old=model.snapshots.find(v=>v.id===id);if(!old)return false;
 model.metadata=clone(old.metadata);model.sections=clone(old.sections);model.simulation=clone(old.simulation);model.bibliography=clone(old.bibliography);save();return true;
};
const safeBackup=()=>JSON.stringify({type:"caderno-fisica-tcc",version:2,exportedAt:new Date().toISOString(),project:model},null,2);
const importBackup=str=>{
 if(str.length>2e6)throw Error("Arquivo acima do limite do caderno.");
 const data=JSON.parse(str),m=data?.project;
 if(data?.type!=="caderno-fisica-tcc"||!m||!m.metadata||!Array.isArray(m.sections)||!m.sections.every(x=>typeof x.id==="string"&&typeof x.body==="string"))throw Error("Arquivo não corresponde a backup válido do TCC.");
 if(m.sections.length>100||Object.keys(m.metadata).length>100)throw Error("Estrutura de backup inválida.");
 model={...fresh(),...m,metadata:{...clone(seed.metadata),...m.metadata},sections:m.sections,bibliography:Array.isArray(m.bibliography)?m.bibliography:[],features:{...fresh().features,...m.features},snapshots:Array.isArray(m.snapshots)?m.snapshots.slice(0,12):[]};
 save();return true;
};
const progress=()=>{
 const fields=Object.values(model.metadata).filter(x=>String(x||"").trim()).length;
 const written=model.sections.filter(s=>s.body.trim().length>120).length;
 const tasks=Object.values(model.features).flatMap(f=>f.entries);
 return {fields,written,taskDone:tasks.filter(e=>e.checked||e.status==="Pronto").length,taskTotal:tasks.length};
};
const numerical=()=>{
 const p=model.simulation,{m,k,b,x0,v0,T,h:dt}=p;
 if(!(Number.isFinite(m)&&m>0&&Number.isFinite(k)&&k>0&&Number.isFinite(b)&&b>=0&&Number.isFinite(T)&&T>0&&Number.isFinite(dt)&&dt>0&&[x0,v0].every(Number.isFinite)))throw Error("Use m>0, k>0, b≥0, T>0 e passo h>0, com valores finitos.");
 const omega0=Math.sqrt(k/m),gamma=b/(2*m);
 if(!(gamma<omega0))throw Error("Esta comparação analítica demonstra o regime SUBAMORTECIDO (b² < 4mk). Reduza b ou altere m e k.");
 const steps=Math.ceil(T/dt);
 if(steps>4500)throw Error("Escolha um passo maior: esta visualização aceita até 4500 intervalos para manter o desempenho.");
 const wd=Math.sqrt(omega0*omega0-gamma*gamma),C=(v0+gamma*x0)/wd;
 const exact=t=>{const q=Math.exp(-gamma*t),co=Math.cos(wd*t),si=Math.sin(wd*t);return{x:q*(x0*co+C*si),v:q*(v0*co-(wd*x0+gamma*C)*si)}};
 const accel=(x,v)=>-(k*x+b*v)/m,energy=(x,v)=>0.5*m*v*v+0.5*k*x*x;
 const initial=()=>({x:x0,v:v0});
 const series={analitico:[],euler:[],cromer:[],rk4:[]};
 const sample=(name,t,x,v)=>series[name].push({t,x,v,E:energy(x,v)});
 for(const name of Object.keys(series))sample(name,0,x0,v0);
 let eu=initial(),cr=initial(),rk=initial();
 for(let j=1;j<=steps;j++){
  const t0=Math.min(T,(j-1)*dt),t=Math.min(T,j*dt),h=t-t0;
  const a=accel(eu.x,eu.v),newEu={x:eu.x+h*eu.v,v:eu.v+h*a};eu=newEu;
  const vc=cr.v+h*accel(cr.x,cr.v);cr={x:cr.x+h*vc,v:vc};
  const f=(x,v)=>({x:v,v:accel(x,v)});
  const k1=f(rk.x,rk.v),k2=f(rk.x+h*k1.x/2,rk.v+h*k1.v/2),k3=f(rk.x+h*k2.x/2,rk.v+h*k2.v/2),k4=f(rk.x+h*k3.x,rk.v+h*k3.v);
  rk={x:rk.x+h*(k1.x+2*k2.x+2*k3.x+k4.x)/6,v:rk.v+h*(k1.v+2*k2.v+2*k3.v+k4.v)/6};
  for(const [name,val] of [["euler",eu],["cromer",cr],["rk4",rk]])sample(name,t,val.x,val.v);
  const ref=exact(t);sample("analitico",t,ref.x,ref.v);
 }
 const metrics={};
 for(const name of ["euler","cromer","rk4"]){
  const vals=series[name],ex=series.analitico;
  const err=vals.map((q,i)=>Math.abs(q.x-ex[i].x));
  metrics[name]={maxError:Math.max(...err),finalError:err.at(-1),energyFinal:vals.at(-1).E,physicalEnergyFinal:ex.at(-1).E};
 }
 return {params:{...p},gamma,omega0,wd,series,metrics,steps};
};
const sweep=()=>{
 const previous=model.simulation.h;const rows=[];
 for(const factor of [1,0.5,0.25]){
  try{model.simulation.h=previous*factor;const r=numerical();rows.push({h:r.params.h,metrics:r.metrics,steps:r.steps})}
  catch(e){rows.push({h:previous*factor,error:e.message})}
 }
 model.simulation.h=previous;return rows;
};
window.PHY_TCC={seed,groups:def.groups,features:def.features,key:KEY,state,save,reset,clear,h,feature,section,updateMeta,updateBody,updateParam,updateEntry,addEntry,removeEntry,shiftStatus,updateFeatureNote,addRef,updateRef,removeRef,snapshot,restoreSnapshot,safeBackup,importBackup,progress,numerical,sweep};
})();