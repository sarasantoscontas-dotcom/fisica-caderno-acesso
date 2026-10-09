/* Expansão de flashcards, independente de outros módulos. */
(()=>{
"use strict";
const A=window.PHY_APP,{h,pill,button,crumb,hero,workspace,state,register,onAction,update,toast}=A;
const content=A.extraSummaries||[];
const original=A&&window.PHY_FLASHCARDS.decks;
state.extraRatings=state.extraRatings||{};
state.extraSession=state.extraSession||{id:"",order:[],index:0,flip:false};
const byId=new Map(content.map(x=>[x.id,x]));
function libraryAddition(){
 return '<section class="content-block extended-decks"><div class="section-title"><div><span class="eyebrow">REVISÃO DE APROFUNDAMENTO</span><h2>Flashcards de temas avançados</h2></div>'+pill("Perguntas explicadas")+'</div>'+
 '<p class="extension-intro">Questões específicas sobre modelos de Física, hipóteses, equações, experimentos e limites. Escolha um assunto e pratique no seu próprio ritmo.</p>'+
 '<div class="extra-deck-grid">'+content.map(s=>{
 const done=s.questions.some((_,i)=>state.extraRatings[s.id+"/"+i]);
 return '<a class="deck-card extra-deck" href="#revisao-extra/'+h(s.id)+'"><div class="deck-top"><span class="deck-symbol">λ</span>'+pill(s.area,"soft")+'</div><h3>'+h(s.title)+'</h3><p>'+h(s.method.slice(0,180))+'…</p><div class="deck-bottom"><span>'+(done?"Revisão em andamento":"Pronto para estudar")+'</span><b>Praticar agora ↗</b></div></a>';
 }).join("")+'</div></section>';
}
const library=()=>{const html=original(),anchor="</main></div>",i=html.lastIndexOf(anchor);return i<0?html+libraryAddition():html.slice(0,i)+libraryAddition()+html.slice(i)};
function session(id,restart){
 const s=byId.get(id);if(!s)return null;
 if(!restart&&state.extraSession.id===id&&state.extraSession.order?.length===s.questions.length)return state.extraSession;
 state.extraSession={id,order:s.questions.map((_,i)=>i),index:0,flip:false};A.save();return state.extraSession;
}
function detail([,id]){
 const s=byId.get(id);if(!s)return workspace("flashcards","Baralho não encontrado",'<section class="empty"><h1>Explore os baralhos.</h1><a class="btn btn-primary" href="#flashcards">Voltar</a></section>');
 const m=session(id,false),index=Math.max(0,Math.min(m.order.length-1,Number(m.index)||0)),card=s.questions[m.order[index]],key=s.id+"/"+m.order[index],rating=state.extraRatings[key];
 return workspace("flashcards",s.title,crumb([{label:"Flashcards",url:"#flashcards"},{label:s.title}])+
 hero("REVISÃO DE FÍSICA · "+s.area,s.title,"Revele as explicações, identifique suas dúvidas e avalie a confiança nas respostas.","λ")+
 '<div class="review-tools"><div>'+pill("Perguntas conceituais")+pill("Treino pessoal","soft")+'</div><div>'+button("↻ Reiniciar","extraRestart")+'<a href="#flashcards" class="btn btn-soft">Outros baralhos</a></div></div>'+
 '<div class="review-progress"><span style="width:'+((index+1)/m.order.length*100)+'%"></span></div>'+
 '<button class="flip-card '+(m.flip?"is-back":"is-front")+'" type="button" data-action="extraFlip" aria-label="'+(m.flip?"Mostrar pergunta":"Revelar explicação")+'"><span class="flip-atom" aria-hidden="true">ℏ</span><small>'+(m.flip?"EXPLICAÇÃO CIENTÍFICA":"PERGUNTA PARA RACIOCINAR")+'</small><strong>'+h(m.flip?card.answer:card.question)+'</strong><span class="flip-tip">'+(m.flip?"Voltar à pergunta":"Toque para virar o cartão")+' ↗</span></button>'+
 '<div class="review-mark"><span>Como foi essa revisão?</span><div>'+button("Ainda difícil","extraRate",'data-level="dificil"',"difficulty-hard "+(rating==="dificil"?"selected":""))+
 button("Estou aprendendo","extraRate",'data-level="medio"',"difficulty-medium "+(rating==="medio"?"selected":""))+
 button("Já domino","extraRate",'data-level="facil"',"difficulty-easy "+(rating==="facil"?"selected":""))+'</div></div>'+
 '<div class="review-arrows">'+button("← Anterior","extraPrev",index===0?"disabled":"")+
 button(index===m.order.length-1?"Revisar novamente ↻":"Próxima pergunta →",index===m.order.length-1?"extraRestart":"extraNext","","btn-primary")+'</div>'+
 '<section class="review-reference"><div><span class="eyebrow">FÍSICA, CONCEITO E EVIDÊNCIA</span><h3>Uma revisão fundamentada</h3><p>'+h(s.warning)+' Consulte seu raciocínio antes de responder e registre mentalmente em quais hipóteses a relação é válida.</p></div></section>');
}
const turn=direction=>{const m=state.extraSession;m.index=Math.max(0,Math.min(m.order.length-1,m.index+direction));m.flip=false;A.save();update()};
onAction("extraFlip",()=>{state.extraSession.flip=!state.extraSession.flip;A.save();update()});
onAction("extraNext",()=>turn(1));onAction("extraPrev",()=>turn(-1));
onAction("extraRestart",()=>{session(state.extraSession.id,true);update();toast("Vamos revisitar os conceitos! ✧")});
onAction("extraRate",b=>{
 const m=state.extraSession;state.extraRatings[m.id+"/"+m.order[m.index]]=b.dataset.level;
 if(m.index<m.order.length-1)m.index++;
 m.flip=false;A.save();update();toast("Sua revisão foi registrada! ✦");
});
register("flashcards",library);
register("revisao-extra",detail);
window.PHY_FLASHCARDS_EXTRA={library,detail,session};
})();