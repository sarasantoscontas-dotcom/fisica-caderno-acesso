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
