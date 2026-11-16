# Padrões e referências de Acessibilidade Mobile

## Equivalência de APIs Semânticas por Framework Mobile

| Conceito Semântico | Jetpack Compose / CMP | SwiftUI (iOS) | Flutter | React Native |
| --- | --- | --- | --- | --- |
| Rótulo para leitor de tela | `contentDescription = "..."` | `.accessibilityLabel("...")` | `Semantics(label: '...')` | `accessibilityLabel="..."` |
| Ocultar item decorativo | `contentDescription = null` | `.accessibilityHidden(true)` | `ExcludeSemantics` | `importantForAccessibility="no"` / `accessibilityElementsHidden` |
| Agrupar card/linha num único foco | `Modifier.semantics(mergeDescendants = true) {}` | `.accessibilityElement(children: .combine)` | `MergeSemantics` | `accessible={true}` no container pai |
| Papel do elemento | `Role.Button`, `Role.Switch`, `Role.Tab` | `.accessibilityAddTraits(.isButton)` | `Semantics(button: true)` | `accessibilityRole="button"` |
| Anúncio dinâmico (Live Region) | `liveRegion = LiveRegionMode.Polite` | `AccessibilityNotification.Announcement(...)` | `Semantics(liveRegion: true)` | `accessibilityLiveRegion="polite"` |

## Limiares Numéricos Obrigatórios

- **Alvo de toque mínimo**: `48 x 48 dp` no Android (Material 3) e `44 x 44 pt` no iOS (Apple HIG).
- **Contraste mínimo (WCAG 2.2 AA)**: `4.5:1` para texto normal (< 18pt ou < 14pt bold) e `3.0:1` para texto grande, ícones informativos e bordas de campos de formulário.
- **Escalonamento de texto**: Suportar até `200%` de escala de fonte sem perda de conteúdo ou funcionalidade.

## Fontes oficiais

- Android Accessibility Guidelines: https://developer.android.com/guide/topics/ui/accessibility
- Accessibility in Jetpack Compose: https://developer.android.com/develop/ui/compose/accessibility
- Apple Accessibility Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/accessibility
- Flutter Accessibility Documentation: https://docs.flutter.dev/ui/accessibility-and-internationalization/accessibility
- React Native Accessibility: https://reactnative.dev/docs/accessibility
- W3C WCAG 2.2 Mobile Accessibility: https://www.w3.org/TR/WCAG22/

