/* Núcleo modular · Caderno do Estudante de Física */
(()=>{
"use strict";
const terms=[...(window.PHY_TERMS_A||[]),...(window.PHY_TERMS_B||[])].sort((a,b)=>a.number-b.number);
const subjects=[...(window.PHY_SUBJECTS_A||[]),...(window.PHY_SUBJECTS_B||[])];
const refs=[...(window.PHY_BIBLIOGRAPHY||[]),...(window.PHY_EXTRA_BIB_FICHAS||[])];
const extraSummaries=window.PHY_EXTRA_SUMMARIES||[];
const extraCards=window.PHY_EXTRA_CARDS||[];
const byId=new Map(subjects.map(s=>[s.id,s]));
const DATA="fisica-caderno-estudante-v1",EMAIL="fisica-caderno-acesso-email-v1",ACTIVE="fisica-caderno-acesso-active-v1";
const h=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $=x=>document.querySelector(x),$$=x=>[...document.querySelectorAll(x)];
const get=k=>{try{return localStorage.getItem(k)}catch{return null}};
const put=(k,v)=>{try{localStorage.setItem(k,String(v));return true}catch{return false}};
let stored={};try{stored=JSON.parse(get(DATA)||"{}")||{}}catch{}
const defaults={read:[],stars:[],notes:{},ratings:{},bookstars:[],booknotes:{},mybooks:[],session:{id:"",order:[],index:0,flip:false}};
const state={...defaults,...stored,read:[...(stored.read||[])],stars:[...(stored.stars||[])],notes:{...(stored.notes||{})},ratings:{...(stored.ratings||{})},bookstars:[...(stored.bookstars||[])],booknotes:{...(stored.booknotes||{})},mybooks:[...(stored.mybooks||[])],session:{...defaults.session,...(stored.session||{})}};
const save=()=>put(DATA,JSON.stringify(state));
const firstEmail=()=>get(EMAIL)||"";
const logged=()=>Boolean(firstEmail()&&get(ACTIVE)==="1");
const actionHandlers=new Map(),submitHandlers=new Map(),routes=new Map();
const allBooks=()=>refs.concat(state.mybooks);
const cardTotal=()=>subjects.reduce((n,s)=>n+s.flashcards.length,0);
const pill=(t,cls="")=>'<span class="pill '+cls+'">'+h(t)+'</span>';
const button=(label,action,attrs="",cls="")=>'<button type="button" class="btn '+cls+'" data-action="'+action+'" '+attrs+'>'+label+'</button>';
const escArea=a=>"area-"+String(a||"physics").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-");
const modules=[
{id:"resumos",icon:"∑",title:"Resumos Prontos",tag:"TEORIA + EXEMPLOS",description:"Textos autorais, equações fundamentais, aplicações e espaços para anotar cada nova descoberta.",action:"Explorar resumos"},
{id:"flashcards",icon:"λ",title:"Flashcards",tag:"REVISÃO ATIVA",description:"Perguntas comentadas, cartões interativos e acompanhamento para revisar sem decorar fórmulas isoladas.",action:"Revisar conceitos"},
{id:"bibliografia",icon:"⌁",title:"Referências Bibliográficas",tag:"PESQUISA ACADÊMICA",description:"Livros universitários, materiais científicos abertos, instituições e a sua biblioteca pessoal.",action:"Abrir biblioteca"},
{id:"tcc",icon:"ℏ",title:"Meu TCC de Física",tag:"LABORATÓRIO ACADÊMICO",description:"Um universo próprio para desenvolver a monografia: escrita, referências, Kanban, simulações numéricas e geração de PDF.",action:"Entrar no ateliê de TCC"},
{id:"pesquisa",icon:"✧",title:"Minha Pesquisa Acadêmica",tag:"PESQUISA + PÓS-GRADUAÇÃO",description:"Projetos de iniciação, mestrado e doutorado, protocolos, matrizes, diário científico, escrita e gestão de evidências.",action:"Entrar no observatório científico"},
{id:"semestre",icon:"▦",title:"Meu Controle Semestral",tag:"CURRÍCULO + ORGANIZAÇÃO",description:"Um espaço completo com disciplinas, dependências, cronograma, Kanban, relatórios e organização acadêmica.",action:"Organizar meu semestre"},
{id:"provas",icon:"∑",title:"Provas e Revisões",tag:"DIAGNÓSTICO + PLANO PDF",description:"Provas, domínio por assunto, estudo espaçado, práticas, atividades e plano de revisão semestral para PDF.",action:"Gerar meu plano de revisões"}
];
const crumb=parts=>'<div class="breadcrumbs"><a href="#home">Meu caderno</a>'+parts.map(x=>' <span>›</span> '+(x.url?'<a href="'+h(x.url)+'">'+h(x.label)+'</a>':'<b>'+h(x.label)+'</b>')).join("")+'</div>';
const hero=(label,title,desc,symbol)=>'<header class="module-hero"><span class="hero-pattern" aria-hidden="true"></span><span class="module-symbol" aria-hidden="true">'+symbol+'</span><span class="eyebrow">'+h(label)+'</span><h1>'+h(title)+'</h1><p>'+h(desc)+'</p><div class="hero-tiny" aria-hidden="true">✧ ∇ ·</div></header>';
const metric=(value,label,symbol)=>'<article class="metric"><span aria-hidden="true">'+symbol+'</span><b>'+h(value)+'</b><small>'+h(label)+'</small></article>';
const sidebar=(module,title)=>{
 const current=modules.find(x=>x.id===module);
 const details=module==="resumos"?"Teoria, demonstrações, exemplos e seus próprios registros.":module==="flashcards"?"Perguntas, explicações, dificuldade e acompanhamento de revisão.":module==="tcc"?"Laboratório autônomo de pesquisa e escrita em Física.":"Fontes, fichas de leitura, pesquisa e seu acervo pessoal.";
 return '<aside class="sidebar"><div class="sidebar-lead"><small>✦ MEU CADERNO DE FÍSICA</small><h2>'+h(title)+'</h2><p>'+h(details)+'</p></div><nav class="sidebar-nav" aria-label="Navegação exclusiva do módulo"><small>ESTE MÓDULO</small><a class="active" href="#'+module+'">'+(current?.icon||"✦")+' '+h(current?.title||title)+'</a><small>MEU CADERNO</small><a href="#home">⌂ Voltar à página inicial</a></nav><div class="sidebar-paper"><b>∴ Ideias em movimento</b><p>Seu espaço é dedicado somente ao assunto que você escolheu.</p></div></aside>';
};
const workspace=(module,title,body)=>'<div class="page workspace theme-'+module+'">'+sidebar(module,title)+'<main class="workspace-main">'+body+'</main></div>';
const page=(s,cls="")=>'<div class="page '+cls+'">'+s+'</div>';
let toTimer;
function toast(message){const el=$("#toast");if(!el)return;el.hidden=false;el.textContent=message;clearTimeout(toTimer);toTimer=setTimeout(()=>{el.hidden=true},3100)}
function loginView(){
 const back=!!firstEmail();
 return '<div class="auth-screen"><div class="auth-decoration" aria-hidden="true"><span>λ</span><span>∇</span><span>ℏ</span><span>∞</span><span>∮</span><span>ψ</span></div><div class="auth-layout">'+
 '<section class="auth-left"><div class="auth-logo"><span class="brand-mark">φ</span><span>CADERNO DO ESTUDANTE<br><strong>FÍSICA</strong></span></div><span class="eyebrow">SEU UNIVERSO DE ESTUDOS</span><h1>Cada descoberta <em>começa com uma pergunta.</em></h1><p>Um espaço para conectar teorias, experimentar ideias e escrever os próximos capítulos da sua graduação.</p>'+
 '<div class="auth-note-grid" aria-hidden="true"><div class="auth-note"><b>∑ Pequenas conquistas</b><span>Uma equação de cada vez</span></div><div class="auth-note"><b>λ Novas descobertas</b><span>Teoria, prática e curiosidade</span></div><div class="auth-note"><b>⌁ Meu laboratório</b><span>Organize suas melhores ideias</span></div></div></section>'+
 '<section class="auth-box"><div class="auth-washi" aria-hidden="true"></div><div class="auth-icons" aria-hidden="true"><span>⚛</span><span>✦</span><span>∇</span></div><span class="eyebrow">'+(back?"QUE BOM TER VOCÊ DE VOLTA":"SEJA MUITO BEM-VINDO(A)")+'</span><h2>'+(back?"Seu caderno está esperando por você!":"Que alegria ter você aqui!")+'</h2><p>Para entrar, digite o mesmo e-mail que você informou na compra do <b>Caderno do Estudante de Física</b>.</p><form id="login-form" novalidate><label for="login-email">E-mail utilizado na compra</label><div class="login-field"><span aria-hidden="true">✉</span><input type="text" id="login-email" autocomplete="email" inputmode="email" autocapitalize="none" spellcheck="false" maxlength="254" placeholder="Digite seu e-mail de compra" required aria-describedby="login-error"></div><p id="login-error" role="alert" hidden></p><button type="submit" class="btn btn-primary">Entrar no meu caderno <span>→</span></button></form><div class="auth-good">✧ Boas descobertas começam por aqui.</div></section></div></div>';
}
function header(active){
 const isModule=modules.some(m=>m.id===active);
 const visible=isModule?modules.filter(m=>m.id===active):modules;
 const links=visible.map(m=>'<a class="'+(active===m.id?"active":"")+'" href="#'+m.id+'">'+m.icon+' '+h(m.title)+'</a>').join("");
 return '<header class="topbar" id="topbar"><a class="top-logo" href="#home"><span class="brand-mark">φ</span><span><b>Caderno do Estudante</b><small>Física · Meu universo acadêmico</small></span></a><nav id="main-nav" class="main-nav" aria-label="'+(isModule?"Módulo atual":"Módulos do caderno")+'">'+links+'</nav><div class="top-actions">'+(!isModule?'<a href="#busca" class="top-search" aria-label="Buscar">⌕ <span>Buscar</span></a>':"")+button("Sair","logout",'aria-label="Sair do caderno"',"btn-logout")+(!isModule?button("☰","toggleMenu",'aria-expanded="false" aria-controls="main-nav" aria-label="Abrir menu"',"btn-menu"):"")+'</div></header>';
}
function route(){
 const path=decodeURIComponent((location.hash||"#home").slice(1)).split("/"),name=path[0]||"home";
 const current=name==="revisao-extra"?"flashcards":name==="estudo-extra"?"resumos":name==="leitura"?"resumos":name==="revisao"?"flashcards":name==="periodo"?"resumos":name;
 return {path,name,current};
}
function render(preserve=false){
 const app=$("#app");if(!app)return;
 const isLocked=!logged();document.body.classList.toggle("login-locked",isLocked);
 if(isLocked){$("#topbar")?.setAttribute("hidden","");app.innerHTML=loginView();document.title="Entrar | Caderno de Física";return}
 const {path,name,current}=route();
 const top=$("#topbar");if(top)top.outerHTML=header(current);
 document.body.classList.remove("nav-open");
 const view=routes.get(name)||routes.get("home");
 try{app.innerHTML=view?view(path):page('<section class="empty"><h1>Vamos descobrir mais?</h1><a class="btn btn-primary" href="#home">Voltar ao caderno</a></section>')}catch(error){app.innerHTML=page('<section class="empty"><h1>O conteúdo não abriu como esperado.</h1><p>Volte ao início e escolha outra leitura.</p><a class="btn btn-primary" href="#home">Início</a></section>');console.error(error)}
 document.title=(modules.find(m=>m.id===current)?.title||"Meu Caderno")+" | Caderno do Estudante de Física";
 if(!preserve)window.scrollTo(0,0);
}
function update(){const y=window.scrollY;render(true);window.scrollTo(0,y)}
function login(input){
 const email=String(input||"").trim().toLocaleLowerCase("pt-BR"),prior=firstEmail();
 const err=$("#login-error");
 const fail=message=>{if(err){err.textContent=message;err.hidden=false}$("#login-email")?.focus()};
 if(!email)return fail("Digite seu e-mail de compra para entrar.");
 if(prior&&prior.toLocaleLowerCase("pt-BR")!==email)return fail("Confira o e-mail utilizado na compra e tente novamente.");
 if(!prior&&!put(EMAIL,email))return fail("Não foi possível concluir a entrada agora. Tente novamente.");
 if(!put(ACTIVE,"1"))return fail("Não foi possível concluir a entrada agora. Tente novamente.");
 render();
}
const toggle=(which,key)=>{const a=state[which],i=a.indexOf(key);if(i<0)a.push(key);else a.splice(i,1);save()};
function filterCards(){
 const q=String($("[data-search]")?.value||"").trim().toLocaleLowerCase("pt-BR"),term=$("[data-filter-term]")?.value||"",
 type=$("[data-filter-type]")?.value||"",area=$("[data-filter-area]")?.value||"",only=$("#favorite-filter")?.checked;
 $$(".filter-card").forEach(node=>{
 const favId=node.dataset.bibId;
 node.hidden=!String(node.dataset.keywords||"").includes(q)||(term&&node.dataset.semester!==term)||(type&&node.dataset.type!==type)||(area&&node.dataset.area!==area)||(only&&(!favId||!state.bookstars.includes(favId)));
 });
}
document.addEventListener("submit",event=>{
 if(event.target.id==="login-form"){event.preventDefault();login($("#login-email")?.value);return}
 const cb=submitHandlers.get(event.target.id);if(cb){event.preventDefault();cb(event.target)}
});
document.addEventListener("click",event=>{
 const btn=event.target?.closest?.("[data-action]");if(!btn)return;
 const act=btn.dataset.action;
 if(act==="logout"){put(ACTIVE,"0");render();return}
 if(act==="toggleMenu"){const yes=document.body.classList.toggle("nav-open");btn.setAttribute("aria-expanded",String(yes));return}
 const fn=actionHandlers.get(act);if(fn)fn(btn);
});
document.addEventListener("input",event=>{
 const d=event.target?.dataset||{};
 if(d.note){state.notes[d.note]=event.target.value;save();return}
 if(d.bibnote){state.booknotes[d.bibnote]=event.target.value;save();return}
 if(d.search!==undefined||d.filterTerm!==undefined||d.filterType!==undefined||d.filterArea!==undefined)filterCards();
 if(event.target?.id==="login-email"){$("#login-error").hidden=true}
});
document.addEventListener("change",event=>{
 const d=event.target?.dataset||{};
 if(d.filterTerm!==undefined||d.filterType!==undefined||d.filterArea!==undefined||event.target?.id==="favorite-filter")filterCards();
});
window.addEventListener("hashchange",()=>render(false));
const register=(name,fn)=>routes.set(name,fn);
const onAction=(name,fn)=>actionHandlers.set(name,fn);
const onSubmit=(name,fn)=>submitHandlers.set(name,fn);
window.PHY_APP={terms,subjects,refs,extraSummaries,extraCards,allBooks,byId,state,save,h,$,$$,pill,button,escArea,modules,crumb,hero,metric,sidebar,workspace,page,toast,render,update,register,onAction,onSubmit,toggle,logged,login,cardTotal};
})();