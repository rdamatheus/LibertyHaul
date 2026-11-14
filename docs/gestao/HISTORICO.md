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

| 13/11/2026 | ISA-009: CTA 'Comprar', seleção de destaque no painel e seção Home incorporados à `main`, sem novo catálogo. | [PR #6](https://github.com/rdamatheus/LibertyHaul/pull/6) mesclada (commit `08e8318`); migração Supabase `liberty_home_featured_products` aplicada e verificada; código relido na `main`; JS sintaticamente válido e simulação de Home com 4/0 cards aprovada. | Domínio `libertyhaul.com.br` não acessível nas consultas externas, portanto deploy e navegação reais ainda não validados. Nenhum produto marcado como destaque automaticamente. |

| 14/11/2026 | ISA-009: responsável delegou escolha; quatro produtos existentes ativados como destaques na Home. | UPDATE restrito aos 4 UUIDs no schema `liberty` confirmado por RETURNING; leitura posterior na view resultou exatamente em 4 publicados/destacados; as 4 imagens constam no bucket. Auditoria de catálogo: 10 descrições vazias, 4 produtos sem foto e 9 em categoria `beleza`. | Visualização no domínio não confirmada; recomenda-se correção de classificação/conteúdo e verificação da publicação. Nenhuma dessas outras mudanças foi executada. |

| 14/11/2026 | ISA-010: revisão de conteúdo de 11 produtos publicados. | Atualizados 11 títulos, 9 categorias e 10 descrições pela tabela `liberty.products`; consulta posterior confirmou 0 descrições vazias, 4 imagens ausentes, 4 destaques preservados e 11 publicados. | Textos limitados aos atributos declarados anteriormente; faltam imagens autorizadas e conferência comercial detalhada dos anúncios. |
| 14/11/2026 | ISA-005/ISA-011: preparada integração da página de lives ao campo existente `live_featured`, mais `robots.txt` e `sitemap.xml`. | Branch `feat/revisao-catalogo-lives-seo-20261114`; código JS sintaticamente válido; simulações de página de lives com/sem itens e Home com destaques passaram. | Confirmar PR/merge, deploy e teste no domínio; não inventar presença de produtos em live nem métricas analíticas. |

## Modelo de registro novo

`AAAA-MM-DD · ISA-XXX · evento · ação confirmada · fonte/link · validação · risco/pendência · próximo passo`.

Apenas fatos novos justificam entrada. Histórico nunca deve dizer que houve publicação, teste, cadastro ou gravação se não houve verificação.
