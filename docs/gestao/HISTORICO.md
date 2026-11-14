# Histórico e evidências — Liberty Haul

Registro cronológico de entregas verificadas e pendências, sem apagar o passado.

| Data (BRT) | Evento | Evidência | Limite ou próximo passo |
|---|---|---|---|
| 04/11/2026 | Fase 1: site e páginas estáticas preparados. | [Documento da Fase 1](../DECISOES_E_VALIDACAO.md). | Era um estado anterior à publicação do site. |
| 08/11/2026 | Domínio GitHub Pages configurado, site público implantado. | Repositório `rdamatheus/LibertyHaul`, arquivo `CNAME` e confirmação do usuário. | Verificar periodicamente HTTPS e links. |
| 08/11/2026 | Fase 2: painel autenticado e catálogo via Supabase. | [PR #1](https://github.com/rdamatheus/LibertyHaul/pull/1), deploy concluído; usuário confirmou uso. | Monitorar limites egress/armazenamento. |
| 08/11/2026 | Fase 3: fila de sugestões, aprovação humana e restrição de acesso. | [PR #2](https://github.com/rdamatheus/LibertyHaul/pull/2), deploy concluído, RLS inspecionado, teste transacional revertido. | Testar nova aba em navegador com Isabelle. |
| 08/11/2026 | Agentes de curadoria diária e revisão semanal criados. | Agendamentos existentes `ISA — Curadoria Liberty` e `ISA — Revisão do site`, habilitados. | Conferir primeiras execuções reais; não confundir agendamento com resultado. |
| 08/11/2026 | Diretório Mestre implantado como ponto de entrada do projeto. | `docs/gestao/` + índice no `README.md`, versionados no repositório. | Configurar agentes e chats para leitura efetiva. |

| 13/11/2026 | ISA-008: página individual, navegação interna da vitrine e copiar link incorporados à `main`. | [PR #5](https://github.com/rdamatheus/LibertyHaul/pull/5) mesclada (commit `0335ce3`); JS validado sintaticamente e simulações de publicado, oculto e ID inválido passaram; arquivos conferidos na `main`. | Validação real do GitHub Pages e do fluxo no navegador ainda não confirmada; acesso automatizado ao domínio falhou. |

## Modelo de registro novo

`AAAA-MM-DD · ISA-XXX · evento · ação confirmada · fonte/link · validação · risco/pendência · próximo passo`.

Apenas fatos novos justificam entrada. Histórico nunca deve dizer que houve publicação, teste, cadastro ou gravação se não houve verificação.
