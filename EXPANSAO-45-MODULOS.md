# Expansão do Caderno do Estudante de Física — 45 módulos

**Escopo exclusivo:** repositório `sarasantoscontas-dotcom/fisica-caderno-acesso`. Implementação aditiva e independente dos sete módulos já existentes. Backup de referência em `backup-antes-45-modulos-20261009`.

## Entrega técnica

- **45 novos módulos** distribuídos em **9 áreas**.
- **450 oficinas especializadas**: dez tópicos por módulo, cada um com conteúdo inicial específico e três registros de atividade editáveis (1.350 registros de exemplo).
- **15 modelos de calculadoras** definidos no motor e expostos somente nos ambientes aos quais fazem sentido.
- Módulos com rotas `#<id>`, `#<id>/tool/f01` até `f10`, `#<id>/diary`, `#<id>/portfolio` e `#<id>/settings`.
- Entrada pela home com catálogo por categorias e busca por palavras-chave. Navegação e estado próprios dentro de cada ambiente.
- Edição de notas, checklists, descrição e situação das atividades, prazo, diários, portfólio, calculadoras, exportação e restauração JSON por módulo. Imprimir/Salvar como PDF pelo navegador.
- Conteúdos base autorais de ensino: hipóteses e simplificações dos modelos devem ser verificadas antes de usar resultados como evidência de experimento real.

## Arquitetura adicionada

| Arquivo | Função |
|---|---|
| `physics-expansion-data-a.js` | Conteúdos dos módulos de formação, laboratório e computação. |
| `physics-expansion-data-b.js` | Física teórica, temas de fronteira e licenciatura. |
| `physics-expansion-data-c.js` | Acessibilidade, pesquisa, pós-graduação e carreira. |
| `physics-expansion-engine.js` | Registro do catálogo; modelos de dados, salvamento isolado, backup e cálculos físicos. |
| `physics-expansion-views.js` | Rotas de todos os módulos, dashboards, editores, diário, portfólio, calculadoras e controles. |
| `physics-expansion.css` | Estilo isolado, layout responsivo, catálogo e impressão. |
| `index.html` | Registro e carregamento dos novos recursos na ordem correta. |
| `views-home.js` | Distinção entre módulos originais e biblioteca de laboratórios novos. |
| `app.js` | Limitação da barra de navegação superior aos módulos originais fora de uma oficina. |

## Persistência, backups e limites

Cada ambiente da expansão usa a chave `fisica-expansion-<id>-v1` de `localStorage`, sem sobrescrever as chaves do TCC, Pesquisa, Semestre, Provas, Resumos, Flashcards e Bibliografia. Os dados são mantidos apenas no mesmo navegador; não há conta sincronizada, validação de compra ou backend. Cada ambiente tem exportação JSON, importação do próprio módulo, restauração de conteúdo exemplo e limpeza com confirmação. Antes de limpar dados ou trocar de equipamento, exportar backup.

Os cálculos são implementações didáticas locais e explicitam condições de validade; não representam dados medidos ou certificações técnicas. O PDF depende da caixa de impressão do navegador. Evitou-se inserir links externos nas novas interfaces.

## Testes executados e pendências

O carregamento sintático dos novos scripts, o cadastro das 45 rotas, o preenchimento das 450 oficinas, a execução de cálculos com entradas demonstrativas, a edição do estado, importação/exportação de backup e isolamento das chaves foram verificados em ambiente JavaScript simulado. Ainda é necessário inspecionar visualmente no navegador real, em desktop/tablet/celular, verificar impressão A4 e testar interação manual antes da distribuição comercial.

## Formação e Matemática

### Oficina de Resolução de Problemas

**Identificador:** `problemas` · **Rota:** `#problemas` · **Calculadora associada:** `projectile`

Interprete, modele e resolva problemas de Física com justificativas e verificação de resultados.

- **Ler um enunciado físico:** Distinguir grandezas fornecidas, hipóteses implícitas e variável solicitada antes de escolher equações.
- **Diagramas de corpo livre:** Isolar cada corpo e representar somente forças reais, com eixos coerentes.
- **Leis de Newton:** Projetar a resultante das forças nos eixos e verificar se o referencial é inercial.
- **Trabalho e energia:** Aplicar conservação apenas quando as condições forem válidas e contabilizar trabalho não conservativo.
- **Quantidade de movimento:** Definir sistema e forças externas; distinguir colisões elásticas e inelásticas.
- **Movimento circular:** Separar aceleração centrípeta de uma suposta força centrífuga em referencial inercial.
- **Problemas de eletrostática:** Identificar simetria antes de escolher integração direta ou lei de Gauss.
- **Conservação de unidades:** Conferir dimensão de cada parcela antes da substituição numérica.
- **Diagnóstico de erros:** Analisar sinal, condições iniciais, limites e plausibilidade do resultado.
- **Redação da solução:** Apresentar hipótese, equação, derivação, unidades e interpretação final.

### Laboratório de Cálculo e Equações Diferenciais

**Identificador:** `calculo` · **Rota:** `#calculo` · **Calculadora associada:** `harmonic`

Das equações diferenciais às soluções que descrevem sistemas dinâmicos reais.

- **Derivadas e taxas:** Velocidade é dx/dt e aceleração d²x/dt²; a interpretação depende do referencial e da variável independente.
- **Integrais físicas:** Relacionar deslocamento à integral de velocidade e trabalho à integral de força ao longo da trajetória.
- **Equações separáveis:** Resolver dN/dt = −λN por separação e explicitar a condição inicial.
- **Equações lineares de primeira ordem:** Usar fator integrante em circuitos RC e processos de relaxação.
- **Oscilador harmônico:** Resolver x''+ω²x=0 e obter constantes das condições iniciais.
- **Equações com amortecimento:** Classificar regimes por discriminante b²−4mk da equação m x''+b x'+kx=0.
- **Problemas de contorno:** Diferenciar condições de Dirichlet e Neumann em calor e ondas.
- **Séries de Fourier:** Decompor funções periódicas e discutir convergência nos pontos de descontinuidade.
- **Transformadas de Laplace:** Tratar entradas por degrau e condições iniciais em sistemas lineares.
- **Comparação numérica:** Confrontar integração por Euler e RK4 com solução analítica e passo refinado.

### Álgebra Linear, Tensores e Operadores

**Identificador:** `algebra` · **Rota:** `#algebra` · **Calculadora associada:** `matrix`

Espaços vetoriais, modos normais e operadores matemáticos da Física.

- **Bases e coordenadas:** Representar um vetor em bases diferentes sem confundir componentes com o objeto geométrico.
- **Matrizes e transformações:** Aplicar transformações lineares e analisar determinante e invertibilidade.
- **Autovalores:** Resolver det(A−λI)=0 e interpretar modos naturais de sistemas acoplados.
- **Autovetores e normalização:** Conferir A v = λ v e construir vetores normalizados.
- **Diagonalização:** Distinguir matrizes diagonalizáveis das que exigem forma de Jordan.
- **Produto interno:** Empregar ortogonalidade, norma e projeção para analisar componentes.
- **Operadores hermitianos:** Conectar autovalores reais de observáveis a operadores autoadjuntos.
- **Comutadores:** Usar [A,B]=AB−BA e relacionar incompatibilidade de observáveis.
- **Tensores físicos:** Analisar índice, transformação e exemplos como tensor de inércia.
- **Problemas de modos normais:** Montar matriz de acoplamento de duas massas e molas e interpretar frequências.

