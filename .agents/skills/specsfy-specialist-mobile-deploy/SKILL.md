---
name: specsfy-specialist-mobile-deploy
description: "Projetar, implementar e revisar pipelines de build, assinatura de código (Keystore, Provisioning Profiles, Fastlane Match) e publicação mobile (AAB/APK no Google Play Console, IPA no TestFlight/App Store Connect, EAS Build e Firebase App Distribution). Use para preparar releases mobile, CI/CD e staged rollout; sincronize versões com `$specsfy-specialist-versioning`."
---

# Release & Deploy Mobile

## Quando usar

- Acionar quando a tarefa envolver assinatura de código mobile (Android Keystore, certificados iOS e Provisioning Profiles), geração de artefatos de release (`AAB`, `APK`, `IPA`), configuração de Fastlane / EAS Build / GitHub Actions ou publicação nas lojas (Google Play Console, Apple App Store Connect / TestFlight, Firebase App Distribution).
- Acionar também para planejar estratégias de **Staged Rollout** (lançamento gradual), **In-App Updates** e **Force Update** (bloqueio de versões obsoletas).
- Combinar obrigatoriamente com `$specsfy-specialist-versioning` para sincronizar o arquivo `SEMVER` com `versionCode`/`versionName` e `CFBundleShortVersionString`/`CFBundleVersion` antes do build.

## Fluxo

1. Sincronizar a versão canônica do arquivo `SEMVER` na raiz com os manifests nativos usando `$specsfy-specialist-versioning` (`node .agents/skills/specsfy-specialist-versioning/scripts/semver.mjs sync --project .`), garantindo incremento estrito do build number inteiro (`versionCode` / `CFBundleVersion`).
2. Configurar e auditar o isolamento de credenciais de assinatura:
   - **Android**: Upload Keystore (`.jks`) fora do Git, injetado via variáveis de ambiente ou arquivo local ignorado no `.gitignore`, com Play App Signing ativo no Google Play Console.
   - **iOS**: Certificados e Provisioning Profiles gerenciados via `Fastlane Match` (repositório privado criptografado) ou App Store Connect API Key (`.p8`) em CI.
3. Habilitar otimização, minificação e ofuscação de release (R8 / ProGuard com `isMinifyEnabled = true` e `isShrinkResources = true` no Android; compilação Release com geração de `dSYM` no iOS) preservando regras de serialização (`@Serializable`, `Codable`, Retrofit/Ktor).
4. Gerar os artefatos assinados e produzir em paralelo os arquivos de símbolos de debug (`mapping.txt` e `dSYMs`) para upload automático ao Play Console / Crashlytics.
5. Distribuir primeiro em trilha fechada (`Internal Testing` no Google Play, `TestFlight` na Apple ou `Firebase App Distribution`) e validar instalação limpa e atualização sobre a versão anterior.
6. Promover para produção em **Staged Rollout** (`10% -> 25% -> 50% -> 100%`), monitorando Crash-free users e taxa de ANR antes de expandir para 100%.

## Padrões

- Gerar sempre **Android App Bundle (`.aab`)** para submissão na Google Play Store, reservando `.apk` apenas para distribuição direta em testes internos ou sideloading controlado.
- Nunca reutilizar o mesmo `versionCode` (Android) ou `CFBundleVersion` (iOS) em duas submissões às lojas: ambas as lojas rejeitam binários com número de build repetido ou menor que o anterior.
- Implementar verificação de versão mínima suportada (`min_supported_version`) no startup do aplicativo via Remote Config ou endpoint de health/configuração para permitir **Force Update** caso uma falha crítica de contrato ou segurança exija atualização imediata.
- Manter `.gitignore` bloqueando explicitamente `*.jks`, `*.keystore`, `*.p12`, `*.p8`, `*.mobileprovision`, `key.properties` e `service-account*.json`.

## Antipadrões

- Comitar arquivos `.jks`, `.keystore`, `.p12`, `.mobileprovision` ou senhas de assinatura no repositório Git (mesmo em repositório privado).
- Testar apenas em build `debug` e publicar em `release` sem testar o binário minificado pelo R8/ProGuard, causando crashes em produção por classes removidas por reflexão/serialização.
- Publicar uma nova release diretamente para `100%` da base de usuários sem passar por trilha interna/TestFlight e sem rollout gradual.

## Validação

- Executar `./gradlew bundleRelease` (Android), `flutter build appbundle --release` (Flutter) ou `xcodebuild archive` / `fastlane beta` validando geração limpa do artefato assinado.
- Testar o binário de `release` real (com R8/minificação ativa) em dispositivo físico ou emulador antes de promover nas lojas.
- Confirmar com `git status --ignored` que nenhuma chave ou certificado de assinatura ficou exposto na árvore versionada.
- Não declarar o pipeline de release pronto sem artefato de release compilado e sincronização do `SEMVER` verificada.

## Skills relacionadas

- `$specsfy-specialist-versioning` para gerenciamento do arquivo `SEMVER` e sincronização automática com Gradle, Info.plist, `pubspec.yaml` e `app.json`.
- `$specsfy-specialist-android` para configuração de build variants, R8/ProGuard e `build.gradle.kts`.
- `$specsfy-specialist-ios` para configurações de Xcode Schemes, Entitlements e App Store Connect.
- `$specsfy-specialist-flutter` para builds multiplataforma Flutter (`flutter build appbundle` / `ipa`).
- `$specsfy-specialist-react-native` para configuração de `eas.json` (EAS Build / EAS Update) e Fastlane.
- `$specsfy-specialist-ionic` para sincronização (`npx cap sync`) e compilação dos projetos nativos Android e iOS.
- `$specsfy-specialist-firebase` para upload de símbolos ao Crashlytics e distribuição via Firebase App Distribution.
- `$specsfy-specialist-gitflow` quando o projeto utilizar branches `release/*` e `hotfix/*` associadas ao pipeline de publicação.

Leia [references/standards.md](references/standards.md) para checklist de submissão Play Store e App Store, comandos de build de release e fontes oficiais.
