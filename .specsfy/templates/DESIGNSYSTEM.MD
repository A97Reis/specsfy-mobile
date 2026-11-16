# Design System Mobile — Regras Macro de Interface

Este documento estabelece as regras e padrões visuais fundamentais para as aplicações móveis do projeto, baseando-se nas diretrizes do **Material Design 3 (Android)** e **Apple Human Interface Guidelines (iOS)**.

---

## 1. Princípios Gerais

- **Ergonomia e Área de Polegar (Thumb Zone)**: Ações primárias e navegação principal devem ser posicionadas ao alcance fácil dos polegares (inferior da tela).
- **Safe Areas & Insets**: Respeitar recortes de tela (Notch / Dynamic Island), barras de status do sistema e barras de navegação por gestos usando `SafeArea`, `WindowInsets` ou equivalente da stack.
- **Feedback Imediato & Microinterações**: Todo toque deve apresentar feedback tátil ou visual imediato (ripple, highlight, active scale).
- **Suporte a Temas**: Cores e tokens devem suportar nativamente **Modo Claro (Light)** e **Modo Escuro (Dark)**.
- **Tipografia Escalonável**: Fontes devem se adaptar às configurações de acessibilidade do sistema do usuário (Dynamic Type no iOS e Font Scaling no Android) sem quebrar o layout.
- **Alvos de Toque Mínimos**:
  - Android: mínimo de `48x48 dp`.
  - iOS: mínimo de `44x44 pt`.

---

## 2. Padrões de Navegação

- **Navegação Principal (Nível 0)**:
  - `BottomNavigationBar` / `NavigationBar` / `TabView` / `IonTabs` com 3 a 5 abas representativas.
  - Alternativa para telas maiores (tablets / foldables): `NavigationRail` lateral.
- **Cabeçalho de Tela**:
  - `TopAppBar` / `UINavigationBar` / `IonHeader` com título claro, navegação de retorno (Back Button) nativa à esquerda quando empilhado e até 2 ações secundárias à direita.
- **Transições e Modais**:
  - Telas contextuais curtas abrem em `BottomSheet` / `ModalBottomSheet` / `SheetPresentation`.
  - Telas de fluxo completo realizam push na pilha de navegação nativa.

---

## 3. Padrões para Superfícies de CRUD

### Lista / Coleção
- **Composição**: `TopAppBar` + campo de busca ou filtros em chips contextuais + lista otimizada (`LazyColumn` / `ListView.builder` / `FlatList` / `FlashList`).
- **Recursos Obrigatórios**:
  - Suporte a `Pull-to-Refresh` para sincronização.
  - Carregamento paginado / rolagem infinita quando o volume puder exceder 20 itens.
  - Itens da lista com toque em toda a área para abrir detalhes; botões de ação específicos (ex.: favoritar, excluir) com área de toque isolada ou em `SwipeActions`.
  - Tratamento de estados:
    - **Carregando**: Esqueletos (`Shimmer` / Skeleton) em vez de spinner bloqueante na primeira carga.
    - **Lista Vazia (Empty State)**: Ilustração ou ícone contextual, mensagem explicativa amigável e botão de ação primária (ex.: "Cadastrar primeiro item").
    - **Erro de Rede / Offline**: Banner ou card de aviso com botão explícito de "Tentar Novamente".

### Detalhe do Registro
- **Composição**: `TopAppBar` com navegação de volta nativa e menu de ações (`Editar`, `Compartilhar`, `Excluir`), seguido de conteúdo em blocos agrupados (`Cards` / `ListSections`).
- **Ações Destrutivas**: Excluir sempre exige diálogo de confirmação nativo antes da execução.

### Criação e Edição (Formulários Mobile)
- **Composição**:
  - Layout em coluna única em smartphones (adaptável a 2 colunas em tablets/desktop).
  - Labels claros posicionados acima dos campos ou como `Floating Labels`.
  - Configuração explícita de `KeyboardType` (ex.: número, email, telefone) e `ImeAction` (`Next` para o próximo campo, `Done` no último campo).
  - Validação inline em tempo real ou ao perder o foco, com texto de erro em cor de destaque abaixo do campo.
  - Ao submeter com erros, rolar automaticamente a visualização para o primeiro campo inválido e focar nele.
  - Proteção contra perda de dados: se houver alterações não salvas e o usuário tentar voltar, exibir diálogo de confirmação de descarte.

---

## 4. Estados Essenciais de Toda Tela Mobile

Toda especificação e implementação de tela deve prever os 6 estados fundamentais:
1. **Normal / Preenchido**: Dados exibidos corretamente.
2. **Carregando (Loading)**: Shimmer na carga inicial; spinner discreto para ações pontuais.
3. **Vazio (Empty)**: Quando não há registros a listar.
4. **Erro (Error)**: Mensagem humana de falha com opção clara de retry.
5. **Offline / Cache**: Indicação visual caso esteja exibindo dados em cache local sem conexão.
6. **Permissão Pendente / Negada**: Quando a tela depende de recurso do sistema (Câmera, Localização, Notificações, Galeria), apresentar justificativa contextual antes de pedir a permissão nativa e caminho para Configurações se negada permanentemente.

---

## 5. Revisão Visual Obrigatória

Durante a implementação de qualquer tarefa de interface, é obrigatório registrar no item `VISUAL` da tarefa:
- Conformidade com espaçamentos múltiplos de 4dp / 8dp.
- Comportamento em tela compacta (360dp de largura) e telas maiores.
- Teste de contraste e comportamento em Dark Mode.
- Comportamento do teclado ao abrir (não ocultar o campo em edição / auto-scroll com `imePadding` ou `KeyboardAvoidingView`).
- No Antigravity em projetos Android/CMP: conferência via `compose-preview` ou `android-device-hub`.
