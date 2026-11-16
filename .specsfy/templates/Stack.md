# Tecnologias Estruturais (Mobile)

Este documento registra a stack tecnológica identificada no projeto, suas evidências e restrições de ambiente móvel.

---

## 1. Stack Estrutural Detectada

| Categoria | Tecnologia | Evidência Local |
| :--- | :--- | :--- |
{{STACK_ROWS}}

---

## 2. Configurações de Plataforma e Dispositivo

- **Ambiente de Desenvolvimento**: Mobile (Android / iOS / Multiplataforma)
- **Target SDKs / Versões Mínimas**:
  - Android: `minSdk` e `targetSdk` definidos no Gradle.
  - iOS: `iOS Deployment Target` definido no projeto/Podfile.
- **Gerenciador de Dependências**: Gradle / Pubspec / SPM / CocoaPods / npm / pnpm / yarn / bun
- **Estratégia de Persistência Local**: Banco embarcado (Room, SQLDelight, Drift, SwiftData, WatermelonDB) ou chave-valor (DataStore, MMKV, SecureStorage/Keychain).
- **Backend / BaaS**: Supabase, Firebase ou API REST/GraphQL.
