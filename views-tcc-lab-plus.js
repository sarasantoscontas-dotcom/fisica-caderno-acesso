/* TCC de Física: calculadoras efetivas de laboratório (dados didáticos editáveis).
   Nenhum link ou função interfere nos outros módulos do Caderno. */
(()=>{
"use strict";
const A=window.PHY_APP,T=window.PHY_TCC;
const h=T.h,ui=()=>window.PHY_TCC_UI;
const label=(title,tool,key,value,step="any")=>'<label class="tcc-science-field">'+h(title)+'<input type="number" step="'+step+'" data-tcc-lab-tool="'+h(tool)+'" data-tcc-lab-field="'+h(key)+'" value="'+h(value??"")+'"></label>';
const num=(raw,name)=>{if(raw===null||raw===undefined||String(raw).trim()==="")throw Error("Preencha "+name+" antes de calcular.");const n=Number(String(raw).trim().replace(",","."));if(!Number.isFinite(n))throw Error("Use um número válido para "+name+".");return n};
const fixed=(n,d=5)=>Number(n).toLocaleString("pt-BR",{maximumFractionDigits:d});
function uncertainty(){
 const p=T.state().labPlus?.uncertainty||{};
 const V=num(p.V,"tensão V"),I=num(p.I,"corrente I"),uV=num(p.uV,"incerteza uV"),uI=num(p.uI,"incerteza uI"),rho=num(p.rho,"correlação ρ");
 if(I===0)throw Error("A corrente I precisa ser diferente de zero.");
 if(uV<0||uI<0||Math.abs(rho)>1)throw Error("Use incertezas não negativas e correlação entre −1 e 1.");
 const R=V/I,a=uV/I,b=V*uI/(I*I),variance=a*a+b*b-2*a*b*rho;
 if(variance< -1e-10*Math.max(a*a+b*b,1))throw Error("Os parâmetros resultam em variância inválida.");
 return {R,uR:Math.sqrt(Math.max(0,variance)),rel:R?Math.sqrt(Math.max(0,variance))/Math.abs(R)*100:null,unit:"Ω"};
}
function regression(){
 const text=T.state().labPlus?.regression?.pairs||"";
 const rows=text.trim().split(/\r?\n/).filter(Boolean);
 if(rows.length<3)throw Error("Informe ao menos três pares (x ; y) para calcular uma regressão.");
 if(rows.length>1000)throw Error("Use até 1000 pares para preservar o desempenho.");
 const arr=rows.map((line,i)=>{
  const sep=line.includes(";")?";":line.includes("\t")?"\t":",";
  const parts=line.split(sep);if(parts.length!==2)throw Error("Na linha "+(i+1)+", use o formato x ; y.");
  return [num(parts[0],"x da linha "+(i+1)),num(parts[1],"y da linha "+(i+1))];
 });
 const n=arr.length,xb=arr.reduce((z,p)=>z+p[0],0)/n,yb=arr.reduce((z,p)=>z+p[1],0)/n;
 const sxx=arr.reduce((z,p)=>z+(p[0]-xb)**2,0),sxy=arr.reduce((z,p)=>z+(p[0]-xb)*(p[1]-yb),0),syy=arr.reduce((z,p)=>z+(p[1]-yb)**2,0);
 if(sxx<1e-22)throw Error("Os valores de x precisam variar para ajustar uma reta.");
 const slope=sxy/sxx,intercept=yb-slope*xb,sse=arr.reduce((z,p)=>z+(p[1]-intercept-slope*p[0])**2,0),r2=syy>1e-22?1-sse/syy:null;
 return {n,slope,intercept,r2,rms:n>2?Math.sqrt(sse/(n-2)):null,points:arr};
}
function damping(){
 const p=T.state().labPlus?.damping||{},m=num(p.m,"massa m"),k=num(p.k,"rigidez k"),b=num(p.b,"amortecimento b");
 if(!(m>0&&k>0&&b>=0))throw Error("A massa e rigidez devem ser positivas; b não pode ser negativo.");
 const w0=Math.sqrt(k/m),gamma=b/(2*m),critical=2*Math.sqrt(m*k),zeta=b/critical;
 const regime=Math.abs(zeta-1)<1e-10?"Crítico":zeta<1?"Subamortecido":"Superamortecido";
 return {w0,gamma,critical,zeta,regime,wd:zeta<1?Math.sqrt(w0*w0-gamma*gamma):null,period:zeta<1?2*Math.PI/Math.sqrt(w0*w0-gamma*gamma):null};
}
const calc={uncertainty,regression,damping};
function panel(title,subtitle,icon,href,color){
 return '<a class="tcc-science-tile '+color+'" href="#tcc/lab-plus/'+href+'"><span>'+icon+'</span><div><b>'+h(title)+'</b><small>'+h(subtitle)+'</small></div><i>↗</i></a>';
}
function fieldsUncertainty(){
 const p=T.state().labPlus?.uncertainty||{};
 return '<p class="tcc-science-explain">Exemplo didático: resistência de um circuito calculada por R = V/I. A incerteza padrão combinada usa derivadas parciais e correlação entre V e I; não se trata de medição real.</p><div class="tcc-science-fields">'+
 label("Tensão V (V)","uncertainty","V",p.V)+label("Corrente I (A)","uncertainty","I",p.I)+label("Incerteza-padrão uV (V)","uncertainty","uV",p.uV)+label("Incerteza-padrão uI (A)","uncertainty","uI",p.uI)+label("Coeficiente de correlação ρ","uncertainty","rho",p.rho)+
 '</div><div class="tcc-science-formula">R = V / I &nbsp; · &nbsp; u²(R) = (uV/I)² + (V·uI/I²)² − 2ρ·V·uV·uI/I³</div>';
}
function fieldsRegression(){
 return '<p class="tcc-science-explain">Exemplo de calibração linear ilustrativa: informe pontos (x ; y), um por linha. O sistema ajusta y = ax + b por mínimos quadrados não ponderados. Use ponto ou vírgula decimal quando separado por ponto e vírgula. Para medidas com incertezas diferentes, seria necessário ajuste ponderado.</p>'+
 '<label class="tcc-science-pair">Pares de dados (x ; y)<textarea rows="9" data-tcc-lab-tool="regression" data-tcc-lab-field="pairs" placeholder="0 ; 0,02&#10;0,25 ; 0,38">'+h(T.state().labPlus?.regression?.pairs||"")+'</textarea></label>'+
 '<div class="tcc-science-formula">a = Σ[(xᵢ−x̄)(yᵢ−ȳ)] / Σ[(xᵢ−x̄)²] &nbsp; · &nbsp; b = ȳ − ax̄</div>';
}
function fieldsDamping(){
 const p=T.state().labPlus?.damping||{};
 return '<p class="tcc-science-explain">Identifique o regime do oscilador massa–mola com amortecimento viscoso F = −kx − bv. Altere m, k e b e observe o regime matemático; as grandezas não são medições experimentais.</p><div class="tcc-science-fields">'+
 label("Massa m (kg)","damping","m",p.m)+label("Rigidez k (N/m)","damping","k",p.k)+label("Amortecimento b (kg/s)","damping","b",p.b)+
 '</div><div class="tcc-science-formula">ζ = b / (2√mk) &nbsp; · &nbsp; ω₀ = √(k/m) &nbsp; · &nbsp; γ = b/(2m)</div>';
}
function resultHTML(tool){
 try{
  const r=calc[tool]();
  if(tool==="uncertainty")return '<div class="tcc-science-result"><small>RESISTÊNCIA CALCULADA</small><strong>'+fixed(r.R)+' Ω ± '+fixed(r.uR)+' Ω</strong><p>Incerteza-padrão combinada'+(r.rel!==null?' · relativa: '+fixed(r.rel,3)+'%':"")+'. Verifique se a aproximação linear é adequada e se os dados têm correlação conhecida.</p></div>';
  if(tool==="regression")return '<div class="tcc-science-result"><small>RETA AJUSTADA</small><strong>y = '+fixed(r.slope)+' x '+(r.intercept>=0?"+ ":"− ")+fixed(Math.abs(r.intercept))+'</strong><p>R²: '+(r.r2===null?"Indefinido para resposta constante":fixed(r.r2,5))+' · Dispersão residual: '+fixed(r.rms,6)+'. Confirme unidade, linearidade e padrão dos resíduos.</p></div>';
  return '<div class="tcc-science-result"><small>REGIME FÍSICO</small><strong>'+h(r.regime)+'</strong><p>ζ = '+fixed(r.zeta)+' · ω₀ = '+fixed(r.w0)+' rad/s · γ = '+fixed(r.gamma)+' s⁻¹ · b crítico = '+fixed(r.critical)+' kg/s'+(r.wd!==null?' · ωd = '+fixed(r.wd)+' rad/s · Td = '+fixed(r.period)+' s':"")+'.</p></div>';
 }catch(e){return '<div class="tcc-science-result is-alert" role="status"><small>AJUSTE OS VALORES</small><p>'+h(e.message)+'</p></div>'}
}
function render(id){
 const current=["uncertainty","regression","damping"].includes(id)?id:null;
 const titles={uncertainty:"Propagação de incertezas",regression:"Regressão linear para dados de Física",damping:"Regimes de amortecimento"};
 const title=current?titles[current]:"Cálculos e medidas de Física";
 const inner=ui().hdr("ESTAÇÃO DE CÁLCULO CIENTÍFICO",title,current?"Experimente um exemplo preenchido, altere as entradas e registre os resultados para fundamentar uma análise numérica ou laboratorial.":"Ferramentas que fazem contas reais, com parâmetros editáveis, unidades e orientações ligadas à escrita científica.")+
 '<div class="tcc-science-grid">'+panel("Incertezas","Propagação, correlação e resistência","±","uncertainty","sc-cyan")+panel("Ajuste linear","Declive, intercepto e R²","⌁","regression","sc-violet")+panel("Amortecimento","ω₀, ζ, γ e regime dinâmico","∇","damping","sc-yellow")+'</div>'+
 (current?'<section class="tcc-science-workbench"><div class="tcc-heading"><div><small>LABORATÓRIO INTERATIVO</small><h2>'+h(title)+'</h2></div></div>'+
 (current==="uncertainty"?fieldsUncertainty():current==="regression"?fieldsRegression():fieldsDamping())+
 '<div class="tcc-science-ops"><button type="button" class="tcc-btn primary" data-tcc-science-action="calculate">∑ Calcular com os meus dados</button><button type="button" class="tcc-btn ghost" data-tcc-science-action="example" data-tool="'+current+'">↺ Restaurar exemplo</button></div>'+
 resultHTML(current)+
 '<div class="tcc-science-practice"><b>Como aproveitar no seu TCC</b><p>'+(current==="uncertainty"?"Use a discussão de propagação em relatórios, projetos instrumentais e análises de erro. Declare se as grandezas são independentes ou correlacionadas.":current==="regression"?"Use a estimativa de parâmetros apenas quando a hipótese linear for justificada. Examine resíduos e a incerteza dos pontos antes de relatar o ajuste.":"Conecte esta classificação ao capítulo de fundamentação, às condições iniciais e à validade da solução analítica do modelo.")+'</p><a href="#tcc/simulator">Abrir simulador completo ↗</a></div></section>':
 '<div class="tcc-science-intro"><span aria-hidden="true">φ · ∇ · λ</span><h2>Escolha uma estação e coloque a teoria para trabalhar.</h2><p>Os formulários já contêm exemplos ilustrativos. Você pode editá-los e recalcular; cada estação salva separadamente seu estado dentro do TCC.</p></div>')+
 '<div class="tcc-science-return"><a class="tcc-btn ghost" href="#tcc">← Voltar à visão geral do TCC</a><a class="tcc-btn ghost" href="#tcc/export">Ver meu TCC em PDF ↗</a></div>';
 return ui().shell("lab-plus",inner);
}
function restore(tool){
 const samples={uncertainty:{V:"5.0",I:"1.00",uV:"0.10",uI:"0.02",rho:"0"},regression:{pairs:"0;0.02\n0.25;0.38\n0.50;0.77\n0.75;1.13\n1.00;1.49"},damping:{m:"1",k:"16",b:"0.8"}};
 for(const [key,value] of Object.entries(samples[tool]||{}))T.updateLabPlus(tool,key,value);
}
document.addEventListener("input",e=>{
 const d=e.target?.dataset||{};
 if(!d.tccLabTool||!d.tccLabField)return;
 T.updateLabPlus(d.tccLabTool,d.tccLabField,e.target.value);
 const el=A.$("#tcc-save-status");if(el)el.textContent="Dados do laboratório salvos ✓";
});
document.addEventListener("click",e=>{
 const btn=e.target?.closest?.("[data-tcc-science-action]");if(!btn)return;
 const name=btn.dataset.tccScienceAction;
 if(name==="example"){restore(btn.dataset.tool);A.update();A.toast("Parâmetros de exemplo restaurados. ✦")}
 if(name==="calculate"){A.update();A.toast("Cálculo atualizado com seus parâmetros. ∇")}
});
window.PHY_TCC_LAB_PLUS={render,uncertainty,regression,damping,restore};
})();