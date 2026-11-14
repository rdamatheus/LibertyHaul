# Agenda — Liberty Haul

**Conferida em:** 14/11/2026 (BRT). Os estados refletem evidências consultadas nessa data; não são sincronização em tempo real.

## Quadro operacional

| ID | Prioridade | Atividade | Situação | Responsável | Próxima ação e critério de conclusão |
|---|---|---|---|---|---|
| ISA-001 | Alta | Painel de produtos e vitrine | **Concluído** | Administração Liberty | Usuário confirmou uso; consulta Supabase verificou 2 produtos publicados. Reabrir apenas com erro comprovado. |
| ISA-002 | Alta | Revisão de sugestões pela Isabelle | **Aguardando teste real** | Isabelle | Abrir `/admin/` → **Sugestões da ISA**; testar edição, rejeição e aprovação de item verdadeiro com link afiliado válido. Aprovação SQL já validada com rollback. |
| ISA-003 | Alta | Curadoria e cadastro de propostas | **Automação ativa; resultado pendente** | Agente ISA — Curadoria Liberty | Após a primeira execução diária, verificar fontes, duplicatas, registros inseridos e atualizar quantidade com evidência. |
| ISA-004 | Média | Auditoria periódica do site | **Automação ativa; resultado pendente** | Agente ISA — Revisão do site | Conferir primeira auditoria semanal e propostas/PR; nenhuma mudança de site sem aprovação. |

| ISA-008 | Alta | Páginas individuais e links Liberty compartilháveis | **Aguardando validação pública** | Tecnologia Liberty | Conferir PR/deploy e testar no domínio produto publicado, ID inválido, rascunho, botão afiliado e cópia no painel; sem mudar Supabase ou DNS. |

| ISA-009 | Alta | Destaques na Home e botão Comprar | **4 destaques ativados; aguardando validação pública** | Tecnologia Liberty / Isabelle | Em 14/11 foram marcados 4 produtos existentes com imagens verificadas no bucket; conferir visualização real da Home → perfil → Comprar e comportamento em dispositivos móveis antes de concluir. |

| ISA-005 | Média | Exibir produtos de lives pelo cadastro existente | **PR #7 integrada; validar em produção** | Tecnologia Liberty / Isabelle | A página /lives/ consulta produtos publicados marcados com `live_featured`; validar no domínio e fazer teste real com produto que efetivamente apareceu em live, sem marcar itens fictícios. |
| ISA-010 | Alta | Revisão de títulos, categorias e descrições | **Dados corrigidos; fotos pendentes** | Catálogo Liberty | 11 títulos padronizados, 10 descrições preenchidas, 9 categorias corrigidas no Supabase em 14/11; obter 4 imagens autorizadas e validar características dos anúncios com Isabelle. |
| ISA-011 | Média | SEO básico do site | **PR #7 integrada; validar em produção** | Tecnologia Liberty | Publicar e verificar `robots.txt` e `sitemap.xml`; revisar indexação; não prometer prévia individual de produto sem pré-renderização. |

## Backlog que NÃO é autorização de implementação

| ID | Tema | Estado | Próxima decisão |
|---|---|---|---|

| ISA-006 | Identidade visual definitiva | Pendente | Confirmar logo/ícone antes de substituir a arte provisória. |
| ISA-007 | Gerar links de afiliado via integração | Não confirmado | Verificar suporte das APIs e regras comerciais antes de propor solução. |

## Como atualizar

- Estados válidos: planejado, agendado, em andamento, bloqueado, aguardando aprovação, aguardando validação, concluído, cancelado.
- Preservar IDs, decisões anteriores e tarefas abertas. Nunca transformar silêncio em aprovação nem apagar uma pendência por estar antiga.
- Para cada mudança relevante, anotar responsável, próxima ação, data, dependência e referência da evidência no [HISTORICO.md](HISTORICO.md).
- Só concluir com validação ou confirmação explícita. Novos prazos, compromissos, prioridades estratégicas e tarefas fora do escopo exigem autorização.
