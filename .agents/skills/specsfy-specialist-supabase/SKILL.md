---
name: specsfy-specialist-supabase
description: "Projetar, implementar e revisar soluções Supabase para aplicativos móveis — Postgres, Auth (PKCE, Social Login, armazenamento seguro em Keychain/Keystore), Row Level Security (RLS), Storage, Realtime, Edge Functions e ambiente local. Use quando houver `supabase/config.toml`, migrations Supabase ou SDKs `@supabase/supabase-js`, `supabase_flutter` ou `supabase-kt`."
---

# Supabase (Mobile & Backend)

## Quando usar

- Acionar quando o projeto tem `supabase/config.toml`, migrations em `supabase/migrations/` ou clientes mobile do Supabase (`@supabase/supabase-js` em React Native/Ionic, `supabase_flutter` em Flutter, `io.github.jan-tennert.supabase` em Android/KMP/CMP, ou `supabase-swift` em iOS).
- Acionar também para modelar tabelas Postgres, escrever e auditar políticas Row Level Security (RLS), configurar fluxo Auth OAuth/PKCE com Deep Links mobile, buckets de Storage, canais Realtime e Edge Functions.
- Combinar com `$specsfy-specialist-mobile-persistence` quando os dados do Supabase forem sincronizados com um banco SQLite/Room/Drift/SwiftData local (Offline-First).

## Fluxo

1. Identificar o SDK cliente utilizado na plataforma mobile (`supabase_flutter`, `supabase-kt`, `supabase-swift` ou `@supabase/supabase-js`), schemas expostos via API, migrations existentes em `supabase/migrations/` e configuração de armazenamento seguro da sessão JWT.
2. Mapear identidades, tenants, papéis (`anon`, `authenticated`, papéis customizados) e a origem de cada claim usada em decisão de acesso (`auth.uid()`, `auth.jwt()`, `raw_app_meta_data`).
3. Modelar tabelas, índices, funções e views no Postgres via migrations versionadas (`supabase migration new`), garantindo índices em todas as colunas referenciadas por políticas RLS (`user_id`, `tenant_id`) e colunas de delta sync (`updated_at`).
4. Definir privilégios (`GRANT`) e políticas RLS explícitas para cada operação (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) e papel, negando acesso por padrão.
5. Configurar no cliente mobile a persistência segura do token de sessão (`Keychain` no iOS, `Keystore`/`EncryptedSharedPreferences` no Android, `expo-secure-store` no React Native, `flutter_secure_storage` no Flutter) e o refresh automático em transições de segundo plano para primeiro plano.
6. Validar Auth, Storage, Realtime e Edge Functions com testes positivos e negativos (incluindo usuário sem sessão `anon` e usuário de outro tenant) antes de concluir a entrega.

## Padrões

- Habilitar RLS (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) em 100% das tabelas em schemas expostos à API (`public`) e negar por padrão.
- Nunca embutir a chave `service_role` dentro do binário do aplicativo mobile (APK, AAB, IPA, bundle JS ou variáveis `EXPO_PUBLIC_*`); o app mobile utiliza exclusivamente a `anon` / `publishable key` combinada com o JWT do usuário autenticado e RLS no banco.
- Tratar como superfície crítica funções `SECURITY DEFINER` (exigindo `SET search_path = ''`), claims customizadas no JWT (usar apenas `raw_app_meta_data`, nunca `raw_user_meta_data` editável pelo cliente) e buckets do Supabase Storage.
- Versionar toda alteração de schema, trigger, função ou policy em `supabase/migrations/`; nunca editar o banco de produção manualmente pelo Dashboard sem migration correspondente.
- Em clientes mobile, gerenciar o ciclo de vida das conexões Realtime e do auto-refresh do Auth (`startAutoRefresh()` em foreground e `stopAutoRefresh()` em background) para economizar bateria e evitar tokens expirados.

## Antipadrões

- Policy `USING (true)` ou `WITH CHECK (true)` deixada em tabelas privadas, expondo todos os registros a qualquer requisição feita com a `anon` key extraída do pacote do app.
- Filtrar dados por `user_id` ou `tenant_id` apenas na query do app mobile (`.eq('user_id', currentUserId)`) sem política RLS equivalente no Postgres.
- Guardar a sessão do Supabase em `AsyncStorage` ou `SharedPreferences` em texto plano sem criptografia da plataforma.
- Manter múltiplos canais Realtime abertos sem cancelar a inscrição (`removeChannel` / `unsubscribe`) quando a tela mobile é descartada.

## Validação

- Provar acesso permitido e negado com identidades reais de teste para cada papel (`anon`, usuário dono do registro e usuário autenticado de outro tenant).
- Executar `supabase db reset` ou aplicar as migrations localmente verificando ausência de drift e presença de índices nas colunas das policies RLS.
- Confirmar no app mobile a restauração de sessão após fechar e reabrir o aplicativo e o comportamento de reconexão após modo avião.
- Não declarar uma tabela ou bucket "protegido por RLS" sem o teste negativo comprovando que o acesso não autorizado falha.

## Skills relacionadas

- `$specsfy-specialist-mobile-persistence` para sincronização Offline-First entre tabelas Supabase e bancos locais (Room, SQLDelight, Drift, SwiftData, WatermelonDB).
- `$specsfy-specialist-android`, `$specsfy-specialist-ios`, `$specsfy-specialist-flutter`, `$specsfy-specialist-react-native`, `$specsfy-specialist-ionic`, `$specsfy-specialist-kmp` e `$specsfy-specialist-cmp` para integração do SDK Supabase na plataforma mobile.
- `$specsfy-specialist-firebase` quando o projeto combinar Supabase (Postgres/Auth/Storage) com Firebase Cloud Messaging (FCM) e Crashlytics.
- `$specsfy-specialist-domain-modeling` para modelar entidades, agregados e limites de domínio antes do schema SQL.
- `$specsfy-specialist-software-architecture` para decisões de fronteira entre banco, Edge Functions e sincronização no cliente.

Leia [references/standards.md](references/standards.md) antes de alterar RLS, Auth, schemas expostos, Storage, Realtime ou estratégia de conexão.
