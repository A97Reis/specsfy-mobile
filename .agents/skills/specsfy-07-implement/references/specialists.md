# Especialistas mobile para implementação

Detecte manifests e arquivos antes de carregar:

- `AndroidManifest.xml` / `com.android.application` → `specsfy-specialist-android`;
- `Package.swift` / `Podfile` / `Info.plist` → `specsfy-specialist-ios`;
- `pubspec.yaml` → `specsfy-specialist-flutter`;
- `react-native` / `expo` / `app.json` → `specsfy-specialist-react-native`;
- `ionic.config.json` / `capacitor.config.ts` → `specsfy-specialist-ionic`;
- `commonMain` (Kotlin Multiplatform) → `specsfy-specialist-kmp`;
- `org.jetbrains.compose` em `commonMain` → `specsfy-specialist-cmp`;
- `supabase/config.toml` ou SDKs Supabase → `specsfy-specialist-supabase`;
- `google-services.json` / `GoogleService-Info.plist` → `specsfy-specialist-firebase`;
- bancos locais e `[MIGRATION]` → `specsfy-specialist-mobile-persistence`;
- telas e fluxos visuais → `specsfy-specialist-design-system`,
  `specsfy-specialist-ui-design`, `specsfy-specialist-ux-design` e
  `specsfy-specialist-mobile-accessibility`.

No Antigravity, em projetos Android e CMP, combine também com `compose-preview`
(`android preview render`), `android-device-hub` e `android-cli` (`android layout`,
`android screen`).
