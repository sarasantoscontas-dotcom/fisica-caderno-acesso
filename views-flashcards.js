/* Módulo 2 · Flashcards por disciplina, 3 perguntas/assunto e treino ativo. */
(()=>{
"use strict";
const A=window.PHY_APP,{terms,subjects,byId,state,h,pill,button,escArea,crumb,hero,metric,workspace,register,onAction,update,toast,cardTotal}=A;
function sessionFor(id,shuffle=false){
 const s=byId.get(id);if(!s)return null;
 const current=state.session;
 if(!shuffle&&current.id===id&&Array.isArray(current.order)&&current.order.length===s.flashcards.length){
 current.index=Math.max(0,Math.min(current.order.length-1,Number(current.index)||0));return current;
 }
 const order=s.flashcards.map((_,i)=>i);
 if(shuffle)for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}
 state.session={id,order,index:0,flip:false};A.save();return state.session;
}
function decks(){
 const total=Object.keys(state.ratings).length;
 return workspace("flashcards","Flashcards",crumb([{label:"Flashcards"}])+
 hero("REVISÃO ATIVA","Aprender também é recordar","Treine seu raciocínio com perguntas e respostas comentadas, avalie sua segurança e retorne ao que precisa aprofundar.","λ")+
 '<div class="metric-grid compact">'+metric(subjects.length,"Baralhos por disciplina","∑")+metric(cardTotal(),"Perguntas de Física","λ")+metric(total,"Cartões avaliados","✦")+'</div>'+
 '<section class="content-block"><div class="section-title"><div><span class="eyebrow">SELECIONE UM BARALHO</span><h2>Revisão organizada por assunto</h2></div>'+pill("Perguntas comentadas")+'</div>'+
 '<div class="filter-row"><label>Buscar disciplina<input type="search" data-search placeholder="Ex.: Eletromagnetismo, Quântica, Fourier..."></label><label>Período<select data-filter-term><option value="">Todos os períodos</option>'+terms.map(t=>'<option value="'+t.number+'">'+t.number+'º período</option>').join("")+'</select></label></div>'+
 '<div class="deck-grid">'+subjects.map(s=>{
  const rated=s.flashcards.filter((_,i)=>state.ratings[s.id+"/"+i]).length;
  return '<a href="#revisao/'+s.id+'" class="deck-card filter-card '+escArea(s.area)+'" data-semester="'+s.semester+'" data-keywords="'+h((s.title+" "+s.area+" "+s.concept).toLowerCase())+'"><div class="deck-top"><span class="deck-symbol">λ</span>'+pill(s.semester+"º período")+'</div>'+pill(s.area,"soft")+'<h3>'+h(s.title)+'</h3><p>Revisão de conceitos, fórmulas e interpretação física.</p><div class="deck-bottom"><span>'+rated+'/'+s.flashcards.length+' cartões avaliados</span><b>Abrir baralho ↗</b></div></a>';
 }).join("")+'</div></section>');
}
function review([,id]){
 const s=byId.get(id);if(!s)return A.page('<section class="empty"><h1>Baralho não encontrado.</h1><a href="#flashcards">Voltar à biblioteca</a></section>');
 const st=sessionFor(id),cardNo=st.order[st.index],card=s.flashcards[cardNo],rating=state.ratings[id+"/"+cardNo];
 const done=s.flashcards.filter((_,i)=>state.ratings[id+"/"+i]).length;
 return workspace("flashcards",s.title,crumb([{label:"Flashcards",url:"#flashcards"},{label:s.title}])+
 hero(s.area+" · "+s.semester+"º PERÍODO",s.title,"Pense primeiro na resposta. Depois vire o cartão, confira o conceito e indique como foi a sua revisão.","λ")+
 '<div class="review-tools"><div>'+pill("Cartão "+(st.index+1)+" de "+st.order.length)+pill(done+" avaliados")+pill(card.tag,"soft")+'</div><div>'+button("↻ Embaralhar","shuffleCards",'data-id="'+s.id+'"')+'<a href="#flashcards" class="btn btn-soft">Outros baralhos</a></div></div>'+
 '<div class="review-progress"><span style="width:'+((st.index+1)/st.order.length*100)+'%"></span></div>'+
 '<button type="button" class="flip-card '+(st.flip?"is-back":"is-front")+'" data-action="flipCard" aria-label="'+(st.flip?"Revelar pergunta":"Revelar resposta")+'"><span class="flip-atom" aria-hidden="true">⚛</span><small>'+h(st.flip?"RESPOSTA COMENTADA":"PERGUNTA DE FÍSICA")+'</small><strong>'+h(st.flip?card.answer:card.question)+'</strong><span class="flip-tip">'+(st.flip?"Toque para rever a pergunta":"Clique ou toque para revelar a resposta")+' <b>↗</b></span></button>'+
 '<div class="review-mark"><span>Como ficou seu domínio deste conceito?</span><div>'+
 button("Ainda difícil","rateCard",'data-level="dificil"',"difficulty-hard "+(rating==="dificil"?"selected":""))+
 button("Em aprendizado","rateCard",'data-level="medio"',"difficulty-medium "+(rating==="medio"?"selected":""))+
 button("Já domino","rateCard",'data-level="facil"',"difficulty-easy "+(rating==="facil"?"selected":""))+'</div></div>'+
 '<div class="review-arrows">'+button("← Anterior","previousCard",st.index===0?"disabled":"")+
 button(st.index===st.order.length-1?"Rever o baralho ↻":"Próximo cartão →",st.index===st.order.length-1?"restartCards":"nextCard","", "btn-primary")+'</div>'+
 '<section class="review-reference"><div><span class="eyebrow">QUER APROFUNDAR?</span><h3>Entenda a teoria por trás desta pergunta</h3><p>'+h(s.concept.slice(0,210))+'…</p></div><a class="btn btn-soft" href="#leitura/'+s.id+'/conceito">Abrir o resumo ∑</a></section>');
}
function next(by){
 const st=state.session;
 st.index=Math.max(0,Math.min(st.order.length-1,st.index+by));st.flip=false;A.save();update();
}
onAction("flipCard",()=>{state.session.flip=!state.session.flip;A.save();update()});
onAction("nextCard",()=>next(1));
onAction("previousCard",()=>next(-1));
onAction("restartCards",()=>{sessionFor(state.session.id,false);update();toast("Vamos revisar novamente! ✧")});
onAction("shuffleCards",el=>{sessionFor(el.dataset.id,true);update();toast("Seu baralho foi embaralhado! λ")});
onAction("rateCard",el=>{
 const st=state.session,key=st.id+"/"+st.order[st.index];state.ratings[key]=el.dataset.level;
 if(st.index<st.order.length-1)st.index++;st.flip=false;A.save();update();toast("Cartão avaliado! ✦");
});
document.addEventListener("keydown",ev=>{
 if(!A.logged()||!location.hash.startsWith("#revisao/"))return;
 if(["INPUT","TEXTAREA","SELECT","BUTTON"].includes(ev.target?.tagName))return;
 if(ev.code==="Space"){ev.preventDefault();state.session.flip=!state.session.flip;A.save();update()}
 if(ev.key==="ArrowRight"){ev.preventDefault();next(1)}
 if(ev.key==="ArrowLeft"){ev.preventDefault();next(-1)}
});
register("flashcards",decks);register("revisao",review);
window.PHY_FLASHCARDS={decks,review,sessionFor};
})();