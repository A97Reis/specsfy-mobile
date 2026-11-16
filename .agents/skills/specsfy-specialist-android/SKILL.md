---
name: specsfy-specialist-android
description: "Projetar, implementar e revisar aplicativos Android nativos em Kotlin com Jetpack Compose, Material 3, ViewModel, StateFlow, Coroutines, Navigation Compose, Hilt/Koin, Room e WorkManager. Use quando houver `build.gradle.kts` com `com.android.application` ou `AndroidManifest.xml`; integre com `android-cli`, `android-device-hub` e `compose-preview` no Antigravity; não use para UI compartilhada com iOS (`$specsfy-specialist-cmp`)."
---

# Android Nativo (Kotlin & Jetpack Compose)

## Quando usar

- Acionar quando o projeto contém `AndroidManifest.xml`, `build.gradle.kts` ou `build.gradle` com plugins `com.android.application` ou `com.android.library`.
- Acionar também para revisar recomposições do Jetpack Compose, arquitetura MVVM/MVI com `ViewModel` e `StateFlow`, rotas tipadas no Navigation Compose, injeção com Hilt/Koin e integração com skills nativas do Antigravity (`compose-preview`, `android-device-hub`, `android-cli`).
- Não acionar quando a tela Compose for compartilhada em `commonMain` para Android e iOS; usar `$specsfy-specialist-cmp` nesse caso.
- Combinar com `$specsfy-specialist-mobile-persistence` quando envolver Room/DataStore e migrations locais, e com `$specsfy-specialist-mobile-accessibility` para auditoria de TalkBack.

## Fluxo

1. Inspecionar `minSdk`, `targetSdk`, `compileSdk`, `gradle/libs.versions.toml` e módulos Gradle antes de propor APIs ou bibliotecas.
2. Modelar o estado de cada tela em um `UiState` imutável (`Loading`, `Success`, `Empty`, `Error`, `Offline`) exposto por `ViewModel` via `StateFlow` e consumido na UI com `collectAsStateWithLifecycle()`.
3. Construir telas declarativas em Jetpack Compose com tokens `MaterialTheme` (Material 3), aplicando `enableEdgeToEdge()` e `Scaffold` com consumo explícito de `WindowInsets`.
4. Configurar navegação type-safe com Navigation Compose (`@Serializable` routes), tratando deep links e preservação de estado no back stack.
5. Isolar trabalho assíncrono em `viewModelScope` com Coroutines/Flows e delegar sincronização resiliente em segundo plano ao `WorkManager`.
6. Validar visualmente os componentes `@Preview` com `compose-preview` (`android preview render`) e inspecionar a árvore real no emulador/dispositivo com `android-device-hub` e `android-cli` (`android layout`, `android screen`).
7. Executar testes unitários (`./gradlew testDebugUnitTest` com JUnit, MockK e Turbine) e testes de UI (`createComposeRule`) antes de concluir a entrega.

## Padrões

- Coletar `Flow` na camada Compose exclusivamente com `collectAsStateWithLifecycle()`, evitando trabalho desperdiçado quando a Activity vai para segundo plano.
- Manter funções `@Composable` livres de efeitos colaterais diretos; usar `LaunchedEffect`, `DisposableEffect` ou callbacks enviados ao `ViewModel` (Unidirectional Data Flow).
- Garantir que parâmetros de `@Composable` sejam estáveis (`@Immutable`, `@Stable` ou coleções imutáveis) para permitir recomposição inteligente (smart skipping).
- Respeitar alvos de toque mínimos de `48x48 dp` e configurar `imePadding()` + `KeyboardOptions(imeAction = ...)` em formulários.
- Declarar permissões de runtime com `rememberLauncherForActivityResult` e verificar `shouldShowRequestPermissionRationale` para orientar o usuário quando negadas.

## Antipadrões

- Disparar chamadas de rede, queries Room ou leitura de `DataStore` diretamente no corpo de um `@Composable` ou na `Main Thread`.
- Usar `GlobalScope.launch` ou segurar referência de `Context`/`View`/`Activity` dentro de `ViewModel`, causando memory leaks em rotações de tela.
- Aplicar `fallbackToDestructiveMigration()` no banco Room em builds de produção, apagando silenciosamente dados locais do usuário em atualizações.
- Ignorar `WindowInsets` do sistema, deixando botões inferiores encobertos pela barra de navegação por gestos ou topo sob o recorte da câmera.

## Validação

- Compilar e executar a suíte unitária com `./gradlew testDebugUnitTest` e verificar lint com `./gradlew lintDebug`.
- Renderizar `@Preview` dos estados `Loading`, `Empty`, `Error` e `Success` via skill `compose-preview` (`android preview render`) no Antigravity.
- Inspecionar hierarquia e limites de toque no dispositivo/emulador via `android layout` e capturar evidência visual com `android screen`.
- Não declarar a tela Android pronta ou sem vazamentos sem testes unitários verdes e verificação visual dos estados de borda.

## Skills relacionadas

- `$specsfy-specialist-cmp` quando a interface Compose residir em `commonMain` para Android e iOS.
- `$specsfy-specialist-kmp` quando a camada de domínio/dados for compartilhada em Kotlin Multiplatform.
- `$specsfy-specialist-mobile-persistence` para modelagem de entidades Room, SQLCipher e tarefas `[MIGRATION]`.
- `$specsfy-specialist-mobile-accessibility` para semântica do TalkBack, contraste e escalonamento em `sp`.
- `$specsfy-specialist-design-system` para regras macro de navegação, listas com pull-to-refresh e formulários mobile.
- `$specsfy-specialist-mobile-deploy` para assinatura com Keystore, geração de AAB/APK e rollout no Google Play Console.

Leia [references/standards.md](references/standards.md) para arquitetura recomendada pelo Google, matriz de ferramentas Antigravity, configuração de Gradle e fontes oficiais do Android Developers.
