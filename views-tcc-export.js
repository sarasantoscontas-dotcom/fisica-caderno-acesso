/* Exportador do TCC: documento acadêmico organizado, impressão A4 / Salvar como PDF. */
(()=>{
"use strict";
const T=window.PHY_TCC,A=window.PHY_APP;
const h=T.h;
const title=()=>T.state().metadata.title||"Título do TCC";
const p=x=>String(x||"").split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean).map(s=>'<p>'+h(s).replace(/\n/g," ")+'</p>').join("");
const nameOf=x=>String(x||"").trim()||"Dado institucional a preencher";
const sectionHTML=s=>{
 const isAbstract=["resumo","abstract"].includes(s.id);
 return '<section class="tcc-print-section '+(isAbstract?"print-abstract":"")+'" id="print-'+h(s.id)+'"><h2>'+h(s.title)+'</h2>'+p(s.body||"Conteúdo a desenvolver.")+'</section>';
};
function bibliography(){
 const b=T.state().bibliography;
 return '<section class="tcc-print-section tcc-print-bibliography"><h2>Apêndice B — Acervo de consulta do projeto</h2><p class="tcc-small-print">Referências organizadas com os dados disponíveis. Confira local, editora, ano, autoria e demais exigências da ABNT antes da submissão; nenhuma fonte digital é aberta pelo sistema.</p>'+
 (b.length?b.map(r=>'<p>'+h([String(r.author||"").toUpperCase(),r.title,r.year&&r.year!=="a conferir"?r.year:"[s. d.]"].filter(Boolean).join(". "))+'.</p>').join(""):'<p>Referências acadêmicas a inserir após consulta e verificação.</p>')+'</section>';
}
function simulationTable(){
 try{
  const r=T.numerical(),rows=T.sweep(),sf=x=>Number(x).toExponential(3);
  return '<section class="tcc-print-section tcc-print-simulation"><h2>Quadros demonstrativos de simulação numérica</h2><p>Os valores abaixo foram calculados pelo modelo no navegador, utilizando fórmulas determinísticas. NÃO representam medições empíricas. A validade dos resultados depende das hipóteses do modelo e da conferência dos parâmetros.</p>'+
  '<table><caption>Parâmetros físicos do ensaio numérico</caption><tbody>'+
  Object.entries(r.params).map(([k,v])=>'<tr><th>'+h(k)+'</th><td>'+h(v)+'</td></tr>').join("")+'</tbody></table>'+
  '<table><caption>Comparação dos integradores com a referência analítica</caption><thead><tr><th>Método</th><th>Erro máximo em x (m)</th><th>Erro final em x (m)</th><th>Energia final (J)</th></tr></thead><tbody>'+
  [["euler","Euler explícito"],["cromer","Euler–Cromer"],["rk4","Runge–Kutta 4"]].map(([id,name])=>'<tr><td>'+h(name)+'</td><td>'+sf(r.metrics[id].maxError)+'</td><td>'+sf(r.metrics[id].finalError)+'</td><td>'+sf(r.metrics[id].energyFinal)+'</td></tr>').join("")+'</tbody></table>'+
  '<table><caption>Ensaio de refinamento de passo</caption><thead><tr><th>Passo h (s)</th><th>Erro máximo Euler (m)</th><th>Erro máximo Cromer (m)</th><th>Erro máximo RK4 (m)</th></tr></thead><tbody>'+
  rows.map(row=>row.error?'<tr><td>'+h(row.h)+'</td><td colspan="3">'+h(row.error)+'</td></tr>':'<tr><td>'+sf(row.h)+'</td><td>'+sf(row.metrics.euler.maxError)+'</td><td>'+sf(row.metrics.cromer.maxError)+'</td><td>'+sf(row.metrics.rk4.maxError)+'</td></tr>').join("")+'</tbody></table>'+
  '<div class="tcc-export-figures">'+window.PHY_TCC_UI.chart(r,"x","Figura demonstrativa — Deslocamento × tempo","posição (m)")+
 window.PHY_TCC_UI.chart(r,"E","Figura demonstrativa — Energia mecânica × tempo","energia (J)")+'</div>'+
 '<p>Fonte: elaboração e cálculo numérico do autor no Caderno de Física; comparar com sua própria reprodução antes da entrega institucional.</p></section>';
 }catch(e){return '<section class="tcc-print-section"><h2>Quadros de simulação numérica</h2><p>Dados indisponíveis para parâmetros atuais: '+h(e.message)+'. Ajuste o regime no simulador antes de finalizar o documento.</p></section>'}
}
function documentHTML(){
 const m=T.state(),data=m.metadata;
 const refsBefore=m.sections.filter(s=>!["resumo","abstract","referencias","apendice"].includes(s.id));
 const abstracts=m.sections.filter(s=>["resumo","abstract"].includes(s.id));
 const ending=m.sections.filter(s=>["referencias","apendice"].includes(s.id));
 return '<article class="tcc-export-sheet" id="tcc-document-to-print" lang="pt-BR">'+
 '<section class="tcc-print-cover"><div class="tcc-print-institution">'+h(nameOf(data.institution))+'<div>'+h(nameOf(data.course))+'</div></div>'+
 '<div class="tcc-print-cover-name">'+h(nameOf(data.author))+'</div><h1>'+h(nameOf(data.title))+'</h1>'+
 '<p>'+h(nameOf(data.city))+'</p><p>'+h(nameOf(data.year))+'</p></section>'+
 '<section class="tcc-print-cover tcc-print-title-page"><div class="tcc-print-cover-name">'+h(nameOf(data.author))+'</div><h1>'+h(nameOf(data.title))+'</h1>'+
 '<div class="tcc-print-work-description"><p>Trabalho de Conclusão de Curso apresentado à '+h(nameOf(data.institution))+' como parte das atividades acadêmicas do curso de '+h(nameOf(data.course))+'.</p><p>Área: '+h(nameOf(data.area))+'.</p><p>Orientação: '+h(nameOf(data.advisor))+'.</p></div><p>'+h(nameOf(data.city))+' · '+h(nameOf(data.year))+'</p></section>'+
 '<section class="tcc-print-approval"><h2>Folha de aprovação</h2><p>'+h(nameOf(data.author))+'</p><h3>'+h(nameOf(data.title))+'</h3><p>Trabalho de Conclusão de Curso apresentado à '+h(nameOf(data.institution))+' para apreciação pela banca examinadora do curso de '+h(nameOf(data.course))+'.</p><p><strong>Data da aprovação:</strong> a ser preenchida após a banca.</p><p><strong>Orientador(a):</strong> '+h(nameOf(data.advisor))+'</p><div class="tcc-approval-signature">Banca examinadora — identificação e assinatura a preencher</div><div class="tcc-approval-signature">Banca examinadora — identificação e assinatura a preencher</div><div class="tcc-approval-signature">Banca examinadora — identificação e assinatura a preencher</div></section>'+
 abstracts.map(sectionHTML).join("")+
 '<section class="tcc-print-section tcc-print-symbols"><h2>Lista de símbolos</h2><table><tbody>'+[["m","Massa (kg)"],["k","Constante elástica (N/m)"],["b","Coeficiente de amortecimento viscoso (kg/s)"],["x","Deslocamento (m)"],["v","Velocidade (m/s)"],["ω₀","Frequência natural (rad/s)"],["γ","Taxa de amortecimento (s⁻¹)"],["ωd","Frequência amortecida (rad/s)"],["h","Passo temporal (s)"],["E","Energia mecânica (J)"]].map(([symbol,label])=>'<tr><th>'+symbol+'</th><td>'+label+'</td></tr>').join("")+'</tbody></table></section>'+
 '<section class="tcc-print-section tcc-print-contents"><h2>Sumário</h2><p class="tcc-small-print">Títulos estruturais; confira a numeração de páginas do documento final conforme as normas institucionais.</p>'+
 '<ol>'+refsBefore.filter(s=>!/^\d\.\d/.test(s.title)).map(s=>'<li>'+h(s.title)+'</li>').join("")+'<li>Referências</li><li>Apêndice</li></ol></section>'+
 refsBefore.map(item=>sectionHTML(item)+(item.id==="resultados"?simulationTable():"")).join("")+
 ending.map(sectionHTML).join("")+
 bibliography()+'</article>';
}
function exportPage(){
 const m=T.state(),ui=window.PHY_TCC_UI;
 const msg='<div class="tcc-export-notice"><b>Documento pronto para conferir e personalizar</b><p>O TCC abaixo é um modelo didático com cálculos simulados. Confira a norma da sua universidade, as citações e seus resultados antes do depósito. Ao clicar em <strong>Gerar PDF</strong>, o navegador abre a impressão: escolha <strong>Salvar como PDF</strong>.</p></div>';
 return ui.shell("export",ui.hdr("ATELIÊ DE PUBLICAÇÃO","Gerar meu TCC em PDF","Visualize o documento acadêmico montado com os textos e dados que você editou. A versão para impressão organiza capa, folha de rosto, capítulos, referências e tabelas numéricas.")+
 msg+'<div class="tcc-export-actions">'+ui.action("Gerar PDF / Imprimir TCC","printPdf",'',"primary")+'<a href="#tcc/chapters" class="tcc-btn ghost">Revisar capítulos</a><a href="#tcc/versions" class="tcc-btn ghost">Salvar uma versão</a></div>'+
 '<div class="tcc-export-meta"><span>Modelo de Física editável</span><span>Formato de impressão A4</span><span>Conteúdo demonstrativo claramente identificado</span></div>'+
 '<div class="tcc-print-holder">'+documentHTML()+'</div>');
}
document.addEventListener("click",e=>{
 const b=e.target?.closest?.('[data-tcc-action="printPdf"]');if(!b)return;
 window.print();
});
window.PHY_TCC_EXPORT={render:exportPage,documentHTML,simulationTable};
})();