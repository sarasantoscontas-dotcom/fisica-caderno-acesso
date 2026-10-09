/* Caderno de Física · expansão modular autônoma (45 ambientes). */
(()=>{"use strict";
const A=window.PHY_APP;
const modules=(window.PHY_EXPANSION_PARTS||[]).flat();
if(modules.length!==45||new Set(modules.map(x=>x.id)).size!==45||modules.some(x=>x.topics.length!==10))throw Error("Acervo da expansão incompleto");
const clone=x=>JSON.parse(JSON.stringify(x));
const h=A.h;
const kinds=["document","worksheet","quiz","matrix","laboratory","calculator","journal","kanban","review","portfolio"];
const stages=["A estudar","Em andamento","Em revisão","Concluído"];
const unique=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const initTool=(m,t,i)=>({
 id:t.id,title:t.title,detail:t.detail,kind:kinds[i],notes:"",
 entries:[
 {id:t.id+"-a",title:"Conceito e modelo: "+t.title,detail:t.detail,status:"A estudar",checked:false,due:""},
 {id:t.id+"-b",title:"Aplicação científica",detail:"Investigue as hipóteses e condições de validade de "+t.title.toLowerCase()+". Relacione o procedimento às grandezas, unidades e relações descritas: "+t.detail,status:"Em andamento",checked:false,due:""},
 {id:t.id+"-c",title:"Avaliação da evidência",detail:"Documente uma derivação, um exemplo ou um registro verificável sobre "+t.title.toLowerCase()+". Distinga resultado calculado, pressupostos e observação efetiva.",status:"Em revisão",checked:false,due:""}
 ]});
const fresh=m=>({
 version:1,title:m.title,description:m.description,tools:Object.fromEntries(m.topics.map((t,i)=>[t.id,initTool(m,t,i)])),
 diary:[],portfolio:[],calculator:{},updated:new Date().toISOString(),reviewDate:""
});
const cache=new Map();
const get=id=>{
 const m=modules.find(x=>x.id===id);if(!m)return null;
 if(cache.has(id))return cache.get(id);
 const baseline=fresh(m),key="fisica-expansion-"+id+"-v1";let old=null;
 try{old=JSON.parse(localStorage.getItem(key)||"null")}catch{}
 const s=old&&typeof old==="object"&&old.tools?{
 ...baseline,...old,tools:{...baseline.tools,...Object.fromEntries(Object.entries(old.tools).filter(([k])=>k in baseline.tools))},
 diary:Array.isArray(old.diary)?old.diary:[],portfolio:Array.isArray(old.portfolio)?old.portfolio:[],
 calculator:old.calculator&&typeof old.calculator==="object"?old.calculator:{}
 }:baseline;
 const out={m,key,s};cache.set(id,out);return out;
};
const save=id=>{const o=get(id);if(!o)return false;o.s.updated=new Date().toISOString();try{localStorage.setItem(o.key,JSON.stringify(o.s));return true}catch{return false}};
const replace=(id,next)=>{const o=get(id);o.s=next;return save(id)};
const tool=(id,fid)=>get(id)?.s.tools[fid]||null;
const setTool=(id,fid,field,value)=>{
 if(!["notes","title","detail"].includes(field))return false;
 const t=tool(id,fid);if(!t)return false;t[field]=String(value??"").slice(0,25000);return save(id)
};
const setEntry=(id,fid,eid,field,value)=>{
 if(!["title","detail","status","checked","due"].includes(field))return false;
 const e=tool(id,fid)?.entries?.find(x=>x.id===eid);if(!e)return false;
 e[field]=field==="checked"?!!value:String(value??"").slice(0,15000);
 return save(id);
};
const addEntry=(id,fid)=>{
 const t=tool(id,fid);if(!t)return false;
 t.entries.push({id:"e"+unique(),title:"Nova atividade de "+t.title,detail:"Descreva o procedimento, as variáveis, as evidências e a interpretação científica.",status:"A estudar",checked:false,due:""});
 return save(id);
};
const deleteEntry=(id,fid,eid)=>{const t=tool(id,fid);if(!t)return false;t.entries=t.entries.filter(x=>x.id!==eid);return save(id)};
const setMeta=(id,field,value)=>{const o=get(id);if(!o||!["title","description","reviewDate"].includes(field))return false;o.s[field]=String(value??"").slice(0,5000);return save(id)};
const append=(id,kind,item)=>{const o=get(id);if(!o||!["diary","portfolio"].includes(kind))return false;o.s[kind].push({id:"e"+unique(),...item,created:new Date().toISOString()});return save(id)};
const remove=(id,kind,eid)=>{const o=get(id);if(!o||!["diary","portfolio"].includes(kind))return false;o.s[kind]=o.s[kind].filter(x=>x.id!==eid);return save(id)};
const updateLog=(id,kind,eid,key,value)=>{const o=get(id),x=o?.s[kind]?.find(x=>x.id===eid);if(!x||!["title","body"].includes(key))return false;x[key]=String(value??"").slice(0,25000);return save(id)};
const setCalc=(id,key,value)=>{const o=get(id);if(!o)return false;o.s.calculator[key]=String(value??"").slice(0,5000);return save(id)};
const backup=id=>JSON.stringify({type:"caderno-fisica-expansion",moduleId:id,version:1,exported:new Date().toISOString(),data:get(id).s},null,2);
const restore=(id,raw)=>{
 const b=JSON.parse(raw);
 if(b.type!=="caderno-fisica-expansion"||b.moduleId!==id||!b.data?.tools)throw Error("Backup não corresponde a este módulo.");
 if(Object.keys(b.data.tools).length>80)throw Error("Dados de backup incompatíveis.");
 const baseline=fresh(get(id).m);
 return replace(id,{...baseline,...b.data,tools:{...baseline.tools,...Object.fromEntries(Object.entries(b.data.tools).filter(([k])=>k in baseline.tools))}});
};
const reset=id=>replace(id,fresh(get(id).m));
const clear=id=>{const o=get(id);if(!o)return false;const s=fresh(o.m);Object.values(s.tools).forEach(t=>{t.notes="";t.entries=[]});s.diary=[];s.portfolio=[];s.calculator={};return replace(id,s)};
const number=(v,name)=>{const x=Number(String(v).replace(",","."));if(!Number.isFinite(x))throw Error("Confira "+name+": informe um número válido.");return x};
const positive=(v,name)=>{const x=number(v,name);if(x<=0)throw Error(name+" precisa ser maior que zero.");return x};
const f=(x,d=6)=>!Number.isFinite(x)?"—":x!==0&&Math.abs(x)<1e-6?x.toExponential(d-1).replace("e"," × 10^"):Number(x.toPrecision(d)).toLocaleString("pt-BR",{maximumFractionDigits:9});
const chart=(fn,end,n=50)=>Array.from({length:n+1},(_,i)=>({x:(i*end)/n,y:fn(i*end/n)}));
const calcSpecs={
 projectile:{title:"Lançamento oblíquo ideal",fields:[["v","Velocidade inicial (m/s)",20],["angle","Ângulo (graus)",35],["g","Gravidade (m/s²)",9.81]],compute:d=>{
 const v=positive(d.v,"Velocidade"),a=number(d.angle,"Ângulo")*Math.PI/180,g=positive(d.g,"Gravidade");if(a<=0||a>=Math.PI/2)throw Error("Use ângulo entre 0° e 90°.");
 const T=2*v*Math.sin(a)/g,range=v*Math.cos(a)*T,H=v*v*Math.sin(a)**2/(2*g);
 return {formula:"x(t)=v₀cosθ·t ; y(t)=v₀senθ·t−gt²/2",metrics:[["Tempo de voo",f(T)+" s"],["Alcance",f(range)+" m"],["Altura máxima",f(H)+" m"]],series:chart(t=>v*Math.sin(a)*t-g*t*t/2,T),caveat:"Sem resistência do ar; lançamento e chegada no mesmo nível."};
 }},
 harmonic:{title:"Oscilação massa–mola ideal",fields:[["m","Massa (kg)",1],["k","Constante elástica (N/m)",16],["amp","Amplitude (m)",0.2]],compute:d=>{
 const m=positive(d.m,"Massa"),k=positive(d.k,"Constante elástica"),amp=positive(d.amp,"Amplitude"),w=Math.sqrt(k/m),T=2*Math.PI/w;
 return {formula:"ω=√(k/m); T=2π/ω; E=½kA²",metrics:[["Frequência angular",f(w)+" rad/s"],["Período",f(T)+" s"],["Energia",f(k*amp*amp/2)+" J"]],series:chart(t=>amp*Math.cos(w*t),2*T),caveat:"Modelo linear conservativo sem amortecimento."}
 }},
 matrix:{title:"Matriz real 2×2",fields:[["a","a",2],["b","b",1],["c","c",1],["d","d",2]],compute:d=>{const [a,b,c,z]=["a","b","c","d"].map(k=>number(d[k],k)),tr=a+z,det=a*z-b*c,disc=tr*tr-4*det;return {formula:"det(A)=ad−bc ; det(A−λI)=0",metrics:[["Traço",f(tr)],["Determinante",f(det)],["Autovalores",disc>=0?f((tr+Math.sqrt(disc))/2)+" ; "+f((tr-Math.sqrt(disc))/2):f(tr/2)+" ± "+f(Math.sqrt(-disc)/2)+"i"]],caveat:"Autovalores complexos possíveis; matriz real sem restrição adicional."}}},
 units:{title:"Cheque dimensional de força",fields:[["m","Massa (kg)",2],["l","Comprimento (m)",3],["t","Tempo (s)",4]],compute:d=>{const m=positive(d.m,"Massa"),l=positive(d.l,"Comprimento"),t=positive(d.t,"Tempo");return {formula:"F=mL/t² ; [F]=kg·m·s⁻²=N",metrics:[["Força estimada",f(m*l/t**2)+" N"],["Dimensão","M L T⁻²"]],caveat:"Expressão didática de escala: não substitui uma lei dinâmica para sistema real."}}},
 ohm:{title:"Circuito resistivo ideal",fields:[["v","Tensão (V)",12],["r","Resistência (Ω)",100]],compute:d=>{const v=number(d.v,"Tensão"),r=positive(d.r,"Resistência"),i=v/r;return {formula:"I=V/R; P=VI=V²/R",metrics:[["Corrente",f(i)+" A"],["Potência",f(v*i)+" W"]],series:chart(t=>t/r,Math.max(Math.abs(v),1)),caveat:"Elemento ôhmico de resistência constante."}}},
 regression:{title:"Ajuste linear por mínimos quadrados",fields:[["pairs","Dados x,y (uma linha por par)","0,0.10\n1,1.05\n2,2.15\n3,3.01"]],compute:d=>{const p=String(d.pairs||"").trim().split("\n").map(l=>l.trim().split(/[;\t,]/).map(Number)).filter(r=>r.length===2&&r.every(Number.isFinite));if(p.length<2)throw Error("Informe ao menos dois pares x,y.");if(p.length>500)throw Error("Limite de 500 pares.");const n=p.length,mx=p.reduce((s,r)=>s+r[0],0)/n,my=p.reduce((s,r)=>s+r[1],0)/n,ssxx=p.reduce((s,r)=>s+(r[0]-mx)**2,0);if(ssxx===0)throw Error("Os valores x não podem ser todos iguais.");const a=p.reduce((s,r)=>s+(r[0]-mx)*(r[1]-my),0)/ssxx,b=my-a*mx,syy=p.reduce((s,r)=>s+(r[1]-my)**2,0),sse=p.reduce((s,r)=>s+(r[1]-a*r[0]-b)**2,0);return {formula:"a=Σ(x−x̄)(y−ȳ)/Σ(x−x̄)² ; b=ȳ−ax̄",metrics:[["Inclinação",f(a)],["Intercepto",f(b)],["R²",syy>0?f(1-sse/syy):sse===0?"1":"indefinido"],["Soma dos resíduos²",f(sse)]],series:p.map(r=>({x:r[0],y:r[1]})),caveat:"Ajuste OLS sem ponderação; verifique modelo, unidades, resíduos e incertezas."}}},
 diffraction:{title:"Interferência de fenda dupla",fields:[["lambda","Comprimento de onda (nm)",550],["d","Separação das fendas (mm)",0.3],["L","Distância ao anteparo (m)",2]],compute:d=>{const lam=positive(d.lambda,"Comprimento de onda")*1e-9,sep=positive(d.d,"Separação")*1e-3,L=positive(d.L,"Distância"),dy=lam*L/sep;return {formula:"Δy≈λL/d (aproximação de pequenos ângulos)",metrics:[["Espaçamento entre franjas",f(dy*1000)+" mm"],["Primeiro máximo",f(dy*1000)+" mm"]],caveat:"Duas fendas ideais, iluminação coerente e aproximação de pequenos ângulos."}}},
 heat:{title:"Calor sensível em regime ideal",fields:[["m","Massa (kg)",0.2],["c","Calor específico (J/kg·K)",4184],["dt","Variação de temperatura (K)",10]],compute:d=>{const m=positive(d.m,"Massa"),c=positive(d.c,"Calor específico"),dt=number(d.dt,"Variação");return {formula:"Q=mcΔT",metrics:[["Calor trocado",f(m*c*dt)+" J"],["Em quilojoules",f(m*c*dt/1000)+" kJ"]],caveat:"Calor específico constante, sem mudanças de fase ou perdas."}}},
 frequency:{title:"Onda harmônica e amostragem",fields:[["a","Amplitude",1],["freq","Frequência (Hz)",5],["fs","Amostragem (Hz)",30]],compute:d=>{const a=positive(d.a,"Amplitude"),freq=positive(d.freq,"Frequência"),fs=positive(d.fs,"Amostragem");return {formula:"x(t)=A sen(2πft); f_Nyquist=f_s/2",metrics:[["Período",f(1/freq)+" s"],["Limite Nyquist",f(fs/2)+" Hz"],["Amostragem",fs>2*freq?"Adequada ao tom ideal":"Insuficiente para este tom"]],series:chart(t=>a*Math.sin(2*Math.PI*freq*t),2/freq),caveat:"Sinal mono-frequencial ideal, sem ruído; exige atenção a anti-aliasing na prática."}}},
 quantum:{title:"Poço quântico infinito 1D",fields:[["n","Número quântico n",1],["L","Largura (nm)",1]],compute:d=>{const n=positive(d.n,"n"),L=positive(d.L,"Largura")*1e-9;if(!Number.isInteger(n))throw Error("n deve ser inteiro positivo.");const hbar=1.054571817e-34,me=9.1093837e-31,e=1.602176634e-19,E=n*n*Math.PI*Math.PI*hbar*hbar/(2*me*L*L);return {formula:"Eₙ=n²π²ℏ²/(2mₑL²)",metrics:[["Energia",f(E/e)+" eV"],["Energia",f(E)+" J"]],caveat:"Elétron não relativístico confinado entre paredes de potencial infinito."}}},
 relativity:{title:"Relatividade especial: fator de Lorentz",fields:[["beta","Velocidade v/c",0.8],["tau","Tempo próprio (s)",1]],compute:d=>{const beta=number(d.beta,"v/c"),tau=positive(d.tau,"Tempo próprio");if(beta<0||beta>=1)throw Error("Informe 0 ≤ v/c < 1.");const gamma=1/Math.sqrt(1-beta*beta);return {formula:"γ=1/√(1−β²) ; Δt=γΔτ",metrics:[["Fator γ",f(gamma)],["Tempo no outro referencial",f(gamma*tau)+" s"],["Contração L/L₀",f(1/gamma)]],caveat:"Medidas em referenciais inerciais; Δτ é o tempo próprio."}}},
 boltzmann:{title:"Razão de ocupação de dois níveis",fields:[["T","Temperatura (K)",300],["gap","Diferença de energia (eV)",0.025]],compute:d=>{const T=positive(d.T,"Temperatura"),gap=number(d.gap,"Energia"),kB=8.617333262145e-5,r=Math.exp(-gap/(kB*T));return {formula:"p₂/p₁=exp(−ΔE/k_BT) para degenerescências iguais",metrics:[["Razão p₂/p₁",f(r)],["k_BT",f(kB*T)+" eV"]],caveat:"Dois níveis não degenerados em equilíbrio canônico."}}},
 astro:{title:"Luminosidade por temperatura efetiva",fields:[["R","Raio em raios solares",1],["T","Temperatura efetiva (K)",5772]],compute:d=>{const R=positive(d.R,"Raio"),T=positive(d.T,"Temperatura"),Lratio=R*R*(T/5772)**4;return {formula:"L/L☉≈(R/R☉)²(T/5772 K)⁴",metrics:[["Luminosidade relativa",f(Lratio)+" L☉"]],caveat:"Emissão aproximadamente de corpo negro, temperatura efetiva global."}}},
 hubble:{title:"Expansão local: Hubble–Lemaître",fields:[["H0","H₀ (km/s/Mpc)",70],["d","Distância (Mpc)",100]],compute:d=>{const H0=positive(d.H0,"H0"),dist=positive(d.d,"Distância");return {formula:"v≈H₀d",metrics:[["Velocidade de recessão aproximada",f(H0*dist)+" km/s"]],caveat:"Aproximação local para velocidades e distâncias cosmológicas moderadas; não equivale a velocidade peculiar medida."}}},
 decay:{title:"Decaimento radioativo ideal",fields:[["N0","Quantidade inicial",1000],["half","Meia-vida (dias)",8],["t","Tempo transcorrido (dias)",24]],compute:d=>{const N0=positive(d.N0,"Quantidade inicial"),half=positive(d.half,"Meia-vida"),t=number(d.t,"Tempo");if(t<0)throw Error("Tempo precisa ser ≥ 0.");const lambda=Math.log(2)/half,N=N0*Math.exp(-lambda*t);return {formula:"N(t)=N₀·2^(−t/t½)",metrics:[["Quantidade remanescente",f(N)],["Fração remanescente",f(N/N0)],["Constante λ",f(lambda)+" dia⁻¹"]],series:chart(x=>N0*Math.exp(-lambda*x),Math.max(t,half*4)),caveat:"Lei de decaimento independente sem reposição ou cadeia radioativa."}}}
};
modules.forEach((m,i)=>{
 A.modules.push({id:m.id,icon:["∇","ℏ","λ","∑","φ"][i%5],title:m.title,tag:m.category.toUpperCase(),description:m.description,action:"Entrar no meu laboratório",expansion:true,category:m.category});
});
window.PHY_EXPANSION={modules,kinds,stages,h,get,tool,setTool,setEntry,addEntry,deleteEntry,setMeta,append,remove,updateLog,setCalc,save,backup,restore,reset,clear,calcSpecs,f};
})();
