<!-- specsfy:framework:start -->
Você está executando com o ecossistema Specsfy Mobile (Antigravity Edition).
A fonte normativa do projeto vive em `.specsfy/Spec.md`.
<!-- specsfy:framework:end -->

# Diretrizes do Projeto (Specsfy Mobile no Antigravity)

1. **Idioma e Comunicação**: Responda sempre em português do Brasil (`pt-br`). Planos, especificações, discussões e artefatos devem ser redigidos em `pt-br`.
2. **Entrevistas e Decisões**: Ao conduzir entrevistas em skills (`specsfy-02-backlog`, `specsfy-interviewer`, `specsfy-mvp-milestone-interviewer`, etc.), utilize a ferramenta `ask_question` para estruturar perguntas com opções claras, permitindo avanço incremental e escolhas orientadas.
3. **Plataformas Mobile**: O ecossistema é projetado para:
   - **Android Nativo** (Kotlin, Jetpack Compose, Material 3, Navigation Compose, Coroutines/Flow)
   - **iOS Nativo** (Swift, SwiftUI, Apple Human Interface Guidelines, Swift Concurrency)
   - **Flutter** (Dart, Widgets, Material 3/Cupertino, Riverpod/BLoC, GoRouter)
   - **React Native** (TypeScript, Expo/Bare, React Navigation/Expo Router, Reanimated)
   - **Ionic / Capacitor** (TypeScript, Ionic UI, Plugins Capacitor nativos)
   - **Kotlin Multiplatform (KMP)** (Arquitetura compartilhada em `commonMain`, Ktor, Coroutines)
   - **Compose Multiplatform (CMP)** (UI compartilhada Android/iOS, Compose Resources)
   - **Supabase** (Auth, Postgres, RLS, Storage, Realtime, Edge Functions via SDKs mobile)
4. **Design System Mobile**: As regras macro de interface residem em `DESIGNSYSTEM.MD`. Padrões web como tabelas densas/DataGrid e breadcrumbs no topo são substituídos por `TopAppBar`, `BottomNavigation/Tabs`, listas `Lazy`/`FlatList` com `Pull-to-Refresh`, formulários com `ImeAction`/`KeyboardType`, áreas seguras (`SafeArea`/`WindowInsets`) e estados de Offline/Permissões.
5. **Integração de Ferramentas Antigravity**: Em projetos Android e Compose Multiplatform, integre e aproveite as skills nativas do Antigravity (`android-cli`, `android-device-hub` e `compose-preview`) para verificação visual e testes de UI.
6. **Contrato de Comprovação**: Nenhuma tarefa é concluída sem comprovação real. Toda alteração de código mobile exige testes em TDD/BDD (`specsfy-06-tdd-bdd` e `specsfy-07-implement`) com isolamento seguro, revisão visual no item `VISUAL` e atualização da documentação técnica via `specsfy-documentator`.
