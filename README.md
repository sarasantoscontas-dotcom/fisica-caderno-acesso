# Caderno do Estudante de Física

**Produto web interativo para estudantes universitários de Física** — primeira entrega com os três módulos principais funcionando, pronto para ser ampliado.

## Identidade visual

Inspirada na arquitetura editorial do Caderno do Estudante de Terapia Ocupacional: tela de login criativa, home com banners, capas de módulos, cartões, papel quadriculado/pontilhado, post-its e barra de navegação. O universo visual de Física é próprio, com **azul-claro predominante**, turquesa, lavanda, verde-menta, amarelo e coral, além de elementos como **φ, λ, ∇, ∑, ∮, ℏ, órbitas e fórmulas científicas**.

Dois arquivos de estilo:
- `physics-design.css`: design completo, login, home, 3 módulos e seus componentes.
- `physics-responsive.css`: telas de desktop, tablet e celular; legibilidade, foco visível, controles de toque, animações reduzidas e impressão.

## Primeiro acesso por e-mail

`app.js` mostra tela positiva e simplificada com campo **E-mail utilizado na compra** e botão **Entrar no meu caderno**. O primeiro texto de e-mail não vazio é associado localmente ao acesso; a pessoa pode retornar usando o mesmo e-mail e sair sem perder as anotações.

**Limite técnico importante para a gestão do produto:** trata-se de um acesso local de conveniência, **não** de autenticação segura ou validação automática da compra. Não existe backend nem comunicação com o checkout. É adequado apenas quando o objetivo é esse comportamento simples; para controle comercial de acesso real, será necessário um servidor/provedor e dados de pedidos. Isso não é apresentado na interface ao estudante.

## Módulos entregues

### 1. Resumos Prontos

- **8 períodos ilustrativos**, incluindo trilhas introdutórias e avançadas, com matérias relevantes a bacharelado e licenciatura em Física.
- **56 disciplinas**, cada uma com material autoral de fundamentos e outro de equações/aplicações: **112 leituras independentes**.
- Conteúdo específico por assunto, conceitos, formalismos, casos de aplicação, principais cuidados de interpretação e questão comentada.
- Leitura por período, favoritos, progresso individual, campo de anotações por leitura e impressão.
- A organização por período é uma sugestão editorial; conferir ementas e pré-requisitos no PPC da instituição.

### 2. Flashcards

- **56 baralhos**, um por disciplina; **168 cartões** com perguntas e respostas específicas, incluindo fundamentos, aplicações e erros de interpretação.
- Virar cartão, avançar, voltar, embaralhar e reiniciar revisão.
- Marcação de dificuldade (Ainda difícil / Em aprendizado / Já domino), memória do progresso e indicadores de cartões avaliados.
- Filtros por período, pesquisa por tema, navegação por teclado (espaço e setas fora de campos).

### 3. Referências Bibliográficas

- **35 fontes e referências iniciais**, abrangendo: livros universitários de consulta, textos abertos, cursos, bases de dados, materiais do BIPM e NIST, periódicos e software científico.
- Pesquisa por autor/título/assunto, filtros por tipo e área, favoritos, ficha de leitura individual e cópia dos dados básicos da referência.
- Inclusão e exclusão de fontes próprias com título, autoria, assunto e link HTTPS opcional.
- Links podem apontar para **catálogos de editoras**, e não necessariamente para acesso gratuito ou à obra específica. Verificar condições de acesso e edição.
- Textos de resumo e flashcards foram **redigidos de forma original** para o caderno; links para OpenStax, Feynman Lectures e demais recursos não implicam reprodução integral de seus textos ou materiais protegidos.

## Organização técnica

```text
index.html                 Página única e carregamento em ordem
favicon.svg                Ícone do universo de Física
physics-content-a.js       Períodos 1–4 e materiais de Física
physics-content-b.js       Períodos 5–8 e materiais de Física
physics-references.js      Fontes bibliográficas e seus metadados
app.js                     Login, estado editável, navegação, buscas e ações
views-home.js              Página inicial e busca geral
views-resumos.js           Resumos e anotações
views-flashcards.js        Cartões e acompanhamento
views-bibliografia.js      Biblioteca e fichamentos
physics-design.css         Design editorial colorido
physics-responsive.css     Tablet, celular e impressão
vercel.json                Configuração da publicação estática
```

