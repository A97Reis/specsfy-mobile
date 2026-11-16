---
name: specsfy-specialist-flutter
description: "Projetar, implementar e revisar aplicativos Flutter em Dart 3 com widgets imutáveis, Material 3 e Cupertino, Riverpod/BLoC, GoRouter, Drift e testes automatizados. Use quando houver `pubspec.yaml` com dependência `flutter`; não use para projetos Android/Kotlin puros (`$specsfy-specialist-android`) ou iOS/Swift puros (`$specsfy-specialist-ios`)."
---

# Flutter & Dart

## Quando usar

- Acionar quando o projeto contém `pubspec.yaml` declarando o SDK `flutter`.
- Acionar também para estruturar gerenciamento de estado com Riverpod ou BLoC/Cubit, navegação declarativa e deep links com `go_router`, adaptação de widgets Material 3 / Cupertino e testes com `flutter test`.
- Não acionar para módulos nativos isolados sem relação com o host Flutter, exceto ao implementar `Platform Channels` / `Pigeon`.
- Combinar com `$specsfy-specialist-mobile-persistence` ao usar Drift/SQLite local e com `$specsfy-specialist-supabase` quando integrar `supabase_flutter`.

## Fluxo

1. Inspecionar `pubspec.yaml`, restrições de SDK Dart/Flutter, `analysis_options.yaml` e a arquitetura existente de pastas (`lib/features/`, `lib/core/`).
2. Modelar estados com classes seladas (`sealed class` do Dart 3) ou `AsyncValue` (Riverpod), garantindo tratamento exaustivo para `loading`, `data`, `empty` e `error`.
3. Construir a árvore de widgets em componentes pequenos, imutáveis e com construtores `const`, aplicando `ThemeData(useMaterial3: true, colorScheme: ...)` e `SafeArea`.
4. Configurar rotas tipadas e guardas de autenticação no `GoRouter`, preservando a navegação aninhada em abas com `StatefulShellRoute.indexedStack`.
5. Isolar integrações nativas via `Pigeon` (código gerado tipado) ou `MethodChannel`/`EventChannel` com tratamento explícito de `PlatformException`.
6. Validar com `flutter analyze` (zero warnings) e executar testes unitários e de widget (`flutter test`) cobrindo todos os estados visuais.

## Padrões

- Declarar construtores `const` em todos os `StatelessWidget` e sub-árvores estáticas, e quebrar métodos `build()` grandes em widgets dedicados em vez de métodos auxiliares `Widget _buildItem()`.
- Usar `ListView.builder`, `GridView.builder` ou `CustomScrollView` com `SliverList` para qualquer lista dinâmica, combinado com `RefreshIndicator` para pull-to-refresh.
- Descartar sistematicamente `TextEditingController`, `FocusNode`, `AnimationController`, `ScrollController` e `StreamSubscription` no método `dispose()`.
- Configurar `textInputAction` e `keyboardType` em cada `TextFormField` para navegação fluida pelo teclado virtual.
- Envolver imagens e ícones clicáveis em áreas de pelo menos `48x48` pixels lógicos e anotar `Semantics` para leitores de tela.

## Antipadrões

- Chamar funções assíncronas, instanciar controllers ou disparar requisições HTTP diretamente dentro do método `build(BuildContext context)`.
- Usar `BuildContext` após um `await` assíncrono sem verificar `if (!context.mounted) return;`.
- Renderizar listas de tamanho variável dentro de `Column` + `SingleChildScrollView`, forçando a instanciação simultânea de todos os itens na memória.
- Ignorar regras do `flutter_lints` / `very_good_analysis` ou espalhar `dynamic` desativando a segurança de tipos do Dart 3.

## Validação

- Executar análise estática com `flutter analyze` exigindo saída limpa sem erros ou avisos.
- Rodar a suíte de testes unitários e de widgets via `flutter test --coverage`.
- Verificar ausência de overflow visual (`RenderFlex overflowed`) testando em tamanhos de tela compactos e com `MediaQueryData(textScaler: TextScaler.linear(1.5))`.
- Não declarar uma feature Flutter concluída sem `flutter analyze` e `flutter test` passando com evidência real.

## Skills relacionadas

- `$specsfy-specialist-mobile-persistence` para bancos locais com Drift (SQLite), criptografia e tarefas `[MIGRATION]`.
- `$specsfy-specialist-supabase` quando o backend utilizar `supabase_flutter`, Auth, RLS e Realtime.
- `$specsfy-specialist-firebase` para integração com FlutterFire (`firebase_core`, `firebase_messaging`, `firebase_crashlytics`).
- `$specsfy-specialist-mobile-accessibility` para semântica de TalkBack/VoiceOver, contraste e escalonamento de texto.
- `$specsfy-specialist-design-system` para padrões macro de navegação, listas e estados de interface mobile.
- `$specsfy-specialist-mobile-deploy` para builds `flutter build appbundle` / `flutter build ipa` e publicação nas lojas.

Leia [references/standards.md](references/standards.md) para padrões de arquitetura em Dart 3, comparação Riverpod vs BLoC, comandos de teste e fontes oficiais do Flutter.
