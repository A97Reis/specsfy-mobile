# Padrões e referências de Versionamento Mobile (`SEMVER`)

## Mapeamento entre `SEMVER` e Manifests Nativos Mobile

Para uma versão `SEMVER = 1.2.3`, o código numérico de build calculado é `10203` (`1 * 10000 + 2 * 100 + 3`):

| Plataforma | Arquivo Manifest | Versão Visível ao Usuário | Código Interno da Loja (Monotônico) |
| --- | --- | --- | --- |
| Android / KMP / CMP | `app/build.gradle.kts` ou `composeApp/build.gradle.kts` | `versionName = "1.2.3"` | `versionCode = 10203` (Inteiro positivo) |
| iOS Nativo | `ios/App/Info.plist` / `iosApp/Info.plist` | `CFBundleShortVersionString` = `1.2.3` | `CFBundleVersion` = `10203` |
| Flutter | `pubspec.yaml` | `version: 1.2.3+10203` (parte antes do `+`) | `version: 1.2.3+10203` (parte após o `+`) |
| React Native / Expo | `app.json` + `package.json` | `"version": "1.2.3"` | `"android": { "versionCode": 10203 }`, `"ios": { "buildNumber": "10203" }` |

## Comandos do Utilitário `semver.mjs`

```bash
# Inicializar SEMVER na raiz
node .agents/skills/specsfy-specialist-versioning/scripts/semver.mjs init --initial 1.0.0 --project .

# Ler a versão atual
node .agents/skills/specsfy-specialist-versioning/scripts/semver.mjs current --project .

# Incrementar versão (patch, minor ou major) e sincronizar manifests
node .agents/skills/specsfy-specialist-versioning/scripts/semver.mjs bump minor --project .

# Sincronizar manifests nativos com o SEMVER atual
node .agents/skills/specsfy-specialist-versioning/scripts/semver.mjs sync --project .

# Verificar se o SEMVER corresponde ao valor esperado em CI
node .agents/skills/specsfy-specialist-versioning/scripts/semver.mjs verify 1.1.0 --project .
```

## Fontes oficiais

- Semantic Versioning 2.0.0: https://semver.org/lang/pt-BR/
- Android App Versioning (`versionCode` & `versionName`): https://developer.android.com/studio/publish/versioning
- Apple Bundle Version Strings (`CFBundleShortVersionString` & `CFBundleVersion`): https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleshortversionstring
- Flutter Build and Release Versioning: https://docs.flutter.dev/deployment/android#updating-the-apps-version-number
- Expo App Version Management: https://docs.expo.dev/build-reference/app-versions/