### Campos Vetoriais e Geometria Matemática

**Identificador:** `campos` · **Rota:** `#campos` · **Calculadora associada:** `none`

Fluxo, circulação, coordenadas e geometria de campos físicos.

- **Gradiente de potencial:** O vetor gradiente aponta a direção de maior crescimento escalar; E=−∇V em eletrostática.
- **Divergente e fontes:** Relacionar ∇·E=ρ/ε₀ à densidade de carga e à forma local da lei de Gauss.
- **Rotacional e circulação:** Analisar ∇×E=0 no regime eletrostático sem generalizar a campos variáveis.
- **Integrais de linha:** Calcular trabalho como integral de F·dr ao longo de um caminho orientado.
- **Fluxo de superfície:** Diferenciar normal escolhida, elemento de área e sinal do fluxo.
- **Teorema de Gauss:** Converter fluxo na fronteira em integral volumétrica de divergência.
- **Teorema de Stokes:** Relacionar circulação na borda ao fluxo do rotacional pela superfície.
- **Coordenadas cilíndricas:** Usar fator de escala r em integrais e no elemento de volume.
- **Coordenadas esféricas:** Empregar r² senθ no elemento de volume e definir convenção angular.
- **Campos conservativos:** Conferir domínio e singularidades antes de concluir existência de potencial.

### Análise Dimensional, Unidades e Estimativas

**Identificador:** `dimensoes` · **Rota:** `#dimensoes` · **Calculadora associada:** `units`

Verifique equações, escalas, ordens de grandeza e coerência quantitativa.

- **Sistema Internacional:** Distinguir unidades básicas, derivadas e símbolos de grandezas.
- **Homogeneidade dimensional:** Em F=ma, conferir [F]=MLT⁻²; termos somados precisam ter dimensões iguais.
- **Grupos adimensionais:** Combinar grandezas para eliminar dimensões e comparar regimes físicos.
- **Algarismos significativos:** Relacionar precisão reportada à incerteza, não apenas ao número de casas decimais.
- **Estimativas de Fermi:** Decompor um fenômeno em fatores verificáveis e comunicar faixas plausíveis.
- **Escalas logarítmicas:** Comparar potências de dez em energia, comprimento e tempo.
- **Conversões energéticas:** Aplicar 1 eV = 1,602176634×10⁻¹⁹ J, distinguindo grandeza e unidade.
- **Cheque de limite físico:** Testar casos extremo, nulo e assintótico da expressão proposta.
- **Análise de erros de unidade:** Encontrar confusões de frequência angular rad/s com frequência Hz.
- **Ordem de grandeza de densidade:** Calcular ρ=m/V e verificar consistência com o material analisado.

## Laboratórios e Experimentos

### Laboratório de Mecânica Experimental

**Identificador:** `mecanica-exp` · **Rota:** `#mecanica-exp` · **Calculadora associada:** `harmonic`

Protocolos de medição e análise de experimentos clássicos de mecânica.

- **Queda livre:** Medir posições versus tempo e ajustar modelo com aceleração aproximadamente constante.
- **Pêndulo simples:** Para pequenas amplitudes, usar T≈2π√(L/g) e examinar a validade da aproximação.
- **Plano inclinado:** Relacionar força paralela à rampa a mg senθ e estimar atrito.
- **Conservação de energia:** Comparar energia potencial e cinética e discutir perdas mensuráveis.
- **Colisões lineares:** Calcular momento total antes e depois e reconhecer forças externas.
- **Atrito estático e cinético:** Observar limiar de escorregamento e analisar dependência da força normal.
- **Oscilador massa-mola:** Relacionar T=2π√(m/k) à rigidez efetiva e à massa do sistema.
- **Movimento em vídeo:** Extrair posição por quadro, calibrar escala e estimar incerteza temporal.
- **Tratamento das medidas:** Registrar repetição, incerteza instrumental e dispersão experimental.
- **Relatório de experimento:** Diferenciar dados observados, ajustes, interpretações e conclusões limitadas.

### Instrumentação Científica e Sensores

**Identificador:** `sensores` · **Rota:** `#sensores` · **Calculadora associada:** `regression`

Medições, calibração, sensibilidades e documentação de instrumentos.

- **Fichas de sensores:** Registrar grandeza, princípio de operação, faixa, resolução, alimentação e calibração.
- **Termopares:** Interpretar tensão termoelétrica diferencial e necessidade de referência de junta fria.
- **Termorresistências:** Analisar dependência resistência-temperatura e limites de linearização local.
- **Acelerômetros:** Converter sinal calibrado em aceleração e reconhecer offsets e orientação.
- **Fotodiodos:** Relacionar fotocorrente e intensidade dentro da faixa linear do detector.
- **Curva de calibração:** Ajustar y=a x+b e avaliar resíduos sem presumir comportamento linear global.
- **Resolução versus precisão:** Distinguir o menor incremento observável do erro de medida.
- **Ruído instrumental:** Caracterizar dispersão e interferência eletromagnética nas leituras.
- **Caderno metrológico:** Registrar instrumento, série, ambiente, padrão e procedimento repetível.
- **Relatório de calibração:** Comunicar coeficientes, unidades, incertezas e validade das condições de uso.

### Circuitos Elétricos e Medições

**Identificador:** `circuitos` · **Rota:** `#circuitos` · **Calculadora associada:** `ohm`

Circuitos DC e transientes com medições, modelos e gráficos.

- **Lei de Ohm:** Aplicar V=RI em elementos ôhmicos sem presumir linearidade de todo componente.
- **Associação de resistores:** Calcular resistência equivalente em série e em paralelo.
- **Divisor de tensão:** Vout=Vin R2/(R1+R2) em circuito sem carga; discutir efeito do instrumento.
- **Leis de Kirchhoff:** Aplicar conservação de carga nos nós e energia nas malhas.
- **Capacitor RC:** Carga ideal de capacitor: Vc(t)=V0(1−e^(−t/RC)).
- **Descarga RC:** Vc(t)=V0 e^(−t/RC) para circuito isolado ideal.
- **Indutor RL:** Corrente em degrau com constante de tempo L/R.
- **Ressonância RLC:** ω0=1/√(LC) no modelo ideal e resposta dependente do amortecimento.
- **Medição com osciloscópio:** Considerar aterramento, largura de banda e ponta de prova.
- **Relatório de circuito:** Comparar simulação, equação e medidas com unidades e incertezas.

### Óptica e Fotônica Experimental

**Identificador:** `optica-exp` · **Rota:** `#optica-exp` · **Calculadora associada:** `diffraction`

Óptica geométrica e ondulatória em protocolos interativos.

- **Reflexão especular:** Verificar ângulo de incidência igual ao de reflexão medidos em relação à normal.
- **Lei de Snell:** Aplicar n1 senθ1=n2 senθ2 para meios homogêneos.
- **Lentes delgadas:** Usar 1/f=1/p+1/q com convenção de sinais explícita.
- **Ampliação transversal:** Calcular m=−q/p e interpretar orientação da imagem.
- **Interferência de duas fendas:** Posições de máximos aproximadas por y≈m λL/d quando ângulos são pequenos.
- **Difração de fenda única:** Mínimos dados por a senθ=m λ, para m não nulo.
- **Polarização:** Lei de Malus: I=I0 cos²θ para luz linearmente polarizada e polarizador ideal.
- **Espectroscopia:** Relacionar linhas espectrais a transições energéticas.
- **Alinhamento óptico:** Registrar geometria, altura do eixo, distância e cuidados com fontes de luz.
- **Relatório de franjas:** Estimativa de comprimento de onda a partir do espaçamento medido e propagação de incerteza.

