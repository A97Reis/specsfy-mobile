---
name: specsfy-specialist-mobile-persistence
description: "Projetar, implementar e revisar persistência local mobile e sincronização offline-first com Room, SQLDelight, Drift, SwiftData, CoreData, WatermelonDB, DataStore e Keychain/Keystore, incluindo migrations protegidas (`[MIGRATION]`). Use quando o app gravar dados locais ou sincronizar offline com Supabase/APIs; não use para modelagem exclusiva do Postgres remoto (`$specsfy-specialist-supabase`)."
---

# Persistência Local Mobile & Offline-First

## Quando usar

- Acionar quando o aplicativo móvel criar, alterar, migrar ou consultar bancos locais (`Room`, `SQLDelight`, `Drift`, `SwiftData`, `CoreData`, `WatermelonDB`, `expo-sqlite`) ou armazenamento chave-valor (`DataStore`, `MMKV`, `Keychain`, `EncryptedSharedPreferences`).
- Acionar obrigatoriamente quando uma tarefa da spec envolver a tag `[MIGRATION]` no banco embarcado do dispositivo ou sincronização offline-first com a nuvem.
- Não acionar para configurar policies RLS ou migrations exclusivas do servidor Supabase sem impacto local; usar `$specsfy-specialist-supabase` nesse caso.
- Combinar com `$specsfy-specialist-domain-modeling` ao definir invariantes de resolução de conflitos offline.

## Fluxo

1. Identificar a engine de persistência da plataforma (`Room` em Android/KMP, `SQLDelight` em KMP, `Drift` em Flutter, `SwiftData`/`CoreData` em iOS, `WatermelonDB`/`expo-sqlite` em React Native, `@capacitor-community/sqlite` em Ionic) e a versão atual do schema local.
2. Modelar tabelas/entidades locais com chave primária gerada no cliente (UUID v4/v7) e colunas de controle de sincronização (`sync_status`, `updated_at`, `deleted_at` para soft-delete offline).
3. Isolar toda mudança de schema local em uma migration explícita e numerada (`Migration(N, N+1)`, arquivos `.sqm` no SQLDelight, `schemaVersion` no Drift, `SchemaMigrationPlan` no SwiftData), vinculada a uma tarefa `[CODE] [MIGRATION]` na spec.
4. Implementar o fluxo Offline-First no repositório: leituras observam exclusivamente o banco local via stream reativo (`Flow`, `Stream`, `AsyncSequence`) enquanto escritas gravam localmente em transação atômica e enfileiram sincronização em segundo plano (`WorkManager`, `BGTaskScheduler`).
5. Proteger tokens, chaves de API e chaves de criptografia do SQLCipher usando hardware seguro (Android Keystore / iOS Keychain).
6. Executar testes automatizados de migração em banco em memória (`inMemoryDatabaseBuilder` / SQLite `:memory:`) provando preservação dos registros existentes da versão `N` para `N+1`.

## Padrões

- Toda leitura ou escrita em disco deve rodar fora da UI Thread (`Dispatchers.IO`, background `ModelActor`, `Isolate` ou worker assíncrono).
- Proibir migrations destrutivas em produção: toda evolução de schema em app publicado preserva os dados já gravados no aparelho do usuário.
- Exportar os schemas históricos do banco (`room.schemaLocation`, `.sqm` ou snapshots JSON do Drift) no repositório para permitir testes reais de upgrade entre qualquer versão anterior e a versão atual.
- Manter `.specsfy/DATABASE.md` sincronizado com as tabelas locais, colunas, índices e o estado de sincronização com a nuvem via `$specsfy-aux-database`.

## Antipadrões

- Habilitar `fallbackToDestructiveMigration()` em produção no Room/Drift, apagando todo o banco local do usuário quando uma versão nova do app é instalada.
- Fazer a tela aguardar o retorno HTTP da API antes de exibir o dado recém-salvo, quebrando a experiência em conexões móveis instáveis (3G/metrô/modo avião).
- Guardar coleções relacionais grandes serializadas como uma única string JSON dentro de `SharedPreferences`, `UserDefaults` ou `AsyncStorage`.
- Executar testes automatizados contra o arquivo SQLite real do simulador sem isolamento em memória, contaminando execuções subsequentes.

## Validação

- Executar testes automatizados de migration (`MigrationTestHelper` no Room, `SchemaVerifier` no Drift, `verifyMigrations` no SQLDelight) validando upgrade com dados reais inseridos na versão anterior.
- Simular perda de conexão (`Offline`), criar/editar registros localmente e comprovar reconciliação sem duplicação quando a rede retorna.
- Conferir `check_database_safety.mjs` garantindo isolamento total de banco em memória durante a suíte de testes.
- Não declarar uma migration ou camada offline-first concluída sem teste de preservação de dados passando.

## Skills relacionadas

- `$specsfy-specialist-android` para integração de Room, DataStore e WorkManager no Android.
- `$specsfy-specialist-ios` para SwiftData, CoreData, Keychain e `BGTaskScheduler` no iOS.
- `$specsfy-specialist-flutter` para Drift, Hive e `flutter_secure_storage` no Flutter.
- `$specsfy-specialist-react-native` para WatermelonDB, `expo-sqlite` e `expo-secure-store`.
- `$specsfy-specialist-ionic` para `@capacitor-community/sqlite` e Capacitor Preferences.
- `$specsfy-specialist-kmp` para SQLDelight e Room Multiplatform em `commonMain`.
- `$specsfy-specialist-supabase` quando os dados locais sincronizarem com tabelas Postgres/RLS no Supabase.
- `$specsfy-specialist-domain-modeling` para modelar invariantes e resolução de conflitos de sincronização.

Leia [references/standards.md](references/standards.md) para matriz de engines por plataforma, contrato de colunas offline-first e fontes oficiais.
