# Padrões e referências Compose Multiplatform (CMP)

## Estrutura de Recursos e Integração Nativa

| Capacidade | Solução em `commonMain` (CMP) | Integração Android (`androidMain`) | Integração iOS (`iosMain`) |
| --- | --- | --- | --- |
| Strings, Fontes e Imagens | `src/commonMain/composeResources/` (`Res.string.*`, `Res.drawable.*`) | Empacotado automaticamente pelo plugin Gradle | Empacotado no bundle do framework iOS |
| ViewModel & Lifecycle | `org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-compose` | Integrado ao `ComponentActivity` | Integrado ao ciclo do `ComposeUIViewController` |
| Navegação | `org.jetbrains.androidx.navigation:navigation-compose` | Suporte nativo ao botão/gesto voltar Android | Suporte a gesto de retorno e pilha multiplataforma |
| Views Nativas Embutidas | `@Composable expect fun NativeMap(...)` | `AndroidView(factory = { ... })` | `UIKitView(factory = { ... })` |

## Integração com `compose-preview` no Antigravity

- Anote componentes em `commonMain` ou `androidMain` com `@Preview` (`org.jetbrains.compose.ui.tooling.preview.Preview`) e acione `android preview render` para inspecionar o resultado visual imediatamente no painel Compose Preview do Antigravity.

## Comandos de verificação

```bash
# Gerar classe Res de recursos multiplataforma e rodar testes
./gradlew generateComposeResClass testDebugUnitTest

# Compilar APK de debug Android
./gradlew :composeApp:assembleDebug
```

## Fontes oficiais

- Documentação Oficial Compose Multiplatform: https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-getting-started.html
- Multiplatform Resources (`composeResources`): https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-images-resources.html
- Lifecycle e ViewModel no CMP: https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-lifecycle.html
- Navigation em Compose Multiplatform: https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-navigation-routing.html
- Integração com SwiftUI e UIKit: https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-uikit-integration.html

