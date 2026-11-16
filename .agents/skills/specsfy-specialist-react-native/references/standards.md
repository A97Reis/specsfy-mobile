# Padrões e referências React Native & Expo

## Escolhas de Arquitetura no Ecossistema React Native

| Necessidade | Padrão Recomendado | Alternativa Suportada | Motivo Técnico |
| --- | --- | --- | --- |
| Roteamento e Deep Links | `expo-router` (file-based, typed routes) | `@react-navigation/native-stack` | Deep linking automático para todas as telas e layouts tipados |
| Listas de alta densidade | `@shopify/flash-list` | `FlatList` (com `windowSize` ajustado) | Reciclagem de views nativas na UI thread sem destruir instâncias |
| Armazenamento de Segredos | `expo-secure-store` | `react-native-keychain` | Usa Keystore (Android) e Keychain (iOS) criptografados por hardware |
| Estado de Servidor vs UI | `@tanstack/react-query` + `zustand` | Redux Toolkit (`@reduxjs/toolkit`) | Separa invalidação/cache de rede do estado síncrono da interface |

## Comandos de verificação

```bash
# Checagem estática de tipos TypeScript
npx tsc --noEmit

# Diagnóstico de compatibilidade de pacotes do Expo SDK
npx expo-doctor

# Execução da suíte Jest + React Native Testing Library
npx jest --watchAll=false
```

## Fontes oficiais

- Documentação Oficial React Native: https://reactnative.dev/docs/getting-started
- Documentação Oficial Expo: https://docs.expo.dev
- Expo Router Docs: https://docs.expo.dev/router/introduction/
- Shopify FlashList: https://shopify.github.io/flash-list/
- React Native Reanimated: https://docs.swmansion.com/react-native-reanimated/
- React Native Testing Library: https://callstack.github.io/react-native-testing-library/

