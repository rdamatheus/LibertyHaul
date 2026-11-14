# Manual e decisões aprovadas — Liberty Haul

## Identidade e modelo

- Projeto: **Liberty Haul**; marca exibida no site como **Liberty**.
- Isabelle é a responsável por avaliar as recomendações.
- O cliente clica no anúncio e compra no marketplace; a Liberty **não** tem checkout próprio.
- Símbolo da Estátua da Liberdade na interface ainda é ilustrativo/provisório, até aprovação da identidade final.

## Arquitetura confirmada

| Componente | Local |
|---|---|
| Repositório | `rdamatheus/LibertyHaul`, branch `main` |
| Hospedagem | GitHub Pages, domínio `libertyhaul.com.br` |
| Site e catálogo | `index.html`, `achadinhos/`, `assets/js/site.js` |
| Área privada | `admin/index.html`, `admin/admin.js`, `admin/admin.css` |
| Supabase | Projeto `croma-hub` (`xtlubocepsbqanrjabog`), schema `liberty` |
| Produtos | `liberty.products`, view `public.liberty_products` |
| Sugestões | `liberty.suggestions`, view `public.liberty_suggestions` |
| Aprovação | `public.liberty_approve_suggestion` (ação humana) |
| Imagens | Bucket `liberty-product-images` (imagens públicas, gravação autorizada) |
| Lives | `data/content.json` ainda estático |

## Regras de negócio

1. Apenas administradores autorizados, autenticados no Supabase Auth, gerenciam o catálogo; RLS é obrigatório.
2. Rascunhos não aparecem publicamente; itens publicados aparecem na vitrine.
3. ISA pode **pesquisar e propor sugestões pendentes**. Não pode aprovar, rejeitar por Isabelle, inventar afiliados nem publicar produtos.
4. A Isabelle confere a origem, ajusta dados e confirma explicitamente a publicação. O link de afiliado HTTPS é obrigatório para publicar e precisa ser realmente vinculado ao programa.
5. Não inventar preço, avaliações, estoque, disponibilidade ou imagens autorizadas. Preços observados são temporais e exigem fonte/data.
6. O agente de auditoria pode apresentar diagnóstico e preparar PRs de pequenas correções para revisão; **sem merge/deploy automático**.
7. Não transformar indicação de live em integração funcional com a página `/lives/`.
8. Nunca modificar dados, permissões ou regras de Croma, LUFF ou Personal OS como efeito deste projeto.

## Controle de alterações

- Consultas e análises podem ocorrer automaticamente. Código, banco, integrações, DNS, automações, regras e publicação dependem de escopo e aprovação explícitos.
- A única manutenção permanente já aprovada é a **atualização factual** dos registros operacionais descritos em [PROTOCOLO-AGENTES.md](PROTOCOLO-AGENTES.md). Não autoriza mudanças de decisão, funcionalidade ou permissões.
- Só declarar concluído após teste/validação; registrar impacto, dependências, riscos, pendências e evidência em [HISTORICO.md](HISTORICO.md).
- Não gravar senhas, tokens, service_role keys ou informações privadas de terceiros nestes arquivos.

## Perfil individual e links Liberty — decisão aprovada em 13/11/2026

- Cada produto publicado mantém seu ID UUID existente e ganha uma URL pública em `/produto/?id=<uuid>`, sem criar outra tabela ou outro catálogo.
- Imagem, título e botão "Ver detalhes" na vitrine conduzem para o perfil interno; somente o botão "Comprar" leva ao link de afiliado HTTPS, em nova aba com `rel="sponsored noopener noreferrer"`.
- O painel de administração oferece "Copiar link" para produtos publicados; rascunhos não ganham links públicos acessíveis.
- A página consulta exclusivamente produtos publicados, mostrando indisponibilidade para IDs inexistentes, inválidos ou ocultos.
- Checkout, pagamento, entrega e suporte ao pedido permanecem no marketplace. Informar claramente a natureza de indicação/comissão.
- Hospedagem estática no GitHub Pages: prévias por produto em aplicativos sociais podem usar metadados genéricos, até futura solução de pré-renderização aprovada separadamente.
- Não alterar links afiliados cadastrados, banco de dados, DNS, integrações nem mecanismos de aprovação de publicação por esta funcionalidade.

## Destaques na Home — decisão aprovada em 13/11/2026

- A Home reutiliza os cards da vitrine e consulta a view existente `public.liberty_products`, exibindo até quatro produtos marcados com `featured=true` e `published=true`, em ordem de cadastro mais recente.
- Um único campo booleano `liberty.products.featured` (padrão `false`) controla destaque no formulário já existente. O campo `live_featured` permanece independente.
- A seção "Achadinhos em destaque" fica oculta se nenhum produto estiver selecionado; o clique sempre abre o perfil Liberty, nunca o afiliado diretamente.
- Não criar outro catálogo, checkout, rotina automática de escolha, tabela ou integração. A Isabelle controla a marcação e a publicação.
- No perfil individual, o CTA visível é **"Comprar"**, mantendo explicação sobre marketplace e comissão.

## Referências históricas

[Decisões da Fase 1](../DECISOES_E_VALIDACAO.md) · [Fase 2](../ADMINISTRACAO_LIBERTY_FASE2.md) · [Fase 3](../ADMINISTRACAO_LIBERTY_FASE3.md). Estas fontes preservam o contexto de cada época; dados atuais devem ser conferidos.
