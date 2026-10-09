/* O outro mundo do TCC · navegação, componentes operacionais e layouts diversos. */
(()=>{
"use strict";
const A=window.PHY_APP,T=window.PHY_TCC;
const {h,button,toast}=A;
let groupFilter="",calMonth=new Date().toISOString().slice(0,7),dragData=null,uiQuery="";
const groups=T.groups,desc={
 "projeto":"Identidade, problema e raciocínio científico",
 "escrita":"Uma oficina para estruturar a monografia",
 "pesquisa":"Biblioteca, fichamentos e correlação de autores",
 "metodo":"Equações, simulações, erros e reprodutibilidade",
 "organizacao":"Etapas, prazos e a rotina de produção do TCC",
 "dados":"Tabelas, decisões e documentação de cálculos",
 "normalizacao":"Conferência técnica e apresentação acadêmica",
 "defesa":"Argumentação, apresentação e versão final"
};
const icons={dashboard:"◈",form:"☷",board:"▦",note:"✎",checklist:"☑",table:"▤",gallery:"▧",document:"¶",matrix:"⊞",timeline:"↝",simulator:"∇",kanban:"☷",calendar:"▦",qa:"?",export:"⇩"};
const lane=["A fazer","Em andamento","Em revisão","Pronto"];
const fmt=x=>String(x??"").trim();
const hdr=(k,t,lead)=>'<header class="tcc-page-header"><span class="tcc-overline">'+h(k)+'</span><h1>'+h(t)+'</h1><p>'+h(lead)+'</p></header>';
const action=(t,a,attrs="",cls="")=>'<button type="button" class="tcc-btn '+cls+'" data-tcc-action="'+a+'" '+attrs+'>'+t+'</button>';
const nav=(active)=>{
 return '<aside class="tcc-rail" aria-label="Navegação exclusiva do TCC">'+
 '<a class="tcc-rail-brand" href="#tcc"><span>ℏ</span><div><small>LABORATÓRIO ACADÊMICO</small><b>MEU TCC</b><em>Física · Projeto de pesquisa</em></div></a>'+
 '<div class="tcc-rail-scroll"><span class="tcc-rail-label">MEU AMBIENTE</span><a class="'+(active==="dashboard"?"selected":"")+'" href="#tcc">◈ Visão geral</a>'+
 '<a class="'+(active==="chapters"?"selected":"")+'" href="#tcc/chapters">¶ Meu documento</a>'+
 '<a class="'+(active==="simulator"?"selected":"")+'" href="#tcc/simulator">∇ Simulador físico</a>'+
 '<a class="'+(active==="sources"?"selected":"")+'" href="#tcc/sources">⌁ Minhas fontes</a>'+
 '<span class="tcc-rail-label">UNIVERSOS DE TRABALHO</span>'+
 groups.map(g=>'<a class="'+(active===g.id?"selected":"")+'" href="#tcc/g/'+g.id+'"><span>'+g.icon+'</span> '+h(g.title)+'</a>').join("")+
 '<span class="tcc-rail-label">FINALIZAÇÃO</span><a class="'+(active==="versions"?"selected":"")+'" href="#tcc/versions">◷ Histórico de versões</a><a class="'+(active==="export"?"selected":"")+'" href="#tcc/export">⇩ Gerar TCC em PDF</a></div>'+
 '<div class="tcc-rail-bottom"><b>✦ Seu universo de pesquisa</b><p>Construir, testar, registrar, revisar e apresentar.</p><a href="#home">← Voltar ao Caderno de Física</a></div></aside>';
};
const shell=(active,html)=>'<div class="tcc-world">'+nav(active)+'<div class="tcc-main"><div class="tcc-topline"><div><span class="tcc-live-dot"></span><b>ATELIÊ DE TCC · FÍSICA</b><small id="tcc-save-status">Edições salvas automaticamente</small></div><div class="tcc-top-actions"><a class="tcc-quiet" href="#home">Caderno principal ↗</a><a class="tcc-quiet" href="#tcc/chapters">Escrever</a><a class="tcc-top-export" href="#tcc/export">Gerar TCC ⇩</a></div></div><div class="tcc-body">'+html+'</div><footer class="tcc-foot">∇ Seu laboratório de ideias e pesquisas · TCC de Física</footer></div></div>';
const grpById=id=>groups.find(g=>g.id===id);
const featTitle=id=>T.feature(id)?.title||"Ferramenta";
const featureCard=f=>'<a class="tcc-feature-tile" href="#tcc/tool/'+f.id+'" data-tcc-keywords="'+h((f.title+" "+f.description+" "+f.layout).toLowerCase())+'"><span class="tcc-feature-icon">'+(icons[f.layout]||"✦")+'</span><small>'+h(f.layout==="simulator"?"EXPERIMENTO NUMÉRICO":f.layout.toUpperCase())+'</small><h3>'+h(f.title)+'</h3><p>'+h(f.entries[0]?.title||"Área pronta para seu projeto")+'</p><span>Explorar ferramenta →</span></a>';
function dashboard(){
 const m=T.state(),p=T.progress();
 return shell("dashboard",'<section class="tcc-hero"><div class="tcc-hero-text"><span class="tcc-overline">✦ BEM-VINDO AO SEU LABORATÓRIO DE PESQUISA</span><h1>Do primeiro problema à <em>última equação.</em></h1><p>Um novo universo dentro do Caderno de Física. Desenvolva seu projeto, organize o método, escreva os capítulos, explore suas simulações e prepare a defesa em um mesmo lugar.</p><div class="tcc-hero-actions"><a class="tcc-btn primary" href="#tcc/chapters">Continuar escrevendo ↗</a><a class="tcc-btn ghost" href="#tcc/simulator">Abrir simulador ∇</a></div></div><div class="tcc-hero-art" aria-hidden="true"><div class="tcc-orbit"><b>ℏ</b><span>∇</span><span>∑</span><span>λ</span></div><div class="tcc-postit p1">✎ hipótese → método</div><div class="tcc-postit p2">E(t) = ½mv² + ½kx²</div></div></section>'+
 '<div class="tcc-model-hint"><b>✦ Seu TCC-modelo já está preenchido.</b><span>Os textos, tarefas e cálculos são exemplos acadêmicos editáveis. Você pode personalizar tudo, limpar o exemplo ou restaurá-lo quando quiser. Resultados de simulação não são dados experimentais.</span></div>'+
 '<section class="tcc-section"><div class="tcc-heading"><div><small>ATELIÊ DE PESQUISA</small><h2>Meu projeto atual</h2></div><a class="tcc-quiet" href="#tcc/g/projeto">Configurar projeto →</a></div><div class="tcc-project-card"><div class="tcc-project-top"><span>FÍSICA COMPUTACIONAL</span><span>◈ PROJETO EDITÁVEL</span></div><h3>'+h(m.metadata.title||"Título do TCC a definir")+'</h3><p>'+h(m.metadata.question||"Defina uma pergunta física investigável.")+'</p><div class="tcc-project-tags"><span>∇ '+h(m.metadata.area||"Área a definir")+'</span><span>✎ '+h(m.metadata.stage||"Desenvolvimento")+'</span></div><div class="tcc-project-links"><a href="#tcc/chapters">Abrir documento →</a><a href="#tcc/g/organizacao">Organizar etapas →</a></div></div></section>'+
 '<section class="tcc-section"><div class="tcc-heading"><div><small>AMBIENTES DE TRABALHO</small><h2>Uma oficina para cada etapa</h2></div></div><div class="tcc-group-grid">'+groups.map((g,i)=>'<a class="tcc-group-card gc-'+i+'" href="#tcc/g/'+g.id+'"><span>'+g.icon+'</span><small>ÁREA DE ESTUDO E PRODUÇÃO</small><h3>'+h(g.title)+'</h3><p>'+h(g.description)+'</p><b>Entrar no ambiente ↗</b></a>').join("")+'</div></section>'+
 '<section class="tcc-section"><div class="tcc-heading"><div><small>ATALHOS DE PRODUÇÃO</small><h2>Retomar uma atividade</h2></div></div><div class="tcc-fast-grid"><a href="#tcc/tool/organizacao-01">▦ Kanban do TCC <span>→</span></a><a href="#tcc/tool/organizacao-06">▦ Agenda de entregas <span>→</span></a><a href="#tcc/tool/pesquisa-03">⌁ Fichamentos <span>→</span></a><a href="#tcc/tool/defesa-04">? Perguntas da banca <span>→</span></a><a href="#tcc/versions">◷ Versões do projeto <span>→</span></a><a href="#tcc/export">⇩ Gerar PDF <span>→</span></a></div></section>'+
 '<section class="tcc-section"><div class="tcc-heading"><div><small>PERSONALIZAÇÃO</small><h2>O modelo é seu para transformar</h2></div></div><div class="tcc-manage"><div><h3>Gerenciar conteúdo de exemplo</h3><p>Salve um backup antes de limpar, se desejar. A opção Limpar esvazia textos demonstrativos, referências e cartões do módulo TCC, mantendo a estrutura e as ferramentas. Restaurar recupera o modelo de Física original.</p></div><div>'+action("Fazer backup JSON","backup")+action("Limpar conteúdo de exemplo","clearDemo",'',"warn")+action("Restaurar exemplo original","resetDemo")+'</div></div></section>');
}
function groupPage(id){
 const g=grpById(id);if(!g)return dashboard();
 const f=T.features.filter(x=>x.group===id).map(x=>T.feature(x.id));
 return shell(id,hdr("OFICINA DE TCC · "+g.title,g.title,g.description)+
 '<div class="tcc-searchbar"><label><span>⌕</span><input type="search" data-tcc-search placeholder="Pesquisar ferramentas deste ambiente..."></label><a href="#tcc">← Todos os ambientes</a></div>'+
 '<div class="tcc-feature-grid">'+f.map(featureCard).join("")+'</div>');
}
const field=(title,value,attrs,kind="textarea")=>'<label class="tcc-input-label"><span>'+h(title)+'</span>'+(kind==="input"?'<input '+attrs+' value="'+h(value)+'">':'<textarea '+attrs+' rows="4">'+h(value)+'</textarea>')+'</label>';
const statuses=selected=>'<select aria-label="Status da atividade" data-tcc-status>'+lane.map(x=>'<option '+(selected===x?"selected":"")+'>'+x+'</option>').join("")+'</select>';
const dueInput=(f,e)=>'<label class="tcc-inline-date">Prazo <input type="date" data-tcc-feature="'+h(f.id)+'" data-tcc-entry="'+h(e.id)+'" data-tcc-prop="due" value="'+h(e.due||"")+'"></label>';
const entryEditor=(f,e,style="list")=>
 '<article class="tcc-entry '+(style==="gallery"?"tcc-entry-gallery":"")+'" data-tcc-entry-card="'+h(e.id)+'" draggable="'+(f.layout==="kanban"?"true":"false")+'" data-tcc-drag-feature="'+h(f.id)+'"><div class="tcc-entry-title">'+
 '<input type="checkbox" data-tcc-feature="'+h(f.id)+'" data-tcc-entry="'+h(e.id)+'" data-tcc-prop="checked" '+(e.checked?"checked":"")+' aria-label="Marcar atividade como concluída">'+
 '<input class="tcc-entry-name" aria-label="Nome da atividade" value="'+h(e.title)+'" data-tcc-feature="'+h(f.id)+'" data-tcc-entry="'+h(e.id)+'" data-tcc-prop="title"></div>'+
 '<textarea rows="3" aria-label="Detalhes da atividade" data-tcc-feature="'+h(f.id)+'" data-tcc-entry="'+h(e.id)+'" data-tcc-prop="detail">'+h(e.detail||"")+'</textarea>'+
 '<div class="tcc-entry-bottom"><label class="tcc-status-label">Status <select data-tcc-feature="'+h(f.id)+'" data-tcc-entry="'+h(e.id)+'" data-tcc-prop="status">'+lane.map(x=>'<option '+(e.status===x?"selected":"")+'>'+x+'</option>').join("")+'</select></label>'+dueInput(f,e)+action("×","removeEntry",'data-feature="'+f.id+'" data-entry="'+e.id+'" aria-label="Excluir cartão"',"tcc-small-warn")+'</div></article>';
const commonFooter=(f)=>'<div class="tcc-tool-footer">'+action("+ Adicionar atividade","addEntry",'data-feature="'+h(f.id)+'',"primary")+action("Salvar versão do projeto","saveVersion")+'</div>'+
 '<section class="tcc-context-note">'+field("Notas gerais da ferramenta",f.notes,'data-tcc-tool-note="'+h(f.id)+'"')+'</section>';
function byLayout(f){
 const entries=f.entries||[],id=h(f.id);
 if(f.layout==="simulator")return '<div class="tcc-tool-note"><b>Laboratório de Física real</b><p>Os gráficos são gerados por cálculo numérico, não por dados inventados. Ajuste os parâmetros e compare métodos em uma tela independente.</p><a class="tcc-btn primary" href="#tcc/simulator">Abrir simulador computacional ∇</a></div>'+commonFooter(f);
 if(f.layout==="export")return '<div class="tcc-tool-note"><b>Escritório de publicação</b><p>Monte o documento integral a partir de suas edições e utilize o sistema de impressão para salvar um PDF com capa, resumo, capítulos, bibliografia e apêndices.</p><a class="tcc-btn primary" href="#tcc/export">Abrir prévia e gerar PDF ⇩</a></div>'+commonFooter(f);
 if(f.layout==="kanban"||f.layout==="board"){
  return '<div class="tcc-kanban" data-tcc-board="'+id+'">'+lane.map(status=>'<section class="tcc-kanban-lane" data-tcc-lane="'+h(status)+'" data-tcc-board-id="'+id+'"><h3>'+h(status)+'</h3><div class="tcc-kanban-stack">'+entries.filter(e=>e.status===status).map(e=>entryEditor(f,e)).join("")+'</div></section>').join("")+'</div>'+commonFooter(f);
 }
 if(f.layout==="table"||f.layout==="matrix"){
  return '<div class="tcc-table-scroll"><table class="tcc-edit-table"><thead><tr><th>Atividade ou conceito</th><th>Aplicação científica</th><th>Status</th><th>Prazo</th><th>Concluído</th><th>Ação</th></tr></thead><tbody>'+entries.map(e=>'<tr><td><textarea rows="2" data-tcc-feature="'+id+'" data-tcc-entry="'+h(e.id)+'" data-tcc-prop="title">'+h(e.title)+'</textarea></td><td><textarea rows="3" data-tcc-feature="'+id+'" data-tcc-entry="'+h(e.id)+'" data-tcc-prop="detail">'+h(e.detail)+'</textarea></td><td><select data-tcc-feature="'+id+'" data-tcc-entry="'+h(e.id)+'" data-tcc-prop="status">'+lane.map(x=>'<option '+(x===e.status?"selected":"")+'>'+x+'</option>').join("")+'</select></td><td><input type="date" data-tcc-feature="'+id+'" data-tcc-entry="'+h(e.id)+'" data-tcc-prop="due" value="'+h(e.due)+'"></td><td><input type="checkbox" data-tcc-feature="'+id+'" data-tcc-entry="'+h(e.id)+'" data-tcc-prop="checked" '+(e.checked?"checked":"")+'></td><td>'+action("×","removeEntry",'data-feature="'+id+'" data-entry="'+h(e.id)+'"',"tcc-small-warn")+'</td></tr>').join("")+'</tbody></table></div>'+commonFooter(f);
 }
 if(f.layout==="calendar")return calendarView(f)+commonFooter(f);
 if(f.layout==="timeline")return '<div class="tcc-timeline">'+entries.slice().sort((a,b)=>(a.due||"").localeCompare(b.due||"")).map((e,i)=>'<section><span class="tcc-time-marker">'+(i+1)+'</span>'+entryEditor(f,e)+'</section>').join("")+'</div>'+commonFooter(f);
 if(f.layout==="gallery"||f.layout==="dashboard")return '<div class="tcc-entry-gallery-grid">'+entries.map(e=>entryEditor(f,e,"gallery")).join("")+'</div>'+commonFooter(f);
 if(f.layout==="checklist")return '<div class="tcc-checklist-list">'+entries.map(e=>entryEditor(f,e)).join("")+'</div>'+commonFooter(f);
 if(f.layout==="qa")return '<div class="tcc-qa-list">'+entries.map(e=>'<details><summary>'+h(e.title)+'</summary><div>'+entryEditor(f,e)+'</div></details>').join("")+'</div>'+commonFooter(f);
 if(f.layout==="form")return '<div class="tcc-form-note">'+field("Orientações e fundamentos de "+f.title,f.notes,'data-tcc-tool-note="'+id+'"')+'</div><div class="tcc-entry-gallery-grid">'+entries.map(e=>entryEditor(f,e,"gallery")).join("")+'</div><div class="tcc-tool-footer">'+action("+ Adicionar informação","addEntry",'data-feature="'+id+'"',"primary")+'</div>';
 return '<div class="tcc-editor-block">'+field("Desenvolvimento de "+f.title,f.notes,'data-tcc-tool-note="'+id+'"')+'</div><div class="tcc-entry-gallery-grid">'+entries.map(e=>entryEditor(f,e,"gallery")).join("")+'</div><div class="tcc-tool-footer">'+action("+ Novo registro","addEntry",'data-feature="'+id+'"',"primary")+'</div>';
}
function calendarView(f){
 const [yr,mo]=calMonth.split("-").map(Number),start=new Date(yr,mo-1,1).getDay(),last=new Date(yr,mo,0).getDate();
 const names=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
 return '<div class="tcc-calendar-controls"><label>Mês do planejamento <input type="month" data-tcc-month value="'+h(calMonth)+'"></label><p>Selecione o mês para visualizar os registros com prazos; os cartões permanecem editáveis.</p></div><div class="tcc-calendar-scroll"><div class="tcc-calendar-grid">'+names.map(n=>'<b class="day-head">'+n+'</b>').join("")+
 Array.from({length:start},()=>'<div class="tcc-day muted"></div>').join("")+
 Array.from({length:last},(_,i)=>{const day=String(i+1).padStart(2,"0"),date=calMonth+"-"+day;return '<div class="tcc-day"><span>'+day+'</span>'+f.entries.filter(e=>e.due===date).map(e=>'<a href="#tcc/tool/'+f.id+'" title="'+h(e.detail)+'">'+h(e.title)+'</a>').join("")+'</div>'}).join("")+'</div></div><div class="tcc-calendar-entries">'+f.entries.map(e=>entryEditor(f,e)).join("")+'</div>';
}
const linkSectionForFeature=id=>({"escrita-02":"introducao","escrita-03":"fundamentacao","escrita-04":"metodosnumericos","escrita-05":"metodologia","escrita-06":"resultados","escrita-07":"discussao","escrita-08":"resumo"})[id]||null;
function featurePage(id){
 const f=T.feature(id);if(!f)return dashboard();
 const grp=grpById(f.group),sId=linkSectionForFeature(id),s=sId?T.section(sId):null;
 return shell(f.group,'<div class="tcc-breadcrumbs"><a href="#tcc">Início</a><span>›</span><a href="#tcc/g/'+grp.id+'">'+h(grp.title)+'</a><span>›</span>'+h(f.title)+'</div>'+
 hdr("FERRAMENTA DE TCC · "+f.layout.toUpperCase(),f.title,f.description)+
 (s?'<section class="tcc-section tcc-long-editor"><div class="tcc-heading"><div><small>DOCUMENTO PRINCIPAL VINCULADO</small><h2>'+h(s.title)+'</h2></div><a href="#tcc/chapters">Outros capítulos ↗</a></div>'+field("Texto completo da monografia — você pode editar tudo",s.body,'data-tcc-section="'+h(s.id)+'" rows="17"')+'</section>':"")+
 '<section class="tcc-section tcc-tool-surface"><div class="tcc-heading"><div><small>ESPAÇO EDITÁVEL · '+h(f.layout.toUpperCase())+'</small><h2>Meu espaço de trabalho</h2></div></div>'+byLayout(f)+'</section>');
}
function chapters(){
 const m=T.state();
 return shell("chapters",hdr("OFICINA DE REDAÇÃO CIENTÍFICA","Meu documento acadêmico","A monografia-modelo já está escrita em capítulos substanciais. Abra qualquer parte, edite, acrescente suas ideias e acompanhe a redação até a versão final.")+
 '<div class="tcc-model-hint"><b>✎ Texto-modelo demonstrativo</b><span>O exemplo traz deduções reais de Física, mas não afirma que medições foram realizadas. Personalize os resultados depois de executar seus próprios cálculos.</span></div>'+
 '<div class="tcc-chapter-grid">'+m.sections.map((s,i)=>'<a class="tcc-chapter-card" href="#tcc/write/'+h(s.id)+'"><span class="tcc-chapter-symbol">'+(i%2?"∇":"¶")+'</span><small>'+(s.body.length?"EM REDAÇÃO · EDITÁVEL":"CAPÍTULO PRONTO PARA ESCREVER")+'</small><h3>'+h(s.title)+'</h3><p>'+h(s.body.slice(0,200))+'…</p><b>Entrar no editor ↗</b></a>').join("")+'</div>');
}
function write(id){
 const s=T.section(id);if(!s)return chapters();
 return shell("chapters",'<div class="tcc-breadcrumbs"><a href="#tcc/chapters">Meu documento</a><span>›</span>'+h(s.title)+'</div>'+hdr("EDITOR DE MONOGRAFIA",s.title,"Um ambiente de escrita contínua. Os parágrafos são parte do documento final e suas alterações ficam salvas.")+
 '<div class="tcc-write-layout"><div class="tcc-paper-editor"><div class="tcc-paper-top">TRABALHO ACADÊMICO · FÍSICA <span>✦ Conteúdo editável</span></div><textarea aria-label="Texto do capítulo '+h(s.title)+'" data-tcc-section="'+h(s.id)+'" rows="26">'+h(s.body)+'</textarea><div class="tcc-paper-end">Editar este texto modifica automaticamente a visualização e o PDF do TCC.</div></div>'+
 '<aside class="tcc-writing-aid"><b>✧ Verificações úteis</b><p>Explique as hipóteses do modelo, cite as fontes efetivamente consultadas, registre unidades e distinga dados simulados de medições.</p><a href="#tcc/simulator">∇ Ver simulação</a><a href="#tcc/export">⇩ Conferir documento</a><a href="#tcc/chapters">← Todos os capítulos</a></aside></div>');
}
function sourceManager(){
 const r=T.state().bibliography;
 return shell("sources",hdr("PESQUISA E REFERÊNCIAS","Biblioteca do meu TCC","Estas referências fazem parte exclusivamente do projeto de TCC. Use os campos para conferir edições e relacionar o texto à literatura consultada.")+
 '<div class="tcc-model-hint"><b>⌁ Bibliografia para consulta</b><span>A presença de uma fonte no modelo não significa que ela já foi lida. Confira metadados e evite citações literais sem consultar a obra.</span></div>'+
 '<div class="tcc-tool-footer">'+action("+ Adicionar fonte","addSource",'',"primary")+'</div>'+
 '<div class="tcc-bib-grid">'+r.map(ref=>'<article class="tcc-source"><div class="tcc-source-title"><b>'+h(ref.title)+'</b>'+action("×","removeSource",'data-id="'+h(ref.id)+'"',"tcc-small-warn")+'</div>'+
 [["Autor ou instituição","author"],["Título completo","title"],["Ano ou data a confirmar","year"],["Assuntos da Física","topic"],["Situação de leitura","status"],["Notas para uso no TCC","notes"]].map(([label,key])=>field(label,ref[key]||"",'data-tcc-ref="'+h(ref.id)+'" data-tcc-prop="'+key+'"',key==="notes"?"textarea":"input")).join("")+
 '<div class="tcc-source-link">'+field("Endereço da fonte (para documentação)",ref.url,'data-tcc-ref="'+h(ref.id)+'" data-tcc-prop="url"',"input")+'</div></article>').join("")+'</div>');
}
function versions(){
 const m=T.state();
 return shell("versions",hdr("HISTÓRICO E SEGURANÇA","Versões e backups do TCC","Salve marcos da escrita, volte a versões anteriores e leve o projeto editável para outro navegador por meio de um arquivo JSON.")+
 '<div class="tcc-manage tcc-versions-tools"><div><h3>Seu projeto pode ter diferentes versões.</h3><p>Uma versão guarda textos, capa, bibliografia e parâmetros da simulação. O backup JSON inclui também cartões e tarefas.</p></div><div>'+action("Salvar versão agora","saveVersion",'',"primary")+action("Baixar backup JSON","backup")+action("Importar backup JSON","chooseImport")+'</div></div>'+
 '<div class="tcc-upload"><label>Restaurar arquivo de projeto já exportado <input type="file" accept=".json,application/json" id="tcc-file-import"></label></div>'+
 '<div class="tcc-versions-list">'+(m.snapshots.length?m.snapshots.map(s=>'<div class="tcc-version"><span>◷</span><div><h3>'+h(s.title)+'</h3><p>'+h(new Date(s.date).toLocaleString("pt-BR"))+'</p></div>'+action("Restaurar esta versão","restoreVersion",'data-id="'+h(s.id)+'"')+'</div>').join(""):'<p class="tcc-empty-state">Seu próximo marco de pesquisa começa aqui. Use “Salvar versão agora” para guardar a primeira versão da monografia.</p>')+'</div>');
}
function simulator(){
 let data,error="";
 try{data=T.numerical()}catch(e){error=e.message}
 const p=T.state().simulation;
 return shell("simulator",hdr("LABORATÓRIO DE SIMULAÇÃO","Oscilador amortecido · métodos numéricos","Compare uma solução analítica com Euler, Euler–Cromer e Runge–Kutta. Experimente parâmetros físicos com unidades consistentes; não são dados coletados em laboratório.")+
 '<section class="tcc-section tcc-sim-block"><div class="tcc-heading"><div><small>CONFIGURAÇÃO FÍSICA</small><h2>Parâmetros da experiência numérica</h2></div></div>'+
 '<div class="tcc-param-grid">'+[["m","Massa m (kg)"],["k","Rigidez k (N/m)"],["b","Amortecimento b (kg/s)"],["x0","Posição inicial x₀ (m)"],["v0","Velocidade inicial v₀ (m/s)"],["T","Duração T (s)"],["h","Passo temporal h (s)"]].map(([key,label])=>'<label>'+h(label)+'<input type="number" step="any" data-tcc-param="'+key+'" value="'+h(p[key])+'"></label>').join("")+'</div>'+
 '<div class="tcc-tool-footer">'+action("Recalcular resultados","recalc",'',"primary")+'<a href="#tcc/write/metodologia" class="tcc-btn ghost">Editar metodologia</a></div>'+
 (error?'<div class="tcc-sim-error" role="alert">'+h(error)+'</div>':simulationPlots(data))+'</section>');
}
function polyline(arr,key,min,max,W=780,H=245){
 const safe=max-min||1,n=arr.length;const step=Math.max(1,Math.ceil(n/550)),pts=[];
 for(let i=0;i<n;i+=step){const q=arr[i],x=(q.t/arr[n-1].t)*W,y=H-((q[key]-min)/safe)*H;if(Number.isFinite(x)&&Number.isFinite(y))pts.push([x.toFixed(1),y.toFixed(1)].join(","))}
 return pts.join(" ");
}
function chart(data,key,title,unit){
 const values=Object.values(data.series).flatMap(row=>row.map(x=>x[key])).filter(Number.isFinite);
 let min=Math.min(...values),max=Math.max(...values);if(min===max){min-=1;max+=1}
 return '<div class="tcc-plot"><div class="tcc-plot-head"><b>'+title+'</b><span>Tempo (s) × '+unit+'</span></div>'+
 '<div class="tcc-svg-scroll"><svg class="tcc-svg" role="img" aria-label="'+h(title)+'" viewBox="0 0 830 305" xmlns="http://www.w3.org/2000/svg"><g transform="translate(35 17)">'+
 [0,0.25,0.5,0.75,1].map(t=>'<path d="M 0 '+(245*t)+' H 780" fill="none" stroke="#dce8f9" stroke-width="1"/>').join("")+
 [["analitico","#163f98"],["euler","#f08663"],["cromer","#8f64cb"],["rk4","#1baba2"]].map(([name,c])=>'<polyline points="'+polyline(data.series[name],key,min,max)+'" fill="none" stroke="'+c+'" stroke-width="'+(name==="analitico"?3:2)+'" opacity=".9"/>').join("")+
 '<path d="M0 0 V245 H780" stroke="#87a4cb" stroke-width="1.3" fill="none"/></g><text x="15" y="17" font-size="11" fill="#647ba5">'+max.toExponential(2)+'</text><text x="15" y="266" font-size="11" fill="#647ba5">'+min.toExponential(2)+'</text><text x="787" y="276" font-size="11" fill="#647ba5">'+data.params.T+' s</text></svg></div>'+
 '<div class="tcc-legend"><span><i style="background:#163f98"></i> Analítica</span><span><i style="background:#f08663"></i> Euler</span><span><i style="background:#8f64cb"></i> Euler–Cromer</span><span><i style="background:#1baba2"></i> RK4</span></div></div>';
}
function simulationPlots(r){
 const toScientific=x=>Number.isFinite(x)?x.toExponential(3):"—";
 const rows=T.sweep();
 return '<div class="tcc-sim-note"><b>REGIME SUBAMORTECIDO</b><span>ω₀ = '+r.omega0.toFixed(4)+' rad/s · γ = '+r.gamma.toFixed(4)+' s⁻¹ · ωd = '+r.wd.toFixed(4)+' rad/s</span><p>Dados gerados por fórmulas numéricas determinísticas no navegador. Confira os valores antes de incorporá-los ao TCC.</p></div>'+
 '<div class="tcc-charts">'+chart(r,"x","Deslocamento do oscilador","Posição (m)")+chart(r,"E","Energia mecânica","Energia (J)")+'</div>'+
 '<div class="tcc-heading"><div><small>ERRO NUMÉRICO</small><h2>Tabela comparativa do passo selecionado</h2></div></div><div class="tcc-table-scroll"><table class="tcc-edit-table tcc-data-table"><thead><tr><th>Método</th><th>Erro máximo |Δx| (m)</th><th>Erro final (m)</th><th>Energia final (J)</th></tr></thead><tbody>'+
 [["euler","Euler explícito"],["cromer","Euler–Cromer"],["rk4","Runge–Kutta 4"]].map(([key,name])=>'<tr><th>'+name+'</th><td>'+toScientific(r.metrics[key].maxError)+'</td><td>'+toScientific(r.metrics[key].finalError)+'</td><td>'+toScientific(r.metrics[key].energyFinal)+'</td></tr>').join("")+'</tbody></table></div>'+
 '<div class="tcc-heading"><div><small>TESTE DE CONVERGÊNCIA</small><h2>Refinamento temporal</h2></div></div><div class="tcc-table-scroll"><table class="tcc-edit-table tcc-data-table"><thead><tr><th>h (s)</th><th>Euler erro máx.</th><th>Cromer erro máx.</th><th>RK4 erro máx.</th></tr></thead><tbody>'+
 rows.map(row=>'<tr><th>'+h(row.h.toFixed(5))+'</th>'+(row.error?'<td colspan="3">'+h(row.error)+'</td>':["euler","cromer","rk4"].map(k=>'<td>'+toScientific(row.metrics[k].maxError)+'</td>').join(""))+'</tr>').join("")+'</tbody></table></div>';
}
function show([,part,id]){
 if(!part||part==="dashboard")return dashboard();
 if(part==="g")return groupPage(id);
 if(part==="tool")return featurePage(id);
 if(part==="chapters")return chapters();
 if(part==="write")return write(id);
 if(part==="sources")return sourceManager();
 if(part==="versions")return versions();
 if(part==="simulator")return simulator();
 if(part==="export")return window.PHY_TCC_EXPORT?window.PHY_TCC_EXPORT.render():shell("export",hdr("EXPORTAÇÃO","Gerar TCC","Preparando a visualização do documento."));
 return dashboard();
}
function rerender(preserve=true){if(preserve)A.update();else A.render()}
function click(name,callback){document.addEventListener("click",e=>{const b=e.target?.closest?.("[data-tcc-action]");if(b?.dataset?.tccAction===name)callback(b,e)})}
click("addEntry",b=>{T.addEntry(b.dataset.feature);rerender();toast("Nova atividade adicionada ao seu TCC.")});
click("removeEntry",b=>{if(window.confirm("Excluir esta atividade do TCC?")){T.removeEntry(b.dataset.feature,b.dataset.entry);rerender()}});
click("addSource",()=>{T.addRef();rerender();toast("Fonte adicionada para edição.")});
click("removeSource",b=>{if(window.confirm("Excluir esta fonte do TCC?")){T.removeRef(b.dataset.id);rerender()}});
click("recalc",()=>{rerender();toast("Comparação numérica atualizada.")});
click("saveVersion",()=>{T.snapshot();rerender();toast("Versão acadêmica guardada!")});
click("resetDemo",()=>{if(window.confirm("Restaurar o TCC de exemplo original? Isso substituirá TODAS as edições feitas apenas no módulo TCC. Faça backup antes, se desejar.")){T.reset();rerender(false);toast("Modelo original restaurado.")}});
click("clearDemo",()=>{if(window.confirm("Limpar TODOS os exemplos e seus conteúdos dentro do módulo TCC? Os outros módulos não serão alterados. A operação não pode ser desfeita sem backup.")){T.clear();rerender(false);toast("O TCC está pronto para ser preenchido por você.")}});
click("restoreVersion",b=>{if(window.confirm("Restaurar esta versão anterior de textos e referências?")){T.restoreSnapshot(b.dataset.id);rerender(false);toast("Versão restaurada.")}});
click("backup",()=>{if(!window.Blob||!window.URL?.createObjectURL)return toast("Exportação indisponível neste navegador.");const blob=new Blob([T.safeBackup()],{type:"application/json;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="tcc-fisica-backup.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200)});
click("chooseImport",()=>{A.$("#tcc-file-import")?.click()});
function setSavedText(text){const el=A.$("#tcc-save-status");if(el)el.textContent=text}
function changed(e){
 const t=e.target;if(!t?.dataset)return;
 const d=t.dataset;let ok=false;
 if(d.tccSection)ok=T.updateBody(d.tccSection,t.value);
 if(d.tccMeta)ok=T.updateMeta(d.tccMeta,t.value);
 if(d.tccToolNote)ok=T.updateFeatureNote(d.tccToolNote,t.value);
 if(d.tccRef)ok=T.updateRef(d.tccRef,d.tccProp,t.value);
 if(d.tccFeature&&d.tccEntry)ok=T.updateEntry(d.tccFeature,d.tccEntry,d.tccProp,d.tccProp==="checked"?t.checked:t.value);
 if(ok)setSavedText("Alterações do TCC salvas ✓");
 if(d.tccSearch!==undefined){uiQuery=t.value.toLowerCase();A.$$('[data-tcc-keywords]').forEach(card=>card.hidden=!card.dataset.tccKeywords?.includes(uiQuery))}
}
document.addEventListener("input",changed);
document.addEventListener("change",e=>{
 const d=e.target?.dataset||{};
 if(d.tccFeature||d.tccRef||d.tccMeta) {changed(e);if(d.tccProp==="status"||d.tccProp==="checked")rerender()}
 if(d.tccParam){if(!T.updateParam(d.tccParam,e.target.value))toast("Preencha um valor numérico válido.");}
 if(d.tccMonth){calMonth=e.target.value;rerender()}
 if(e.target?.id==="tcc-file-import"){
  const file=e.target.files?.[0];if(!file)return;
  if(file.size>2e6)return toast("Use um backup JSON com menos de 2 MB.");
  file.text().then(src=>{if(!window.confirm("Importar este backup e substituir o conteúdo atual do TCC?"))return;try{T.importBackup(src);rerender(false);toast("Backup do TCC importado.")}catch(err){toast("Importação não realizada: "+err.message)}}).catch(()=>toast("Não foi possível ler o arquivo."));
 }
});
document.addEventListener("dragstart",e=>{
 const card=e.target?.closest?.("[data-tcc-drag-feature]");if(!card)return;
 dragData={feature:card.dataset.tccDragFeature,entry:card.dataset.tccEntryCard};
 if(e.dataTransfer){e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",dragData.entry)}
});
document.addEventListener("dragover",e=>{if(e.target?.closest?.("[data-tcc-lane]"))e.preventDefault()});
document.addEventListener("drop",e=>{
 const l=e.target?.closest?.("[data-tcc-lane]");if(!l||!dragData||l.dataset.tccBoardId!==dragData.feature)return;
 e.preventDefault();T.shiftStatus(dragData.feature,dragData.entry,l.dataset.tccLane);dragData=null;rerender();toast("Cartão movido no Kanban.");
});
window.PHY_TCC_UI={show,shell,hdr,action,polyline,chart,simulationPlots,rerender,calendarView};
A.register("tcc",show);
})();