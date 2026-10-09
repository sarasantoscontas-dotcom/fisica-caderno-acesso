/* Módulo 3 · Biblioteca de fontes científicas, fichamentos e referências pessoais. */
(()=>{
"use strict";
const A=window.PHY_APP,{state,h,pill,button,crumb,hero,metric,workspace,register,onAction,onSubmit,update,toast,toggle}=A;
const all=()=>A.allBooks();
const favorite=r=>state.bookstars.includes(r.id);
const external=url=>/^https:\/\//i.test(url||"");
const card=r=>{
 const notes=state.booknotes[r.id]||"";
 return '<article class="reference-card filter-card" data-bib-id="'+h(r.id)+'" data-type="'+h(r.type)+'" data-area="'+h(r.area)+'" data-keywords="'+h((r.title+" "+r.authors+" "+r.topic+" "+r.type+" "+r.area).toLowerCase())+'"><div class="reference-head"><span class="reference-icon">⌁</span><div>'+pill(r.type)+pill(r.area,"soft")+'</div>'+button(favorite(r)?"★":"☆","starBook",'data-id="'+h(r.id)+'" aria-label="'+(favorite(r)?"Remover dos favoritos":"Favoritar fonte")+'"',"icon-btn")+'</div>'+
 '<h3>'+h(r.title)+'</h3><p class="reference-authors">'+h(r.authors)+'</p><p class="reference-topic">'+h(r.topic)+'</p><p class="reference-note">'+h(r.note||"Minha fonte bibliográfica para estudar e pesquisar.")+'</p>'+
 '<div class="reference-buttons">'+(external(r.url)?'<a class="btn btn-soft" href="'+h(r.url)+'" target="_blank" rel="noopener noreferrer">Abrir fonte ou catálogo ↗</a>':"")+
 button("Copiar dados","copyBook",'data-id="'+h(r.id)+'"')+
 (r.id.startsWith("minha-")?button("Excluir","removeBook",'data-id="'+h(r.id)+'"'):"")+'</div>'+
 '<details class="reference-fiche" '+(r.studyGuide?'open':'')+'><summary>✎ Ficha bibliográfica e minha leitura</summary>'+
 (r.studyGuide?'<div class="bib-reading-guide"><span class="eyebrow">O QUE OBSERVAR NA LEITURA</span><p>'+h(r.studyGuide)+'</p><h4>Questão para confrontar com a fonte</h4><p>'+h(r.criticalQuestion)+'</p><small>'+h(r.citationHint||"")+'</small></div>':'')+
 '<label>Minhas anotações, capítulos e páginas conferidas<textarea rows="4" data-bibnote="'+h(r.id)+'" placeholder="Registre o capítulo consultado, suas observações e as páginas reais da fonte...">'+h(notes)+'</textarea></label></details></article>';
};
const page=()=>{
 const refs=all(),types=[...new Set(refs.map(x=>x.type))].sort(),areas=[...new Set(refs.map(x=>x.area))].sort((a,b)=>a.localeCompare(b,"pt-BR"));
 return workspace("bibliografia","Referências Bibliográficas",crumb([{label:"Referências Bibliográficas"}])+
 hero("LIVROS, CIÊNCIA E PESQUISA","Sua biblioteca de conhecimento","Consulte livros universitários, materiais abertos, bases científicas e crie fichas de leitura que fazem sentido para sua graduação.","⌁")+
 
 '<section class="content-block"><div class="section-title"><div><span class="eyebrow">ENCONTRE, SALVE E ESTUDE</span><h2>Meu acervo de Física</h2></div>'+pill("Bibliografia por área")+'</div>'+
 '<div class="filter-row bibliography-filters"><label>Buscar autor, título ou assunto<input type="search" data-search placeholder="Ex.: Feynman, Quântica, NIST..."></label>'+
 '<label>Tipo de material<select data-filter-type><option value="">Todos os tipos</option>'+types.map(x=>'<option>'+h(x)+'</option>').join("")+'</select></label>'+
 '<label>Área científica<select data-filter-area><option value="">Todas as áreas</option>'+areas.map(x=>'<option>'+h(x)+'</option>').join("")+'</select></label>'+
 '<label class="favorite-filter"><input id="favorite-filter" type="checkbox"> Só minhas favoritas</label></div>'+
 '<div class="reference-grid">'+refs.map(card).join("")+'</div></section>'+
 '<section class="content-block my-bibliography"><div class="section-title"><div><span class="eyebrow">MEU ACERVO PESSOAL</span><h2>Adicionar referência ao caderno</h2></div><span class="handwritten">suas leituras, suas descobertas ✎</span></div>'+
 '<form id="form-new-book" class="new-reference-form">'+
 '<label>Título da obra ou artigo<input name="title" maxlength="240" placeholder="Ex.: Artigo sobre interferência" required></label>'+
 '<label>Autor ou instituição<input name="authors" maxlength="220" placeholder="Autor da publicação" required></label>'+
 '<label>Assunto<input name="topic" maxlength="220" placeholder="Ex.: Óptica e interferência"></label>'+
 '<label>URL da fonte, se tiver<input name="url" maxlength="600" inputmode="url" placeholder="https://..."></label>'+
 '<button class="btn btn-primary" type="submit">+ Guardar no meu acervo</button></form></section>');
};
function copyText(str){
 if(navigator.clipboard?.writeText){navigator.clipboard.writeText(str).then(()=>toast("Dados copiados! ✦")).catch(()=>toast("Selecione os dados para copiar."))}
 else toast("A cópia automática não está disponível.");
}
onAction("starBook",el=>{toggle("bookstars",el.dataset.id);update()});
onAction("copyBook",el=>{const r=all().find(x=>x.id===el.dataset.id);if(r)copyText(r.authors+". "+r.title+". "+(r.url?"Disponível em: "+r.url:"") )});
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
 const entered=String(f.get("url")||"").trim();
 const url=external(entered)?entered:"";
 state.mybooks.push({
  id:"minha-"+Date.now()+"-"+Math.floor(Math.random()*10000),
  title,authors,topic:String(f.get("topic")||"").trim()||"Leitura pessoal em Física",
  type:"Minha referência",area:"Acervo pessoal",url,
  note:"Uma nova descoberta na sua biblioteca. Adicione anotações e páginas de estudo na ficha de leitura."
 });
 A.save();A.render();toast("Referência adicionada ao seu caderno! ✦");
});
register("bibliografia",page);
window.PHY_BIBLIO={page,card};
})();