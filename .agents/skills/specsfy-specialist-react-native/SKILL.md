---
name: specsfy-specialist-react-native
description: "Projetar, implementar e revisar aplicativos React Native e Expo em TypeScript com New Architecture (Fabric/TurboModules), Expo Router/React Navigation, FlashList, Reanimated, Zustand/TanStack Query e React Native Testing Library. Use quando houver `react-native` ou `expo` em `package.json`; não use para WebViews híbridas com Ionic (`$specsfy-specialist-ionic`)."
---

# React Native & Expo

## Quando usar

- Acionar quando `package.json` contém `react-native` ou `expo`, ou quando existem `app.json` / `app.config.ts` / `metro.config.js`.
- Acionar também para estruturar rotas no Expo Router (`app/`) ou React Navigation, otimizar listas longas com `@shopify/flash-list`, criar animações na UI thread com `react-native-reanimated` e escrever testes com `@testing-library/react-native`.
- Não acionar quando o aplicativo for híbrido baseado em WebView com componentes `Ion*` e Capacitor; usar `$specsfy-specialist-ionic` nesse caso.
- Combinar com `$specsfy-specialist-supabase` ao integrar `@supabase/supabase-js` com `expo-secure-store` e com `$specsfy-specialist-mobile-persistence` para bancos SQLite/WatermelonDB locais.

## Fluxo

1. Inspecionar `package.json`, `app.json`/`app.config.ts`, versão do Expo SDK / React Native e habilitação da New Architecture (Fabric & TurboModules).
2. Estruturar o roteamento com Expo Router (grupos `(tabs)`, `(auth)`, modais e deep links tipados) ou React Navigation com tipos estritos em TypeScript.
3. Construir telas usando `SafeAreaView` / `useSafeAreaInsets` de `react-native-safe-area-context`, `Pressable` com feedback visual e listas recicladas (`FlashList` ou `FlatList`).
4. Separar estado do servidor (`@tanstack/react-query`) do estado efêmero/cliente (`zustand`), persistindo tokens exclusivamente em `expo-secure-store` ou `react-native-keychain`.
5. Tratar teclado virtual com `KeyboardAvoidingView` ou `react-native-keyboard-controller` e configurar `keyboardType`, `returnKeyType` e `autoCapitalize` em todos os `TextInput`.
6. Validar tipagem (`npx tsc --noEmit`) e executar suítes de comportamento com Jest + `@testing-library/react-native` (e fluxos E2E com Maestro quando aplicável).

## Padrões

- Renderizar qualquer coleção dinâmica com `FlashList` (definindo `estimatedItemSize`) ou `FlatList` com `keyExtractor` estável e `refreshing`/`onRefresh` para pull-to-refresh.
- Executar animações gestuais e transições em worklets do `react-native-reanimated` (`useSharedValue`, `useAnimatedStyle`) para manter 60/120 fps sem bloquear a JS thread.
- Armazenar tokens de sessão do Supabase/Auth exclusivamente em `expo-secure-store` ou `react-native-keychain`, nunca em `AsyncStorage` puro.
- Garantir `hitSlop` ou dimensão mínima de `48x48 dp` / `44x44 pt` em botões compactos e preencher `accessibilityRole`, `accessibilityLabel` e `accessibilityState`.
- Usar `StyleSheet.create` ou NativeWind com tokens consistentes de espaçamento e suporte a `useColorScheme()` (Light/Dark mode).

## Antipadrões

- Usar `ScrollView` com `.map()` para listas de tamanho variável, instanciando centenas de views nativas de uma só vez e causando queda de frames ou crash por memória.
- Aninhar `FlatList` vertical dentro de `ScrollView` na mesma orientação de rolagem, quebrando a virtualização de janela.
- Guardar credenciais, chaves ou JWTs em `@react-native-async-storage/async-storage` sem criptografia em nível de hardware.
- Deixar `console.log` ou computações pesadas síncronas dentro de callbacks de scroll/render na thread JavaScript.

## Validação

- Executar verificação de tipos TypeScript (`npx tsc --noEmit`) e linter (`npx expo lint` ou `npm run lint`).
- Executar testes automatizados de componentes e telas com `npm test -- --watchAll=false` usando `@testing-library/react-native`.
- Validar comportamento de teclado, Safe Area, estados `Loading`/`Empty`/`Error`/`Offline` e fluidez de listas em simulador iOS e emulador Android.
- Não declarar a entrega React Native concluída sem testes automatizados passando e tipagem sem erros.

## Skills relacionadas

- `$specsfy-specialist-ionic` para aplicativos híbridos baseados em WebView com Ionic/Capacitor.
- `$specsfy-specialist-supabase` para autenticação mobile, RLS e Realtime com `@supabase/supabase-js`.
- `$specsfy-specialist-mobile-persistence` para bancos offline-first com WatermelonDB, `expo-sqlite` ou `op-sqlite` e tarefas `[MIGRATION]`.
- `$specsfy-specialist-mobile-accessibility` para auditoria de TalkBack/VoiceOver, `accessibilityRole` e Dynamic Type.
- `$specsfy-specialist-design-system` para diretrizes visuais mobile em `DESIGNSYSTEM.MD`.
- `$specsfy-specialist-mobile-deploy` para builds com EAS Build / Fastlane e publicação nas lojas.

Leia [references/standards.md](references/standards.md) para arquitetura Expo Router, configuração segura de sessão, otimização de listas e fontes oficiais do React Native e Expo.
