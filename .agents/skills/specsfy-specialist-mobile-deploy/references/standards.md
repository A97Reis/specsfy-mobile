# Padrões e referências de Release & Deploy Mobile

## Matriz de Artefatos e Assinatura por Loja

| Plataforma / Loja | Formato de Produção | Credencial de Assinatura | Trilha de Homologação | Automação Recomendada |
| --- | --- | --- | --- | --- |
| Google Play Store (Android) | `.aab` (Android App Bundle) | Upload Keystore (`.jks`) + Play App Signing + Service Account JSON | Internal Testing / Closed Track | Fastlane `supply` ou Gradle Play Publisher |
| Apple App Store (iOS) | `.ipa` (via `.xcarchive`) | Distribution Certificate + Provisioning Profile + App Store Connect API Key (`.p8`) | TestFlight (Internal & External) | Fastlane `match` + `gym` + `pilot` / Xcode Cloud |
| Expo / React Native | `.aab` (Android) e `.ipa` (iOS) | Credenciais gerenciadas pelo EAS ou locais via `credentials.json` (fora do Git) | Internal Distribution / TestFlight / Play Internal | `eas build --platform all` + `eas submit` |

## Checklist Pré-Submissão nas Lojas

1. **Versão sincronizada**: `node .agents/skills/specsfy-specialist-versioning/scripts/semver.mjs sync --project .` executado e `versionCode` / `CFBundleVersion` incrementados.
2. **Privacidade e Permissões**:
   - Android: Formulário *Data Safety* compatível com os SDKs incluídos e apenas permissões estritamente necessárias no `AndroidManifest.xml`.
   - iOS: `PrivacyInfo.xcprivacy` (Privacy Manifest) declarando APIs de razão exigida (`NSPrivacyAccessedAPITypes`) e `NS*UsageDescription` claras no `Info.plist`.
3. **Ofuscação e Símbolos**: R8 testado em build de release com regras `@Keep`/`@Serializable` preservadas; upload de `mapping.txt` e `dSYMs` ativo.

## Fontes oficiais

- Android App Signing & Play Console: https://developer.android.com/studio/publish/app-signing
- Shrink, obfuscate, and optimize with R8: https://developer.android.com/build/shrink-code
- Apple App Store Connect & TestFlight: https://developer.apple.com/testflight/
- Apple Privacy Manifest Files (`PrivacyInfo.xcprivacy`): https://developer.apple.com/documentation/bundleresources/privacy_manifest_files
- Fastlane Documentation: https://docs.fastlane.tools
- Expo Application Services (EAS Build & Submit): https://docs.expo.dev/build/introduction/