### Termodinâmica Experimental e Calorimetria

**Identificador:** `termo-exp` · **Rota:** `#termo-exp` · **Calculadora associada:** `heat`

Equilíbrio térmico, trocas de calor e protocolos de medida.

- **Capacidade térmica:** Distinguir C=dQ/dT de calor específico c por massa.
- **Calorimetria ideal:** Somar Q_i=mcΔT com troca líquida nula em sistema isolado.
- **Equivalente em água:** Considerar capacidade térmica do calorímetro no balanço energético.
- **Curvas de aquecimento:** Reconhecer trechos de mudança de fase versus aumento de temperatura.
- **Calor latente:** Empregar Q=mL na transição ideal a temperatura aproximadamente constante.
- **Condução estacionária:** Lei de Fourier de calor: q=−k A dT/dx.
- **Convecção:** Interpretar coeficiente efetivo de transferência de calor dependente do escoamento.
- **Expansão térmica:** ΔL≈αL0ΔT dentro do regime de coeficiente quase constante.
- **Reversibilidade:** Distinguir transformação ideal reversível de processo real dissipativo.
- **Relatório calorimétrico:** Documentar perdas ambientais, equilibration e sensibilidade dos instrumentos.

## Computação e Dados

### Estúdio de Simulações de Sistemas Físicos

**Identificador:** `simulacoes` · **Rota:** `#simulacoes` · **Calculadora associada:** `projectile`

Explore modelos, condições iniciais, gráficos e limitações de simulações.

- **Lançamento oblíquo:** Sem resistência do ar, x=v0 cosθ t e y=v0 senθ t−gt²/2.
- **Trajetória orbital:** Em gravitação newtoniana, aceleração central −GM r/r³.
- **Oscilador ideal:** Soluções senoidais para m x''+kx=0 com ω=√(k/m).
- **Oscilador amortecido:** O envelope decai exponencialmente em regime subamortecido.
- **Movimento circular uniforme:** Velocidade tangencial ωr e aceleração centrípeta ω²r.
- **Colisões unidimensionais:** Conservar momento e usar restituição e quando definida.
- **Forças centrais:** Interpretar potencial efetivo com momento angular constante.
- **Acoplamento de osciladores:** Identificar modos simétrico e antissimétrico para massas idênticas.
- **Conferência de simulações:** Reduzir passo temporal e comparar quantidades conservadas.
- **Documentação de resultados:** Registrar hipóteses, entradas, método e saída sem apresentar dados sintéticos como medidos.

### Métodos Numéricos Aplicados à Física

**Identificador:** `metodos` · **Rota:** `#metodos` · **Calculadora associada:** `harmonic`

Integração, raízes, erros, estabilidade e convergência numérica.

- **Euler explícito:** Atualização y_(n+1)=y_n+h f(t_n,y_n), com erro global em geral O(h).
- **Euler–Cromer:** Atualizar primeiro velocidade e então posição em sistemas mecânicos.
- **Runge–Kutta de quarta ordem:** Combinar quatro inclinações com pesos 1,2,2,1 para obter ordem global O(h⁴) em condições regulares.
- **Bisseção de raízes:** Exigir intervalo com troca de sinal para função contínua.
- **Newton–Raphson:** Iterar x_(n+1)=x_n−f(x_n)/f'(x_n) e discutir falhas por derivada pequena.
- **Integração trapezoidal:** Aproximar área por trapézios com erro controlado por regularidade.
- **Interpolação linear:** Aproximar grandezas entre nós sem extrapolar sem justificativa.
- **Diferenças finitas:** Aproximar derivadas por diferenças centrais com erro de truncamento.
- **Critérios de convergência:** Comparar h,h/2,h/4 com solução analítica ou referência refinada.
- **Reprodutibilidade numérica:** Guardar parâmetros, passo, precisão e versão do algoritmo.

### Processamento de Sinais e Séries Temporais

**Identificador:** `sinais` · **Rota:** `#sinais` · **Calculadora associada:** `frequency`

Amostragem, espectros, filtros e análise de sinais físicos.

- **Amostragem temporal:** Teorema de Nyquist requer frequência amostral maior que o dobro da frequência máxima representada, sob hipóteses de banda limitada.
- **Frequência e período:** f=1/T para movimento periódico simples.
- **Sinal harmônico:** x(t)=A sen(2πft+φ) e significado de amplitude, fase e frequência.
- **Aliasing:** Frequências acima de Nyquist podem aparecer artificialmente em frequências mais baixas.
- **DFT:** Decompor série finita em componentes de frequência e definir normalização adotada.
- **Janelamento:** Diminuir vazamento espectral considerando compromisso entre resolução e lóbulos.
- **Ruído branco:** Identificar densidade espectral aproximadamente plana em faixa relevante.
- **Filtragem passa-baixa:** Atenuar componentes altas, reconhecer distorções de fase.
- **Correlação temporal:** Comparar sinais deslocados e discutir causalidade versus associação.
- **Relatório espectral:** Incluir taxa de amostragem, janela, unidade, faixa de frequências e incerteza.

### Estatística, Incertezas e Tratamento de Dados

**Identificador:** `estatistica` · **Rota:** `#estatistica` · **Calculadora associada:** `regression`

Medições, estatística descritiva, regressões e propagação de incerteza.

- **Média amostral:** Calcular x̄=Σx_i/n e justificar representatividade.
- **Desvio padrão:** Usar s=√(Σ(x_i−x̄)²/(n−1)) para amostra independente.
- **Incerteza da média:** Quando apropriado, u(x̄)=s/√n, distinguindo correlação temporal.
- **Erros sistemáticos:** Identificar viés de instrumento, método e calibração.
- **Propagação de incertezas:** Usar derivadas parciais e covariâncias quando variáveis não são independentes.
- **Regressão linear:** Ajustar y=ax+b e examinar resíduos.
- **Coeficiente de determinação:** Não usar R² isoladamente como prova de adequação física.
- **Análise de outliers:** Investigar causas antes de descartar leituras discrepantes.
- **Distribuição normal:** Distinguir hipótese de normalidade e evidência observacional.
- **Relatório estatístico:** Reportar unidades, amostragem, método, intervalo e limitações da inferência.

### Computação Científica e Algoritmos Reprodutíveis

**Identificador:** `algoritmos` · **Rota:** `#algoritmos` · **Calculadora associada:** `none`

Documente execuções, parâmetros, testes e reprodutibilidade de algoritmos.

