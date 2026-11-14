# Estado atual — Liberty Haul

**Última verificação:** 08/11/2026, Brasil. Retrato de código, Supabase e automações; números podem mudar.

## Implantado

- Domínio público `libertyhaul.com.br` e GitHub Pages implantados.
- `/admin/` com login Supabase, CRUD de produtos e imagem; usuário confirmou acesso e cadastro.
- `/achadinhos/` consulta `liberty.products` e mostra somente produtos publicados.
- Aba **Sugestões da ISA** implantada; `liberty.suggestions` isolada com RLS e leitura restrita. A função de aprovação cria produto e registra aprovação numa mesma transação.
- Automação diária `ISA — Curadoria Liberty` e semanal `ISA — Revisão do site` habilitadas, sem permissão de publicação autônoma.
- `/lives/` ainda utiliza o arquivo estático `data/content.json`; não afirmar sincronização automática de lives.

## Código incorporado em 13/11/2026 (ISA-008)

- [PR #5](https://github.com/rdamatheus/LibertyHaul/pull/5) mesclada à `main`: nova página pública `/produto/?id=<uuid>`, cards internos de vitrine e **Copiar link** no painel.
- Foram verificados os arquivos na branch principal, sintaxe JavaScript e cenários simulados de item publicado, não publicado e ID inválido.
- **Pendente:** confirmação do deploy pelo GitHub Pages e teste real no domínio/navegador. A ferramenta de acesso à URL pública não conseguiu retornar a página; não declarar validação pública concluída.
- Nenhuma modificação de banco, DNS, dados de produto ou integração realizada nesta etapa.

## Evolução ISA-009 — 13/11/2026

- Campo `featured boolean not null default false` integrado à tabela `liberty.products` e à view pública existente, preservando `security_invoker=true` e as políticas RLS; sem novas tabelas.
- Consulta após a migração: 11 produtos cadastrados, 11 publicados, 0 em destaque. Os destaques dependem de marcação pela Isabelle no `/admin/`.
- [PR #6](https://github.com/rdamatheus/LibertyHaul/pull/6) mesclada à `main`: seção Home, checkbox no painel e CTA "Comprar" conferidos no código. Publicação e teste público não confirmados, pois o domínio não respondeu às consultas externas.

## Evidência do Supabase em 08/11/2026

| Dado | Quantidade |
|---|---:|
| Produtos totais | 2 |
| Produtos publicados | 2 |
| Sugestões | 0 |
| Sugestões pendentes | 0 |
| Administradores Liberty | 1 |

Projeto Supabase: `croma-hub`, ID `xtlubocepsbqanrjabog`; somente schema `liberty` e componentes associados são da Liberty. Não modificar outros sistemas.

## Validação conhecida

- GitHub Pages da Fase 3 terminou com sucesso.
- Teste SQL da aprovação, inserção de produto e registro de revisão validado numa transação revertida; nenhum registro fictício permaneceu.
- Usuário confirmou que a primeira versão do painel funciona.
- **Não confirmado ainda:** teste de ponta a ponta da aba de sugestões no navegador pela Isabelle e resultados das primeiras execuções dos agentes.

## Limitações e riscos

- Pesquisa automática pode não conseguir inserir sugestões se ferramentas/conexões falharem; nunca dizer "cadastrado" sem consulta posterior.
- A ISA não converte automaticamente URL comum em link de comissão.
- Fotos encontradas são referências, não licença de uso comercial.
- Monitorar custos e tráfego do Supabase gratuito.
- A aparência da marca ainda usa símbolo provisório.
- Documentos da Fase 1 continuam no repositório apenas por rastreabilidade; seu estado operacional tornou-se obsoleto.

Para ações pendentes: [AGENDA.md](AGENDA.md). Para decisões: [MANUAL.md](MANUAL.md).