O conteúdo é servido como **HTML/CSS/JavaScript estático**, sem instalação de dependências. O arquivo `index.html` está na raiz. A navegação usa fragmentos (`#home`, `#resumos`, `#periodo/1`, `#leitura/f1-1/conceito`, `#flashcards`, `#revisao/f1-1`, `#bibliografia`, `#busca`). Essa escolha funciona bem em hospedagem estática.

**Estado acadêmico:** salvo no `localStorage` sob `fisica-caderno-estudante-v1`. O login utiliza chaves separadas. Não há sincronização entre dispositivos ou conta na nuvem. A aplicação não foi projetada para dados sigilosos.

## Fontes científicas de partida

- MIT OpenCourseWare, Física e Matemática: https://ocw.mit.edu/
- OpenStax University Physics: https://openstax.org/subjects/science
- The Feynman Lectures on Physics: https://www.feynmanlectures.caltech.edu/
- BIPM — The International System of Units (SI): https://www.bipm.org/en/publications/si-brochure
- NIST Fundamental Physical Constants: https://physics.nist.gov/cuu/Constants/

## Publicação

Importar **`sarasantoscontas-dotcom/fisica-caderno-acesso`**, branch `main`, na Vercel como projeto estático. Diretório raiz: `/`, sem comando de build e sem instalação. A URL pública só será conhecida após a importação/publicação feita pela conta Vercel. Não vincular ao projeto de Terapia Ocupacional.

## Validação

Revisão estrutural realizada: scripts avaliados em ambiente JS simulado, login e retorno, 8 períodos, leitura de fundamento/aplicação, salvamento de notas, favoritos, avaliação de flashcards, inclusão de referência e filtros. Verificação de CSS e assets vinculados. **É recomendável conferir visualmente o layout e a publicação em navegador real, especialmente em diferentes celulares e tablets.**

Próximas etapas possíveis: TCC, pesquisa, Controle de Semestres, estágio/docência, laboratórios e mais módulos de Física — sempre de forma aditiva, sem apagar os três já entregues.


## Evolução do caderno: isolamento e biblioteca científica (09/10/2026)

**Regra permanente para todos os novos módulos:** cada área é um ambiente independente, com ferramentas, conteúdos, navegação interna e histórico pertencentes a ela. As rotas `#resumos`, `#periodo/...`, `#leitura/...` e `#estudo-extra/...` são de Resumos; as rotas `#flashcards`, `#revisao/...`, `#revisao-extra/...` pertencem a Flashcards; `#bibliografia` pertence exclusivamente à Bibliografia. A home é o ponto de distribuição entre módulos. A barra superior de uma área aberta apresenta apenas aquela área, e a lateral não lista módulos irmãos. Sem CTA cruzado de Resumos para Flashcards, ou vice-versa.

**Sem contadores visíveis:** home, listagens, fichas e painéis de cada módulo não exibem números totais de disciplinas, resumos, cartões, baralhos, fichas, recursos, leituras realizadas ou avaliadas. O número ordinal de **período acadêmico** continua identificado apenas por ser necessário à organização curricular. O progresso continua sendo salvo, com mensagens qualitativas e barras visuais, sem inventário numérico.

**Expansão exclusiva dos módulos:**
- `physics-extension-study.js` fornece 40 **resumos especializados**, além dos resumos já existentes, com fundamentação técnica, desenvolvimento do modelo, equações, exemplos, advertências, perguntas comentadas e fontes de consulta acadêmica. Os 80 flashcards novos são perguntas distintas vinculadas a esses assuntos.
- `views-resumos-extra.js` apresenta as novas leituras e suas páginas completas na rota `#estudo-extra/<id>`, cada qual com favoritar, marcar como estudado, imprimir e campo de notas isolado, reutilizando o estado sem apagar leituras anteriores.
- `views-flashcards-extra.js` apresenta os 80 novos cartões em baralhos temáticos exclusivamente no módulo Flashcards, com virar, revisão, navegação, marcação por dificuldade e progresso salvo separadamente.
- `physics-extension-bibliography.js` acrescenta **40 fichas de leitura bibliográfica** sobre seções específicas das coleções reais MIT OpenCourseWare 8.01SC (Mecânica), 8.04 (Quântica), 8.333 (Mecânica Estatística) e 8.311 (Eletromagnetismo). As fichas possuem orientação, pergunta crítica e espaço para conferência de citações e notas; várias fichas correspondem a capítulos diferentes de **uma mesma coleção de referência**, e não se apresentam como 40 livros distintos.
- `views-bibliografia.js` exibe as fichas guiadas junto ao acervo existente, sem alterar os registros dos estudantes.
- `physics-modules-isolated.css` adiciona identidade editorial azul, lilás, menta e papelaria científica aos novos cartões e comportamentos responsivos. O `index.html` importa tudo em ordem.

