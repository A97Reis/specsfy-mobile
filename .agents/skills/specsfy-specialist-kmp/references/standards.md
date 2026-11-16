# Padrões e referências Kotlin Multiplatform (KMP)

## Equivalência de Bibliotecas Multiplataforma (`commonMain`)

| Domínio | Biblioteca `commonMain` | Engine / Driver `androidMain` | Engine / Driver `iosMain` |
| --- | --- | --- | --- |
| Rede HTTP | `io.ktor:ktor-client-core` | `ktor-client-okhttp` | `ktor-client-darwin` |
| Serialização | `org.jetbrains.kotlinx:kotlinx-serialization-json` | Nativo no compilador Kotlin | Nativo no compilador Kotlin/Native |
| Concorrência | `org.jetbrains.kotlinx:kotlinx-coroutines-core` | `Dispatchers.Main` (Android) | `Dispatchers.Main` (Darwin RunLoop) + `SKIE` |
| Banco Relacional | `app.cash.sqldelight` ou `androidx.room` (KMP) | `AndroidSqliteDriver` | `NativeSqliteDriver` |
| Injeção de Dependência | `io.insert-koin:koin-core` | `koin-android` | Inicialização via helper `initKoin()` chamado no `App.swift` |

## Interoperabilidade Segura com Swift

- Exceções em funções `suspend` expostas diretamente ao Swift precisam de `@Throws(Exception::class)` ou, preferencialmente, retorno envelopado em `Result<T, DomainError>` (sealed hierarchy traduzida por `SKIE` como `enum` exaustivo em Swift).

## Comandos de verificação

```bash
# Executar testes compartilhados em todos os targets disponíveis
./gradlew check

# Executar testes unitários rápidos do commonTest
./gradlew testDebugUnitTest

# Validar linkagem nativa para simulador iOS (Apple Silicon)
./gradlew linkDebugFrameworkIosSimulatorArm64
```

## Fontes oficiais

- Documentação Oficial Kotlin Multiplatform: https://kotlinlang.org/docs/multiplatform.html
- KMP Hierarchy & Source Sets: https://kotlinlang.org/docs/multiplatform-hierarchy.html
- Ktor Client Multiplatform: https://ktor.io/docs/client-create-multiplatform-application.html
- SKIE (Swift Kotlin Interface Enhancer): https://skie.touchlab.co
- SQLDelight Multiplatform: https://sqldelight.github.io/sqldelight/latest/multiplatform_sqlite/

