# Specsfy Mobile (Antigravity Edition)

> **Specify. Prove. Ship.** — Metodologia Orientada por Especificações (*Spec-Driven Development*) 100% focada em desenvolvimento Mobile (**Android, iOS, Flutter, React Native, Ionic, KMP, CMP**) e **Supabase**, otimizada para uso no **Google Antigravity**.
>
> 🔗 **Repositório Oficial**: `https://github.com/A97Reis/specsfy-mobile`

---

## 📱 Plataformas & Especialistas Incluídos (44 Skills em `.agents/skills/`)

Todas as **19 skills estruturais** e **25 skills especialistas** coexistem na mesma pasta `.agents/skills/` com a anatomia canônica do Specsfy (`SKILL.md`, `agents/openai.yaml`, `references/standards.md` e `scripts/`):

- **Android Nativo** (`specsfy-specialist-android`): Kotlin, Jetpack Compose, Material 3, ViewModel/StateFlow, Coroutines, Navigation Compose, Hilt/Koin, Room e WorkManager + integração com `compose-preview`, `android-device-hub` e `android-cli`.
- **iOS Nativo** (`specsfy-specialist-ios`): Swift 6, SwiftUI, Apple HIG, Swift Concurrency (`async/await`, `Actor`), NavigationStack, SwiftData/CoreData e Keychain.
- **Flutter** (`specsfy-specialist-flutter`): Dart 3, Widgets imutáveis, Riverpod, BLoC, GoRouter, Material 3 & Cupertino, Drift e testes.
- **React Native & Expo** (`specsfy-specialist-react-native`): TypeScript, New Architecture (Fabric/TurboModules), Expo SDK, Expo Router, FlashList, Reanimated e RNTL.
- **Ionic & Capacitor** (`specsfy-specialist-ionic`): TypeScript, Componentes `Ion*`, Temas Material/Cupertino, Capacitor Bridge e Plugins Nativos.
- **Kotlin Multiplatform - KMP** (`specsfy-specialist-kmp`): Lógica compartilhada em `commonMain` para Android e iOS, Ktor Client, Serialization, Koin e SKIE.
- **Compose Multiplatform - CMP** (`specsfy-specialist-cmp`): UI declarativa compartilhada Android/iOS em `commonMain` com `composeResources` e `compose-preview`.
- **Supabase & Firebase** (`specsfy-specialist-supabase`, `specsfy-specialist-firebase`): Postgres, Auth PKCE, Row Level Security (RLS), Storage, Realtime, Edge Functions, FCM Push e Crashlytics.
- **Transversais Mobile**: `specsfy-specialist-mobile-persistence`, `specsfy-specialist-design-system`, `specsfy-specialist-interface-experience`, `specsfy-specialist-ui-design`, `specsfy-specialist-ux-design`, `specsfy-specialist-mobile-accessibility`, `specsfy-specialist-versioning`, `specsfy-specialist-mobile-deploy`, `specsfy-specialist-software-architecture`, `specsfy-specialist-domain-modeling`, `specsfy-specialist-code-review`, `specsfy-specialist-debugging`, `specsfy-specialist-technical-research`, `specsfy-specialist-prototyping`, `specsfy-specialist-gitflow`, `specsfy-specialist-merge-conflict-resolution`.

---

## 🌐 Passo a Passo: Como Buscar a Estrutura Direto do GitHub (Sem Alterar o Repositório do Git)

Sempre que você criar ou abrir um projeto mobile novo ou existente, você pode puxar **apenas a estrutura do Specsfy Mobile** direto do GitHub (`https://github.com/A97Reis/specsfy-mobile`), **sem alterar este repositório no GitHub** e **sem sobrescrever o `.git` do seu aplicativo**.

### Passo 1 — Importar a Estrutura do GitHub para o seu Projeto Mobile

Abra o terminal na raiz do seu aplicativo mobile (ou peça ao próprio Antigravity para executar) usando **qualquer uma das 3 opções abaixo**:

#### Opção 1 (Recomendada): Comando único via `npx` direto do GitHub
Executa o instalador diretamente do GitHub em cache temporário e copia apenas a estrutura (`.agents/skills/`, `.specsfy/`, `specs/`, `GEMINI.md`, `AGENTS.md`) para o seu projeto atual:

```bash
# Detecta automaticamente a stack mobile do projeto atual e instala as skills necessárias:
npx --yes github:A97Reis/specsfy-mobile --project . --detected

# Ou, se o projeto ainda estiver vazio e você quiser copiar TODAS as 44 skills de uma vez:
npx --yes github:A97Reis/specsfy-mobile --project . --all
```

#### Opção 2: Clone descartável em pasta temporária (PowerShell — Windows)
Baixa do GitHub em uma pasta temporária do sistema, instala a estrutura no projeto atual e apaga o clone temporário imediatamente (não toca no `.git` do seu app):

```powershell
$tmp = Join-Path $env:TEMP "specsfy-mobile-$(Get-Random)"; git clone --depth 1 https://github.com/A97Reis/specsfy-mobile.git $tmp; node "$tmp/scripts/install-mobile.mjs" --project . --all; Remove-Item -Recurse -Force $tmp
```

