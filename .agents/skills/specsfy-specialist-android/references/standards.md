# Padrões e referências Android Nativo

## Arquitetura de camadas e Unidirectional Data Flow (UDF)

| Camada | Responsabilidade | Componentes Jetpack / Kotlin | Regra de fronteira |
| --- | --- | --- | --- |
| UI (Apresentação) | Renderizar estado e emitir eventos de intenção do usuário | `@Composable`, `ViewModel`, `StateFlow<UiState>`, `collectAsStateWithLifecycle` | Nunca acessa DAOs ou clientes HTTP diretamente |
| Domínio (Opcional) | Regras de negócio reutilizáveis e orquestração de múltiplos repositórios | `UseCase` / Interactors em Kotlin puro | Sem dependência de `android.*` |
| Dados | Fonte única da verdade (offline-first), cache local e sincronização | `Repository`, `Room (@Dao)`, `DataStore`, `Retrofit`/`Ktor`, `WorkManager` | Expõe `Flow<T>` ou `suspend fun` seguras para qualquer dispatcher |

## Integração com ferramentas Antigravity

- **`compose-preview`**: Sempre crie funções `@Preview(showBackground = true)` cobrindo tema claro/escuro e estados de tela (`Loading`, `Empty`, `Success`, `Error`) e execute `android preview render` após alterações visuais.
- **`android-device-hub` e `android-cli`**:
  - Use `android layout` para auditar bounds, textos truncados e `contentDescription` diretamente na tela espelhada.
  - Use `android screen` para capturar evidências visuais para o item `VISUAL` do checklist de implementação.

## Comandos de verificação

```bash
# Testes unitários locais (rápidos, na JVM)
./gradlew testDebugUnitTest

# Análise estática do Android Lint
./gradlew lintDebug

# Testes instrumentados de UI (emulador/dispositivo conectado)
./gradlew connectedDebugAndroidTest
```

## Fontes oficiais

- Guia de Arquitetura de Apps Android: https://developer.android.com/topic/architecture
- Jetpack Compose Docs: https://developer.android.com/develop/ui/compose/documentation
- Material Design 3 no Compose: https://developer.android.com/develop/ui/compose/designsystems/material3
- Navigation Compose Type-Safe: https://developer.android.com/guide/navigation/design/type-safety
- Room Persistence Library: https://developer.android.com/training/data-storage/room
- WorkManager: https://developer.android.com/topic/libraries/architecture/workmanager

