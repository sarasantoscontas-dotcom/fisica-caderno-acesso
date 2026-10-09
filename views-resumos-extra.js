/* Resumos extras: biblioteca exclusiva e ateliê científico de Física */
(()=>{
"use strict";
const A=window.PHY_APP,{h,button,pill,crumb,hero,workspace,state,register,onAction,update,toast,toggle}=A;
const extras=A.extraSummaries||[];
const originalLibrary=window.PHY_RESUMOS.library;
const summaries=()=>'<section class="content-block extended-library"><div class="section-title"><div><span class="eyebrow">LABORATÓRIO DE CONCEITOS E MODELOS</span><h2>Resumos aprofundados de Física</h2></div>'+pill("Leituras técnicas")+'</div>'+
 '<p class="extension-intro">Novos textos sobre mecânica, fenômenos eletromagnéticos, métodos numéricos, quântica, estatística, óptica e pesquisa. Cada leitura tem explicação, aplicação, advertências e referências técnicas próprias.</p>'+
 '<div class="extra-summary-grid">'+extras.map(x=>{
 const key=x.id+"/completo",done=state.read.includes(key),fav=state.stars.includes(x.id);
 return '<article class="extra-summary-card filter-card" data-keywords="'+h((x.title+" "+x.area+" "+x.concept).toLowerCase())+'"><div class="extra-summary-top">'+pill(x.area)+button(fav?"★":"☆","starSubject",'data-id="'+h(x.id)+'" aria-label="Favoritar este resumo"',"icon-btn")+'</div>'+
 '<h3>'+h(x.title)+'</h3><p>'+h(x.concept.slice(0,204))+'…</p><span class="extra-summary-status">'+(done?"✓ Leitura estudada":"✎ Conteúdo para aprofundar")+'</span><a class="extra-read-link" href="#estudo-extra/'+h(x.id)+'">Abrir resumo completo ↗</a></article>';
 }).join("")+'</div></section>';
function augmentedLibrary(){
 const html=originalLibrary();
 const closing="</main></div>";
 const i=html.lastIndexOf(closing);
 if(i<0)return html+summaries();
 return html.slice(0,i)+summaries()+html.slice(i);
}
function readExtra([,id]){
 const x=extras.find(s=>s.id===id);
 if(!x)return workspace("resumos","Resumo não encontrado",'<section class="empty"><h1>Escolha uma nova leitura.</h1><a class="btn btn-primary" href="#resumos">Voltar aos resumos</a></section>');
 const key=x.id+"/completo",done=state.read.includes(key),star=state.stars.includes(x.id),note=state.notes[key]||"";
 return workspace("resumos",x.title,crumb([{label:"Resumos",url:"#resumos"},{label:x.title}])+
 hero("APROFUNDAMENTO · "+x.area,x.title,"Uma leitura científica para compreender, interpretar e aplicar os modelos da Física.","∇")+
 '<article class="reading-paper extended-reading"><div class="summary-essay"><span class="chapter-label">FUNDAMENTAÇÃO E HIPÓTESES</span><h2>O conceito físico em profundidade</h2><p>'+h(x.concept)+'</p>'+
 '<h3>Desenvolvimento do modelo</h3><p>'+h(x.method)+'</p>'+
 '<div class="formula-box"><span>RELAÇÕES MATEMÁTICAS E CONDIÇÕES DE APLICAÇÃO</span><strong>'+h(x.formula)+'</strong></div>'+
 '<div class="paper-highlight"><span aria-hidden="true">✧</span><div><h3>Exemplo resolvido e interpretado</h3><p>'+h(x.example)+'</p></div></div>'+
 '<div class="paper-highlight peach"><span aria-hidden="true">△</span><div><h3>Limites do modelo e erros comuns</h3><p>'+h(x.warning)+'</p></div></div>'+
 '<h3>Fundamentação para consultar</h3><p>'+h(x.source.name)+'. Ao aprofundar a leitura, confira as condições e demonstrações na fonte acadêmica original.</p>'+
 '<p><a class="btn btn-soft" href="'+h(x.source.url)+'" target="_blank" rel="noopener noreferrer">Consultar fonte científica ↗</a></p></div>'+
 '<section class="thought-question"><span class="eyebrow">COMPREENSÃO E RACIOCÍNIO</span><h3>Questões comentadas sobre este assunto</h3>'+
 x.questions.map(q=>'<details class="extra-question"><summary>'+h(q.question)+'</summary><p>'+h(q.answer)+'</p></details>').join("")+'</section>'+
 '<section class="student-notes"><div class="student-notes-top"><div><span class="eyebrow">MEU CADERNO DE FÍSICA</span><h3>Minhas deduções e observações ✎</h3></div><span>∮</span></div>'+
 '<textarea rows="8" data-note="'+h(key)+'" placeholder="Registre hipóteses, fórmulas, deduções, exemplos próprios e dúvidas...">'+h(note)+'</textarea><p>Este registro pertence exclusivamente a esta leitura.</p></section>'+
 '<div class="reading-actions">'+button(done?"✓ Leitura estudada":"✓ Marcar como estudado","markRead",'data-key="'+h(key)+'"',"btn-primary")+
 button(star?"★ Nos favoritos":"☆ Favoritar resumo","starSubject",'data-id="'+h(x.id)+'"')+
 button("Imprimir resumo","printStudy")+'</div></article>'+
 '<div class="reading-next"><a href="#resumos">← Voltar à biblioteca de resumos</a></div>');
}
register("resumos",augmentedLibrary);
register("estudo-extra",readExtra);
window.PHY_RESUMOS_EXTRA={summaries,readExtra,augmentedLibrary};
})();