# Componentes e Telas de Interface (Mobile)

Este arquivo mapeia os componentes visuais, telas e padrões de navegação utilizados no aplicativo, em conformidade com as diretrizes de `DESIGNSYSTEM.MD`.

---

## 1. Contexto de UI da Aplicação

- **Stack de Interface**: {{STACK_LABEL}}
- **Diretrizes Base**: Material Design 3 e/ou Apple Human Interface Guidelines
- **Modo Escuro / Claro**: Suportado nativamente

---

## 2. Mapa de Telas e Navegação

| Rota / Identificador da Tela | Nome / Título | Navegação (Origem -> Destino) | Padrão Visual (Lista, Detalhe, Form, Dashboard) | Permissões / Autenticação |
| :--- | :--- | :--- | :--- | :--- |
| `/home` | Início | Aba Principal | Dashboard / Resumo | Autenticado |
| `/items` | Listagem | Aba Principal -> Detalhe | Lista com Pull-to-Refresh | Autenticado |
| `/items/new` | Novo Item | Lista -> Modal / Push | Formulário em Coluna | Autenticado |
| `/items/{id}` | Detalhes | Lista -> Push | Detalhe em Cards | Autenticado |

---

## 3. Catálogo de Componentes e Blocos Reutilizáveis

| Componente | Arquivo / Pacote | Finalidade | Props / Entradas Principais | Estados Suportados |
| :--- | :--- | :--- | :--- | :--- |
| `AppTopBar` | `components/AppTopBar` | Barra de topo padronizada | `title`, `canBack`, `actions` | Fixo / Elevado ao rolar |
| `EmptyStateView` | `components/EmptyStateView` | Feedback de lista vazia | `icon`, `title`, `actionText`, `onAction` | Normal |
| `LoadingShimmer` | `components/LoadingShimmer` | Skeleton loader para listas | `itemCount`, `type` | Animado |
| `ErrorRetryCard` | `components/ErrorRetryCard` | Alerta de erro com botão retry | `errorMessage`, `onRetry` | Normal |
