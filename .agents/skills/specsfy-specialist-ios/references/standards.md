# Padrões e referências iOS Nativo

## Gerenciamento de Estado e Concorrência em SwiftUI

| Recurso | iOS 17+ (Recomendado) | iOS 15–16 (Compatibilidade) | Regra de uso |
| --- | --- | --- | --- |
| Modelo observável | `@Observable final class ViewModel` | `final class ViewModel: ObservableObject` | Marcar com `@MainActor` para garantir atualizações na thread principal |
| Instanciação na View dona | `@State private var viewModel` | `@StateObject private var viewModel` | Nunca instanciar dentro do `init` sem `@State`/`@StateObject` |
| Passagem para subview | Parâmetro normal ou `@Bindable` | `@ObservedObject` | Preferir passar valores simples e closures quando a subview for apresentacional |
| Ambiente global | `.environment(model)` / `@Environment(Model.self)` | `.environmentObject(model)` / `@EnvironmentObject` | Injetar dependências e mocks nos `#Preview` e testes |

## Segurança e Armazenamento Local

- **Keychain Services**: Obrigatório para `access_token`, `refresh_token`, chaves criptográficas e credenciais biométricas (`kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`).
- **`UserDefaults` / `@AppStorage`**: Restrito a preferências não sensíveis (ex.: flag de onboarding visto, preferência de ordenação).
- **SwiftData / CoreData**: Sempre isolar escrita pesada em background context/actor (`@ModelActor` no SwiftData ou `newBackgroundContext()` no CoreData) para manter a UI a 60/120 Hz.

## Comandos de verificação

```bash
# Executar testes de pacotes Swift
swift test

# Executar suíte de testes no Simulador iOS via CLI
xcodebuild test \
  -scheme <NomeDoScheme> \
  -destination 'platform=iOS Simulator,name=iPhone 16'
```

## Fontes oficiais

- Apple Human Interface Guidelines (HIG): https://developer.apple.com/design/human-interface-guidelines
- SwiftUI Documentation: https://developer.apple.com/documentation/swiftui
- Swift Concurrency: https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/
- SwiftData Documentation: https://developer.apple.com/documentation/swiftdata
- Keychain Services: https://developer.apple.com/documentation/security/keychain_services
- Swift Testing: https://developer.apple.com/documentation/testing

