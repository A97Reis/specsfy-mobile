# Regras de Desenvolvimento e Arquitetura (Mobile)

Este documento reúne convenções, boas práticas de engenharia e regras inegociáveis para a evolução deste projeto mobile.

---

## 1. Diretrizes da Stack

- **Stack**: {{STACK_LABEL}}
- **Orientações**: {{STACK_GUIDANCE}}

---

## 2. Regras de Código e Arquitetura Mobile

1. **Separação de Responsabilidades**:
   - Camada de UI (Views/Composables/Widgets) não deve conter lógica de negócio direta nem chamadas diretas de rede/banco.
   - Utilize ViewModels / Controllers / BLoCs / Stores para orquestrar o estado da tela.
   - Camada de Domínio e Repositórios encapsulam regras de negócio e abstraem a fonte de dados (local vs. remota).
2. **Ciclo de Vida e Estados Reativos**:
   - Respeite o ciclo de vida do dispositivo (rotação, suspensão em background, morte do processo por memória).
   - Use coletores de estado conscientes de ciclo de vida (`collectAsStateWithLifecycle` no Android, `@Observable` no iOS, `Consumer` no Flutter, etc.).
3. **Rede e Resiliência**:
   - Toda chamada de rede deve prever timeouts razoáveis, tratamento de indisponibilidade e feedback claro ao usuário.
   - Nunca bloqueie a Thread Principal (UI Thread) com operações de IO, disco ou criptografia.
4. **Segurança no Cliente**:
   - Nunca persista chaves secretas de backend (`service_role`, credenciais mestras) no código mobile ou assets públicos.
   - Armazene tokens em mecanismos protegidos pelo hardware (Android Keystore / iOS Keychain).
5. **Acessibilidade Obrigatória**:
   - Todo elemento interativo ou ícone puramente visual deve ter descrição semântica acessível ou estar marcado como decorativo.
   - Alvos de toque com área mínima de 48dp (Android) e 44pt (iOS).
6. **Contrato TDD e Delivery**:
   - Nenhuma tarefa de código é aceita sem teste unitário/integração correspondente.
   - Toda tarefa que altera UI exige comprovação no item `VISUAL` do checklist da spec.
