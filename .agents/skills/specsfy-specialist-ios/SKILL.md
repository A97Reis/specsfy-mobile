---
name: specsfy-specialist-ios
description: "Projetar, implementar e revisar aplicativos iOS nativos em Swift 6 com SwiftUI, Apple Human Interface Guidelines (HIG), Swift Concurrency (async/await, Actor), NavigationStack, SwiftData/CoreData e Keychain. Use quando houver `Package.swift`, `Podfile`, `Info.plist` ou `.xcodeproj`/`.xcworkspace`; não use para UI multiplataforma em Compose (`$specsfy-specialist-cmp`)."
---

# iOS Nativo (Swift & SwiftUI)

## Quando usar

- Acionar quando o projeto contém `Package.swift`, `Podfile`, `Info.plist` ou arquivos `.xcodeproj`/`.xcworkspace` voltados ao ecossistema Apple (iOS/iPadOS).
- Acionar também para revisar isolamento de concorrência em Swift 6 (`@MainActor`, `Sendable`, `actor`), fluxos em `NavigationStack`, conformidade com o Apple HIG e armazenamento seguro no Keychain.
- Não acionar para código compartilhado Kotlin; usar `$specsfy-specialist-kmp` para lógica em `commonMain` e `$specsfy-specialist-cmp` para telas Compose Multiplatform.
- Combinar com `$specsfy-specialist-mobile-persistence` em migrations de SwiftData/CoreData e com `$specsfy-specialist-mobile-accessibility` para VoiceOver e Dynamic Type.

## Fluxo

1. Identificar `iOS Deployment Target`, versão do Swift, gerenciador de dependências (`Swift Package Manager` ou `CocoaPods`) e chaves de permissão (`NS*UsageDescription`) no `Info.plist`.
2. Modelar o estado observável da tela com a macro `@Observable` (Observation framework) ou `ObservableObject`/`@Published` isolado em `@MainActor`.
3. Construir views declarativas em SwiftUI seguindo o Apple HIG, usando `NavigationStack(path:)`, `.searchable`, `.refreshable` e respeitando as Safe Areas nativas da Dynamic Island e do Home Indicator.
4. Estruturar operações assíncronas com Swift Concurrency (`async/await`, `Task`, `AsyncSequence`, `actor`), garantindo cancelamento cooperativo (`Task.checkCancellation()`) no `.task {}` modifier da View.
5. Persistir credenciais e tokens exclusivamente no iOS Keychain e dados estruturados em SwiftData (`@Model`) ou CoreData com schemas versionados.
6. Escrever e rodar suítes determinísticas com Swift Testing (`@Test`, `#expect`) ou `XCTest` usando protocolos/fakes injetados.

## Padrões

- Isolar toda mutação de estado de interface com `@MainActor` e exigir conformidade `Sendable` em tipos trafegados entre tarefas concorrentes.
- Preferir `.task(id:)` em Views SwiftUI em vez de `onAppear { Task { ... } }`, pois `.task` cancela automaticamente a tarefa quando a View sai da hierarquia.
- Respeitar alvos de toque mínimos de `44x44 pt` (`contentShape(Rectangle())` quando necessário) e tipografia semântica (`Font.body`, `Font.headline`) compatível com Dynamic Type.
- Declarar descrições claras e orientadas ao benefício do usuário em todas as chaves `NS*UsageDescription` do `Info.plist` antes de requisitar câmera, localização ou notificações.
- Tratar transições de ciclo de vida via `@Environment(\.scenePhase)` (`active`, `inactive`, `background`).

## Antipadrões

- Armazenar tokens JWT, refresh tokens ou dados sensíveis do usuário em `UserDefaults` ou `@AppStorage` (armazenamento em texto plano sem criptografia).
- Forçar unwraps (`!`) ou usar `try!` em caminhos de rede, parsing JSON (`Codable`) ou banco de dados que podem falhar em produção.
- Usar `GeometryReader` indiscriminadamente para empilhar layouts que poderiam ser resolvidos com `VStack`, `HStack`, `Spacer`, `safeAreaInset` ou `ViewThatFits`.
- Ignorar retenção de ciclos (`[weak self]`) em closures de longa duração fora do ciclo estruturado do SwiftUI.

## Validação

- Compilar e executar testes automatizados via `swift test` (pacotes SPM) ou `xcodebuild test -scheme <Scheme> -destination 'platform=iOS Simulator,name=iPhone 16'`.
- Verificar ausência de avisos de concorrência estrita do Swift 6 (`StrictConcurrency`) e vazamentos de memória no Instruments/XCTest.
- Validar renderização nos modos Light/Dark e com Dynamic Type ampliado (`accessibilityExtraLarge`) nos Previews (`#Preview`).
- Não declarar a funcionalidade iOS concluída sem testes automatizados passando e validação dos estados `Loading`, `Empty`, `Error` e `Offline`.

## Skills relacionadas

- `$specsfy-specialist-kmp` quando o app iOS consumir um framework Kotlin Multiplatform (`Shared.xcframework`) com SKIE/KMP-NativeCoroutines.
- `$specsfy-specialist-cmp` quando telas compartilhadas forem embutidas via `ComposeUIViewController`.
- `$specsfy-specialist-mobile-persistence` para versionamento de schemas SwiftData (`VersionedSchema`, `SchemaMigrationPlan`) e CoreData.
- `$specsfy-specialist-mobile-accessibility` para auditoria detalhada de VoiceOver, traits e Dynamic Type.
- `$specsfy-specialist-design-system` para diretrizes visuais unificadas do projeto em `DESIGNSYSTEM.MD`.
- `$specsfy-specialist-mobile-deploy` para Provisioning Profiles, Fastlane Match, geração de IPA e publicação no TestFlight / App Store Connect.

Leia [references/standards.md](references/standards.md) para diretrizes de Swift Concurrency, padrões de Keychain, SwiftUI moderno e fontes oficiais da Apple.
