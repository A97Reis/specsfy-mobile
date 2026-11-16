---
name: specsfy-specialist-interface-experience
description: "Analisar o aplicativo móvel atual e orientar a descoberta, o plano e a entrega de interfaces mobile completas, fluidas e compatíveis com a stack existente (Android, iOS, Flutter, React Native, Ionic, CMP)."
---

# Experiência de interface mobile

## Quando usar

- Acionar ao criar ou alterar tela, fluxo de abas (`BottomNavigation`/`TabView`), lista com `Pull-to-Refresh`, detalhe, `ModalBottomSheet`, formulário ou jornada mobile usada por pessoas.
- Acionar antes de UX, UI e implementação para entender o aplicativo existente e organizar a conversa sobre a interface móvel.
- Não usar para lógica puramente interna, migrations silenciosas ou workers em segundo plano sem superfície para pessoas.

## Fluxo

1. Carregar `$specsfy-setup` e ler `.specsfy/STACK.md`, `.specsfy/PACKAGES.md`, manifests mobile (`build.gradle.kts`, `Info.plist`, `pubspec.yaml`, `package.json`, `capacitor.config.ts`), instruções locais e documentação atual. Carregar `$specsfy-specialist-design-system` e ler `DESIGNSYSTEM.MD` antes de propor qualquer tela. Se o arquivo não existir, criar a fonte a partir de `.specsfy/templates/DESIGNSYSTEM.MD`. Executar `node .agents/skills/specsfy-setup/scripts/inspect_interface.mjs --project <raiz>` para localizar rotas, telas e componentes antes da leitura detalhada.
2. Examinar as telas, pilhas de navegação, componentes, permissões de SO, estados offline/online e testes ligados à área afetada. Registrar o que a pessoa já consegue fazer, o que deve permanecer e o que a entrega muda.
3. Identificar o framework mobile (`Jetpack Compose`, `SwiftUI`, `Flutter`, `React Native/Expo`, `Ionic/Capacitor`, `Compose Multiplatform`), o navegador de rotas e o runner de testes usados pelo projeto. Seguir essas fontes sem trocar tecnologia sem confirmação da pessoa.
4. Aplicar o contrato central de perguntas numeradas (`ask_question`) somente para lacunas reais: perguntar uma lacuna por rodada sobre telas, fluxo de navegação, campos de formulário, teclados e formato de apresentação (tela empilhada, aba raiz ou `ModalBottomSheet`). Quando a pessoa não informar direção visual, aplicar os defaults mobile de `DESIGNSYSTEM.MD`.
5. Registrar na seção 10 da spec a stack observada, cada tela, o fluxo de navegação (`TopAppBar`, `BottomNavigation`), os formulários mobile (coluna única, `KeyboardType`, `ImeAction`), os estados (`Loading/Shimmer`, `Empty`, `Success`, `Error`, `Offline`) e a acessibilidade (`TalkBack`/`VoiceOver`, `SafeArea`/`WindowInsets`). Para superfícies CRUD mobile, mapear lista reciclada (`LazyColumn`/`FlatList`/`ListView.builder`) com `Pull-to-Refresh`, busca/filtros em chips ou `BottomSheet`, card clicável abrindo o detalhe, e formulário de criação/edição com validação inline.
6. Criar na seção 14 a `Fase de interface`, com uma tarefa por tela e testes para navegação, formulário, validações, estados de carregamento/erro e acessibilidade.
7. Chamar `$specsfy-specialist-ux-design` para jornada e `$specsfy-specialist-ui-design` para composição visual, combinados com o especialista da plataforma detectada (`$specsfy-specialist-android`, `$specsfy-specialist-ios`, `$specsfy-specialist-flutter`, `$specsfy-specialist-react-native`, `$specsfy-specialist-ionic` ou `$specsfy-specialist-cmp`).

## Padrões

- Mapear cada tela, gesto, ação, formulário, estado e transição de navegação no plano.
- Preservar a stack mobile, os componentes e os padrões de navegação (`BottomNavigationBar`, `NavigationStack`, `TopAppBar`) já observados.
- Registrar tipo de teclado (`KeyboardType`), ação do teclado (`ImeAction`/`ReturnKeyType`), `SafeArea`/`WindowInsets` e mensagens junto da tela afetada.
- Aplicar `DESIGNSYSTEM.MD` como fonte macro e `INTERFACE.md` como catálogo vivo das telas e fluxos do app.
- Usar listas recicladas com `Pull-to-Refresh` e `Empty State` acionável nas superfícies de coleção, evitando tabelas `DataGrid` ou paginação numérica de desktop.
- Conferir espaçamentos, áreas seguras, alvos de toque (`48dp`/`44pt`), contraste Light/Dark e tipografia durante o desenvolvimento e registrar o resultado no item `VISUAL` da tarefa.

## Antipadrões

- Propor uma tela mobile sem ler o grafo de navegação e os componentes atuais do aplicativo.
- Reproduzir padrões web desktop (tabelas multi-colunas, breadcrumbs no topo, modais com formulários longos) em telas móveis.
- Validar somente o estado feliz conectado e ignorar `Loading`, `Empty`, `Error`, `Offline` ou permissão negada pelo sistema operacional.

## Validação

- Confirmar que a pessoa recebeu pergunta sobre as telas em toda entrega que cria ou altera uma interface.
- Conferir que a seção 10 registra a stack mobile e o sistema atual antes da proposta.
- Confirmar que `DESIGNSYSTEM.MD` e `INTERFACE.md` foram lidos e atualizados.
- Executar `validate_spec.mjs`, `validate_tasks.mjs` e `validate_interface_tasks.mjs` conforme a etapa.
- Verificar nos temas Claro e Escuro os estados `Loading`, `Empty`, `Error`, `Success`, `Offline`, permissões, teclado virtual e leitores de tela antes de concluir a interface.

## Skills relacionadas

- `$specsfy-specialist-ux-design` para jornada, tarefas, ergonomia de polegar e conteúdo.
- `$specsfy-specialist-ui-design` para composição visual, hierarquia, tokens e estados.
- `$specsfy-specialist-design-system` para regras macro mobile (Material 3 e Apple HIG) em `DESIGNSYSTEM.MD`.
- `$specsfy-specialist-mobile-accessibility` para TalkBack, VoiceOver, Dynamic Type e alvos de toque.
- `$specsfy-specialist-android`, `$specsfy-specialist-ios`, `$specsfy-specialist-flutter`, `$specsfy-specialist-react-native`, `$specsfy-specialist-ionic` e `$specsfy-specialist-cmp` para implementação nativa na plataforma.

Leia [references/standards.md](references/standards.md) para fontes de acessibilidade e inspeção de interfaces.
