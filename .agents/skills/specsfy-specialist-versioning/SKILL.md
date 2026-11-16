---
name: specsfy-specialist-versioning
description: "Gerenciar o versionamento semântico (`SEMVER`) na raiz do projeto e sincronizá-lo com os manifests mobile: `versionCode`/`versionName` (Android Gradle), `CFBundleShortVersionString`/`CFBundleVersion` (iOS Info.plist), `version+build` (Flutter `pubspec.yaml`) e `app.json` (React Native/Expo). Use antes de releases, tags Git e builds de loja."
---

# Versionamento Mobile (`SEMVER`)

## Quando usar

- Acionar ao inicializar o controle de versão do aplicativo, incrementar versões (`patch`, `minor`, `major`) ou preparar um ciclo de release para Google Play Store, Apple App Store / TestFlight ou distribuição interna.
- Acionar sempre que for necessário sincronizar o arquivo `SEMVER` da raiz com os números de versão e códigos de build inteiros exigidos pelos manifests nativos mobile.
- Combinar com `$specsfy-specialist-mobile-deploy` durante o pipeline de assinatura e publicação nas lojas e com `$specsfy-specialist-gitflow` ao abrir ou fechar branches `release/*` e `hotfix/*`.

## Fluxo

1. Verificar a existência e validade do arquivo `SEMVER` na raiz do projeto executando `node .agents/skills/specsfy-specialist-versioning/scripts/semver.mjs current --project .` (ou inicializar com `init --initial 1.0.0`).
2. Classificar a mudança segundo SemVer 2.0.0:
   - `patch` (`X.Y.Z+1`): correções de bugs, ajustes visuais ou melhorias internas sem alterar fluxos ou contratos.
   - `minor` (`X.Y+1.0`): novas funcionalidades, novas telas ou capacidades retrocompatíveis.
   - `major` (`X+1.0.0`): reformulação arquitetural ou quebra incompatível de contrato/sincronização.
3. Incrementar a versão via CLI (`node .agents/skills/specsfy-specialist-versioning/scripts/semver.mjs bump <patch|minor|major> --project .`).
4. Sincronizar automaticamente a versão semântica e o código de build inteiro (`major * 10000 + minor * 100 + patch`) com os manifests nativos detectados no projeto (`sync --project .`):
   - **Android (`app/build.gradle.kts`)**: `versionName` e `versionCode`.
   - **iOS (`Info.plist`)**: `CFBundleShortVersionString` e `CFBundleVersion`.
   - **Flutter (`pubspec.yaml`)**: `version: X.Y.Z+BUILD`.
   - **React Native / Expo (`app.json` / `package.json`)**: `version`, `android.versionCode` e `ios.buildNumber`.
5. Verificar com `verify <X.Y.Z>` que o arquivo `SEMVER` e os manifests permanecem alinhados antes de gerar a tag Git e os artefatos `.aab`/`.ipa`.

## Padrões

- Manter o arquivo `SEMVER` na raiz como a única fonte canônica da versão do produto (uma única linha `MAJOR.MINOR.PATCH\n`).
- Garantir que o código de build inteiro (`versionCode` no Android e `CFBundleVersion` no iOS) seja estritamente crescente a cada versão gerada, usando a fórmula determinística `MAJOR * 10000 + MINOR * 100 + PATCH` (ex.: `1.2.3` -> `10203`).
- Executar a alteração de versão sempre pelo script `scripts/semver.mjs`, evitando edição manual dessincronizada entre Android e iOS.

## Antipadrões

- Atualizar `versionName` no Android e esquecer de atualizar `CFBundleShortVersionString` no iOS ou `pubspec.yaml` no Flutter.
- Manter o mesmo `versionCode` / `CFBundleVersion` ao subir um novo binário para o Google Play Console ou TestFlight (causa rejeição imediata no upload da loja).
- Usar sufixos arbitrários inválidos no arquivo `SEMVER` como `latest`, `v1.0` ou `1.0.0-beta` quando as lojas exigem `X.Y.Z` numérico estrito em `CFBundleShortVersionString`.

## Validação

- Consultar a versão atual e validar formato estrito com `node .agents/skills/specsfy-specialist-versioning/scripts/semver.mjs current --project .`.
- Executar `node .agents/skills/specsfy-specialist-versioning/scripts/semver.mjs sync --project .` e inspecionar `git diff` nos manifests mobile (`build.gradle.kts`, `Info.plist`, `pubspec.yaml`, `app.json`).
- Confirmar com `verify <versão>` que a versão gravada corresponde exatamente à release planejada.
- Não declarar o versionamento concluído sem a sincronização comprovada nos manifests da plataforma.

## Skills relacionadas

- `$specsfy-specialist-mobile-deploy` para assinatura de código, compilação de `.aab`/`.ipa` e publicação nas lojas após o bump de versão.
- `$specsfy-specialist-gitflow` para alinhamento do incremento de `SEMVER` com branches `release/*` e `hotfix/*` e tags Git.
- `$specsfy-specialist-android`, `$specsfy-specialist-ios`, `$specsfy-specialist-flutter`, `$specsfy-specialist-react-native` e `$specsfy-specialist-ionic` para os manifests específicos de cada plataforma.

Leia [references/standards.md](references/standards.md) para a regra de cálculo de `versionCode`/`buildNumber`, mapeamento de manifests mobile e fontes oficiais.