- **Definição do problema:** Traduzir sistema físico em variáveis de estado e equações.
- **Pseudocódigo científico:** Especificar inicialização, laço temporal, atualizações e saída.
- **Teste de unidade:** Verificar unidades e dimensionalidade dos dados intermediários.
- **Teste de conservação:** Monitorar energia ou momento somente quando o modelo pressupõe conservação.
- **Teste de convergência:** Diminuir o passo e verificar estabilidade dos resultados.
- **Controle de sementes:** Registrar geradores pseudoaleatórios quando houver simulação estocástica.
- **Versionamento de scripts:** Descrever mudança de algoritmo, parâmetros e saídas.
- **Metadados de experimento:** Registrar data, software, precisão, plataforma e entradas.
- **Reexecução independente:** Oferecer procedimento para reconstruir o resultado com mesmos parâmetros.
- **Caderno de implementação:** Documentar decisões numéricas, falhas e justificativas com evidência.

## Física Teórica

### Mecânica Analítica e Hamiltoniana

**Identificador:** `mecanica-analitica` · **Rota:** `#mecanica-analitica` · **Calculadora associada:** `harmonic`

Equações variacionais, fase e conservação em sistemas clássicos.

- **Coordenadas generalizadas:** Escolher graus de liberdade independentes e escrever posição em coordenadas adequadas.
- **Vínculos holonômicos:** Expressar relações entre coordenadas e reduzir graus de liberdade quando possível.
- **Lagrangiana:** Formar L=T−V para sistema conservativo adequado e identificar dependência temporal.
- **Euler–Lagrange:** Aplicar d/dt(∂L/∂q̇)−∂L/∂q=0 com forças generalizadas quando necessárias.
- **Pêndulo simples:** L=½ m l² θ̇²+mgl cosθ, com escolha consistente da referência de potencial.
- **Momento canônico:** Definir p_i=∂L/∂q̇, distinguindo do momento mecânico em campos eletromagnéticos.
- **Hamiltoniana:** H=Σ p_i q̇_i−L, discutindo quando coincide com energia mecânica.
- **Equações de Hamilton:** Evolução por q̇_i=∂H/∂p_i e ṗ_i=−∂H/∂q_i.
- **Espaço de fase:** Interpretar curvas posição-momento e regiões permitidas.
- **Simetrias e conservação:** Conectar simetrias contínuas a quantidades conservadas via teorema de Noether.

### Eletromagnetismo Avançado

**Identificador:** `eletromagnetismo` · **Rota:** `#eletromagnetismo` · **Calculadora associada:** `ohm`

Campos, potenciais, equações de Maxwell e condições de contorno.

- **Lei de Gauss elétrica:** ∮E·dA=Q_interno/ε0 e avaliação prévia da simetria.
- **Lei de Gauss magnética:** ∇·B=0 na descrição clássica sem monopolos magnéticos.
- **Lei de Faraday:** ∮E·dl=−dΦ_B/dt e sinal pela orientação definida.
- **Ampère–Maxwell:** ∇×B=μ0 J+μ0ε0 ∂E/∂t em vácuo.
- **Potenciais eletromagnéticos:** B=∇×A e E=−∇V−∂A/∂t.
- **Condições de contorno:** Continuidade de E tangencial em eletrostática e salto de D normal por carga superficial.
- **Equação de onda:** Derivar propagação eletromagnética a velocidade c em vácuo.
- **Energia de campos:** Densidade u=½(ε0E²+B²/μ0).
- **Vetor de Poynting:** Fluxo energético S=E×B/μ0 em vácuo.
- **Radiação dipolar:** Discutir campos distantes e regime de aproximação dipolar.

### Mecânica Quântica e Sistemas Quânticos

**Identificador:** `quantica` · **Rota:** `#quantica` · **Calculadora associada:** `quantum`

Estados, operadores e modelos quânticos com interpretações criteriosas.

- **Normalização da função de onda:** A integral do módulo quadrado da função de onda no espaço é igual a 1 para um estado normalizável.
- **Equação de Schrödinger:** iℏ∂ψ/∂t=Ĥψ para evolução não relativística com Hamiltoniano definido.
- **Operador momento:** p̂=−iℏ∂/∂x na representação posição, considerando o domínio adequado.
- **Poço infinito:** Eₙ=n²π²ℏ²/(2mL²) com n inteiro positivo, massa m e largura L.
- **Tunelamento:** Transmissão por barreira depende da energia e do potencial, sem trajetória clássica interna.
- **Valores esperados:** O valor esperado de A é ⟨ψ,Âψ⟩ para estado normalizado e operador apropriado.
- **Comutadores:** [x̂,p̂]=iℏ e implicações físicas para as relações de incerteza.
- **Spin de partícula:** Duas componentes de spin 1/2 e medição projetiva idealizada.
- **Oscilador quântico:** Eₙ=ℏω(n+½), níveis igualmente espaçados em potencial quadrático.
- **Limites clássicos:** Analisar aproximações, decoerência e o papel de grandes números quânticos.

### Relatividade e Espaço-Tempo

**Identificador:** `relatividade` · **Rota:** `#relatividade` · **Calculadora associada:** `relativity`

Intervalos, transformações de Lorentz e fundamentos da gravitação.

- **Postulados da relatividade especial:** Leis físicas iguais em referenciais inerciais e c constante no vácuo.
- **Transformações de Lorentz:** t'=γ(t−vx/c²) e x'=γ(x−vt) ao longo do movimento.
- **Dilatação temporal:** Δt=γ Δτ para relógio próprio em movimento relativo.
- **Contração de comprimento:** L=L0/γ para medida simultânea em referencial apropriado.
- **Intervalo invariante:** s²=c²Δt²−Δx²−Δy²−Δz² com assinatura escolhida.
- **Simultaneidade:** Eventos simultâneos em um referencial podem não sê-lo em outro.
- **Energia relativística:** E²=(pc)²+(mc²)² e energia de repouso mc².
- **Quadrivetores:** Tratar tempo e espaço em objeto geométrico que se transforma por Lorentz.
- **Princípio de equivalência:** Distinguir equivalência local de aceleração e gravidade de afirmação global.
- **Curvatura do espaço-tempo:** Interpretar geodésicas e limites da descrição newtoniana.

### Física Estatística e Sistemas Complexos

**Identificador:** `estatistica-fisica` · **Rota:** `#estatistica-fisica` · **Calculadora associada:** `boltzmann`

Microestados, funções de partição, distribuições e fases.

- **Microestado versus macroestado:** Diferentes configurações microscópicas podem compartilhar grandezas macroscópicas.
- **Entropia de Boltzmann:** S=k_B lnΩ em sistema com microestados equiprováveis.
- **Ensemble canônico:** Probabilidade p_i=e^(−βE_i)/Z para temperatura definida.
- **Função de partição:** Z=Σ_i e^(−βE_i) e conexão às grandezas termodinâmicas.
- **Distribuição Maxwell–Boltzmann:** Examinar domínio clássico diluído e ausência de degenerescência quântica.
- **Distribuição de Fermi–Dirac:** Ocupação média com exclusão de Pauli para férmions.
- **Distribuição de Bose–Einstein:** Ocupação de estados de bósons e efeitos de degenerescência.
- **Capacidade térmica:** C_V=(∂U/∂T)_V relacionando energia média e flutuações.
- **Transições de fase:** Identificar parâmetro de ordem e comportamento não analítico no limite termodinâmico.
- **Modelo de Ising:** Discutir spins interagentes, campo externo e comportamento coletivo.

## Fronteiras e Especializações

### Astrofísica e Observações Astronômicas

**Identificador:** `astrofisica` · **Rota:** `#astrofisica` · **Calculadora associada:** `astro`

Grandezas e observáveis para estudo de estrelas e órbitas.

