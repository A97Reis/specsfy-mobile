# Padrões e referências Firebase Mobile

## Matriz de Tratamento de Push Notifications (FCM + APNs)

| Estado do App | Payload `notification` | Payload `data` (Data-only) | Comportamento Esperado no App |
| --- | --- | --- | --- |
| **Foreground** (Aberto) | Entregue ao callback em memória do SDK | Entregue ao callback em memória | Exibir banner in-app discreto ou atualizar a UI sem interromper digitação |
| **Background** (Segundo plano) | Bandeja do sistema exibe automaticamente | Handler de background acordado (restrito no iOS sem `content-available: 1`) | Ao tocar na notificação, ler `data` e navegar para a rota via Deep Link |
| **Terminated** (Fechado) | Bandeja do sistema exibe automaticamente | No iOS exige `apns-push-type: background`; no Android exige prioridade alta | Recuperar a mensagem inicial no startup (`getInitialMessage`) e abrir a tela |

## Segurança em `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/tasks/{taskId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null
                    && request.auth.uid == userId
                    && request.resource.data.userId == userId;
    }
  }
}
```

## Fontes oficiais

- Documentação Firebase para Android: https://firebase.google.com/docs/android/setup
- Documentação Firebase para Apple (iOS): https://firebase.google.com/docs/ios/setup
- Documentação FlutterFire: https://firebase.google.com/docs/flutter/setup
- Firebase Cloud Messaging (FCM): https://firebase.google.com/docs/cloud-messaging
- Firebase Crashlytics: https://firebase.google.com/docs/crashlytics
- Firestore Security Rules: https://firebase.google.com/docs/firestore/security/get-started

