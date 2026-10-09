/* Módulo 3 · Biblioteca de fontes científicas, fichamentos e referências pessoais. */
(()=>{
"use strict";
const A=window.PHY_APP,{state,h,pill,button,crumb,hero,metric,workspace,register,onAction,onSubmit,update,toast,toggle}=A;
const all=()=>A.allBooks();
const favorite=r=>state.bookstars.includes(r.id);
const usageMap=window.PHY_BIB_USAGE||{};
const relevantUsage=r=>{
 const linked=usageMap[r.id];
 if(linked){
  const subjects=linked.subjects||[],topics=linked.topics||[];
  const works=(linked.works&&linked.works.length)?linked.works:[
   "Trabalho ou seminário sobre "+r.topic,
   "Atividade de estudo: "+r.studyGuide,
   "Discussão de pesquisa: "+r.criticalQuestion
  ];
  return {subjects,topics,works};
 }
 // As fontes adicionadas pelos estudantes mantêm a mesma ferramenta, mesmo sem ficha prévia.
 const subject=r.topic&&r.topic!=="Leitura pessoal em Física"?r.topic:"Física aplicada ao tema escolhido";
 return {subjects:[subject,r.area||"Pesquisa acadêmica","Metodologia científica","Trabalhos de graduação"],topics:[r.topic||subject,"Conceitos e modelos relacionados","Referências para discussão teórica"],works:["Fundamentação de um trabalho sobre "+subject,"Seminário, relatório ou fichamento relativo à obra","Estudo orientado com as observações do próprio estudante"]};
};
const usageList=values=>'<ul class="usage-items">'+values.map(v=>'<li>'+h(v)+'</li>').join("")+'</ul>';
const card=r=>{
 const notes=state.booknotes[r.id]||"";
 const usage=relevantUsage(r);
 const keywords=[r.title,r.authors,r.topic,r.type,r.area,...usage.subjects,...usage.topics,...usage.works].join(" ").toLowerCase();
 return '<article class="reference-card filter-card" data-bib-id="'+h(r.id)+'" data-type="'+h(r.type)+'" data-area="'+h(r.area)+'" data-keywords="'+h(keywords)+'"><div class="reference-head"><span class="reference-icon" aria-hidden="true">⌁</span><div>'+pill(r.type)+pill(r.area,"soft")+'</div>'+button(favorite(r)?"★":"☆","starBook",'data-id="'+h(r.id)+'" aria-label="'+(favorite(r)?"Remover dos favoritos":"Favoritar fonte")+'"',"icon-btn")+'</div>'+
 '<h3>'+h(r.title)+'</h3><p class="reference-authors">'+h(r.authors)+'</p><p class="reference-topic">'+h(r.topic)+'</p><p class="reference-note">'+h(r.note||"Fonte para apoiar sua pesquisa e organização acadêmica.")+'</p>'+
 (r.id.startsWith("minha-")?'<div class="reference-buttons">'+button("Excluir minha referência","removeBook",'data-id="'+h(r.id)+'"')+'</div>':"")+
 '<details class="reference-fiche usage-fiche"><summary>⌁ Onde utilizar</summary>'+
 '<div class="bib-usage"><div class="usage-group usage-subjects"><h4>Disciplinas relacionadas</h4>'+usageList(usage.subjects)+'</div>'+
 '<div class="usage-group usage-topics"><h4>Assuntos que você pode pesquisar</h4>'+usageList(usage.topics)+'</div>'+
 '<div class="usage-group usage-works"><h4>Ideias para trabalhos acadêmicos</h4>'+usageList(usage.works)+'</div>'+
 (r.studyGuide?'<p class="usage-guidance"><strong>Como estudar esta referência:</strong> '+h(r.studyGuide)+'</p>':"")+
 (r.criticalQuestion?'<p class="usage-guidance"><strong>Pergunta para orientar sua leitura:</strong> '+h(r.criticalQuestion)+'</p>':"")+
 '</div><label class="usage-personal-notes">Minhas observações sobre esta referência<textarea rows="4" data-bibnote="'+h(r.id)+'" placeholder="Registre conexões com suas disciplinas, ideias de trabalhos e observações sobre a obra...">'+h(notes)+'</textarea></label></details></article>';
};
const page=()=>{
 const refs=all(),types=[...new Set(refs.map(x=>x.type))].sort(),areas=[...new Set(refs.map(x=>x.area))].sort((a,b)=>a.localeCompare(b,"pt-BR"));
 return workspace("bibliografia","Referências Bibliográficas",crumb([{label:"Referências Bibliográficas"}])+
 hero("LIVROS, CIÊNCIA E PESQUISA","Sua biblioteca de conhecimento","Encontre livros, materiais e obras científicas e descubra em quais disciplinas, assuntos e trabalhos acadêmicos utilizá-los.","⌁")+
 
 '<section class="content-block"><div class="section-title"><div><span class="eyebrow">ENCONTRE REFERÊNCIAS E DESCUBRA ONDE UTILIZAR</span><h2>Meu acervo de Física</h2></div>'+pill("Bibliografia por área")+'</div>'+
 '<div class="filter-row bibliography-filters"><label>Buscar título, autor, assunto ou disciplina<input type="search" data-search placeholder="Ex.: Física Moderna, Eletromagnetismo, seminário..."></label>'+
 '<label>Tipo de material<select data-filter-type><option value="">Todos os tipos</option>'+types.map(x=>'<option>'+h(x)+'</option>').join("")+'</select></label>'+
 '<label>Área científica<select data-filter-area><option value="">Todas as áreas</option>'+areas.map(x=>'<option>'+h(x)+'</option>').join("")+'</select></label>'+
 '<label class="favorite-filter"><input id="favorite-filter" type="checkbox"> Só minhas favoritas</label></div>'+
 '<div class="reference-grid">'+refs.map(card).join("")+'</div></section>'+
 '<section class="content-block my-bibliography"><div class="section-title"><div><span class="eyebrow">MEU ACERVO PESSOAL</span><h2>Adicionar referência ao caderno</h2></div><span class="handwritten">suas leituras, suas descobertas ✎</span></div>'+
 '<form id="form-new-book" class="new-reference-form">'+
 '<label>Título da obra ou artigo<input name="title" maxlength="240" placeholder="Ex.: Artigo sobre interferência" required></label>'+
 '<label>Autor ou instituição<input name="authors" maxlength="220" placeholder="Autor da publicação" required></label>'+
 '<label>Assunto<input name="topic" maxlength="220" placeholder="Ex.: Óptica e interferência"></label>'+
 
 '<button class="btn btn-primary" type="submit">+ Guardar no meu acervo</button></form></section>');
};
onAction("starBook",el=>{toggle("bookstars",el.dataset.id);update()});
onAction("removeBook",el=>{
 const id=el.dataset.id;if(!id.startsWith("minha-"))return;
 state.mybooks=state.mybooks.filter(x=>x.id!==id);
 state.bookstars=state.bookstars.filter(x=>x!==id);
 delete state.booknotes[id];A.save();update();toast("Sua biblioteca foi reorganizada! ✎");
});
onSubmit("form-new-book",form=>{
 const f=new FormData(form);
 const title=String(f.get("title")||"").trim(),authors=String(f.get("authors")||"").trim();
 if(!title||!authors){toast("Preencha título e autoria da sua referência.");return}
 state.mybooks.push({
  id:"minha-"+Date.now()+"-"+Math.floor(Math.random()*10000),
  title,authors,topic:String(f.get("topic")||"").trim()||"Leitura pessoal em Física",
  type:"Minha referência",area:"Acervo pessoal",url:"",
  note:"Uma descoberta para relacionar com disciplinas, pesquisas e trabalhos acadêmicos."
 });
 A.save();A.render();toast("Referência adicionada ao seu caderno! ✦");
});
register("bibliografia",page);
window.PHY_BIBLIO={page,card};
})();