---
name: specsfy-specialist-cmp
description: "Projetar, implementar e revisar interfaces compartilhadas Android e iOS com Compose Multiplatform (CMP) em `commonMain`, incluindo `composeResources`, Material 3, ViewModel KMP, Navigation Compose KMP e `compose-preview` no Antigravity. Use quando houver plugin `org.jetbrains.compose` com UI em `commonMain`; para lógica sem UI compartilhada use `$specsfy-specialist-kmp`."
---

# Compose Multiplatform (CMP)

## Quando usar

- Acionar quando `build.gradle.kts` aplica `org.jetbrains.compose` e `org.jetbrains.kotlin.plugin.compose` com telas `@Composable` em `src/commonMain/kotlin`.
- Acionar também para gerenciar recursos multiplataforma em `composeResources/` (strings, vetores, fontes), navegação compartilhada (`navigation-compose`, `Voyager` ou `Decompose`), integração `ComposeUIViewController` no iOS e renderização com `compose-preview` no Antigravity.
- Não acionar quando as telas forem nativas separadas (Compose só no Android e SwiftUI no iOS); usar `$specsfy-specialist-android` e `$specsfy-specialist-ios` combinados com `$specsfy-specialist-kmp`.
- Combinar com `$specsfy-specialist-design-system` para regras macro de interface mobile e com `$specsfy-specialist-mobile-accessibility` para semântica multiplataforma.

## Fluxo

1. Inspecionar a configuração do plugin `org.jetbrains.compose` no `build.gradle.kts`, o pacote gerado de `composeResources` (`Res.string.*`, `Res.drawable.*`) e os pontos de entrada em `androidMain` (`MainActivity`) e `iosMain` (`MainViewController.kt`).
2. Construir telas declarativas em `commonMain` utilizando `MaterialTheme` (Material 3) e ViewModels multiplataforma (`androidx.lifecycle:lifecycle-viewmodel-compose`) expondo `StateFlow<UiState>`.
3. Centralizar todos os textos, ícones vetoriais e fontes em `src/commonMain/composeResources/` para compartilhamento binário entre Android e iOS.
4. Configurar `WindowInsets.safeDrawing` / `Scaffold` em `commonMain` e ajustar `ComposeUIViewController` em `iosMain` para respeitar a Dynamic Island, o Home Indicator e a animação do teclado iOS.
5. Renderizar e inspecionar `@Preview` com a skill `compose-preview` (`android preview render`) no Antigravity a cada alteração visual.
6. Executar testes de UI multiplataforma (`runComposeUiTest`) e testes de ViewModel em `commonTest`.

## Padrões

- Carregar recursos sempre pela API tipada `stringResource(Res.string.chave)` e `painterResource(Res.drawable.icone)` de `org.jetbrains.compose.resources`, nunca usando `R.string` do Android dentro de `commonMain`.
- Coletar `StateFlow` na UI com `collectAsStateWithLifecycle()` do pacote multiplataforma `org.jetbrains.androidx.lifecycle:lifecycle-runtime-compose`.
- Garantir que todas as telas suportem os estados `Loading`, `Empty`, `Error` (com ação de tentar novamente) e `Offline`, além de pull-to-refresh nas listas (`PullToRefreshBox`).
- Isolar interoperabilidade visual nativa (como mapas ou players de vídeo nativos) atrás de um `@Composable expect fun` com implementação `AndroidView` em `androidMain` e `UIKitView` em `iosMain`.

## Antipadrões

- Referenciar `androidx.compose.ui.platform.LocalContext` dentro de `commonMain` (exclusivo do Android; em CMP use `LocalUriHandler`, `composeResources` ou injeção via interface).
- Hardcodar paddings de barra de status ou topo em `dp` fixos, quebrando o layout em diferentes modelos de iPhone (Notch vs Dynamic Island) e aparelhos Android.
- Esquecer de configurar `ignoresSafeArea(.keyboard)` ou `WindowInsets.ime` adequadamente no host `UIViewControllerRepresentable` do iOS, causando salto duplo quando o teclado sobe.

## Validação

- Renderizar as funções `@Preview` com `android preview render` (skill `compose-preview`) e verificar layout nos temas claro e escuro.
- Executar `./gradlew testDebugUnitTest` para validar os ViewModels e fluxos de estado em `commonTest`.
- Verificar compilação de ambos os targets (`./gradlew assembleDebug` para Android e build do `ComposeApp` para iOS Simulator).
- Não declarar uma tela Compose Multiplatform pronta sem preview validado e testes de estado passando.

## Skills relacionadas

- `$specsfy-specialist-kmp` para camada de domínio, rede (Ktor), serialização e repositórios em `commonMain`.
- `$specsfy-specialist-android` para configurações específicas do host Android (`AndroidManifest.xml`, `MainActivity`, permissões Android).
- `$specsfy-specialist-ios` para configurações do host Xcode (`Info.plist`, `ContentView.swift`, Keychain e ciclo de vida iOS).
- `$specsfy-specialist-design-system` para diretrizes visuais mobile em `DESIGNSYSTEM.MD`.
- `$specsfy-specialist-mobile-accessibility` para semântica, alvos de toque e contraste em telas Compose.

Leia [references/standards.md](references/standards.md) para uso de `composeResources`, integração `UIKitView`/`ComposeUIViewController` e fontes oficiais da JetBrains.
