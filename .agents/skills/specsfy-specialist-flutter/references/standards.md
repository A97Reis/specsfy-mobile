# Padrões e referências Flutter & Dart

## Gerenciamento de Estado e Arquitetura

| Abordagem | Quando escolher | Padrão de modelagem em Dart 3 | Teste correspondente |
| --- | --- | --- | --- |
| Riverpod (`flutter_riverpod`) | Projetos que priorizam composição reativa, cache automático e injeção declarativa | `AsyncNotifier<T>` + `AsyncValue.when(data:, loading:, error:)` | `ProviderContainer(overrides: [...])` |
| BLoC / Cubit (`flutter_bloc`) | Fluxos orientados a eventos explícitos, rastreabilidade de transições e equipes grandes | `sealed class State` com pattern matching exaustivo `switch (state)` | `blocTest<MyBloc, MyState>(...)` |

## Performance de Renderização (Impeller & Árvore de Widgets)

- **Widgets vs Funções Auxiliares**: Extrair sub-componentes como classes `StatelessWidget` com construtor `const` permite ao Flutter pular a reconstrução da sub-árvore; métodos `_buildCard()` reconstroem toda vez que o pai atualiza.
- **Isolates (`Isolate.run`)**: Qualquer parsing de JSON volumoso (> 1 MB), compressão de imagem ou criptografia deve rodar em um Isolate separado via `Isolate.run(() => ...)` para não bloquear a UI thread.

## Comandos de verificação

```bash
# Análise estática e lints do Dart
flutter analyze

# Execução de testes unitários e de widget
flutter test

# Execução de um arquivo de teste específico
flutter test test/features/home/home_page_test.dart
```

## Fontes oficiais

- Documentação Oficial do Flutter: https://docs.flutter.dev
- Guia de Arquitetura Flutter: https://docs.flutter.dev/app-architecture
- Dart 3 Patterns & Sealed Classes: https://dart.dev/language/patterns
- Riverpod Documentation: https://riverpod.dev/docs/introduction/getting_started
- BLoC Library Documentation: https://bloclibrary.dev
- GoRouter Package: https://pub.dev/packages/go_router

