# Modelo de Persistência e Dados (Mobile)

Este documento registra a estratégia de dados da aplicação móvel, cobrindo persistência local no dispositivo, sincronização offline e esquema remoto (ex.: Supabase / Backend).

---

## 1. Visão Geral da Arquitetura de Dados

- **Plataforma / Stack**: {{STACK_LABEL}}
- **Diretriz de Dados**: {{STACK_GUIDANCE}}
- **Estratégia de Cache e Offline**: Offline-first com sincronização assíncrona ou cache sob demanda.

---

## 2. Entidades Persistentes Locais (Dispositivo)

| Entidade / Tabela | Engine Local (Room, SQLDelight, Drift, SwiftData, etc.) | Chave Primária | Índices | Estratégia de Sincronização |
| :--- | :--- | :--- | :--- | :--- |
| Exemplo | SQLite local | `id UUID` | `idx_updated_at` | Enfileirada para sync remoto |

---

## 3. Armazenamento Seguro e Preferências

| Tipo | Chaves / Dados | Mecanismo Seguro (Keystore / Keychain / MMKV) | Finalidade |
| :--- | :--- | :--- | :--- |
| Tokens de Autenticação | `access_token`, `refresh_token` | Armazenamento Criptografado do SO | Sessão do usuário autenticado |
| Preferências | `theme_mode`, `notifications_enabled` | DataStore / SharedPreferences / UserDefaults | Configurações do app |

---

## 4. Migrations e Evolução de Schemas Locais

- Toda alteração em tabelas locais deve ser acompanhada de uma **migration versionada** e testada (ex.: migração automática ou manual no Room/Drift/SQLDelight).
- É proibido usar `fallbackToDestructiveMigration` em produção — perda de dados offline não é tolerada.
- No Supabase: migrations versionadas em `supabase/migrations/` com RLS habilitado por padrão em todas as tabelas públicas.
