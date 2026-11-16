# Padrões e referências de Persistência Local Mobile

## Matriz de Engines por Plataforma

| Plataforma | Banco Relacional Embarcado | Armazenamento Chave-Valor | Armazenamento de Segredos (Hardware) | Ferramenta de Teste de Migration |
| --- | --- | --- | --- | --- |
| Android Nativo | Room (`androidx.room`) | Jetpack DataStore | Android Keystore | `MigrationTestHelper` + `inMemoryDatabaseBuilder` |
| iOS Nativo | SwiftData / CoreData | `UserDefaults` (não sensível) | iOS Keychain Services | `ModelConfiguration(isStoredInMemoryOnly: true)` |
| Kotlin Multiplatform | SQLDelight / Room KMP | Multiplatform Settings / DataStore KMP | `expect/actual` Keystore + Keychain | `JdbcSqliteDriver(JdbcSqliteDriver.IN_MEMORY)` |
| Flutter | Drift (`drift`) | `shared_preferences` | `flutter_secure_storage` | `NativeDatabase.memory()` + `SchemaVerifier` |
| React Native / Expo | `expo-sqlite` / WatermelonDB | `react-native-mmkv` | `expo-secure-store` / `react-native-keychain` | Adapter SQLite em memória no Jest |
| Ionic / Capacitor | `@capacitor-community/sqlite` | `@capacitor/preferences` | Plugin Keychain / Secure Storage | Mock/In-memory SQLite em Vitest/Jest |

## Modelo de Colunas para Sincronização Offline-First

Para toda tabela sincronizada com backend (ex.: Supabase):
- `id` (`TEXT` / `UUID` PK): Gerado no cliente para permitir relacionamento imediato sem rede.
- `sync_status` (`TEXT` NOT NULL): `'SYNCED'`, `'PENDING_INSERT'`, `'PENDING_UPDATE'`, `'PENDING_DELETE'`, `'CONFLICT'`.
- `updated_at` (`INTEGER` / `TEXT` ISO-8601 UTC): Usado para resolução Last-Write-Wins ou detecção de conflito.
- `deleted_at` (`INTEGER` / `TEXT` NULL): Suporte a soft-delete local até que o `DELETE` remoto seja confirmado.

## Fontes oficiais

- Android Offline-First Architecture: https://developer.android.com/topic/architecture/data-layer/offline-first
- Room Migrations Guide: https://developer.android.com/training/data-storage/room/migrating-db-versions
- SQLDelight Migrations: https://sqldelight.github.io/sqldelight/latest/multiplatform_sqlite/migrations/
- Drift Migrations (Flutter): https://drift.simonbinder.eu/Migrations/
- SwiftData Schema Migration: https://developer.apple.com/documentation/swiftdata/schemamigrationplan

