/* 45 laboratórios autorais de Física: painéis, oficinas, edição e rotas isoladas. */
(()=>{"use strict";
const A=window.PHY_APP,X=window.PHY_EXPANSION,h=A.h;
const nice=x=>h(String(x??""));
const kindLabels={document:"Leitura e teoria",worksheet:"Atividade orientada",quiz:"Questões comentadas",matrix:"Matriz de estudo",laboratory:"Laboratório de investigação",calculator:"Oficina quantitativa",journal:"Diário científico",kanban:"Quadro de atividades",review:"Revisão crítica",portfolio:"Produção acadêmica"};
const button=(label,action,attrs="",cls="")=>'<button type="button" class="px-btn '+cls+'" data-px-action="'+action+'" '+attrs+'>'+label+'</button>';
const link=(label,id,path="",cls="")=>'<a class="px-btn '+cls+'" href="#'+id+(path?"/"+path:"")+'">'+label+'</a>';
const attr=(id,fid,eid)=>'data-px-id="'+id+'" data-px-fid="'+fid+'" data-px-eid="'+eid+'"';
const input=(label,id,fid,eid,key,value,kind="text")=>'<label class="px-field"><span>'+h(label)+'</span>'+
 (kind==="textarea"?'<textarea rows="4" '+attr(id,fid,eid)+' data-px-key="'+key+'">'+nice(value)+'</textarea>':
 kind==="select"?'<select '+attr(id,fid,eid)+' data-px-key="'+key+'">'+X.stages.map(x=>'<option '+(value===x?"selected":"")+'>'+h(x)+'</option>').join("")+'</select>':
 '<input '+(kind==="checkbox"?'type="checkbox" '+(value?"checked":""):'type="'+kind+'" value="'+nice(value)+'"')+' '+attr(id,fid,eid)+' data-px-key="'+key+'">')+'</label>';
const navigate=id=>X.get(id).m.topics.map((t,i)=>'<a href="#'+id+'/tool/'+t.id+'"><small>'+h(String(i+1).padStart(2,"0"))+'</small>'+h(t.title)+'</a>').join("");
const sidebar=(id,active)=>{
 const m=X.get(id).m;
 return '<aside class="px-sidebar" aria-label="Navegação própria de '+h(m.title)+'">'+
 '<a class="px-brand" href="#'+id+'"><span>φ</span><small>CADERNO DO ESTUDANTE DE FÍSICA</small><strong>'+h(m.title)+'</strong></a>'+
 '<div class="px-side-scroll"><small class="px-overline">NESTE MÓDULO</small>'+
 '<a class="'+(active==="home"?"active":"")+'" href="#'+id+'">⌂ Visão geral</a>'+
 '<a class="'+(active==="diary"?"active":"")+'" href="#'+id+'/diary">✎ Meu diário acadêmico</a>'+
 '<a class="'+(active==="portfolio"?"active":"")+'" href="#'+id+'/portfolio">▤ Meu portfólio</a>'+
 '<small class="px-overline">OFICINAS ESPECIALIZADAS</small>'+navigate(id)+
 '<small class="px-overline">MINHAS INFORMAÇÕES</small><a class="'+(active==="settings"?"active":"")+'" href="#'+id+'/settings">⚙ Configurações e backup</a></div>'+
 '<div class="px-side-footer"><a href="#home">← Voltar ao Caderno de Física</a><p>Este laboratório mantém suas informações separadas dos outros módulos.</p></div></aside>';
};
const shell=(id,active,body)=>{
 const m=X.get(id).m;
 return '<div class="px-shell px-theme-'+id+'">'+sidebar(id,active)+'<div class="px-main"><header class="px-header"><div><span>✦ '+h(m.category)+'</span><small>Seu espaço independente de estudo científico</small></div><div class="px-header-actions">'+link("Visão geral",id)+link("Minhas oficinas",id,"#oficinas","px-primary")+'</div></header><main class="px-body">'+body+'</main><footer class="px-footer">∇ Caderno do Estudante de Física · '+h(m.title)+' · Registros locais neste dispositivo</footer></div></div>';
};
const headline=(ey,title,subtitle)=>'<div class="px-headline"><span>'+h(ey)+'</span><h1>'+h(title)+'</h1><p>'+h(subtitle)+'</p></div>';
const tile=(id,t,i)=>{
 const item=X.tool(id,t.id),done=item.entries.length>0&&item.entries.every(e=>e.checked),label=done?"Revisado":"Abrir oficina";
 return '<a href="#'+id+'/tool/'+t.id+'" class="px-tile" data-px-search="'+nice((t.title+" "+t.detail).toLowerCase())+'"><div class="px-tile-cover"><span>∇ '+nice(String(i+1).padStart(2,"0"))+'</span><b>'+h(["∮","∑","λ","φ","ℏ"][i%5])+'</b></div><small>'+h(kindLabels[item.kind])+'</small><h3>'+h(t.title)+'</h3><p>'+h(t.detail)+'</p><strong>'+label+' →</strong></a>';
};
const row=(id,fid,e)=>{
 return '<article class="px-entry" data-px-draggable="'+h(e.id)+'" draggable="true"><div class="px-entry-top"><label class="px-check"><input type="checkbox" '+(e.checked?"checked":"")+' '+attr(id,fid,e.id)+' data-px-key="checked"> Concluído</label>'+button("Excluir","removeEntry",attr(id,fid,e.id),"px-danger")+'</div>'+
 input("Atividade específica",id,fid,e.id,"title",e.title)+input("Procedimento, conceito e aplicação",id,fid,e.id,"detail",e.detail,"textarea")+
 '<div class="px-entry-bottom">'+input("Etapa",id,fid,e.id,"status",e.status,"select")+input("Prazo pessoal",id,fid,e.id,"due",e.due,"date")+'</div></article>';
};
const rows=(id,t)=>'<div class="px-entries">'+t.entries.map(e=>row(id,t.id,e)).join("")+'</div>';
const cards=(id,t)=>{
 if(t.kind==="quiz")return '<section class="px-paper"><h2>Perguntas para recuperação ativa</h2><p>Responda antes de abrir o desenvolvimento científico.</p><div class="px-quiz">'+t.entries.map((e,i)=>'<details><summary>'+h(e.title)+'</summary><div class="px-answer"><b>Fundamentação do assunto</b><p>'+h(e.detail)+'</p></div></details>').join("")+'</div></section>';
 if(t.kind==="matrix")return '<section class="px-paper"><h2>Matriz de conceitos e aplicações</h2><div class="px-table-scroll"><table><thead><tr><th>Elemento</th><th>Interpretação</th><th>Verificado</th></tr></thead><tbody>'+t.entries.map(e=>'<tr><td>'+h(e.title)+'</td><td>'+h(e.detail)+'</td><td>'+(e.checked?"Sim":"A estudar")+'</td></tr>').join("")+'</tbody></table></div></section>';
 if(t.kind==="kanban")return '<section class="px-paper"><h2>Quadro de trabalho</h2><p>Altere a etapa no cartão e acompanhe as ações pendentes.</p><div class="px-kanban">'+X.stages.map(st=>'<div class="px-lane"><h3>'+h(st)+'</h3>'+t.entries.filter(e=>e.status===st).map(e=>'<div class="px-board-card"><b>'+h(e.title)+'</b><p>'+h(e.detail)+'</p>'+input("Etapa",id,t.id,e.id,"status",e.status,"select")+'</div>').join("")+'</div>').join("")+'</div></section>';
 if(t.kind==="review")return '<section class="px-paper"><h2>Conferência crítica</h2>'+t.entries.map(e=>'<label class="px-review"><input type="checkbox" '+(e.checked?"checked":"")+' '+attr(id,t.id,e.id)+' data-px-key="checked"><span>'+h(e.title)+'<small>'+h(e.detail)+'</small></span></label>').join("")+'</section>';
 if(t.kind==="journal")return '<section class="px-paper"><h2>Registro acadêmico de investigação</h2><p>Registre hipóteses, ajustes de método e as evidências associadas.</p>'+link("Abrir diário pessoal",id,"diary","px-primary")+'</section>';
 if(t.kind==="portfolio")return '<section class="px-paper"><h2>Entregáveis e evidências</h2><p>Documente os documentos, relatórios e resultados próprios desta especialidade.</p>'+link("Abrir portfólio pessoal",id,"portfolio","px-primary")+'</section>';
 if(t.kind==="worksheet")return '<section class="px-paper"><h2>Roteiro de resolução</h2><ol><li>Defina grandezas, símbolos e condições de validade.</li><li>Construa a relação matemática ou experimental.</li><li>Execute a análise e confira unidades e limites físicos.</li><li>Documente a interpretação à luz de '+h(t.title)+'.</li></ol></section>';
 if(t.kind==="laboratory")return '<section class="px-paper"><h2>Protocolo e evidências</h2><div class="px-labgrid"><div><b>Questão investigada</b><p>'+h(t.title)+'</p></div><div><b>Modelo inicial</b><p>'+h(t.detail)+'</p></div><div><b>Conferência</b><p>Compare hipótese, procedimento, resultado esperado e erro associado.</p></div></div></section>';
 return '<section class="px-paper"><h2>Oficina de produção científica</h2><p>'+h(t.detail)+'</p><p>Edite os registros abaixo para documentar suas próprias análises e os resultados obtidos.</p></section>';
};
const diagram=r=>{
 if(!r.series?.length)return "";
 const values=r.series.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));if(values.length<2)return "";
 let minx=Math.min(...values.map(p=>p.x)),maxx=Math.max(...values.map(p=>p.x)),miny=Math.min(...values.map(p=>p.y)),maxy=Math.max(...values.map(p=>p.y));
 if(maxx===minx)maxx=minx+1;if(maxy===miny){maxy=miny+1;miny-=1}
 const coords=values.map(p=>(30+(p.x-minx)/(maxx-minx)*550).toFixed(1)+","+(186-(p.y-miny)/(maxy-miny)*156).toFixed(1)).join(" ");
 return '<figure class="px-plot"><svg viewBox="0 0 610 215" role="img" aria-label="Curva calculada para os parâmetros de entrada"><line x1="30" y1="186" x2="590" y2="186" stroke="#7089a8"/><line x1="30" y1="22" x2="30" y2="186" stroke="#7089a8"/><polyline points="'+coords+'" fill="none" stroke="#316ed5" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="36" y="13" font-size="10" fill="#617795">Variável calculada</text><text x="543" y="204" font-size="10" fill="#617795">Entrada</text></svg><figcaption>Gráfico gerado localmente. Confira as hipóteses do modelo antes de interpretar.</figcaption></figure>';
};
const calcWidget=id=>{
 const m=X.get(id).m,sp=X.calcSpecs[m.calculator];if(!sp)return "";
 const st=X.get(id).s.calculator;
 return '<section class="px-paper px-calc"><h2>Calculadora científica · '+h(sp.title)+'</h2><p>Modifique as entradas e recalcule. Os resultados são demonstrativos e não correspondem a observações laboratoriais reais.</p>'+
 '<div class="px-calc-grid">'+sp.fields.map(([key,label,def])=>'<label class="px-field"><span>'+h(label)+'</span>'+(key==="pairs"?'<textarea rows="5" data-px-calc="'+id+'" data-px-calc-key="'+key+'">'+nice(st[key]??def)+'</textarea>':'<input type="number" step="any" data-px-calc="'+id+'" data-px-calc-key="'+key+'" value="'+nice(st[key]??def)+'">')+'</label>').join("")+'</div>'+
 button("Calcular e visualizar","calculate",'data-px-id="'+id+'"',"px-primary")+'<div class="px-calculation-result" id="px-calculation-result" aria-live="polite"><p>Preencha os parâmetros e pressione Calcular e visualizar.</p></div></section>';
};
const calcResult=id=>{
 const m=X.get(id).m,sp=X.calcSpecs[m.calculator];if(!sp)return "";
 try{
 const state=X.get(id).s.calculator;
 const data=Object.fromEntries(sp.fields.map(([key,,def])=>[key,state[key]??def]));
 const r=sp.compute(data);
 return '<div class="px-formula">'+h(r.formula)+'</div><div class="px-metrics">'+r.metrics.map(([k,v])=>'<div><small>'+h(k)+'</small><strong>'+h(v)+'</strong></div>').join("")+'</div>'+diagram(r)+'<p class="px-caveat">'+h(r.caveat)+'</p>';
 }catch(e){return '<p role="alert" class="px-error">'+h(e.message)+'</p>';}
};
const dashboard=id=>{
 const o=X.get(id),m=o.m,s=o.s,first=m.topics[0],descs=m.topics.slice(0,3);
 return shell(id,"home",'<header class="px-hero"><div class="px-hero-art" aria-hidden="true">∇ <i>ℏ</i> φ</div><span class="px-overline">MEU LABORATÓRIO DE FÍSICA · '+h(m.category).toUpperCase()+'</span><h1>'+h(s.title)+'</h1><p>'+h(s.description)+'</p><div class="px-hero-actions">'+link("Começar por "+first.title,id,"tool/"+first.id,"px-primary")+link("Meu diário",id,"diary")+'</div></header>'+
 '<section class="px-intro"><div><small>SEUS CONCEITOS</small><h2>O que você poderá investigar aqui</h2><p>'+h(m.description)+'</p></div><div class="px-example-stack">'+descs.map(t=>'<div><b>'+h(t.title)+'</b><span>'+h(t.detail)+'</span></div>').join("")+'</div></section>'+
 '<section class="px-library" id="oficinas"><div class="px-sectionhead"><div><small>LABORATÓRIOS E OFICINAS</small><h2>Explore cada etapa da especialidade</h2></div><label class="px-field"><span>Buscar nesta especialidade</span><input type="search" data-px-search-input placeholder="Pesquise por conceito ou aplicação"></label></div><div class="px-tiles">'+m.topics.map((t,i)=>tile(id,t,i)).join("")+'</div></section>'+
 (X.calcSpecs[m.calculator]?'<section class="px-sectionhead"><div><small>MODELO QUANTITATIVO</small><h2>Simulador e cálculos</h2></div></section>'+calcWidget(id):"")+
 '<div class="px-bottomlinks">'+link("Meu diário científico",id,"diary")+link("Documentos e portfólio",id,"portfolio")+link("Backup e personalização",id,"settings")+'</div>');
};
const tool=id=>{
 const fid=decodeURIComponent((location.hash||"").split("/").slice(2).join("/")),t=X.tool(id,fid),o=X.get(id);
 if(!t)return dashboard(id);
 const i=o.m.topics.findIndex(v=>v.id===fid),prev=o.m.topics[i-1],next=o.m.topics[i+1];
 return shell(id,fid,headline(kindLabels[t.kind].toUpperCase(),t.title,t.detail)+
 '<div class="px-toolbar">'+link("← Todas as oficinas",id,"")+button("Imprimir este conteúdo","print",'data-px-id="'+id+'"')+'</div>'+
 '<section class="px-paper px-lesson"><div class="px-sectionhead"><div><small>FUNDAMENTAÇÃO ACADÊMICA</small><h2>Princípio, interpretação e aplicação</h2></div></div><p>'+h(t.detail)+'</p><div class="px-context"><b>Como trabalhar este conceito</b><p>Defina as condições de validade, identifique as grandezas envolvidas e registre uma aplicação ligada à especialidade: '+h(o.m.title)+'. Compare sua interpretação com o desenvolvimento apresentado e a documentação experimental ou teórica disponível.</p></div></section>'+
 cards(id,t)+(t.kind==="calculator"?calcWidget(id):"")+
 '<section class="px-paper px-editor"><div class="px-sectionhead"><div><small>SEU MATERIAL DE ESTUDO</small><h2>Anotações, cálculos e reflexões</h2></div><span class="px-saved">Salvamento automático neste navegador</span></div>'+
 '<label class="px-field"><span>Meu desenvolvimento de '+h(t.title)+'</span><textarea rows="7" data-px-tool-id="'+id+'" data-px-tool-fid="'+fid+'" placeholder="Escreva suas equações, raciocínio, interpretações e observações.">'+nice(t.notes)+'</textarea></label></section>'+
 '<section class="px-paper"><div class="px-sectionhead"><div><small>PRODUÇÃO PERSONALIZÁVEL</small><h2>Atividades e evidências</h2></div>'+button("+ Criar atividade","addEntry",'data-px-id="'+id+'" data-px-fid="'+fid+'"',"px-primary")+'</div>'+rows(id,t)+'</section>'+
 '<div class="px-prevnext">'+(prev?link("← "+prev.title,id,"tool/"+prev.id):link("← Visão geral",id))+
 (next?link(next.title+" →",id,"tool/"+next.id,"px-primary"):link("Concluir e ver portfólio →",id,"portfolio","px-primary"))+'</div>');
};
const logPage=(id,which)=>{
 const o=X.get(id),name=which==="diary"?"Diário acadêmico e científico":"Portfólio e entregáveis",items=o.s[which];
 return shell(id,which,headline("REGISTROS DO MEU CADERNO",name,"Organize documentos, evidências, observações e decisões de "+o.m.title+".")+
 '<section class="px-paper"><h2>Novo '+(which==="diary"?"registro":"entregável")+'</h2>'+
 '<label class="px-field"><span>Título</span><input id="px-log-title" placeholder="'+(which==="diary"?"Ex.: Reunião, ensaio, hipótese":"Ex.: Relatório, gráfico, apresentação")+'"></label>'+
 '<label class="px-field"><span>Descrição, método, evidência ou observação</span><textarea rows="5" id="px-log-body" placeholder="Registre informações técnicas contextualizadas, decisões e resultados verdadeiros."></textarea></label>'+
 button("+ Adicionar ao meu caderno","addLog",'data-px-id="'+id+'" data-px-kind="'+which+'"',"px-primary")+'</section>'+
 '<section class="px-paper"><div class="px-sectionhead"><div><h2>Meus registros pessoais</h2></div></div>'+
 (items.length?'<div class="px-entries">'+items.map(x=>'<article class="px-entry"><small>Registro criado em '+h(new Date(x.created).toLocaleDateString("pt-BR"))+'</small>'+
 '<label class="px-field"><span>Título do registro</span><input data-px-log-id="'+id+'" data-px-log-kind="'+which+'" data-px-log-eid="'+x.id+'" data-px-log-key="title" value="'+nice(x.title)+'"></label>'+
 '<label class="px-field"><span>Descrição</span><textarea rows="5" data-px-log-id="'+id+'" data-px-log-kind="'+which+'" data-px-log-eid="'+x.id+'" data-px-log-key="body">'+nice(x.body)+'</textarea></label>'+
 button("Excluir registro","removeLog",'data-px-id="'+id+'" data-px-kind="'+which+'" data-px-eid="'+x.id+'"',"px-danger")+'</article>').join("")+'</div>':'<p>Seus registros pessoais aparecerão aqui. Os exemplos acadêmicos continuam disponíveis nas oficinas.</p>')+'</section>');
};
const settings=id=>{
 const o=X.get(id);
 return shell(id,"settings",headline("PERSONALIZAÇÃO E SEGURANÇA LOCAL","Meu laboratório, meus dados","Personalize este ambiente e proteja os trabalhos realizados na instalação atual do navegador.")+
 '<section class="px-paper"><h2>Identidade do caderno</h2>'+
 '<label class="px-field"><span>Título do meu ambiente</span><input data-px-meta-id="'+id+'" data-px-meta-key="title" value="'+nice(o.s.title)+'"></label>'+
 '<label class="px-field"><span>Descrição pessoal</span><textarea rows="4" data-px-meta-id="'+id+'" data-px-meta-key="description">'+nice(o.s.description)+'</textarea></label>'+
 '<label class="px-field"><span>Próxima revisão pessoal</span><input type="date" data-px-meta-id="'+id+'" data-px-meta-key="reviewDate" value="'+nice(o.s.reviewDate)+'"></label></section>'+
 '<section class="px-paper"><h2>Backup e restauração deste módulo</h2><p>Os dados são locais e não sincronizam dispositivos. Exporte o backup antes de limpar exemplos ou trocar de navegador.</p>'+
 '<div class="px-toolbar">'+button("Baixar backup JSON","backup",'data-px-id="'+id+'"',"px-primary")+button("Imprimir ambiente","print",'data-px-id="'+id+'"')+
 button("Restaurar conteúdo original","reset",'data-px-id="'+id+'"')+button("Limpar somente este módulo","clear",'data-px-id="'+id+'"',"px-danger")+'</div>'+
 '<label class="px-field"><span>Cole um backup JSON deste mesmo módulo</span><textarea rows="6" id="px-import-backup" placeholder="Cole aqui o conteúdo do arquivo de backup"></textarea></label>'+
 button("Importar este backup","import",'data-px-id="'+id+'"')+'</section>');
};
const render=(id,path)=>{
 const part=path[1]||"";
 if(part==="tool")return tool(id);
 if(part==="diary")return logPage(id,"diary");
 if(part==="portfolio")return logPage(id,"portfolio");
 if(part==="settings")return settings(id);
 return dashboard(id);
};
X.modules.forEach(m=>A.register(m.id,path=>render(m.id,path)));
const rerender=()=>A.update();
const getTarget=e=>e.target?.dataset||{};
document.addEventListener("input",e=>{
 const d=getTarget(e),v=e.target?.type==="checkbox"?e.target.checked:e.target?.value;
 if(d.pxId&&d.pxFid&&d.pxEid){X.setEntry(d.pxId,d.pxFid,d.pxEid,d.pxKey,v);}
 else if(d.pxToolId){X.setTool(d.pxToolId,d.pxToolFid,"notes",v);}
 else if(d.pxCalc){X.setCalc(d.pxCalc,d.pxCalcKey,v);}
 else if(d.pxMetaId){X.setMeta(d.pxMetaId,d.pxMetaKey,v);}
 else if(d.pxLogId){X.updateLog(d.pxLogId,d.pxLogKind,d.pxLogEid,d.pxLogKey,v);}
 if(d.pxSearchInput!==undefined){const q=String(v).trim().toLowerCase();A.$$("[data-px-search]").forEach(el=>el.hidden=!el.dataset.pxSearch.includes(q));}
});
document.addEventListener("change",e=>{const d=getTarget(e);if(d.pxKey==="status"||d.pxKey==="checked")rerender();});
function download(name,txt,mime="application/json"){
 const url=URL.createObjectURL(new Blob([txt],{type:mime})),a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const actions={
 addEntry:b=>{X.addEntry(b.dataset.pxId,b.dataset.pxFid);rerender();},
 removeEntry:b=>{if(confirm("Excluir apenas esta atividade?")){X.deleteEntry(b.dataset.pxId,b.dataset.pxFid,b.dataset.pxEid);rerender();}},
 addLog:b=>{const title=A.$("#px-log-title")?.value?.trim(),body=A.$("#px-log-body")?.value?.trim();if(!title||!body){A.toast("Preencha título e descrição.");return;}X.append(b.dataset.pxId,b.dataset.pxKind,{title,body});rerender();},
 removeLog:b=>{if(confirm("Excluir somente este registro?")){X.remove(b.dataset.pxId,b.dataset.pxKind,b.dataset.pxEid);rerender();}},
 calculate:b=>{const out=A.$("#px-calculation-result");if(out)out.innerHTML=calcResult(b.dataset.pxId);},
 print:()=>window.print(),
 backup:b=>download("fisica-"+b.dataset.pxId+"-backup.json",X.backup(b.dataset.pxId)),
 reset:b=>{if(confirm("Restaurar o modelo de exemplo? Isso substitui as edições deste módulo. Faça backup antes.")){X.reset(b.dataset.pxId);rerender()}},
 clear:b=>{if(confirm("Limpar as informações e atividades somente deste módulo? Faça backup antes.")){X.clear(b.dataset.pxId);rerender()}},
 import:b=>{const raw=A.$("#px-import-backup")?.value;if(!raw){A.toast("Cole o backup antes de importar.");return}if(!confirm("Substituir dados atuais deste módulo pelo backup informado?"))return;try{X.restore(b.dataset.pxId,raw);rerender();A.toast("Backup restaurado.")}catch(e){A.toast(e.message)}}
};
document.addEventListener("click",e=>{const b=e.target?.closest?.("[data-px-action]");if(b&&actions[b.dataset.pxAction])actions[b.dataset.pxAction](b)});
})();