#### Opção 3: Instalar ou atualizar uma skill específica via `npx skills add`
Se você quiser buscar apenas uma skill ou especialista específico do seu GitHub:

```bash
npx skills add https://github.com/A97Reis/specsfy-mobile --skill specsfy-specialist-flutter --agent universal --copy -y --full-depth
```

---

### Passo 2 — Inicializar o Contexto do App no Antigravity (`$specsfy-setup`)

Com a estrutura copiada para o seu projeto, digite no chat do **Google Antigravity**:

```text
Execute o $specsfy-setup no diretório atual
```

**O que acontece:**
- O agente lê os manifestos do seu app (`build.gradle.kts`, `pubspec.yaml`, `Package.swift`, `package.json`, `supabase/config.toml`, etc.).
- Gera os documentos vivos do seu projeto (`PROJECT.md`, `INTERFACE.md`, `DESIGNSYSTEM.MD`, `.specsfy/STACK.md`, `.specsfy/DATABASE.md`, `.specsfy/RULES.md`, `.specsfy/PACKAGES.md` e `.specsfy/USER-PROFILE.md`).
- Faz perguntas numeradas (`ask_question`) somente sobre decisões que ainda não existam no código.

---

### Passo 3 — Capturar Ideias ou Importar seu MVP

Escolha conforme a sua necessidade:

- **Para importar um `MVP.md` completo (App novo)**:
  ```text
  Importe o MVP.md usando $specsfy-mvp-milestone-interviewer
  ```
- **Para anotar uma ideia rápida sem perguntas (`specs/inbox/`)**:
  ```text
  Use $specsfy-01-inbox: Quero criar a tela de pedidos com Pull-to-Refresh, filtro por status em BottomSheet e cache offline no banco local.
  ```
- **Para refinar a ideia em Backlog com entrevista guiada (`specs/backlog/`)**:
  ```text
  Refine a última captura da inbox com $specsfy-02-backlog
  ```

---

### Passo 4 — Executar os 3 Atos (Especificar → Planejar/TDD → Implementar)

1. **Ato I — Especificar e Validar (`draft` → `defined`)**:
   ```text
   Crie a especificação a partir do backlog com $specsfy-03-specify e valide com $specsfy-04-validate
   ```
   - Cria `specs/draft/NNNN-slug/spec.md` com requisitos (`US`, `FR`, `NFR`), no mínimo 3 cenários BDD Gherkin (`AC`) por requisito e contrato de interface mobile na Seção 10.
   - Valida o `Definition Gate: Passed` e move para `specs/defined/`.

2. **Ato II — Planejar Tarefas e Provar o RED em TDD (`defined` → `planned`)**:
   ```text
   Planeje as tarefas da spec com $specsfy-05-tasks e gere os testes TDD em RED com $specsfy-06-tdd-bdd
   ```
   - Decompõe a Seção 14 em tarefas `[TEST] [TDD]`, `[CODE] [MIGRATION]` e `Fase de interface`.
   - Cria os testes executáveis (`*Test.kt`, `*Tests.swift`, `*_test.dart`, `*.test.tsx`) com marcador `SPECSFY:`, comprova o **RED**, aprova o `Plan Gate: Passed` e move para `specs/planned/`.

3. **Ato III — Implementar no GREEN, Revisar Visualmente e Documentar (`planned` → `in-progress` → `review` → `completed`)**:
   ```text
   Implemente a spec com $specsfy-07-implement
   ```
   - Executa cada tarefa na ordem `PREP` → `EXECUTE` (**GREEN**) → `VERIFY` → **`VISUAL`** (inspecionando `SafeArea`/`WindowInsets`, estados `Loading/Empty/Error/Offline`, Dark Mode e usando `compose-preview` / `android-device-hub` / `android-cli` quando aplicável) → `EVIDENCE` → `IMPROVE`.
   - Atualiza `docs/` e `.specsfy/PACKAGES.md` automaticamente via `$specsfy-documentator`.

---

### Passo 5 — Comandos do Dia a Dia no Projeto Consumidor

| Objetivo | Comando no Chat do Antigravity ou Terminal |
| --- | --- |
| **Alterar requisito de uma spec já aprovada** | `Use $specsfy-update-spec na spec 0001: adicionar login social com Apple e Google` |
| **Ver progresso geral das specs e tarefas** | `Mostre o progresso do projeto com $specsfy-progress` |
| **Registrar regra permanente do projeto** | `Use $specsfy-aux-rules: toda lista deve suportar Pull-to-Refresh e Skeleton loading` |
| **Fazer Code Review de uma branch ou PR** | `Revise as alterações atuais com $specsfy-specialist-code-review` |
| **Incrementar versão (`SEMVER`) e sincronizar manifests mobile** | `node .agents/skills/specsfy-specialist-versioning/scripts/semver.mjs bump minor --project .` |
| **Preparar build de loja (`.aab`/`.ipa`) e Staged Rollout** | `Use $specsfy-specialist-mobile-deploy para preparar o release` |
