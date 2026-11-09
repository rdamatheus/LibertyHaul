# Agenda — Liberty Haul

**Conferida em:** 08/11/2026 (BRT). Os estados refletem evidência disponível nessa data; não são sincronização em tempo real.

## Quadro operacional

| ID | Prioridade | Atividade | Situação | Responsável | Próxima ação e critério de conclusão |
|---|---|---|---|---|---|
| ISA-001 | Alta | Painel de produtos e vitrine | **Concluído** | Administração Liberty | Usuário confirmou uso; consulta Supabase verificou 2 produtos publicados. Reabrir apenas com erro comprovado. |
| ISA-002 | Alta | Revisão de sugestões pela Isabelle | **Aguardando teste real** | Isabelle | Abrir `/admin/` → **Sugestões da ISA**; testar edição, rejeição e aprovação de item verdadeiro com link afiliado válido. Aprovação SQL já validada com rollback. |
| ISA-003 | Alta | Curadoria e cadastro de propostas | **Automação ativa; resultado pendente** | Agente ISA — Curadoria Liberty | Após a primeira execução diária, verificar fontes, duplicatas, registros inseridos e atualizar quantidade com evidência. |
| ISA-004 | Média | Auditoria periódica do site | **Automação ativa; resultado pendente** | Agente ISA — Revisão do site | Conferir primeira auditoria semanal e propostas/PR; nenhuma mudança de site sem aprovação. |

## Backlog que NÃO é autorização de implementação

| ID | Tema | Estado | Próxima decisão |
|---|---|---|---|
| ISA-005 | Integrar cadastro de produtos às lives | Não implementado | Definir fluxo: `/lives/` ainda usa `data/content.json`; nova aprovação necessária. |
| ISA-006 | Identidade visual definitiva | Pendente | Confirmar logo/ícone antes de substituir a arte provisória. |
| ISA-007 | Gerar links de afiliado via integração | Não confirmado | Verificar suporte das APIs e regras comerciais antes de propor solução. |

## Como atualizar

- Estados válidos: planejado, agendado, em andamento, bloqueado, aguardando aprovação, aguardando validação, concluído, cancelado.
- Preservar IDs, decisões anteriores e tarefas abertas. Nunca transformar silêncio em aprovação nem apagar uma pendência por estar antiga.
- Para cada mudança relevante, anotar responsável, próxima ação, data, dependência e referência da evidência no [HISTORICO.md](HISTORICO.md).
- Só concluir com validação ou confirmação explícita. Novos prazos, compromissos, prioridades estratégicas e tarefas fora do escopo exigem autorização.
