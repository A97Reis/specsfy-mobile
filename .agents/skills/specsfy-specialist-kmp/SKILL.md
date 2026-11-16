---
name: specsfy-specialist-kmp
description: "Projetar, implementar e revisar módulos Kotlin Multiplatform (KMP) com lógica compartilhada em `commonMain` para Android e iOS, contratos `expect`/`actual`, Ktor Client, Coroutines/Flows, Serialization, Koin e interop Swift via SKIE. Use quando houver plugin `org.jetbrains.kotlin.multiplatform` e `commonMain`; para UI compartilhada em Compose use `$specsfy-specialist-cmp`."
---

# Kotlin Multiplatform (KMP)

## Quando usar

- Acionar quando `build.gradle.kts` declara `kotlin("multiplatform")` ou `org.jetbrains.kotlin.multiplatform` e existem source sets `commonMain`, `androidMain` e `iosMain`.
- Acionar também para modelar regras de domínio, clientes HTTP com Ktor, serialização com `kotlinx.serialization`, persistência compartilhada e interoperação do código Kotlin com Swift/Xcode (`SKIE` ou `KMP-NativeCoroutines`).
- Não acionar para construir telas visuais declarativas compartilhadas; usar `$specsfy-specialist-cmp` para UI em Compose Multiplatform, `$specsfy-specialist-android` para UI Android pura e `$specsfy-specialist-ios` para UI SwiftUI pura.
- Combinar com `$specsfy-specialist-mobile-persistence` ao usar SQLDelight ou Room KMP em `commonMain`.

## Fluxo

1. Inspecionar a hierarquia de targets e source sets no `build.gradle.kts` (`commonMain`, `commonTest`, `androidMain`, `iosMain`, `iosArm64`, `iosSimulatorArm64`) e o `gradle/libs.versions.toml`.
2. Concentrar 100% das entidades de domínio, casos de uso, repositórios, validações e máquinas de estado em `src/commonMain/kotlin`.
3. Definir interfaces Kotlin em `commonMain` ou declarações `expect`/`actual` mínimas apenas para capacidades estritamente dependentes do sistema operacional (engines Ktor `OkHttp` vs `Darwin`, drivers de banco, Keystore/Keychain).
4. Expor fluxos reativos via `StateFlow` e `SharedFlow` e configurar `SKIE` (ou `KMP-NativeCoroutines`) para que o consumidor SwiftUI receba `AsyncSequence` e `sealed class` com exaustividade real no `switch` do Swift.
5. Escrever testes determinísticos em `src/commonTest/kotlin` usando `kotlin.test` e `kotlinx-coroutines-test` (`runTest`), validando o comportamento compartilhado de uma só vez.

## Padrões

- Preferir interfaces em `commonMain` injetadas via construtor/Koin sobre `expect class` complexas, reservando `expect`/`actual` para factories enxutas de plataforma.
- Encapsular falhas de rede e I/O em tipos de resultado explícitos (`sealed interface Result<out T>`) em vez de deixar exceções Kotlin não verificadas cruzarem a ponte Objective-C/Swift (onde causam crash se não declaradas com `@Throws`).
- Usar `kotlinx-datetime` para datas/horários e `kotlinx.serialization` para JSON em `commonMain`, evitando qualquer import de `java.time.*` ou `org.json.*`.
- Configurar exportação de framework iOS (`xcframework`) com visibilidade mínima necessária (exportar apenas a fachada de domínio/apresentação, mantendo detalhes de infraestrutura `internal`).

## Antipadrões

- Importar pacotes `android.*`, `java.io.*` ou `platform.UIKit.*` dentro de `src/commonMain/kotlin`, quebrando a compilação multiplataforma.
- Expor `Flow` ou `suspend fun` crus para o Swift sem `SKIE`/`KMP-NativeCoroutines` ou wrappers com cancelamento de `Job`, causando vazamento de coroutines quando a View SwiftUI é descartada.
- Duplicar regras de validação de negócio ou mapeamento de DTOs entre o app Android e o app iOS em vez de centralizá-las em `commonMain`.

## Validação

- Executar a suíte compartilhada com `./gradlew allTests` ou `./gradlew testDebugUnitTest` + `./gradlew iosSimulatorArm64Test`.
- Compilar o artefato nativo para iOS (`./gradlew assembleXCFramework` ou `./gradlew linkDebugFrameworkIosSimulatorArm64`) para comprovar que nenhuma dependência JVM vazou para o código compartilhado.
- Não declarar um módulo KMP pronto sem compilação bem-sucedida nos targets Android e iOS e suíte `commonTest` verde.

## Skills relacionadas

- `$specsfy-specialist-cmp` quando a camada visual também for compartilhada entre Android e iOS com Compose Multiplatform.
- `$specsfy-specialist-android` para a camada de UI Android nativa consumindo o módulo KMP.
- `$specsfy-specialist-ios` para a camada SwiftUI consumindo o `XCFramework` gerado pelo KMP.
- `$specsfy-specialist-mobile-persistence` para bancos multiplataforma com SQLDelight ou Room KMP e migrations seguras.
- `$specsfy-specialist-supabase` quando integrar `supabase-kt` no `commonMain`.

Leia [references/standards.md](references/standards.md) para mapeamento de bibliotecas multiplataforma, interop Kotlin/Swift e fontes oficiais do Kotlin Multiplatform.
