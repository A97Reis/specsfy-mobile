---
name: specsfy-specialist-ux-design
description: "Investigar, estruturar e validar experiências mobile com pesquisa, arquitetura da informação, jornadas de navegação por abas/pilha, formulários otimizados para teclado móvel, onboarding, permissões contextuais e recuperação de erros offline/online. Use para usabilidade, fluxo e descoberta mobile; não reduza UX a acabamento visual (`$specsfy-specialist-ui-design`)."
---

# Design de experiência mobile (UX)

## Quando usar

- Acionar para estruturar jornadas de usuário em aplicativos móveis, arquitetura de navegação (`BottomNavigation`/`TabView` vs `NavigationStack` vs `ModalBottomSheet`), fluxos de formulários, onboarding, solicitação contextual de permissões (câmera, localização, biometria, notificações) e tratamento de perda de conexão.
- Acionar quando há dúvida sobre a sequência de passos, carga cognitiva no celular ou capacidade da pessoa concluir uma tarefa com uma mão.
- Não acionar para acabamento visual isolado de cores e sombras; usar `$specsfy-specialist-ui-design` quando a jornada já estiver validada.
- Combinar com `$specsfy-specialist-prototyping` quando uma hipótese de fluxo precisar de validação rápida antes de escrever código de produção.

## Fluxo

1. Carregar `$specsfy-specialist-design-system` e ler `DESIGNSYSTEM.MD` e `INTERFACE.md` antes de propor a jornada. Quando a entrega criar ou mudar uma interface para pessoas, conduzir a descoberta pelo contrato de perguntas numeradas (`ask_question`), reaproveitando o contexto já confirmado.
2. Ler a stack mobile e as telas existentes do aplicativo para preservar os modelos mentais de navegação já aprendidos pela pessoa usuária.
3. Mapear a jornada móvel ponta a ponta incluindo entradas (ícone do app, Deep Link, Push Notification), escolhas, esperas, perda de rede (`Offline`), permissões negadas pelo SO e retomada de segundo plano (`background -> foreground`).
4. Projetar formulários móveis enxutos: dividir cadastros extensos em etapas claras ou agrupar campos essenciais, definir o tipo de teclado ideal para cada campo e preservar o rascunho localmente se o app for fechado.
5. Desenhar solicitações de permissão em dois estágios: explicar primeiro o benefício em linguagem humana no contexto da tarefa antes de disparar o diálogo nativo irreversível do Android/iOS, e oferecer caminho alternativo caso a permissão seja negada.
6. Encaminhar a estrutura de telas e estados validados para `$specsfy-specialist-ui-design` e para o especialista da plataforma mobile.

## Padrões

- Usar linguagem do domínio clara e concisa, adaptada para telas pequenas sem jargão técnico em mensagens de erro.
- Manter status do sistema, progresso de sincronização e caminho de retorno/cancelamento sempre visíveis e compatíveis com o gesto nativo de voltar (swipe back no iOS e predictive back no Android).
- Evitar diálogos de confirmação bloqueantes para ações reversíveis; preferir execução imediata com `Snackbar`/`Toast` oferecendo botão `Desfazer` (`Undo`).
- Preservar todos os dados digitados pela pessoa após falha de validação ou queda de rede, posicionando o foco diretamente no primeiro campo que exige correção.
- Projetar onboarding progressivo focado em entregar valor imediato, permitindo explorar o app antes de exigir cadastro ou múltiplas permissões.

## Antipadrões

- Solicitar todas as permissões do sistema (câmera, GPS, notificações, contatos) em sequência logo ao abrir o aplicativo pela primeira vez, levando ao bloqueio em massa pelo usuário.
- Exigir digitação manual quando o dispositivo oferece alternativa nativa mais rápida (seletores de data nativos, biometria Passkeys/FaceID/TouchID, preenchimento automático de código OTP/e-mail).
- Apagar o formulário inteiro ou fechar o `BottomSheet` sem aviso quando ocorre um erro de rede no envio.
- Usar dark patterns, ações de exclusão de conta escondidas ou textos de consentimento ambíguos.

## Validação

- Verificar que todas as tarefas principais podem ser concluídas sem becos sem saída, mesmo quando o usuário nega uma permissão opcional ou perde conectividade temporariamente.
- Confirmar que fluxos iniciados por Push Notification ou Deep Link levam diretamente ao contexto correto e possuem retorno coerente para a tela inicial.
- Validar a jornada com tecnologias assistivas (`$specsfy-specialist-mobile-accessibility`) garantindo que a ordem de foco reflete a sequência lógica da tarefa.
- Não declarar uma experiência mobile "intuitiva" ou validada sem comprovação dos fluxos de sucesso, erro, permissão negada e offline.

## Skills relacionadas

- `$specsfy-specialist-interface-experience` para organizar o inventário de telas, rotas e ações da entrega.
- `$specsfy-specialist-ui-design` para materializar a hierarquia visual, tokens e estados depois que a jornada está definida.
- `$specsfy-specialist-design-system` para regras macro mobile (Material 3 / Apple HIG) e padrões de listas e formulários em `DESIGNSYSTEM.MD`.
- `$specsfy-specialist-mobile-accessibility` para garantir usabilidade plena com TalkBack, VoiceOver e Dynamic Type.
- `$specsfy-specialist-prototyping` para testar hipóteses de fluxo com protótipo descartável.
- `$specsfy-specialist-domain-modeling` para alinhar vocabulário ubíquo e invariantes exibidos na jornada.

Leia [references/standards.md](references/standards.md) para escolher método de pesquisa, estruturar jornadas, avaliar formulários, onboarding e recuperação de erros.