**Referências de consulta identificadas:** MIT OpenCourseWare Classical Mechanics 8.01SC: https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/pages/online-textbook/ ; Quantum Physics I 8.04: https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/pages/lecture-notes/ ; Statistical Mechanics I 8.333: https://ocw.mit.edu/courses/8-333-statistical-mechanics-i-statistical-mechanics-of-particles-fall-2013/pages/lecture-notes/ ; Electromagnetic Theory 8.311: https://ocw.mit.edu/courses/8-311-electromagnetic-theory-spring-2004/pages/calendar/ ; BIPM SI Brochure: https://www.bipm.org/en/web/guest/publications/si-brochure . Os textos são sínteses originais de estudo; não são reproduções integrais das fontes. Confirme edições, enunciados e condições de modelos nos materiais originais.

**Garantias técnicas verificadas:** simulação de carregamento dos 12 scripts; login inicial; rotas principais e rotas novas; menus e links sem cruzamento entre os três módulos; persistência de leitura, favorito e avaliação dos novos materiais; ausência de métricas numéricas nas páginas avaliadas. A renderização gráfica em um navegador físico e o comportamento de publicação dependem da versão hospedada.

**Arquitetura para expansões futuras:** novas áreas devem ter datasets próprios e `views-<modulo>.js` separados, persistir dados por chaves próprias no estado e não incluir navegação cruzada dentro de outros módulos.

## Referências Bibliográficas: onde utilizar (09/10/2026)

Atualização **restrita à Bibliografia**. A navegação permanece isolada, sem links para módulos irmãos.

- Os cartões bibliográficos mostram título, autores, tema, tipo e área, favoritos e um painel expansível intitulado **Onde utilizar**.
- **Nenhum botão abre links para sites, editoras, catálogos ou obras**. A ação **Copiar dados** também foi removida. O cadastro de referência pessoal não solicita mais URL. Links antigos armazenados anteriormente não são apagados do estado local, apenas não são exibidos.
- O arquivo `physics-bibliography-usage.js` mapeia as 35 referências gerais e as 40 fichas de leitura dirigidas a cursos do MIT para suas **disciplinas relacionadas** e **assuntos a estudar**. As 35 fontes gerais têm situações de uso específicas, e as 40 fichas possuem exemplos de seminários, relatórios e atividades de investigação derivados do assunto, roteiro e pergunta da própria ficha.
- Cada painel **Onde utilizar** apresenta (i) disciplinas relacionadas, (ii) assuntos que podem ser pesquisados, (iii) ideias para trabalhos acadêmicos e, quando disponível, (iv) orientação e pergunta de leitura. A busca da Bibliografia também indexa essas relações, permitindo pesquisar por disciplina ou aplicação.
- **Anotações e favoritos preservados**: a propriedade existente `booknotes[ref.id]` continua sendo utilizada pelo campo **Minhas observações sobre esta referência**, mantendo todos os registros do estudante. Inclusão e exclusão de obras pessoais continuam funcionando, sem link externo.
- O arquivo `physics-bibliography-usage.css` dá apresentação com cartões em tons azul-claro, lilás e verde-menta, com adaptação a celulares.

**Validação simulada:** 75 fontes exibidas e 75 painéis `Onde utilizar`; todas com disciplinas e assuntos; nenhuma ligação externa ou botão de cópia na Biblioteca; dados pessoais, notas e favoritos preservados; módulos de Resumos e Flashcards renderizando normalmente. Inspeção visual em navegador real continua recomendada.
