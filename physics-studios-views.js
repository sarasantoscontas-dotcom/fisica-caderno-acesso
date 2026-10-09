/* Três mundos acadêmicos independentes, completamente interativos. */
(()=>{"use strict";
const A=window.PHY_APP,S=window.PHY_STUDIOS,h=A.h;
const icons={document:"¶",table:"▤",matrix:"⊞",checklist:"☑",board:"▥",calendar:"▦",gallery:"▧",timeline:"↝",journal:"✎",notes:"✎",kanban:"☷",qa:"?",form:"☷"};
const status=["A fazer","Em andamento","Em revisão","Pronto"],selectedMonth={},search={};
let drag=null;
const titleCase=x=>String(x||"").replace(/-/g," ");
const b=(label,action,attr="",cl="")=>'<button type="button" class="phy-action '+cl+'" data-st-action="'+action+'" '+attr+'>'+label+'</button>';
const link=(label,path,cl="")=>'<a class="phy-action '+cl+'" href="#'+path+'">'+label+'</a>';
const field=(label,id,area,key,val,type="text")=>'<label class="phy-field"><span>'+h(label)+'</span>'+(type==="textarea"?'<textarea rows="4" data-st-id="'+id+'" data-st-area="'+area+'" data-st-key="'+key+'">'+h(val||"")+'</textarea>':'<input type="'+type+'" value="'+h(val||"")+'" data-st-id="'+id+'" data-st-area="'+area+'" data-st-key="'+key+'">')+'</label>';
const feField=(id,fid,label,key,val,type="textarea")=>'<label class="phy-field"><span>'+h(label)+'</span>'+(type==="textarea"?'<textarea rows="6" data-st-id="'+id+'" data-st-feature="'+fid+'" data-st-key="'+key+'">'+h(val||"")+'</textarea>':'<input type="text" data-st-id="'+id+'" data-st-feature="'+fid+'" data-st-key="'+key+'" value="'+h(val||"")+'">')+'</label>';
const entField=(id,fid,eid,key,value,kind="text")=>kind==="textarea"?'<textarea rows="3" aria-label="'+h(key)+'" data-st-id="'+id+'" data-st-feature="'+fid+'" data-st-entry="'+eid+'" data-st-key="'+key+'">'+h(value||"")+'</textarea>':kind==="checkbox"?'<input type="checkbox" aria-label="Marcar concluído" data-st-id="'+id+'" data-st-feature="'+fid+'" data-st-entry="'+eid+'" data-st-key="'+key+'" '+(value?"checked":"")+'>':'<input type="'+kind+'" aria-label="'+h(key)+'" data-st-id="'+id+'" data-st-feature="'+fid+'" data-st-entry="'+eid+'" data-st-key="'+key+'" value="'+h(value??"")+'">';
const selectStatus=(id,fid,eid,val)=>'<select aria-label="Situação da atividade" data-st-id="'+id+'" data-st-feature="'+fid+'" data-st-entry="'+eid+'" data-st-key="status">'+status.map(x=>'<option'+(x===val?' selected':"")+'>'+x+'</option>').join("")+'</select>';
function nav(id,active){
 const cfg=S.config(id);const d=S.state(id);return '<aside class="phy-rail" aria-label="Navegação do ambiente '+h(cfg.title)+'">'+
 '<a href="#'+id+'" class="phy-brand"><span>'+cfg.icon+'</span><div><small>ESTÚDIO ACADÊMICO</small><b>'+h(cfg.short)+'</b><em>Física · Caderno interativo</em></div></a>'+
 '<div class="phy-rail-scroll"><small class="phy-nav-label">MEU MUNDO DE ESTUDO</small><a class="'+(active==="home"?"active":"")+'" href="#'+id+'">◈ Visão geral</a>'+
 (id==="pesquisa"?'<a class="'+(active==="project"?"active":"")+'" href="#pesquisa/project">⚗ Meu projeto científico</a><a href="#pesquisa/g/Protocolos%20e%20dados">⌁ Protocolos e dados</a>':"")+
 (id==="semestre"?'<a class="'+(active==="courses"?"active":"")+'" href="#semestre/courses">▤ Minhas disciplinas</a><a href="#semestre/g/Rotina%20e%20tarefas">↝ Organização e tarefas</a>':"")+
 (id==="provas"?'<a class="'+(active==="tests"?"active":"")+'" href="#provas/tests">λ Minhas provas e assuntos</a><a class="'+(active==="plan"?"active":"")+'" href="#provas/plano">✧ Plano de revisão para PDF</a>':"")+
 '<small class="phy-nav-label">OFICINAS DO MÓDULO</small>'+
 cfg.groups.map((g,i)=>'<a class="'+(active===g?"active":"")+'" href="#'+id+'/g/'+encodeURIComponent(g)+'"><span>'+["∑","⌁","✎","✧"][i]+'</span> '+h(g)+'</a>').join("")+
 '<small class="phy-nav-label">ORGANIZAÇÃO PESSOAL</small><a class="'+(active==="settings"?"active":"")+'" href="#'+id+'/settings">☷ Configurar e guardar dados</a>'+
 '</div><div class="phy-rail-footer"><b>✧ Meu espaço, meus estudos.</b><p>Edite, acompanhe e reorganize cada etapa com liberdade.</p><a href="#home">← Voltar ao Caderno de Física</a></div></aside>';
}
function shell(id,active,content){
 const cfg=S.config(id);return '<div class="phy-hub phy-'+id+'">'+nav(id,active)+'<div class="phy-main">'+
 '<header class="phy-topbar"><div><span class="phy-live"></span><b>'+h(cfg.subtitle)+'</b><small id="phy-saved-status">Alterações salvas neste caderno</small></div>'+
 '<div class="phy-toplinks">'+link("◈ Visão geral",id)+link(id==="provas"?"Gerar plano para PDF →":id==="semestre"?"Minhas disciplinas →":"Meu projeto →",id+(id==="provas"?"/plano":id==="semestre"?"/courses":"/project"),"primary")+'</div></header>'+
 '<main class="phy-body">'+content+'</main><footer class="phy-footer">∇ Caderno do Estudante de Física · '+h(cfg.short)+' · Um universo independente de aprendizagem.</footer></div></div>';
}
const hdr=(ey,title,desc)=>'<header class="phy-pageheading"><span class="phy-eyebrow">'+h(ey)+'</span><h1>'+h(title)+'</h1><p>'+h(desc)+'</p></header>';
function featureTile(id,f){
 return '<a class="phy-feature-tile" href="#'+id+'/tool/'+f.id+'" data-st-search="'+h((f.title+" "+f.description+" "+f.layout).toLowerCase())+'"><span class="phy-feature-icon">'+(icons[f.layout]||"✧")+'</span><small>'+h(f.layout==="qa"?"Perguntas e respostas":f.layout)+"</small><h3>"+h(f.title)+'</h3><p>'+h(f.description)+'</p><b>Entrar na ferramenta ↗</b></a>';
}
function groupCards(id){
 const cfg=S.config(id),d=S.state(id);return '<div class="phy-groups">'+cfg.groups.map((g,i)=>{const feat=Object.values(d.features).find(f=>f.group===g);return '<a class="phy-group-card" href="#'+id+'/g/'+encodeURIComponent(g)+'"><span>'+["∮","▤","λ","✧"][i]+'</span><small>OFICINA DE FÍSICA</small><h3>'+h(g)+'</h3><p>'+h(feat?.description||cfg.description)+'</p><strong>Explorar este espaço →</strong></a>'}).join("")+'</div>';
}
function dashboard(id){
 const cfg=S.config(id),d=S.state(id);
 const up=id==="pesquisa"?'<div class="phy-panel phy-story"><div><span class="phy-eyebrow">PROJETO CIENTÍFICO PREENCHIDO</span><h3>'+h(d.project.projectTitle||"Sua investigação em Física")+'</h3><p>'+h(d.project.question||"Escreva a sua pergunta de pesquisa.")+'</p><small>'+h(d.project.level||"Escolha seu nível de pesquisa")+'</small></div>'+link("Abrir projeto ↗","pesquisa/project","primary")+'</div>':
 id==="semestre"?'<div class="phy-panel phy-story"><div><span class="phy-eyebrow">ORGANIZAÇÃO CURRICULAR</span><h3>'+h(d.semester.term||"Meu semestre")+'</h3><p>'+h(d.semester.focus||"Planeje suas disciplinas, horários e entregas.")+'</p><small>'+h(d.semester.course||"Graduação em Física")+'</small></div>'+link("Ver minhas disciplinas ↗","semestre/courses","primary")+'</div>':
 '<div class="phy-panel phy-story phy-story-exams"><div><span class="phy-eyebrow">UM PLANO FEITO COM SEUS ASSUNTOS</span><h3>Seu semestre organizado para as provas</h3><p>O gerador combina datas das provas, importância de cada tópico e o que você já domina. Seu plano aparece em tabela e pode virar PDF.</p><small>Revise o diagnóstico e personalize as datas antes de gerar.</small></div>'+link("Gerar plano de revisão ⇩","provas/plano","primary")+'</div>';
 const peek=id==="provas"?'<section class="phy-section"><div class="phy-section-head"><div><small>PRÓXIMAS AVALIAÇÕES</small><h2>Onde concentrar atenção</h2></div>'+link("Editar assuntos →","provas/tests")+'</div><div class="phy-peek-grid">'+d.tests.slice(0,3).map(t=>{const topic=[...(t.topics||[])].sort((a,b)=>S.priority(t,b).score-S.priority(t,a).score)[0];return '<a href="#provas/tests/'+t.id+'" class="phy-peek"><b>'+h(t.subject)+'</b><small>'+h(t.date)+'</small><p>'+h(topic?.name||"Definir assuntos")+'</p><span>'+h(topic?S.priority(t,topic).label:"Planejar revisão")+' →</span></a>'}).join("")+'</div></section>':
 id==="semestre"?'<section class="phy-section"><div class="phy-section-head"><div><small>MEU CURRÍCULO</small><h2>Disciplinas do período</h2></div>'+link("Organizar matriz →","semestre/courses")+'</div><div class="phy-peek-grid">'+d.courses.slice(0,3).map(c=>'<a class="phy-peek" href="#semestre/courses"><b>'+h(c.name)+'</b><small>'+h(c.semester)+'</small><p>'+h(c.goal)+'</p><span>'+h(c.stage)+' →</span></a>').join("")+'</div></section>':
 '<section class="phy-section"><div class="phy-section-head"><div><small>RACIOCÍNIO CIENTÍFICO</small><h2>Suas próximas investigações</h2></div>'+link("Editar protocolo →","pesquisa/project")+'</div><div class="phy-peek-grid">'+d.project.steps.slice(0,3).map(c=>'<a class="phy-peek" href="#pesquisa/project"><b>'+h(c.task)+'</b><small>'+h(c.stage)+'</small><p>'+h(c.detail)+'</p><span>Ver projeto →</span></a>').join("")+'</div></section>';
 const stages=id==="pesquisa"?["Escolha a pergunta","Defina o protocolo","Documente os dados","Apresente evidências"]:id==="semestre"?["Planeje disciplinas","Distribua as tarefas","Acompanhe projetos","Feche o período"]:["Cadastre avaliações","Diagnostique domínio","Gere sua revisão","Pratique e ajuste"];
 return shell(id,"home",'<section class="phy-hero"><div class="phy-hero-grid"></div><div class="phy-hero-inner"><span class="phy-eyebrow">FÍSICA · LABORATÓRIO INTERATIVO</span><h1>'+h(cfg.hero)+'</h1><p>'+h(cfg.description)+'</p><div class="phy-hero-actions">'+link(id==="provas"?"✧ Gerar meu plano de revisão":id==="semestre"?"▤ Organizar meu semestre":"⚗ Abrir minha pesquisa",id+(id==="provas"?"/plano":id==="semestre"?"/courses":"/project"),"primary")+
 link("Explorar as oficinas",id+"/g/"+encodeURIComponent(cfg.groups[0]))+'</div></div><div class="phy-hero-art" aria-hidden="true"><span>'+cfg.emoji+'</span><i>∇F · ∫dt</i><b>✧ ciência em movimento</b></div></section>'+
 up+'<section class="phy-section"><div class="phy-section-head"><div><small>UM UNIVERSO INTEIRO PRA VOCÊ</small><h2>Oficinas deste ambiente</h2></div></div>'+groupCards(id)+'</section>'+peek+
 '<section class="phy-section"><div class="phy-section-head"><div><small>MINHAS PRÓXIMAS DESCOBERTAS</small><h2>Uma trilha para avançar</h2></div></div><div class="phy-steps">'+stages.map((x,i)=>'<span><i>'+["✧","∇","⌁","λ"][i]+'</i>'+h(x)+'</span>').join("")+'</div></section>'+
 '<section class="phy-section"><div class="phy-section-head"><div><small>ESPAÇOS PESSOAIS</small><h2>Seu laboratório de ferramentas</h2></div></div><div class="phy-feat-grid">'+Object.values(d.features).slice(0,8).map(f=>featureTile(id,f)).join("")+'</div></section>');
}
function group(id,g){
 const d=S.state(id),items=Object.values(d.features).filter(f=>f.group===g);if(!items.length)return dashboard(id);
 const c=S.config(id);return shell(id,g,hdr("OFICINA DE "+c.short.toUpperCase(),g,"Ferramentas exclusivas desta área, com situações de Física preenchidas. Você pode editar, apagar exemplos e criar novas atividades.")+
 '<label class="phy-field phy-search"><span>Buscar ferramenta nesta oficina</span><input type="search" data-st-filter placeholder="Pesquise por tema, formato ou atividade"></label>'+
 '<div class="phy-feat-grid">'+items.map(f=>featureTile(id,f)).join("")+'</div>'+
 '<div class="phy-return">'+link("← Todas as oficinas",id)+'</div>');
}
function entryCard(id,f,e,opts={}){
 const fid=f.id,eid=e.id;
 const core='<div class="phy-entry-header"><b>'+entField(id,fid,eid,"title",e.title)+'</b>'+b("×","entryRemove",'data-id="'+id+'" data-fid="'+fid+'" data-eid="'+eid+'" aria-label="Excluir atividade"',"danger")+'</div>'+
 entField(id,fid,eid,"detail",e.detail,"textarea")+
 '<div class="phy-entry-meta">'+selectStatus(id,fid,eid,e.status)+entField(id,fid,eid,"due",e.due,"date")+
 '<label class="phy-check">'+entField(id,fid,eid,"checked",e.checked,"checkbox")+' Concluído</label></div>';
 return '<article class="phy-entry '+(opts.className||"")+'" '+(opts.drag?'draggable="true" data-st-drag="'+id+'" data-fid="'+fid+'" data-eid="'+eid+'"':"")+'>'+core+'</article>';
}
function featureContent(id,f){
 const rows=f.entries||[];
 if(f.layout==="kanban"){
  return '<div class="phy-board">'+status.map(l=>'<section class="phy-board-lane" data-st-lane="'+l+'" data-st-lane-id="'+id+'" data-st-lane-fid="'+f.id+'"><h3>'+h(l)+'</h3>'+rows.filter(x=>x.status===l).map(e=>entryCard(id,f,e,{drag:true})).join("")+'</section>').join("")+'</div>';
 }
 if(f.layout==="gallery"||f.layout==="board")return '<div class="phy-entry-gallery">'+rows.map(e=>entryCard(id,f,e)).join("")+'</div>';
 if(f.layout==="matrix"||f.layout==="table")return '<div class="phy-overflow"><table class="phy-table"><thead><tr><th>Elemento</th><th>Descrição acadêmica e aplicação</th><th>Etapa</th><th>Prazo</th><th>Concluído</th><th></th></tr></thead><tbody>'+rows.map(e=>'<tr><td>'+entField(id,f.id,e.id,"title",e.title)+'</td><td>'+entField(id,f.id,e.id,"detail",e.detail,"textarea")+'</td><td>'+selectStatus(id,f.id,e.id,e.status)+'</td><td>'+entField(id,f.id,e.id,"due",e.due,"date")+'</td><td>'+entField(id,f.id,e.id,"checked",e.checked,"checkbox")+'</td><td>'+b("Excluir","entryRemove",'data-id="'+id+'" data-fid="'+f.id+'" data-eid="'+e.id+'"',"danger")+'</td></tr>').join("")+'</tbody></table></div>';
 if(f.layout==="calendar"){
  const byDate={};rows.forEach(e=>{(byDate[e.due]||(byDate[e.due]=[])).push(e)});
  return '<div class="phy-calendar-list">'+Object.keys(byDate).sort().map(day=>'<section><div class="phy-date-label">▦ '+h(day)+'</div><div class="phy-entry-gallery">'+byDate[day].map(e=>entryCard(id,f,e)).join("")+'</div></section>').join("")+'</div>';
 }
 if(f.layout==="timeline")return '<div class="phy-timeline">'+rows.map(e=>'<div class="phy-time-step"><span>'+h(e.due||"Data aberta")+'</span>'+entryCard(id,f,e)+'</div>').join("")+'</div>';
 if(f.layout==="qa")return '<div class="phy-qa">'+rows.map(e=>'<details><summary>'+h(e.title)+'</summary>'+entryCard(id,f,e)+'</details>').join("")+'</div>';
 return '<div class="phy-entry-stack">'+rows.map(e=>entryCard(id,f,e)).join("")+'</div>';
}
function tool(id,fid){
 const f=S.feature(id,fid);if(!f)return dashboard(id);
 return shell(id,f.group,hdr("ESPAÇO EDITÁVEL · "+f.layout.toUpperCase(),f.title,f.description)+
 '<div class="phy-tool-meta">'+link("← "+h(f.group),id+"/g/"+encodeURIComponent(f.group))+'<span>✧ Todos os dados deste ambiente são editáveis</span></div>'+
 '<section class="phy-panel phy-editor"><div class="phy-section-head"><div><small>SEU CADERNO PESSOAL</small><h2>Conteúdo já preenchido</h2></div></div>'+feField(id,fid,"Minhas anotações, fundamentos, métodos e análises","notes",f.notes)+'</section>'+
 '<section class="phy-panel phy-tool-work"><div class="phy-section-head"><div><small>'+h(f.layout.toUpperCase())+' · FÍSICA</small><h2>Aplicações e atividades</h2></div>'+b("+ Nova atividade","entryAdd",'data-id="'+id+'" data-fid="'+fid+'"',"primary")+'</div>'+featureContent(id,f)+'</section>'+
 '<div class="phy-return">'+link("← Voltar à oficina",id+"/g/"+encodeURIComponent(f.group))+' '+link("Visão geral",id)+'</div>');
}
function project(){
 const d=S.state("pesquisa"),p=d.project;
 const info=[["Título do projeto","projectTitle"],["Nível acadêmico","level"],["Área científica","area"],["Pergunta principal","question"],["Orientação","advisor"],["Instituição","institution"],["Data prevista de marco","date"]];
 return shell("pesquisa","project",hdr("MEU PROJETO PREENCHIDO","A investigação começa com uma boa pergunta","Estudo-modelo de Física Computacional. Adapte para iniciação científica, mestrado ou doutorado e registre critérios de validade.")+
 '<div class="phy-panel phy-project"><span class="phy-eyebrow">FORMULÁRIO DE INVESTIGAÇÃO</span><div class="phy-edit-grid">'+info.map(([label,key])=>field(label,"pesquisa","project",key,p[key]||"",key==="date"?"date":"text")).join("")+'</div>'+
 '<div class="phy-note-illustration"><b>Modelo científico de referência</b><p>m x″ + b x′ + kx = 0 · E = ½mv² + ½kx² · dE/dt = −bv². Registre quais relações você efetivamente verificou e em quais condições elas valem.</p></div></div>'+
 '<div class="phy-section"><div class="phy-section-head"><div><small>PERGUNTAS E ENTREGAS</small><h2>Roteiro da investigação</h2></div></div><div class="phy-entry-stack">'+(p.steps||[]).map((x,i)=>'<article class="phy-entry"><h3>'+h(x.task)+'</h3><span class="phy-chip">'+h(x.stage)+'</span><p>'+h(x.detail)+'</p></article>').join("")+'</div></div>'+
 '<div class="phy-return">'+link("Explorar meus protocolos →","pesquisa/g/Protocolos%20e%20dados")+'</div>');
}
function courses(){
 const d=S.state("semestre");
 return shell("semestre","courses",hdr("MATRIZ E ORGANIZAÇÃO CURRICULAR","Meu controle semestral de Física","Disciplinas-modelo com dependências, objetivos, horas e status editáveis. Ajuste tudo ao Projeto Pedagógico do seu curso.")+
 '<div class="phy-panel"><div class="phy-section-head"><div><small>MEU SEMESTRE</small><h2>Planejamento pessoal</h2></div></div><div class="phy-edit-grid">'+[["Período","term"],["Curso","course"],["Instituição","institution"],["Objetivos do período","focus"]].map(([label,key])=>field(label,"semestre","semester",key,d.semester[key]||"")).join("")+'</div>'+field("Minhas observações","semestre","semester","notes",d.semester.notes||"","textarea")+'</div>'+
 '<section class="phy-panel"><div class="phy-section-head"><div><small>MINHAS DISCIPLINAS</small><h2>Matriz pessoal e acompanhamento</h2></div>'+b("+ Adicionar disciplina","rowAdd",'data-id="semestre" data-kind="courses"',"primary")+'</div>'+
 '<div class="phy-overflow"><table class="phy-table phy-courses-table"><thead><tr><th>Disciplina</th><th>Período</th><th>Carga horária</th><th>Pré-requisitos</th><th>Status</th><th>Objetivo e atenção</th><th></th></tr></thead><tbody>'+d.courses.map(c=>'<tr><td>'+field("","semestre","course:"+c.id,"name",c.name)+'</td><td>'+field("","semestre","course:"+c.id,"semester",c.semester)+'</td><td>'+field("","semestre","course:"+c.id,"hours",c.hours,"number")+'</td><td>'+field("","semestre","course:"+c.id,"prerequisite",c.prerequisite)+'</td><td>'+field("","semestre","course:"+c.id,"stage",c.stage)+'</td><td>'+field("","semestre","course:"+c.id,"goal",c.goal)+'</td><td>'+b("Excluir","rowRemove",'data-id="semestre" data-kind="courses" data-rid="'+c.id+'"',"danger")+'</td></tr>').join("")+'</tbody></table></div></section>'+
 '<div class="phy-return">'+link("Organizar tarefas →","semestre/g/Rotina%20e%20tarefas")+'</div>');
}
const masteryLabels=["Preciso estudar","Estou começando","Consigo com ajuda","Domino sozinho"];
function tests(selected){
 const d=S.state("provas"),all=d.tests,shown=selected?all.filter(t=>t.id===selected):all;
 return shell("provas","tests",hdr("ESTAÇÃO DE AVALIAÇÕES","Minhas provas e os assuntos que preciso dominar","Cadastre datas e edite cada tópico. Seu domínio alimenta automaticamente o plano de revisão, com atenção maior ao que você ainda não sabe.")+
 '<section class="phy-panel"><div class="phy-section-head"><div><small>AVALIAÇÕES DO PERÍODO</small><h2>Organizar provas</h2></div>'+b("+ Cadastrar prova","rowAdd",'data-id="provas" data-kind="tests"',"primary")+'</div>'+
 '<div class="phy-test-picker">'+all.map(t=>link("λ "+h(t.subject),"provas/tests/"+t.id,selected===t.id?"selected":"")).join("")+' '+link("Ver todas","provas/tests")+'</div>'+
 shown.map(t=>'<article class="phy-test-card"><header><span class="phy-chip">AVALIAÇÃO ACADÊMICA · EXEMPLO EDITÁVEL</span><div>'+b("Excluir esta prova","rowRemove",'data-id="provas" data-kind="tests" data-rid="'+t.id+'"',"danger")+'</div></header><div class="phy-edit-grid">'+field("Nome da avaliação","provas","test:"+t.id,"title",t.title)+field("Disciplina","provas","test:"+t.id,"subject",t.subject)+field("Data da prova","provas","test:"+t.id,"date",t.date,"date")+field("Situação","provas","test:"+t.id,"status",t.status)+'</div>'+
 '<div class="phy-section-head"><div><small>COMPREENSÃO POR ASSUNTO</small><h3>Diagnóstico de domínio</h3></div>'+b("+ Assunto","topicAdd",'data-tid="'+t.id+'"',"primary")+'</div>'+
 '<div class="phy-topic-grid">'+(t.topics||[]).map(x=>'<section class="phy-topic"><div><span class="phy-chip '+(S.priority(t,x).score>=23?"is-high":"")+'">'+h(S.priority(t,x).label)+'</span><small>Revisão por dificuldade e relevância</small></div>'+
 field("Assunto","provas","topic:"+t.id+":"+x.id,"name",x.name)+
 '<label class="phy-field"><span>Meu domínio</span><select data-st-id="provas" data-st-area="topic:'+t.id+':'+x.id+'" data-st-key="mastery">'+masteryLabels.map((a,i)=>'<option value="'+i+'" '+(Number(x.mastery)===i?"selected":"")+'>'+h(a)+'</option>').join("")+'</select></label>'+
 '<label class="phy-field"><span>Importância na prova</span><select data-st-id="provas" data-st-area="topic:'+t.id+':'+x.id+'" data-st-key="importance">'+[["1","Complementar"],["2","Importante"],["3","Fundamental"]].map(([v,label])=>'<option value="'+v+'" '+(Number(x.importance)===Number(v)?"selected":"")+'>'+label+'</option>').join("")+'</select></label>'+
 field("Minha atividade de revisão","provas","topic:"+t.id+":"+x.id,"tasks",x.tasks,"textarea")+'</section>').join("")+'</div></article>').join("")+'</section>'+
 '<div class="phy-plan-prompt"><span aria-hidden="true">✦ ∇ λ</span><div><h2>Seu diagnóstico já pode virar um plano de estudos!</h2><p>As disciplinas com menor domínio, maior importância e provas próximas recebem atenção especial.</p></div>'+link("Gerar meu plano para PDF ↗","provas/plano","primary")+'</div>');
}
const brdate=x=>x?x.split("-").reverse().join("/"):"";
function reviewPlan(){
 const plan=S.plan(),d=S.state("provas"),groups=plan.subjectPriorities;
 const row=x=>'<tr><td>'+h(brdate(x.date))+'</td><td>'+h(x.subject)+'</td><td>'+h(x.topic)+'</td><td><span class="phy-chip '+(x.priority==="Atenção especial"?"is-high":"")+'">'+h(x.priority)+'</span></td><td>'+h(x.phase)+'</td><td>'+h(x.task||"Resolver exercícios")+'</td><td>'+h(x.duration)+' min</td><td>☐</td></tr>';
 return shell("provas","plan",hdr("PLANO PERSONALIZADO · FÍSICA","Gerador de revisão do semestre","Um roteiro gerado com base nas suas provas e no domínio de cada conceito. Edite o diagnóstico para atualizar as prioridades e salve o roteiro como PDF.")+
 '<div class="phy-plan-actions"><div><b>Planejamento de revisão pronto para visualizar</b><p>O plano inclui sessões espaçadas e atividades de resolução. As datas das provas são exemplos até você confirmá-las.</p></div>'+b("⇩ Salvar plano de revisão em PDF","printPlan","","primary")+'</div>'+
 '<section id="phy-review-print" class="phy-print-plan"><div class="phy-print-title"><small>CADERNO DO ESTUDANTE DE FÍSICA · REVISION PLANNER</small><h1>Plano de revisão para provas</h1><p>'+h(d.preferences.term||"Meu semestre")+' · Elaborado com o diagnóstico acadêmico do estudante</p><small>Data de atualização: '+h(brdate(plan.today))+' · Sessões replanejadas quando assuntos ou datas forem alterados.</small></div>'+
 '<section class="phy-print-section"><h2>Minhas prioridades de estudo</h2><div class="phy-priority-grid">'+groups.map(g=>'<article><h3>'+h(g.name)+'</h3><p>'+g.topics.slice(0,3).map(x=>h(x.topic+" — "+x.priority)).join(" · ")+'</p></article>').join("")+'</div></section>'+
 '<section class="phy-print-section"><h2>Agenda e atividades por assunto</h2>'+(plan.schedule.length?'<div class="phy-overflow"><table class="phy-table phy-plan-table"><thead><tr><th>Data</th><th>Disciplina</th><th>Assunto</th><th>Prioridade</th><th>Revisão</th><th>Atividade orientada</th><th>Duração</th><th>Feito</th></tr></thead><tbody>'+plan.schedule.map(row).join("")+'</tbody></table></div>':'<p>Cadastre avaliações futuras com assuntos para gerar as revisões.</p>')+'</section>'+
 '<section class="phy-print-section"><h2>Como utilizar este planejamento</h2><p>Comece tentando recuperar o conceito sem consulta. Resolva ao menos uma questão nova; confronte o raciocínio com equações, unidades e casos-limite. Registre as dúvidas que persistirem. Após cada prova, atualize seu diagnóstico para o próximo ciclo. As sessões são uma sugestão automática e não substituem os prazos definidos pela universidade.</p><p>O desempenho é acompanhado pelos níveis de domínio informados pelo estudante. O sistema não supõe que atividades geradas foram concluídas.</p></section></section>'+
 '<div class="phy-return">'+link("← Ajustar minhas provas","provas/tests")+' '+b("Salvar em PDF","printPlan","","primary")+'</div>');
}
function settings(id){
 const d=S.state(id),c=S.config(id);
 return shell(id,"settings",hdr("MEU ESTÚDIO EDITÁVEL","Configurações e segurança do meu caderno","Salve uma cópia do conteúdo deste ambiente, restaure o modelo de exemplo ou limpe somente seus campos aqui dentro.")+
 '<div class="phy-panel"><div class="phy-edit-grid">'+field("Nome deste mundo",id,"settings","title",d.settings.title)+field("Descrição pessoal",id,"settings","description",d.settings.description)+'</div>'+
 (id==="provas"?'<div class="phy-edit-grid">'+field("Semestre","provas","preferences","term",d.preferences.term)+field("Minutos por sessão","provas","preferences","sessionMinutes",d.preferences.sessionMinutes,"number")+field("Sessões por dia","provas","preferences","dailyLimit",d.preferences.dailyLimit,"number")+'</div>':"")+
 '<div class="phy-settings-actions">'+b("⇩ Fazer backup JSON","backup",'data-id="'+id+'"',"primary")+b("↺ Restaurar exemplos","reset",'data-id="'+id+'"')+b("✕ Limpar exemplos deste módulo","clear",'data-id="'+id+'"',"danger")+b("Importar backup","importPrompt",'data-id="'+id+'"')+'</div>'+
 '<label class="phy-field"><span>Cole aqui seu backup JSON para importar</span><textarea rows="7" id="phy-import-json" placeholder="Cole o JSON exportado, somente para este ambiente."></textarea></label>'+
 '<p class="phy-help">As operações afetam somente '+h(c.title)+'. Antes de limpar exemplos, salve uma cópia. Dados pessoais e atividades reais não são sincronizados entre dispositivos.</p></div>');
}
function render(id,path){
 const second=path[1]||"home",third=path.slice(2).join("/");
 if(second==="g")return group(id,decodeURIComponent(third));
 if(second==="tool")return tool(id,third);
 if(id==="pesquisa"&&second==="project")return project();
 if(id==="semestre"&&second==="courses")return courses();
 if(id==="provas"&&second==="tests")return tests(third);
 if(id==="provas"&&second==="plano")return reviewPlan();
 if(second==="settings")return settings(id);
 return dashboard(id);
}
for(const cfg of S.all())A.register(cfg.id,path=>render(cfg.id,path));
const rerender=()=>A.update();
function changed(e){
 const t=e.target,d=t?.dataset;if(!d?.stId)return;
 const id=d.stId;let done=false;
 if(d.stFeature&&d.stEntry)done=S.entrySet(id,d.stFeature,d.stEntry,d.stKey,d.stKey==="checked"?t.checked:t.value);
 else if(d.stFeature)done=S.featureSet(id,d.stFeature,d.stKey,t.value);
 else if(d.stArea?.startsWith("course:"))done=S.rowSet(id,"courses",d.stArea.slice(7),d.stKey,t.value);
 else if(d.stArea?.startsWith("test:"))done=S.rowSet(id,"tests",d.stArea.slice(5),d.stKey,t.value);
 else if(d.stArea?.startsWith("topic:")){const [,testId,topicId]=d.stArea.split(":");done=S.topicSet(testId,topicId,d.stKey,t.value)}
 else if(d.stArea)done=S.set(id,d.stArea,d.stKey,t.value);
 if(done){const el=A.$("#phy-saved-status");if(el)el.textContent="Minha edição foi salva ✓";}
}
document.addEventListener("input",e=>{
 changed(e);
 const q=e.target;if(q?.dataset?.stFilter!==undefined){const v=q.value.toLowerCase();A.$$("[data-st-search]").forEach(x=>x.hidden=!x.dataset.stSearch.includes(v));}
});
document.addEventListener("change",e=>{changed(e);if(e.target?.dataset?.stKey==="status"||e.target?.dataset?.stKey==="mastery"||e.target?.dataset?.stKey==="importance")rerender()});
const actions={
 entryAdd:b=>{S.entryAdd(b.dataset.id,b.dataset.fid);rerender()},
 entryRemove:b=>{if(!window.confirm("Excluir somente esta atividade?"))return;S.entryRemove(b.dataset.id,b.dataset.fid,b.dataset.eid);rerender()},
 rowAdd:b=>{S.rowAdd(b.dataset.id,b.dataset.kind);rerender()},
 rowRemove:b=>{if(!window.confirm("Excluir esta disciplina ou avaliação?"))return;S.rowRemove(b.dataset.id,b.dataset.kind,b.dataset.rid);rerender()},
 topicAdd:b=>{S.topicAdd(b.dataset.tid);rerender()},
 printPlan:()=>{window.print();},
 backup:b=>{const txt=S.backup(b.dataset.id);if(!window.Blob||!window.URL?.createObjectURL)return A.toast("Não foi possível preparar o backup.");const url=URL.createObjectURL(new Blob([txt],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="caderno-fisica-"+b.dataset.id+"-backup.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)},
 reset:b=>{if(!window.confirm("Restaurar dados de exemplo deste módulo? Suas edições serão substituídas."))return;S.reset(b.dataset.id);rerender()},
 clear:b=>{if(!window.confirm("Limpar exemplos e campos deste módulo? Faça backup antes. Os outros módulos não serão alterados."))return;S.clear(b.dataset.id);rerender()},
 importPrompt:b=>{const content=A.$("#phy-import-json")?.value;if(!content)return A.toast("Cole seu backup JSON no campo acima.");if(!window.confirm("Importar este backup e substituir os dados atuais deste módulo?"))return;try{S.restore(b.dataset.id,content);rerender();A.toast("Backup restaurado!") }catch(e){A.toast(e.message)}}
};
document.addEventListener("click",e=>{const btn=e.target?.closest?.("[data-st-action]");if(btn&&actions[btn.dataset.stAction])actions[btn.dataset.stAction](btn)});
document.addEventListener("dragstart",e=>{const item=e.target?.closest?.("[data-st-drag]");if(!item)return;drag={id:item.dataset.stDrag,fid:item.dataset.fid,eid:item.dataset.eid};if(e.dataTransfer){e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",drag.eid)}});
document.addEventListener("dragover",e=>{if(e.target?.closest?.("[data-st-lane]"))e.preventDefault()});
document.addEventListener("drop",e=>{const lane=e.target?.closest?.("[data-st-lane]");if(!lane||!drag||drag.id!==lane.dataset.stLaneId||drag.fid!==lane.dataset.stLaneFid)return;e.preventDefault();S.entrySet(drag.id,drag.fid,drag.eid,"status",lane.dataset.stLane);drag=null;rerender();A.toast("Etapa atualizada no quadro.")});
window.PHY_STUDIOS_UI={render,dashboard,group,tool,reviewPlan,project,courses,tests};
})();