---
name: specsfy-specialist-ionic
description: "Projetar, implementar e revisar aplicativos móveis híbridos com Ionic Framework e Capacitor em TypeScript, incluindo componentes Ion*, adaptação Material/Cupertino, plugins nativos Capacitor e otimização de WebView. Use quando houver `ionic.config.json` ou `capacitor.config.ts`; não use para React Native nativo (`$specsfy-specialist-react-native`)."
---

# Ionic Framework & Capacitor

## Quando usar

- Acionar quando o projeto contém `ionic.config.json`, `capacitor.config.ts` ou `capacitor.config.json`, ou dependências `@ionic/*` e `@capacitor/*` em `package.json`.
- Acionar também para estruturar páginas com `IonPage`/`IonHeader`/`IonContent`/`IonTabs`, integrar plugins nativos do Capacitor (Câmera, Biometria, Push, Filesystem) e ajustar comportamento de WebView no Android e iOS.
- Não acionar para aplicações React Native/Expo que renderizam views nativas sem WebView; usar `$specsfy-specialist-react-native` nesse caso.
- Combinar com `$specsfy-specialist-supabase` para autenticação e dados via `@supabase/supabase-js` e com `$specsfy-specialist-mobile-persistence` para SQLite nativo (`@capacitor-community/sqlite`).

## Fluxo

1. Inspecionar `ionic.config.json`, `capacitor.config.ts`, o framework de UI subjacente (`@ionic/react`, `@ionic/angular` ou `@ionic/vue`) e as pastas nativas `android/` e `ios/`.
2. Estruturar cada tela com a hierarquia canônica do Ionic (`IonPage` > `IonHeader` > `IonToolbar` > `IonContent` > `IonFooter`), garantindo transições nativas e controle de scroll pelo `IonContent`.
3. Implementar navegação em abas (`IonTabs` + `IonRouterOutlet`) e listas com `IonRefresher` (pull-to-refresh) e `IonInfiniteScroll` / virtual scroll.
4. Encapsular chamadas de hardware e sistema operacional em serviços tipados que consomem `@capacitor/*`, tratando fallbacks seguros quando executados no navegador durante desenvolvimento.
5. Sincronizar alterações nativas com `npx cap sync` e configurar permissões correspondentes no `AndroidManifest.xml` e `Info.plist`.
6. Executar testes automatizados de componentes/serviços (`vitest` ou `jest`) e validar o build de produção antes do sync nativo.

## Padrões

- Respeitar as variáveis CSS de Safe Area do Ionic (`--ion-safe-area-top`, `--ion-safe-area-bottom`) e tokens de tema (`--ion-color-primary`, Dark Mode via `ion-palette-dark`).
- Gerenciar o botão físico/gesto de voltar do Android registrando listeners no `App.addListener('backButton', ...)` ou via `useBackButton` do Ionic.
- Utilizar hooks de ciclo de vida de página do Ionic (`ionViewWillEnter`, `ionViewDidLeave`) para atualizar dados ao retornar à tela na pilha de navegação.
- Substituir diálogos bloqueantes do browser (`window.alert`, `window.confirm`) por componentes nativos `IonAlert`, `IonActionSheet` e `IonToast`.
- Armazenar tokens sensíveis em plugins de armazenamento criptografado (Keychain/Keystore) em vez de `localStorage` vulnerável a limpeza pelo SO.

## Antipadrões

- Criar containers `<div style="overflow-y: scroll">` dentro de `IonContent`, quebrando o momentum scrolling nativo do iOS, o `IonRefresher` e o ajuste automático do teclado.
- Modificar arquivos gerados diretamente dentro de `android/app/src/main/assets/public` ou `ios/App/App/public` em vez de rodar o build e `npx cap copy` / `npx cap sync`.
- Esquecer de remover listeners de plugins Capacitor (`PluginListenerHandle.remove()`) ao desmontar componentes, gerando execução duplicada de eventos.
- Depender de `localStorage` ou `IndexedDB` puro para dados críticos sem persistência nativa, pois o iOS WKWebView pode expurgar dados sob pressão de armazenamento.

## Validação

- Validar compilação e tipagem com `npm run build` e `npx tsc --noEmit`.
- Executar suíte de testes unitários e de integração com `npm test` (Vitest/Jest + Testing Library) com mocks dos plugins `@capacitor/*`.
- Executar `npx cap doctor` e `npx cap sync` para comprovar integridade dos projetos nativos Android e iOS.
- Não declarar a entrega Ionic/Capacitor concluída sem testes passando e validação visual nos modos Material (`md`) e Cupertino (`ios`).

## Skills relacionadas

- `$specsfy-specialist-react-native` quando o projeto usar React Native/Expo em vez de Capacitor/Ionic.
- `$specsfy-specialist-android` e `$specsfy-specialist-ios` quando for necessário escrever um plugin Capacitor customizado em Kotlin ou Swift.
- `$specsfy-specialist-supabase` para integração de Auth, Database e Storage no cliente mobile.
- `$specsfy-specialist-mobile-persistence` para persistência SQLite offline-first via Capacitor SQLite.
- `$specsfy-specialist-mobile-accessibility` para leitores de tela, alvos de toque e contraste na WebView mobile.
- `$specsfy-specialist-mobile-deploy` para geração de AAB/IPA assinados a partir das pastas `android/` e `ios/` do Capacitor.

Leia [references/standards.md](references/standards.md) para hierarquia de layout Ionic, matriz de plugins Capacitor, ciclo de vida e fontes oficiais do Ionic e Capacitor.
