#!/usr/bin/env node
"use strict";
/* Rodar: node tests/verify-expansion.cjs */
const assert=require("node:assert/strict");
const vm=require("node:vm");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const scripts=["physics-expansion-data-a.js","physics-expansion-data-b.js","physics-expansion-data-c.js","physics-expansion-engine.js","views-home.js","physics-expansion-views.js"];
const memory=new Map(),routes=new Map();
const esc=x=>String(x??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const app={
 modules:["resumos","flashcards","bibliografia","tcc","pesquisa","semestre","provas"].map(id=>({id,title:id,description:"Módulo original",icon:"∑",tag:"BASE",action:"Abrir"})),
 h:esc,register:(id,fn)=>routes.set(id,fn),onAction:()=>{},onSubmit:()=>{},state:{read:[]},
 terms:[],subjects:[{id:"mecanica",title:"Mecânica I",concept:"Leis de Newton",flashcards:[],area:"Mecânica",semester:1}],refs:[],
 pill:x=>String(x),button:x=>String(x),metric:()=>"",page:x=>x,allBooks:()=>[],render:()=>{},update:()=>{},toast:()=>{},$$:()=>[],$:()=>null
};
const context=vm.createContext({
 window:{PHY_APP:app},document:{addEventListener:()=>{}},
 localStorage:{getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,String(value))},
 location:{hash:"#home"},console,setTimeout,Date,Math,Number,String,JSON,Array,Object,Map,Set
});
for(const file of scripts){new vm.Script(fs.readFileSync(path.join(root,file),"utf8"),{filename:file}).runInContext(context)}
const X=context.window.PHY_EXPANSION;
assert.equal(X.modules.length,45);
assert.equal(new Set(X.modules.map(m=>m.id)).size,45);
assert.equal(new Set(X.modules.map(m=>m.category)).size,9);
assert.equal(app.modules.length,52);
assert.equal(routes.size,47);
let total=0;
for(const m of X.modules){
 assert.equal(m.topics.length,10,m.id+" offices");
 assert.equal(Object.keys(X.get(m.id).s.tools).length,10,m.id+" stored tools");
 context.location.hash="#"+m.id;
 assert.ok(routes.get(m.id)([m.id]).includes(esc(m.title)),m.id+" dashboard");
 for(const t of m.topics){
  context.location.hash="#"+m.id+"/tool/"+t.id;
  const html=routes.get(m.id)([m.id,"tool",t.id]);
  assert.ok(html.includes(esc(t.title)),m.id+"/"+t.id+" title");
  assert.ok(html.includes(esc(t.detail)),m.id+"/"+t.id+" content");
  total++;
 }
}
const home=routes.get("home")([]);
assert.equal((home.match(/data-px-home-category=/g)||[]).length,45);
assert.ok(home.includes("data-px-home-search"));
assert.equal(Object.keys(X.calcSpecs).length,15);
for(const [name,spec] of Object.entries(X.calcSpecs)){
 const inputs=Object.fromEntries(spec.fields.map(([key,,def])=>[key,def]));
 const result=spec.compute(inputs);
 assert.ok(result.metrics.length>0,name+" no metrics");
 assert.ok(result.metrics.every(row=>!String(row[1]).includes("NaN")),name+" NaN");
}
const first=X.modules[0].id,second=X.modules[1].id,tid=X.modules[0].topics[0].id;
X.setTool(first,tid,"notes","Persistência validada");
X.addEntry(first,tid);
const entry=X.tool(first,tid).entries.at(-1);
X.setEntry(first,tid,entry.id,"checked",true);
const backup=X.backup(first);
X.clear(first);
X.restore(first,backup);
assert.equal(X.tool(first,tid).notes,"Persistência validada");
assert.ok(X.tool(first,tid).entries.some(e=>e.id===entry.id&&e.checked));
assert.equal(memory.has("fisica-expansion-"+second+"-v1"),false);
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
for(const file of ["physics-expansion-data-a.js","physics-expansion-data-b.js","physics-expansion-data-c.js","physics-expansion-engine.js","physics-expansion-views.js","physics-expansion.css"])assert.ok(html.includes(file),file+" missing from index");
assert.ok(fs.readFileSync(path.join(root,"app.js"),"utf8").includes("modules.filter(m=>!m.expansion)"));
console.log("OK: "+X.modules.length+" módulos; "+total+" oficinas; 9 áreas; 15 modelos numéricos; backup e isolamento.");
