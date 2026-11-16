# Padrões e referências de Design System Mobile

## Matriz de Substituição: Padrões Web Desktop vs Padrões Nativos Mobile

| Necessidade Funcional | Antipadrão Web (Proibido no Mobile) | Padrão Mobile Canônico (`DESIGNSYSTEM.MD`) |
| --- | --- | --- |
| Navegação Principal | Barra lateral fixa larga / Mega-menu no topo | `BottomNavigationBar` / `TabView` (3 a 5 abas) + `NavigationStack` |
| Localização Hierárquica | Breadcrumbs (`Início > Clientes > Editar`) | `TopAppBar` com título conciso e botão/gesto nativo de voltar |
| Coleções de Registros | `DataGrid` / Tabela com várias colunas e paginação `1, 2, 3` | Lista vertical reciclada (`LazyColumn`/`FlatList`/`ListView`) + Scroll infinito |
| Atualização de Dados | Botão "Recarregar página" | Gesto nativo `Pull-to-Refresh` no topo da lista |
| Filtros e Ordenação | Barra horizontal extensa com múltiplos selects | `FilterChips` horizontais compactos + `ModalBottomSheet` de filtros |
| Ações por Item da Lista | Coluna final com 4 ícones minúsculos | Toque no card abre detalhe; `Swipe Actions` ou menu contextual (`MoreVert` / Long Press) |

## Estados Obrigatórios de Superfície Mobile

1. **Loading Inicial**: Skeleton/Shimmer respeitando a geometria dos cards.
2. **Empty State**: Ícone ilustrativo + título claro + subtítulo orientador + botão CTA primário.
3. **Success + Pull-to-Refresh**: Conteúdo renderizado com indicador de atualização não bloqueante no topo.
4. **Error State**: Mensagem humana explicando o problema + botão de "Tentar novamente".
5. **Offline State**: Banner discreto informando modo offline e exibição dos dados em cache local.

## Fontes oficiais

- Material Design 3 (M3) Guidelines: https://m3.material.io
- Apple Human Interface Guidelines (HIG): https://developer.apple.com/design/human-interface-guidelines
- Material 3 Adaptive Layout & Navigation: https://m3.material.io/foundations/layout/applying-layout/window-size-classes
- Apple HIG Layout & Safe Areas: https://developer.apple.com/design/human-interface-guidelines/layout