- **Magnitude e fluxo:** Diferenças de magnitude obedecem Δm=−2,5 log10(F2/F1).
- **Paralaxe estelar:** Distância em parsec d≈1/p em segundos de arco no regime geométrico usual.
- **Luminosidade estelar:** L=4πR²σT_eff⁴ para emissor com temperatura efetiva.
- **Lei de Wien:** λmax T≈2,898×10⁻³ m K para corpo negro ideal.
- **Diagrama HR:** Comparar luminosidade, temperatura e tipos estelares.
- **Espectros de absorção:** Identificar linhas atômicas e limitações de inferência de composição.
- **Lei de Kepler:** P²=4π²a³/[G(M+m)] no problema de dois corpos ideal.
- **Velocidade radial:** Interpretar deslocamento Doppler dentro do regime apropriado.
- **Evolução estelar:** Relacionar massa inicial às fases evolutivas, sem trajetória universal única.
- **Roteiro observacional:** Registrar instrumento, condições atmosféricas, banda e incertezas.

### Cosmologia e Evolução do Universo

**Identificador:** `cosmologia` · **Rota:** `#cosmologia` · **Calculadora associada:** `hubble`

Redshift, expansão e evidências dos modelos cosmológicos.

- **Lei de Hubble–Lemaître:** Para distâncias suficientemente pequenas no regime local, v≈H0d.
- **Redshift cosmológico:** 1+z=a(t0)/a(te) no contexto FLRW.
- **Fator de escala:** Relacionar expansão à separação de observadores comóveis.
- **Parâmetro de Hubble:** H(t)=ȧ/a e diferença entre H(t) e H0.
- **Radiação cósmica de fundo:** Espectro quase de corpo negro e anisotropias observadas.
- **Nucleossíntese primordial:** Relacionar condições iniciais e abundâncias leves.
- **Matéria escura:** Avaliar evidências gravitacionais sem afirmar identificação microscópica.
- **Energia escura:** Distinguir parâmetro fenomenológico e interpretação física.
- **Distâncias cosmológicas:** Comparar distância comóvel, angular e luminosidade.
- **Limites do modelo:** Descrever pressupostos de homogeneidade e isotropia em grandes escalas.

### Física de Partículas e Interações Fundamentais

**Identificador:** `particulas` · **Rota:** `#particulas` · **Calculadora associada:** `relativity`

Partículas elementares, simetrias e conservação em processos.

- **Férmions elementares:** Separar quarks e léptons por carga, cor e interações.
- **Bósons de calibre:** Fóton, glúons e W/Z mediam interações no Modelo Padrão.
- **Conservação de carga:** Conferir carga elétrica antes e depois de uma reação.
- **Léptons e neutrinos:** Distinguir sabores, massas e oscilação de neutrinos.
- **Hádrons:** Mésons quark-antiquark e bárions de três quarks na classificação simples.
- **Energia no centro de massa:** Usar invariantes para descrever colisões relativísticas.
- **Produção de pares:** Respeitar energia-momento e condições do ambiente de interação.
- **Diagramas de Feynman:** Ler como termos de expansão perturbativa, não trajetórias literais.
- **Quebra de simetria eletrofraca:** Relacionar campo de Higgs a massas de partículas acopladas.
- **Limites do Modelo Padrão:** Registrar perguntas abertas sobre neutrinos, matéria escura e gravitação.

### Física Nuclear e Radiações

**Identificador:** `nuclear` · **Rota:** `#nuclear` · **Calculadora associada:** `decay`

Estrutura nuclear, decaimento, meia-vida e conceitos de dosimetria.

- **Núclidos e isótopos:** Identificar Z, A e N=A−Z e estabilidade relativa.
- **Energia de ligação:** Conectar defeito de massa a E=Δmc² com massas coerentes.
- **Decaimento exponencial:** N(t)=N0e^(−λt) para população homogênea sem reposição.
- **Meia-vida:** t_1/2=ln2/λ para decaimento exponencial simples.
- **Atividade:** A=λN expressa em becquerel no SI.
- **Decaimento alfa:** A diminui quatro unidades e Z diminui duas.
- **Decaimento beta menos:** Nêutron converte-se em próton com emissão de elétron e antineutrino.
- **Radiação gama:** Transição de estado nuclear excitado sem mudança de Z ou A.
- **Atenuação de feixe:** I=I0e^(−μx) para feixe monoenergético em condições adequadas.
- **Radioproteção:** Tempo, distância e blindagem como princípios gerais; seguir protocolos autorizados.

### Física dos Materiais, Semicondutores e Nanotecnologia

**Identificador:** `materiais` · **Rota:** `#materiais` · **Calculadora associada:** `ohm`

Estrutura cristalina, bandas e propriedades macroscópicas.

- **Células cristalinas:** Identificar rede, base e parâmetros geométricos.
- **Planos cristalográficos:** Usar índices de Miller e espaçamentos interplanares.
- **Lei de Bragg:** 2d senθ=nλ na aproximação de difração cristalina.
- **Vibrações da rede:** Fônons como excitações coletivas quantizadas.
- **Bandas eletrônicas:** Distinguir bandas de valência e condução e lacunas proibidas.
- **Semicondutor intrínseco:** Analisar portadores termicamente gerados sem dopagem intencional.
- **Dopagem tipo n e p:** Relacionar doadores e aceitadores ao tipo majoritário de portador.
- **Efeito Hall:** Usar sinal e intensidade para inferir características dos portadores em modelos simples.
- **Propriedades térmicas:** Comparar condução por elétrons e fônons conforme material.
- **Escala nanométrica:** Confinamento quântico e alta razão área-volume modificam propriedades.

## Licenciatura e Docência

### Planejador de Aulas de Física

**Identificador:** `aulas` · **Rota:** `#aulas` · **Calculadora associada:** `none`

Planos de ensino adaptáveis, avaliação e experimentos didáticos.

- **Plano de movimento uniforme:** Explorar gráficos posição-tempo a partir de situações cotidianas.
- **Plano de forças e inércia:** Confrontar concepções alternativas com demonstrações seguras.
- **Plano de energia mecânica:** Investigar transformações e dissipação em rampas e brinquedos.
- **Plano de eletricidade:** Distinguir corrente, tensão e resistência com circuitos de baixa tensão.
- **Plano de óptica:** Modelar reflexão e refração por experimentos com fontes adequadas.
- **Plano de termologia:** Comparar sensação térmica e temperatura com evidências.
- **Objetivos verificáveis:** Definir o que o aluno deverá explicar, calcular ou produzir ao final da aula.
- **Conhecimentos prévios:** Registrar ideias iniciais antes de formalizar conceitos.
- **Estratégias de avaliação:** Construir questões conceituais e rubricas de explicação.
- **Adaptações curriculares:** Conferir BNCC, currículo local, recursos e necessidades da turma.

### Estágio Supervisionado e Regência Escolar

**Identificador:** `estagio-docente` · **Rota:** `#estagio-docente` · **Calculadora associada:** `none`

Diário de campo, planejamento, supervisão e relatórios de regência.

