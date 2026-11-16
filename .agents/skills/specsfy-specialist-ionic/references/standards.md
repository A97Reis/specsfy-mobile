# Padrões e referências Ionic Framework & Capacitor

## Anatomia de Página e Plugins Nativos

| Componente / Plugin | Uso Canônico | Armadilha Comum |
| --- | --- | --- |
| `IonPage` + `IonContent` | Envolve toda rota navegável; gerencia transições, teclado e scroll acelerado | Omitir `IonPage` quebra transições de pilha e sobrepõe telas anteriores |
| `IonRefresher` + `IonInfiniteScroll` | Pull-to-refresh e paginação incremental em listas mobile | Esquecer de chamar `event.detail.complete()` trava o spinner na tela |
| `@capacitor/app` | Monitorar `appStateChange` (foreground/background), deep links (`appUrlOpen`) e `backButton` | Não tratar o botão voltar no Android fecha o app abruptamente |
| `@capacitor/keyboard` | Controlar redimensionamento da WebView (`KeyboardResize.Body` / `Native`) | Formulários longos encobertos pelo teclado no iOS se `IonContent` não estiver no topo |

## Comandos de verificação

```bash
# Diagnóstico do ambiente Capacitor
npx cap doctor

# Build web e sincronização com projetos nativos Android/iOS
npm run build
npx cap sync

# Execução dos testes automatizados
npm test -- --run
```

## Fontes oficiais

- Documentação Oficial Ionic Framework: https://ionicframework.com/docs
- Documentação Oficial Capacitor: https://capacitorjs.com/docs
- Capacitor Official Plugins: https://capacitorjs.com/docs/apis
- Ionic Theming & Safe Areas: https://ionicframework.com/docs/theming/advanced
- Ionic Lifecycle Events: https://ionicframework.com/docs/react/lifecycle

