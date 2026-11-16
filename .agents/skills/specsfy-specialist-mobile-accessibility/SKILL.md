---
name: specsfy-specialist-mobile-accessibility
description: "Projetar, implementar e auditar acessibilidade em aplicativos móveis para Android (TalkBack) e iOS (VoiceOver), cobrindo árvore semântica, alvos de toque mínimos (48dp/44pt), Dynamic Type/Font Scaling, contraste WCAG 2.2 AA e redução de movimento. Use em qualquer tela ou componente mobile; combine com o especialista da plataforma."
---

# Acessibilidade Mobile (TalkBack & VoiceOver)

## Quando usar

- Acionar ao especificar, construir ou revisar qualquer tela, componente interativo, formulário ou fluxo de navegação mobile (Android, iOS, Flutter, React Native, Ionic, CMP).
- Acionar também quando uma auditoria visual ou teste de UI apontar falta de rótulos semânticos, alvos de toque pequenos, truncamento de texto com fonte ampliada ou baixo contraste em Light/Dark mode.
- Combinar sempre com o especialista da stack visual (`$specsfy-specialist-android`, `$specsfy-specialist-ios`, `$specsfy-specialist-flutter`, `$specsfy-specialist-react-native`, `$specsfy-specialist-ionic` ou `$specsfy-specialist-cmp`).

## Fluxo

1. Mapear a ordem lógica de leitura e foco de cada tela para usuários de leitores de tela (TalkBack no Android e VoiceOver no iOS).
2. Definir rótulos (`label`), papéis (`role`/`trait`), estados (`checked`, `selected`, `disabled`, `expanded`) e ações customizadas para todos os controles interativos, ocultando elementos puramente decorativos da árvore de acessibilidade.
3. Agrupar elementos compostos (ex.: um card de produto ou linha de configuração com título, subtítulo e switch) em um único nó semântico (`mergeDescendants = true` no Compose, `.accessibilityElement(children: .combine)` no SwiftUI, `MergeSemantics` no Flutter) para evitar navegação cansativa item a item.
4. Garantir dimensões mínimas de área de toque (`48x48 dp` no Android e `44x44 pt` no iOS) independentemente do tamanho visual do ícone.
5. Testar o layout com escala de fonte em `200%` (`sp` no Android / Dynamic Type `AX3` no iOS) garantindo que containers cresçam verticalmente sem cortar texto.
6. Auditar contraste de cores (mínimo `4.5:1` para texto normal e `3:1` para texto grande e ícones funcionais) tanto no tema Claro quanto no tema Escuro.

## Padrões

- Todo botão somente com ícone (`IconButton`) precisa obrigatoriamente de descrição localizada (`contentDescription`, `accessibilityLabel`, `tooltip`); imagens decorativas recebem `null` / `.accessibilityHidden(true)` / `ExcludeSemantics`.
- Anunciar mudanças dinâmicas importantes (erros de validação de formulário, conclusão de carregamento, alertas) via `liveRegion` (`LiveRegionMode.Polite` no Compose, `UIAccessibility.post(notification: .announcement)` no iOS, `SemanticsService.announce` no Flutter).
- Respeitar a preferência do sistema para redução de movimento (`prefers-reduced-motion` / `UIAccessibility.isReduceMotionEnabled` / `ANIMATOR_DURATION_SCALE`), substituindo animações de deslocamento amplo por transições suaves de opacidade.
- Nunca transmitir informação crítica (como erro de campo ou status de pagamento) apenas pela cor; combinar sempre cor + ícone + texto descritivo.

## Antipadrões

- Fixar altura rígida (ex.: `height = 40.dp` ou `height: 44`) em botões, banners ou linhas de lista que contêm texto, causando corte vertical quando o usuário ativa fonte grande no sistema.
- Incluir as palavras `"botão"` ou `"imagem de"` dentro da string de `contentDescription`/`accessibilityLabel` quando o componente já possui `Role.Button` ou `Role.Image`, fazendo o leitor de tela anunciar `"Salvar, botão, botão"`.
- Permitir que o foco do leitor de tela vaze para elementos da tela de fundo quando um `Modal` ou `BottomSheet` está aberto sobre ela.

## Validação

- No Android/CMP com Antigravity: inspecionar a árvore de UI via `android layout` (skill `android-cli`) conferindo a presença de `contentDescription` e bounds >= `48dp` em todos os nós clicáveis.
- Executar verificações automatizadas de acessibilidade nos testes de UI (`enableAccessibilityChecks()` no Compose/Espresso, `performAccessibilityAudit()` no XCTest iOS 17+, `matchesGuideline(androidTapTargetGuideline)` no `flutter test`).
- Validar visualmente a tela com escala de fonte em `200%` e nos temas Light e Dark sem sobreposição nem truncamento de informações essenciais.
- Não declarar uma interface mobile acessível sem verificação da árvore semântica e dos alvos de toque.

## Skills relacionadas

- `$specsfy-specialist-design-system` para tokens de cor, tipografia escalável e padrões de componentes em `DESIGNSYSTEM.MD`.
- `$specsfy-specialist-ui-design` e `$specsfy-specialist-ux-design` para hierarquia visual, clareza de fluxos e recuperação de erros.
- `$specsfy-specialist-android`, `$specsfy-specialist-ios`, `$specsfy-specialist-flutter`, `$specsfy-specialist-react-native`, `$specsfy-specialist-ionic` e `$specsfy-specialist-cmp` para as APIs nativas de semântica de cada framework.

Leia [references/standards.md](references/standards.md) para a tabela de equivalência de APIs de acessibilidade entre frameworks mobile, limiares WCAG 2.2 e fontes oficiais.