- **Caracterização da escola:** Registrar modalidade, recursos, horários e contexto pedagógico sem dados pessoais sensíveis.
- **Observação de aula:** Documentar objetivos, participação e estratégias, distinguindo relato e julgamento.
- **Diário de campo:** Organizar datas, decisões didáticas e evidências de aprendizagem.
- **Planejamento da regência:** Conectar objetivos, conteúdo, duração, metodologia e avaliação.
- **Sequência didática:** Planejar progressão de conceitos em diferentes encontros.
- **Gestão de tempo:** Registrar transições, atividades e tempo efetivo de participação.
- **Feedback do supervisor:** Anotar orientações e revisões pactuadas com o responsável.
- **Instrumentos de avaliação:** Comparar respostas pré e pós-atividade sem inferir causalidade automaticamente.
- **Relatório de estágio:** Redigir contexto, metodologia, evidências, reflexões e limitações.
- **Portfólio de regência:** Organizar planos, relatórios e evidências autorizadas.

### Experimentos Didáticos e Materiais de Baixo Custo

**Identificador:** `experimentos-didaticos` · **Rota:** `#experimentos-didaticos` · **Calculadora associada:** `harmonic`

Oficinas investigativas para ensino de Física com atenção à segurança.

- **Pêndulo de barbante:** Medir período de pequenas oscilações e testar efeito do comprimento.
- **Carrinho e rampa:** Investigar movimento acelerado com marcações de posição-tempo.
- **Balão e terceira lei:** Discutir ação e reação sem confundir forças no mesmo corpo.
- **Circuito com pilha:** Montar circuito simples de baixa tensão e comparar série e paralelo.
- **Lentes com água:** Discutir formação de imagens em meios transparentes.
- **Som e frequência:** Explorar vibração e altura sonora com recursos acessíveis.
- **Condução térmica:** Comparar materiais com ensaio seguro sem contato com superfícies perigosas.
- **Flutuação:** Investigar empuxo e densidade usando objetos adequados.
- **Roteiro investigativo:** Partir de hipótese, observação e explicação com evidências.
- **Segurança e adaptação:** Inspecionar risco, acessibilidade, supervisão e alternativas antes da prática.

### Avaliação da Aprendizagem em Física

**Identificador:** `avaliacao-docente` · **Rota:** `#avaliacao-docente` · **Calculadora associada:** `none`

Avaliações diagnósticas, rubricas e interpretação de concepções físicas.

- **Concepções sobre força:** Identificar confusão entre força e velocidade em movimento uniforme.
- **Diagnóstico gráfico:** Interpretar inclinação em gráfico posição-tempo e área em velocidade-tempo.
- **Questões conceituais:** Separar entendimento de fenômeno de manipulação algébrica.
- **Rubrica de argumentação:** Avaliar hipótese, evidência, justificativa e limites.
- **Avaliação prática:** Observar planejamento, medida, registro e interpretação.
- **Avaliação formativa:** Dar devolutivas específicas antes da avaliação final.
- **Autoavaliação orientada:** Confrontar objetivos propostos com evidências produzidas.
- **Questões discursivas:** Exigir explicação de mecanismo físico e não apenas fórmula.
- **Análise de erros:** Agrupar erros conceituais, matemáticos e de unidade.
- **Replanejamento didático:** Propor intervenções ligadas às dificuldades evidenciadas.

### Inclusão, Acessibilidade e Ensino de Física

**Identificador:** `inclusao` · **Rota:** `#inclusao` · **Calculadora associada:** `none`

Planejamentos acessíveis com diferentes representações de fenômenos físicos.

- **Gráficos acessíveis:** Converter descrição visual de curvas para características de subida, descida, máximos e unidades.
- **Modelos táteis:** Representar grandezas e relações espaciais sem depender exclusivamente de cor.
- **Matemática em linguagem clara:** Explicar significado físico de símbolos e cada etapa algébrica.
- **Experimentos adaptados:** Prever manipulação, observação alternativa e avaliação equivalentes.
- **Textos com hierarquia:** Escrever instruções objetivas com sequência de ações verificáveis.
- **Áudio descrição científica:** Descrever eixos, tendências, escalas e limitações de imagens.
- **Avaliação multimodal:** Permitir diferentes formas de demonstrar competência física.
- **Contraste e legibilidade:** Conferir navegação por teclado, foco visível e diferenciação não cromática.
- **Dificuldades de aprendizagem:** Identificar barreiras pedagógicas concretas antes de escolher adaptação.
- **Plano inclusivo de aula:** Documentar objetivos comuns e estratégias flexíveis contextualizadas.

## Pesquisa e Publicação

### Gestão de Projetos Científicos e Grupos de Pesquisa

**Identificador:** `gestao-pesquisa` · **Rota:** `#gestao-pesquisa` · **Calculadora associada:** `none`

Gestão integrada de investigações, responsabilidades, dependências e entregas.

- **Portfólio de projetos:** Distinguir pergunta, responsável, recursos e resultado esperado de cada investigação.
- **Matriz de responsabilidades:** Atribuir autoria, execução, supervisão e validação a pessoas definidas.
- **Marcos científicos:** Separar entrega de protocolo, experimento, análise, manuscrito e relatório.
- **Dependência entre tarefas:** Não agendar análise antes de dados e protocolo estarem validados.
- **Kanban do laboratório:** Identificar a fazer, em andamento, validação e concluído.
- **Reuniões de grupo:** Registrar pauta, decisões, pendências e responsáveis sem atribuições fictícias.
- **Gestão de riscos:** Considerar falta de instrumento, falha de medição e atrasos de autorização.
- **Recursos de pesquisa:** Planejar equipamentos, tempo de laboratório e horas de computação.
- **Controle de decisões:** Documentar mudança de hipótese e justificativa metodológica.
- **Relatório de projeto:** Separar resultados demonstrados, limitações e próximas ações.

### Gestão de Dados Científicos e Reprodutibilidade

**Identificador:** `dados-cientificos` · **Rota:** `#dados-cientificos` · **Calculadora associada:** `none`

Ciclo de vida de dados, metadados, proveniência e princípios FAIR.

- **Plano de gestão de dados:** Definir coleta, estrutura, retenção, acesso e formas de compartilhamento.
- **Dicionário de variáveis:** Registrar unidade, tipo, intervalo válido e definição operacional.
- **Metadados de medição:** Identificar instrumento, calibração, operador autorizado e condições ambientais.
- **Dados brutos e processados:** Preservar originais imutáveis e registrar cada transformação.
- **Proveniência científica:** Rastrear origem de valores, arquivos e procedimentos.
- **Controle de qualidade:** Sinalizar ausências, leituras inválidas e correções justificadas.
- **Princípios FAIR:** Aprimorar encontrabilidade, acessibilidade, interoperabilidade e reutilização.
- **Licenças e permissões:** Verificar direitos autorais, dados sensíveis e critérios institucionais.
- **Reprodução de análise:** Documentar software, parâmetros, versão, entradas e saídas.
- **Pacote de depósito:** Preparar README, dicionário, metodologia e restrições de uso.

### Produção de Artigos e Revisão por Pares

**Identificador:** `artigos` · **Rota:** `#artigos` · **Calculadora associada:** `none`

Escrita científica, organização editorial e respostas a pareceristas.

