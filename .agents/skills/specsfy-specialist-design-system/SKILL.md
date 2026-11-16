---
name: specsfy-specialist-design-system
description: "Definir, evoluir e auditar o Design System Mobile do projeto em `DESIGNSYSTEM.MD`, alinhado ao Material Design 3 (Android) e Apple Human Interface Guidelines (iOS). Use para tokens de cor/tipografia, listas com Pull-to-Refresh, formulários mobile, Safe Area/WindowInsets e estados de tela (`Loading`, `Empty`, `Error`, `Offline`)."
---

# Design System Mobile

## Quando usar

- Acionar ao inicializar, atualizar ou auditar `DESIGNSYSTEM.MD` e `INTERFACE.md` em projetos móveis (Android, iOS, Flutter, React Native, Ionic, KMP/CMP).
- Acionar também ao desenhar ou revisar fluxos de listagem, busca, filtros em Bottom Sheet, detalhes e formulários para garantir que nenhuma convenção de desktop/web (como tabelas densas ou breadcrumbs) vaze para a interface mobile.
- Combinar com `$specsfy-specialist-ui-design` para composição visual de telas, `$specsfy-specialist-ux-design` para jornadas e `$specsfy-specialist-mobile-accessibility` para contraste, Dynamic Type e alvos de toque.

## Fluxo

1. Ler `DESIGNSYSTEM.MD` e `INTERFACE.md` na raiz do projeto consumidor para identificar os tokens visuais, componentes padronizados e regras de navegação já estabelecidas.
2. Mapear a estrutura global de navegação móvel: `BottomNavigationBar` / `TabView` (3 a 5 destinos principais na raiz), `TopAppBar` / `NavigationBar` contextual e `ModalBottomSheet` para ações secundárias e filtros.
3. Definir tokens semânticos de cor (com suporte obrigatório a Light Mode e Dark Mode), escala tipográfica responsiva (`sp` / Dynamic Type) e espaçamento baseado em grid de `4dp`/`8dp`.
4. Padronizar superfícies de coleção (CRUD mobile): listas verticais recicladas (`LazyColumn`, `ListView.builder`, `FlashList`), gesto de `Pull-to-Refresh`, busca integrada e estados visuais explícitos (`Shimmer/Skeleton`, `Empty State` com CTA, `Error` com retry e banner `Offline`).
5. Padronizar formulários para polegar e teclado virtual: coluna única vertical, labels permanentes acima do campo, `KeyboardType` e `ImeAction`/`ReturnKeyType` (`Next`, `Done`, `Search`) configurados em cada input.
6. Registrar qualquer novo componente reutilizável em `DESIGNSYSTEM.MD` e `INTERFACE.md` antes ou durante a entrega da fatia.

## Padrões

- Respeitar `SafeArea` / `WindowInsets` em 100% das telas para que cabeçalhos e botões de ação inferiores nunca colidam com a Dynamic Island, Notch, barra de status ou barra de gestos do sistema.
- Substituir tabelas multi-colunas (`DataGrid`) por **Cards ou List Items** contendo hierarquia clara (título primário, metadado secundário, badge de status e ação rápida ou swipe action).
- Garantir alvo de toque mínimo de `48x48 dp` (Android) e `44x44 pt` (iOS) com espaçamento mínimo de `8dp` entre controles adjacentes.
- Posicionar ações primárias na zona de alcance natural do polegar (parte inferior da tela ou `FloatingActionButton` / barra inferior fixa acima do teclado).

## Antipadrões

- Transpor padrões web desktop para aplicativos móveis: tabelas com rolagem horizontal, paginação numérica (`1, 2, 3...`), breadcrumbs no topo, modais com formulários extensos ou tooltips que dependem de `hover` de mouse.
- Usar cores hexadecimais literais espalhadas nas telas em vez de tokens semânticos (`surface`, `onSurface`, `primary`, `error`), quebrando o Dark Mode.
- Exibir apenas um spinner bloqueante em tela branca sem preservar a estrutura da página ou sem oferecer botão de nova tentativa quando a rede falha.

## Validação

- Conferir se todas as telas especificadas ou implementadas seguem os tokens e padrões declarados em `DESIGNSYSTEM.MD` e estão registradas em `INTERFACE.md`.
- Verificar visualmente (via `compose-preview`, simulador ou dispositivo) os 5 estados obrigatórios de cada tela de dados (`Loading`, `Empty`, `Success`, `Error`, `Offline`) nos temas Claro e Escuro.
- Não aprovar revisão visual (`VISUAL`) se houver sobreposição de Safe Area, ausência de Pull-to-Refresh em listas dinâmicas ou teclado cobrindo campos de formulário.

## Skills relacionadas

- `$specsfy-specialist-ui-design` para hierarquia visual, densidade e acabamento de telas específicas.
- `$specsfy-specialist-ux-design` para arquitetura da informação, fluxos de onboarding e recuperação de erros.
- `$specsfy-specialist-interface-experience` para descoberta e evolução da experiência completa do aplicativo.
- `$specsfy-specialist-mobile-accessibility` para conformidade com TalkBack, VoiceOver, contraste e escala de fonte.
- `$specsfy-specialist-android`, `$specsfy-specialist-ios`, `$specsfy-specialist-flutter`, `$specsfy-specialist-react-native`, `$specsfy-specialist-ionic` e `$specsfy-specialist-cmp` para implementação nativa dos tokens.

Leia [references/standards.md](references/standards.md) para a matriz de substituição Web vs Mobile, anatomia de tokens e fontes oficiais do Material Design 3 e Apple HIG.
