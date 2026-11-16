---
name: specsfy-specialist-firebase
description: "Projetar, implementar e revisar integrações Firebase em aplicativos móveis (Android, iOS, Flutter, React Native, Ionic) — Auth, Firestore, Cloud Messaging (FCM), Crashlytics, Remote Config e App Distribution. Use quando houver `google-services.json`, `GoogleService-Info.plist` ou `firebase.json`; para backend em Supabase use `$specsfy-specialist-supabase`."
---

# Firebase Mobile

## Quando usar

- Acionar quando o repositório contém `google-services.json` (Android), `GoogleService-Info.plist` (iOS), `firebase.json` ou SDKs Firebase (`firebase-*`, `firebase_core`, `@react-native-firebase/*`).
- Acionar também para configurar notificações Push com Firebase Cloud Messaging (FCM), relatórios de falha com Crashlytics, feature flags com Remote Config, regras de segurança do Firestore (`firestore.rules`) e distribuição para testers via App Distribution.
- Não acionar quando o backend for exclusivamente Supabase sem serviços Firebase; usar `$specsfy-specialist-supabase` (ou combinar ambos quando o projeto usar Supabase para banco/Auth e Firebase para FCM/Crashlytics).

## Fluxo

1. Inspecionar os arquivos de configuração por ambiente (`dev`, `staging`, `prod`) associados aos build variants/flavors do Android e schemes do Xcode.
2. Configurar e auditar regras de segurança (`firestore.rules` e `storage.rules`) negando acesso por padrão e validando `request.auth != null` e propriedade do documento.
3. Implementar o ciclo completo do Firebase Cloud Messaging (FCM): solicitação contextual de permissão no Android 13+ (`POST_NOTIFICATIONS`) e iOS (`UNUserNotificationCenter`), registro/atualização do token via `onNewToken`, canais de notificação no Android e tratamento de deep links em foreground/background/terminated.
4. Configurar o Firebase Crashlytics com upload automático de símbolos de desofuscação (mapping R8/ProGuard no Android e dSYMs no iOS) e registro de breadcrumbs sem dados pessoais (PII).
5. Definir valores padrão locais (`setDefaultsAsync`) para todas as chaves consumidas do Firebase Remote Config, garantindo funcionamento pleno no primeiro boot offline.
6. Validar regras localmente com a Firebase Local Emulator Suite antes de publicar alterações de segurança.

## Padrões

- Separar projetos Firebase por ambiente (`-dev`, `-prod`) para nunca disparar notificações push de teste ou sujar métricas do Crashlytics de produção.
- Solicitar permissão de notificações push apenas em um momento de valor claro para o usuário (ex.: após login ou ao ativar alertas), nunca no primeiro milissegundo da splash screen.
- Configurar `firestore.indexes.json` versionado no Git para toda query composta (`where` + `orderBy` em campos distintos).
- Sanitizar logs enviados ao `Crashlytics.recordError` / `log`, proibindo envio de CPF, e-mail, senha ou tokens JWT nos relatórios de crash.

## Antipadrões

- Publicar `firestore.rules` com `allow read, write: if true;` ou mesmo `allow read, write: if request.auth != null;` sem restringir quais documentos cada `request.auth.uid` pode ler ou alterar.
- Versionar chaves privadas de Service Account (`firebase-adminsdk-*.json`) dentro do código-fonte ou dentro do pacote APK/IPA do aplicativo.
- Realizar leituras de coleções inteiras no Firestore sem `.limit(N)` e paginação por cursor (`startAfterDocument`), gerando explosão de custo e lentidão no cliente mobile.

## Validação

- Testar `firestore.rules` com casos positivos (dono do recurso) e negativos (usuário não autenticado e usuário de outro tenant) no Firebase Emulator.
- Comprovar recebimento de Push Notification nos 3 estados do aplicativo: aberto (`foreground`), segundo plano (`background`) e fechado (`terminated`).
- Verificar que símbolos de release (R8 mapping / dSYM) estão configurados no build para desofuscar stack traces no Crashlytics.
- Não declarar a integração Firebase pronta sem validação negativa das regras de segurança e teste de ciclo de vida do token FCM.

## Skills relacionadas

- `$specsfy-specialist-supabase` quando o app usar Supabase para Postgres/Auth/RLS e Firebase apenas para Push (FCM) e Crashlytics.
- `$specsfy-specialist-android` para configuração do plugin Gradle `com.google.gms.google-services`, canais de notificação e R8.
- `$specsfy-specialist-ios` para configuração de APNs (Apple Push Notification service), `GoogleService-Info.plist` e dSYMs no Xcode.
- `$specsfy-specialist-flutter` para configuração via `flutterfire configure` (`firebase_options.dart`).
- `$specsfy-specialist-react-native` para integração com `@react-native-firebase/*` e `expo-notifications`.
- `$specsfy-specialist-mobile-deploy` para automação de entregas internas com Firebase App Distribution e Fastlane.

Leia [references/standards.md](references/standards.md) para regras de segurança do Firestore, matriz de estados de Push Notification (FCM/APNs) e fontes oficiais do Firebase.