- **Título e resumo:** Expressar sistema investigado, método, principal achado e limites em linguagem precisa.
- **Introdução científica:** Apresentar contexto, lacuna e contribuição sem exagerar novidade.
- **Métodos replicáveis:** Descrever equações, condições, procedimentos e parâmetros.
- **Resultados em figuras:** Identificar eixos, unidades, barras de incerteza e origem dos dados.
- **Discussão crítica:** Relacionar achados à literatura e explicitar limitações.
- **Citações verificadas:** Usar apenas fontes consultadas com atribuição correta.
- **Critérios de autoria:** Documentar contribuições reais e aprovações segundo políticas aplicáveis.
- **Carta ao editor:** Resumir contribuição, pertinência ao escopo e informações requeridas.
- **Pareceres recebidos:** Registrar comentário, resposta fundamentada, mudança textual e localização.
- **Versão submetida:** Conferir integridade, figuras, metadados e exigências da revista.

### Revisão Sistemática e Mapeamento da Literatura

**Identificador:** `revisao-sistematica` · **Rota:** `#revisao-sistematica` · **Calculadora associada:** `none`

Protocolos transparentes de busca, triagem, extração e síntese de estudos.

- **Pergunta da revisão:** Delimitar população ou sistema, método e desfecho conforme a área física.
- **Critérios de elegibilidade:** Determinar tipos de estudo, condições físicas e intervalos antes da triagem.
- **Estratégia de busca:** Registrar termos, sinônimos, operadores e fontes consultadas efetivamente.
- **Triagem por título e resumo:** Justificar inclusão ou exclusão de cada registro.
- **Avaliação de texto integral:** Registrar motivo específico da exclusão após leitura.
- **Extração de dados:** Obter sistema, método, parâmetros, evidências e limitações por artigo.
- **Avaliação crítica:** Verificar hipótese, adequação do método e qualidade das medidas.
- **Matriz comparativa:** Organizar diferenças entre modelos e condições experimentais.
- **Síntese narrativa:** Separar consenso, divergência e lacunas metodológicas.
- **Fluxo de seleção:** Contabilizar registros apenas a partir de triagem realmente efetuada.

### Editais, Bolsas e Financiamento Científico

**Identificador:** `editais` · **Rota:** `#editais` · **Calculadora associada:** `none`

Propostas, elegibilidade, orçamento e organização documental.

- **Identidade da proposta:** Escrever título, instituição, linha de pesquisa e responsáveis.
- **Problema e relevância:** Conectar pergunta de Física à contribuição científica plausível.
- **Objetivos e entregas:** Converter hipótese em metas com evidências verificáveis.
- **Metodologia viável:** Relacionar recursos disponíveis, medidas, análise e limitações.
- **Cronograma de execução:** Estimar tempo para aquisição, experimento, tratamento e escrita.
- **Orçamento justificado:** Diferenciar itens de custeio, capital e contrapartidas conforme edital.
- **Plano de contingência:** Definir alternativas para indisponibilidade de equipamento e dados.
- **Documentos de candidatura:** Organizar currículo, cartas e declarações exigidas oficialmente.
- **Conformidade institucional:** Conferir elegibilidade e prazo na publicação oficial do edital.
- **Relatório de atividades:** Documentar entregas reais, despesas autorizadas e divergências.

## Pós-Graduação

### Meu Mestrado em Física

**Identificador:** `mestrado` · **Rota:** `#mestrado` · **Calculadora associada:** `none`

Disciplinas, qualificação, dissertação e defesa acompanhadas em um só espaço.

- **Plano individual de formação:** Relacionar disciplinas, créditos e competências ao projeto de mestrado.
- **Proposta de dissertação:** Delimitar pergunta, método, viabilidade e originalidade proporcional.
- **Seminários de pós-graduação:** Planejar apresentação de modelo, método e resultados preliminares.
- **Diário de orientação:** Registrar perguntas, decisões e revisão de entregas.
- **Levantamento bibliográfico:** Consolidar autores, hipóteses e lacunas relevantes.
- **Desenvolvimento experimental:** Planejar execução, análise e validação das medidas.
- **Escrita dos capítulos:** Estruturar introdução, revisão, metodologia, resultados e conclusões.
- **Requisitos institucionais:** Conferir regimento, créditos e datas sem presumir regras universais.
- **Preparação da defesa:** Ensaiar argumento, limitações e perguntas técnicas.
- **Versão final da dissertação:** Auditar citações, figuras, autorizações e depósito institucional.

### Meu Doutorado e Desenvolvimento da Tese

**Identificador:** `doutorado` · **Rota:** `#doutorado` · **Calculadora associada:** `none`

Projetos de longo prazo, contribuições originais, qualificação e defesa.

- **Mapa de contribuição original:** Distinguir avanço científico verificável de aplicação rotineira.
- **Projeto de tese:** Desdobrar pergunta central em hipóteses e pacotes de trabalho.
- **Plano plurianual:** Planejar marcos, dependências, contingências e avaliações periódicas.
- **Exame de qualificação:** Organizar estado da arte, método, dados parciais e riscos.
- **Experimentos centrais:** Definir parâmetros, controles, análise e critérios de robustez.
- **Contribuições para artigos:** Separar resultados publicáveis e obrigações de autoria.
- **Gestão de colaboração:** Documentar participação de orientador, coautores e laboratórios.
- **Escrita da tese:** Garantir coerência entre capítulos e respostas ao problema central.
- **Defesa e objeções:** Treinar justificativas metodológicas, incertezas e limitações.
- **Depósito e continuidade:** Conferir correções, formatos oficiais e reprodutibilidade dos resultados.

### Meu Pós-Doutorado em Física

**Identificador:** `posdoc` · **Rota:** `#posdoc` · **Calculadora associada:** `none`

Pesquisa independente, colaboração, liderança e comunicação científica.

- **Plano de trabalho:** Formular objetivos mensuráveis, entregas e viabilidade do período.
- **Autonomia científica:** Identificar linha própria e contribuição distinta dos projetos anteriores.
- **Colaborações externas:** Registrar responsabilidades, dados e regras de autoria.
- **Laboratório e infraestrutura:** Planejar acesso, insumos, capacidade e uso seguro.
- **Produção científica:** Organizar manuscritos, dados, apresentações e resultados disponíveis.
- **Mentoria de pesquisadores:** Registrar supervisão autorizada e plano de desenvolvimento.
- **Propostas de financiamento:** Organizar objetivos, orçamento e requisitos do programa.
- **Comunicação de resultados:** Adaptar mensagens para congresso, equipe e sociedade.
- **Relatório institucional:** Vincular cada entrega à evidência verificável e ao plano aprovado.
- **Próximo ciclo profissional:** Planejar candidaturas e continuidade científica sem garantias fictícias.

### Docência no Ensino Superior e Orientação Acadêmica

**Identificador:** `docencia-superior` · **Rota:** `#docencia-superior` · **Calculadora associada:** `none`

Planos de ensino, avaliações, seminários e acompanhamento universitário.

- **Plano de disciplina:** Explicitar ementa, pré-requisitos, objetivos, metodologias e avaliação.
- **Aula universitária de mecânica:** Ligar derivação lagrangiana a modelos resolvidos e aplicações.
- **Aula de eletromagnetismo:** Organizar simetria, formalismo matemático e experimentos de demonstração.
- **Seminário científico:** Definir questão, evidência central, tempo e rubrica de avaliação.
- **Listas de exercícios:** Balancear derivação, interpretação conceitual e aplicação numérica.
- **Rubrica acadêmica:** Avaliar raciocínio, hipóteses, unidades e clareza da justificativa.
- **Agenda de orientação:** Registrar metas, entregas e dúvidas documentadas.
- **Feedback formativo:** Indicar trecho específico, fundamento da crítica e ação sugerida.
- **Acessibilidade universitária:** Disponibilizar alternativas de representação de figuras e equações.
- **Portfólio docente:** Consolidar planos, atividades e reflexão baseada em evidência.

