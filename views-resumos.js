/* Módulo 1 · Resumos de Física, biblioteca por período, editor e progresso. */
(()=>{
"use strict";
const A=window.PHY_APP,{terms,subjects,byId,state,h,pill,button,escArea,crumb,hero,metric,workspace,register,onAction,update,toast,toggle}=A;
const summaryKey=(s,p)=>s.id+"/"+p;
const readPart=(s,p)=>state.read.includes(summaryKey(s,p));
const fav=s=>state.stars.includes(s.id);
const subjectCard=s=>{
 const done=Number(readPart(s,"conceito"))+Number(readPart(s,"aplicacao"));
 return '<article class="subject-card '+escArea(s.area)+'"><div class="subject-head">'+pill(s.area)+button(fav(s)?"★":"☆","starSubject",'data-id="'+s.id+'" aria-label="'+(fav(s)?"Remover dos favoritos":"Favoritar")+' '+h(s.title)+'"',"icon-btn")+'</div><h3>'+h(s.title)+'</h3><p>'+h(s.concept.slice(0,190))+'…</p><div class="mini-progress"><span style="width:'+(done*50)+'%"></span></div><small>'+done+'/2 leituras realizadas</small><footer><a href="#leitura/'+s.id+'/conceito">Abrir resumos →</a><a href="#revisao/'+s.id+'">Revisar λ</a></footer></article>';
};
const library=()=>workspace("resumos","Resumos Prontos",
 crumb([{label:"Resumos Prontos"}])+hero("BIBLIOTECA DE RESUMOS","Meu laboratório de conceitos","Leia sobre fenômenos, deduções, modelos, equações e aplicações que acompanham a graduação em Física.","∑")+
 '<div class="metric-grid compact">'+metric(terms.length,"Períodos","∑")+metric(subjects.length,"Disciplinas","∇")+metric(state.read.length,"Leituras concluídas","✦")+'</div>'+
 '<section class="content-block"><div class="section-title"><div><span class="eyebrow">ORGANIZAÇÃO POR PERÍODO</span><h2>Minha trilha de Física</h2></div></div><div class="term-grid">'+terms.map(A&&window.PHY_HOME.termCard).join("")+'</div></section>'+
 '<section class="content-block"><div class="section-title"><div><span class="eyebrow">TODAS AS DISCIPLINAS</span><h2>Explore os assuntos</h2></div>'+pill("Resumos editáveis")+'</div><label class="filter-field">Buscar disciplina ou conteúdo<input data-search type="search" placeholder="Ex.: Eletromagnetismo, Cálculo, Ondas..."></label><div class="subject-grid">'+subjects.map(s=>'<div class="filter-card" data-keywords="'+h((s.title+" "+s.area+" "+s.concept).toLowerCase())+'">'+subjectCard(s)+'</div>').join("")+'</div></section>');
const period=([,number])=>{
 const t=terms.find(x=>x.number===Number(number));if(!t)return missing();
 const items=t.subjects.map(id=>byId.get(id)).filter(Boolean);
 const finished=items.reduce((total,s)=>total+Number(readPart(s,"conceito"))+Number(readPart(s,"aplicacao")),0);
 return workspace("resumos",t.number+"º Período",crumb([{label:"Resumos",url:"#resumos"},{label:t.number+"º período"}])+
 hero("GRADUAÇÃO EM FÍSICA",t.number+"º período · "+t.title,"Um caderno para compreender a teoria, registrar deduções e estudar a Física em profundidade.",t.symbol)+
 '<div class="metric-grid compact">'+metric(items.length,"Disciplinas","∇")+metric(finished,"Leituras concluídas","✦")+metric(items.length*2,"Textos para estudar","λ")+'</div>'+
 '<section class="content-block"><div class="section-title"><div><span class="eyebrow">LEITURAS DESTE PERÍODO</span><h2>Escolha sua disciplina</h2></div><a class="text-link" href="#resumos">Todos os períodos ↗</a></div><div class="subject-grid">'+items.map(subjectCard).join("")+'</div></section>');
};
function reading([,id,kind]){
 const s=byId.get(id);if(!s)return missing();
 const part=kind==="aplicacao"?"aplicacao":"conceito",isIntro=part==="conceito";
 const key=summaryKey(s,part),read=readPart(s,part),q=s.flashcards[isIntro?0:1],note=state.notes[key]||"";
 const content=isIntro?
 '<div class="summary-essay"><span class="chapter-label">CAPÍTULO 01 · FUNDAMENTAÇÃO</span><h2>Compreender o conceito físico</h2><p>'+h(s.concept)+'</p>'+
 '<div class="paper-highlight"><span aria-hidden="true">✧</span><div><h3>Por que isso importa?</h3><p>'+h(s.example)+'</p></div></div>'+
 '<h3>Organizando o modelo</h3><p>Ao trabalhar com <strong>'+h(s.title)+'</strong>, a primeira decisão deve ser identificar as grandezas relevantes, o fenômeno analisado e as hipóteses que permitem a aproximação matemática. A interpretação do resultado inclui verificar unidades, sinais e limites do modelo, e não apenas encontrar um valor numérico.</p>'+
 '<div class="formula-box"><span>EXPRESSÃO DE REFERÊNCIA</span><strong>'+h(s.formula)+'</strong></div>'+
 '<h3>Cuidado conceitual</h3><p>'+h(s.pitfall)+'</p></div>':
 '<div class="summary-essay"><span class="chapter-label">CAPÍTULO 02 · MODELO E APLICAÇÃO</span><h2>Equações, análise e exemplo</h2><p>'+h(s.example)+'</p>'+
 '<div class="formula-box"><span>EQUAÇÕES PRINCIPAIS</span><strong>'+h(s.formula)+'</strong></div>'+
 '<h3>Qual teoria sustenta a relação?</h3><p>'+h(s.concept)+'</p>'+
 '<div class="paper-highlight peach"><span aria-hidden="true">△</span><div><h3>Evite este erro</h3><p>'+h(s.pitfall)+'</p></div></div>'+
 '<h3>Ao resolver um exercício</h3><p>Defina os eixos e as condições iniciais quando necessários; escreva as hipóteses, substitua grandezas com unidades consistentes e confronte sua solução com casos-limite. Se um sinal ou ordem de grandeza não fizer sentido, volte à definição do modelo antes de recalcular.</p></div>';
 return workspace("resumos",s.title,crumb([{label:"Resumos",url:"#resumos"},{label:s.semester+"º período",url:"#periodo/"+s.semester},{label:s.title}])+
 hero(s.area+" · "+s.semester+"º PERÍODO",s.title,"Leia, conecte a matemática ao fenômeno e registre seu próprio raciocínio.","∫")+
 '<nav class="reading-tabs" aria-label="Capítulos desta disciplina"><a href="#leitura/'+s.id+'/conceito" class="'+(isIntro?"active":"")+'">✦ Fundamentos e conceitos</a><a href="#leitura/'+s.id+'/aplicacao" class="'+(!isIntro?"active":"")+'">∇ Equações e aplicações</a></nav>'+
 '<article class="reading-paper">'+content+
 '<section class="thought-question"><span class="eyebrow">PERGUNTA PARA COMPREENDER</span><h3>'+h(q.question)+'</h3><details><summary>Mostrar resposta comentada ↗</summary><p>'+h(q.answer)+'</p></details></section>'+
 '<section class="student-notes"><div class="student-notes-top"><div><span class="eyebrow">MEU CADERNO DE ANOTAÇÕES</span><h3>Registre suas descobertas ✎</h3></div><span>∇</span></div><textarea rows="7" data-note="'+h(key)+'" placeholder="Escreva deduções, hipóteses, conexões com outras disciplinas, exercícios e dúvidas para estudar...">'+h(note)+'</textarea><p>Este espaço é só seu: organize a dedução do seu jeito.</p></section>'+
 '<div class="reading-actions">'+button(read?"✓ Já estudei esta leitura":"✓ Marcar como estudado","markRead",'data-key="'+h(key)+'"',"btn-primary")+button(fav(s)?"★ Nos favoritos":"☆ Favoritar disciplina","starSubject",'data-id="'+s.id+'"')+'<a class="btn btn-soft" href="#revisao/'+s.id+'">Revisar com flashcards λ</a>'+button("Imprimir leitura","printStudy")+'</div></article>'+
 '<div class="reading-next"><a href="#leitura/'+s.id+'/'+(isIntro?"aplicacao":"conceito")+'">'+(isIntro?"Próxima leitura: Equações e aplicações →":"← Retomar fundamentos")+'</a><a href="#periodo/'+s.semester+'">Voltar às disciplinas</a></div>');
}
function missing(){return A.page('<section class="empty"><h1>Não encontramos este texto.</h1><a class="btn btn-primary" href="#resumos">Abrir biblioteca</a></section>')}
onAction("markRead",b=>{toggle("read",b.dataset.key);update();toast("Seu progresso foi atualizado! ✦")});
onAction("starSubject",b=>{toggle("stars",b.dataset.id);update()});
onAction("printStudy",()=>window.print());
register("resumos",library);register("periodo",period);register("leitura",reading);
window.PHY_RESUMOS={subjectCard,library,reading};
})();