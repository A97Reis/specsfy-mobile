---
name: specsfy-specialist-ui-design
description: "Projetar e revisar interfaces visuais de aplicativos móveis com hierarquia, layout adaptativo, tokens Material 3 e Apple HIG, componentes, densidade para toque, estados visuais (`Loading`, `Empty`, `Error`, `Offline`) e suporte a Light/Dark mode. Use para telas, listas, cards, sheets, formulários e navegação mobile; combine com `$specsfy-specialist-ux-design` e `$specsfy-specialist-mobile-accessibility`."
---

# Design de interface mobile (UI)

## Quando usar

- Acionar para definir ou revisar hierarquia visual, grid de `4dp`/`8dp`, estrutura de `Scaffold`/`SafeArea`, tokens de cor e tipografia, cards, listas, formulários e navegação de um aplicativo móvel.
- Acionar quando uma tela funciona, mas a composição dificulta leitura rápida no celular, alcance do polegar, distinção de ações ou resposta visual a estados de carregamento e erro.
- Não acionar para descobrir se a jornada resolve o problema de negócio da pessoa; usar `$specsfy-specialist-ux-design` para pesquisa, fluxo e validação de tarefa.
- Combinar com `$specsfy-specialist-design-system` e com o especialista da plataforma (`$specsfy-specialist-android`, `$specsfy-specialist-ios`, `$specsfy-specialist-flutter`, `$specsfy-specialist-react-native`, `$specsfy-specialist-ionic` ou `$specsfy-specialist-cmp`).

## Fluxo

1. Carregar `$specsfy-specialist-design-system` e ler `DESIGNSYSTEM.MD` e `INTERFACE.md` antes da composição. Se não houver direção visual customizada, aplicar os defaults mobile do documento (Material 3 / Apple HIG).
2. Ler a stack observada, tokens de tema, componentes reutilizáveis e telas atuais do app antes de propor novos componentes.
3. Identificar tarefa principal da tela, contexto de uso móvel (uma mão/polegar, iluminação variável, conexão instável) e ordenar conteúdo e ações por prioridade.
4. Para superfícies CRUD mobile, aplicar a anatomia canônica:
   - **Lista**: `TopAppBar` + busca/filtros em `FilterChips` ou `ModalBottomSheet` + lista vertical reciclada (`LazyColumn`/`FlatList`/`ListView.builder`) com `Pull-to-Refresh` e itens em formato de Card/ListItem.
   - **Detalhe**: `TopAppBar` com retorno nativo + seções agrupadas de informações + barra/botão de ação principal na zona do polegar.
   - **Criar/Editar**: formulário em coluna única vertical com espaçamento confortável para toque, teclado específico por campo e validação inline abaixo do input.
5. Mapear obrigatoriamente os estados visuais: `Nominal/Success`, `Loading (Skeleton/Shimmer)`, `Empty State (com CTA)`, `Error (com retry)`, `Offline` e `Permission Denied`.
6. Garantir `SafeArea` / `WindowInsets` em todas as bordas (topo, base e teclado virtual `IME`) e suporte completo a Light Mode e Dark Mode via tokens semânticos.
7. Validar renderização visual (usando `compose-preview` / `android preview render`, `android screen` no `android-device-hub` ou simulador) e registrar a evidência no item `VISUAL` da tarefa.

## Padrões

- Colocar visão essencial primeiro e revelar detalhes secundários sob demanda (progressive disclosure via detalhe ou `ModalBottomSheet`).
- Preservar posição de rolagem e filtros ativos ao navegar da lista para o detalhe e voltar.
- Manter ações destrutivas (ex.: excluir conta ou apagar item) visualmente distintas com cor semântica `error` e confirmação clara via diálogo nativo ou opção de desfazer (`Snackbar` com `Undo`).
- Exibir labels fixos acima ou flutuantes nos campos de formulário (nunca depender apenas do `placeholder`, que desaparece ao digitar) e erros em vermelho abaixo do campo com ícone de apoio.
- Garantir alvos de toque de no mínimo `48x48 dp` (Android) e `44x44 pt` (iOS).

## Antipadrões

- Usar tabelas horizontais (`DataGrid`), breadcrumbs no topo ou paginação `1, 2, 3` em telas de smartphone.
- Criar cores hexadecimais avulsas fora do tema semântico, quebrando a legibilidade quando o sistema operacional alterna para Dark Mode.
- Esconder a ação principal da tela dentro de um menu de três pontos enquanto ações secundárias ocupam destaque.
- Ignorar o teclado virtual, deixando o botão "Salvar" ou o campo ativo encoberto quando o usuário começa a digitar.

## Validação

- Comparar os estados `Success`, `Loading`, `Empty`, `Error`, `Offline` e `Permission Denied` na mesma composição visual.
- Testar textos curtos e longos, escala de fonte ampliada em `200%` (Dynamic Type / `sp`), telas compactas e modo paisagem/tablet quando suportado.
- Auditar `SafeArea`/`WindowInsets`, contraste WCAG AA (`4.5:1` texto / `3:1` controles), foco e alvos de toque.
- Registrar o resultado da inspeção visual no item `VISUAL` da seção 14 da spec.
- Não declarar a interface consistente ou responsiva sem inspeção visual comprovada nos estados críticos.

## Skills relacionadas

- `$specsfy-specialist-design-system` fornece as regras macro mobile e defaults canônicos em `DESIGNSYSTEM.MD`.
- `$specsfy-specialist-interface-experience` organiza a descoberta de telas, rotas e ações antes da composição visual.
- `$specsfy-specialist-ux-design` governa pesquisa, jornada, arquitetura da informação e ergonomia da interação.
- `$specsfy-specialist-mobile-accessibility` conduz auditoria de TalkBack, VoiceOver, alvos de toque e Dynamic Type.
- `$specsfy-specialist-prototyping` testa alternativas visuais em protótipo descartável antes da implementação definitiva.
- `$specsfy-specialist-android`, `$specsfy-specialist-ios`, `$specsfy-specialist-flutter`, `$specsfy-specialist-react-native`, `$specsfy-specialist-ionic` e `$specsfy-specialist-cmp` materializam os componentes na stack nativa.

Leia [references/standards.md](references/standards.md) para matrizes de layout, densidade, tokens, estados e regras de revisão visual.