### Internacionalização e Colaborações Científicas

**Identificador:** `internacionalizacao` · **Rota:** `#internacionalizacao` · **Calculadora associada:** `none`

Projetos compartilhados, candidaturas e apresentações internacionais.

- **Mapa de laboratórios:** Comparar áreas de pesquisa, métodos e recursos de grupos com aderência ao projeto.
- **Proposta de visita científica:** Explicar questão, colaboração pretendida e resultados compartilháveis.
- **Carta de motivação:** Relacionar experiência real aos objetivos do programa.
- **Plano de doutorado-sanduíche:** Definir atividades, supervisão, infraestrutura e entregas.
- **Resumo científico em inglês:** Apresentar problema, método, resultado e limites sem ambiguidade.
- **Apresentação em congresso:** Adaptar tempo, terminologia, legenda e acessibilidade dos slides.
- **Colaboração em dados:** Definir atribuições, acordos e restrições de compartilhamento.
- **Cronograma documental:** Controlar tradução, comprovação, aceite e datas oficiais.
- **Etiqueta acadêmica:** Preparar contato profissional claro com instituições e orientadores.
- **Relatório de mobilidade:** Diferenciar atividades planejadas de resultados efetivamente produzidos.

## Estágio e Carreira

### Estágio Técnico-Científico e Experiência Profissional

**Identificador:** `estagio-tecnico` · **Rota:** `#estagio-tecnico` · **Calculadora associada:** `none`

Rotinas, evidências, supervisão e competências em ambientes técnico-científicos.

- **Plano de estágio:** Definir atividades e competências conforme termo e supervisão oficial.
- **Ambientação em laboratório:** Registrar protocolos de segurança, treinamento e autorizações.
- **Rotina de instrumentos:** Documentar operação supervisionada e limites de responsabilidade.
- **Diário de atividade:** Anotar data, problema, procedimento e resultados observados.
- **Tratamento de dados:** Verificar unidades, rastreabilidade, qualidade e versões.
- **Reuniões de supervisão:** Registrar feedback, decisões e tarefas acordadas.
- **Competências técnicas:** Relacionar metodologias e equipamentos ao aprendizado.
- **Relatório periódico:** Descrever progresso e obstáculos com evidência.
- **Ética profissional:** Respeitar confidencialidade, segurança e atribuição de autoria.
- **Relatório final:** Consolidar objetivos, trabalho realizado, competências e reflexões.

### Pesquisa e Desenvolvimento Industrial

**Identificador:** `ped-industrial` · **Rota:** `#ped-industrial` · **Calculadora associada:** `none`

Projetos de protótipos, requisitos e ensaios de validação.

- **Definição do problema industrial:** Quantificar necessidade, contexto e restrições.
- **Requisitos técnicos:** Escrever parâmetros mensuráveis de desempenho e segurança.
- **Revisão de soluções:** Comparar alternativas e limitações de implementação.
- **Projeto de protótipo:** Documentar configuração, materiais e princípios físicos.
- **Plano de ensaios:** Definir variável, condição, instrumento, critério de aceitação e registro.
- **Análise de falhas:** Identificar modo de falha, gravidade, ocorrência e mitigação.
- **Avaliação de custos:** Registrar materiais, tempo, manutenção e incerteza da estimativa.
- **Controle de revisões:** Ligar mudança de projeto à evidência do ensaio.
- **Relatório técnico:** Separar resultado de medição, cálculo e extrapolação.
- **Transferência tecnológica:** Organizar documentação, direitos e validação institucional.

### Metrologia, Qualidade e Calibração

**Identificador:** `metrologia` · **Rota:** `#metrologia` · **Calculadora associada:** `regression`

Rastreabilidade, certificados didáticos, ajuste e controle de medições.

- **Rastreabilidade metrológica:** Documentar cadeia de calibrações com incertezas declaradas.
- **Grandeza e unidade:** Usar definições do SI coerentes com o mensurando.
- **Curva de calibração:** Relacionar indicação instrumental ao padrão de referência.
- **Correção e erro de indicação:** Correção pode ser definida como valor de referência menos indicação.
- **Repetibilidade:** Avaliar dispersão nas mesmas condições operacionais definidas.
- **Reprodutibilidade:** Comparar resultados sob mudanças de condição especificadas.
- **Incerteza combinada:** Aplicar covariâncias e sensibilidades conforme o modelo de medição.
- **Tolerância versus incerteza:** Distinguir limite de especificação de intervalo de incerteza.
- **Registro de não conformidade:** Descrever requisito, evidência e ação corretiva sem juízo presumido.
- **Certificado didático:** Incluir identificação, procedimento, padrão, resultados, incertezas e ressalvas.

### Portfólio, Currículo Lattes e Carreira Científica

**Identificador:** `portfolio` · **Rota:** `#portfolio` · **Calculadora associada:** `none`

Projetos, produções, competências e apresentação profissional.

- **Identidade profissional:** Escrever áreas de competência e formação efetivamente cursada.
- **Currículo acadêmico:** Organizar graus, bolsas, publicações e participações verificáveis.
- **Projeto destacado:** Apresentar pergunta, método, contribuição individual e evidência.
- **Portfólio experimental:** Mostrar relatório, protocolo e análise com permissões adequadas.
- **Portfólio computacional:** Descrever algoritmo, entradas, resultados e testes de convergência.
- **Publicações e resumos:** Conferir autoria, status editorial e referência correta.
- **Competências instrumentais:** Listar equipamentos operados com grau real de experiência.
- **Apresentação pessoal:** Adaptar narrativa a seleção acadêmica ou vaga técnica.
- **Planejamento de carreira:** Mapear oportunidades e competências a desenvolver.
- **Revisão do portfólio:** Verificar atualidade, acessibilidade, rastreabilidade e confidencialidade.

### Seleções Acadêmicas, Concursos e Oportunidades

**Identificador:** `selecoes` · **Rota:** `#selecoes` · **Calculadora associada:** `none`

Preparação de provas, projetos, entrevistas e documentação.

- **Diagnóstico de edital:** Identificar critérios e bibliografia diretamente no documento oficial.
- **Programa de Física:** Organizar mecânica, eletromagnetismo, termodinâmica e quântica.
- **Resolução escrita:** Treinar dedução, hipóteses, unidades e interpretação final.
- **Prova didática:** Preparar objetivo, contextualização, desenvolvimento e avaliação.
- **Projeto de pesquisa:** Defender pergunta, originalidade, métodos e viabilidade.
- **Entrevista técnica:** Responder sobre limitações e escolhas metodológicas com evidência.
- **Plano de estudos:** Atribuir tempo conforme dificuldade, importância e data de avaliação.
- **Documentos de inscrição:** Conferir comprovações, declarações e formatos exigidos.
- **Simulado de banca:** Treinar perguntas de conteúdo e justificativas científicas.
- **Acompanhamento de candidaturas:** Registrar inscrição, etapas confirmadas, resultados e recursos possíveis.

