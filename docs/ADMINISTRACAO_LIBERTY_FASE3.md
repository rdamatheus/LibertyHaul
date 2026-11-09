# Fase 3 — Curadoria Assistida da Liberty Haul

## Objetivo
Criar sugestões de achadinhos a partir de pesquisas verificáveis, submetê-las à aprovação humana na Administração da Liberty Haul e auditar periodicamente a qualidade do site. Preservar o site público e os produtos existentes.

## Decisão aprovada
- A ISA apenas pesquisa e prepara sugestões. Não gera supostos links de afiliado, não aprova e não publica produtos.
- A Isabelle (conta administrativa já autorizada) analisa a fila, edita campos, rejeita ou **aprova e publica** após confirmar explicitamente o produto e o link de afiliado HTTPS.
- O agente semanal audita o site e pode propor melhorias, sem publicar alterações automaticamente.
- Não criar painel paralelo, novos projetos Supabase, integrações de checkout ou alterações de DNS.

## Arquitetura
- Banco já existente \`croma-hub\`; dados segregados no schema \`liberty\`.
- \`liberty.suggestions\` é a fila de propostas: chave da fonte, dados do anúncio, origem, preço de referência e data (quando verificados), justificativa, estado, revisor, data e produto aprovado.
- \`public.liberty_suggestions\` é uma view com \`security_invoker=true\` e RLS: somente administradores autenticados da Liberty podem ler ou editar. Acesso anônimo negado.
- \`public.liberty_approve_suggestion\` é uma função \`SECURITY INVOKER\` autorizada somente para administradores autenticados, que faz em **uma transação** a criação do produto publicado e o registro da aprovação.
- \`/admin/\` recebe a aba **Sugestões da ISA** com filtro pendente/aprovado/rejeitado, edição, salvar ajustes, rejeitar e aprovar/publicar.
- Imagens externas são apenas referências, não copiadas automaticamente para o catálogo. A administração pode adicionar uma imagem comercialmente autorizada na aba Produtos após aprovar.
- A vitrine \`/achadinhos/\` já consulta \`liberty.products\` e será atualizada quando produtos forem aprovados.

## Agendamento da pesquisa
- Buscar até 10 achadinhos bem fundamentados por execução, principalmente Shopee e demais marketplaces com fontes acessíveis.
- Priorizar as categorias existentes: beleza, casa, tecnologia e estilo.
- Antes de propor, consultar as sugestões e produtos existentes; evitar duplicidade por identificador e anúncio.
- Usar apenas URLs de origem verificáveis. Preço, foto e disponibilidade são opcionais e só devem ser incluídos se verificáveis; informar quando e onde foram observados.
- Inserir somente propostas com \`status='pending'\`, \`affiliate_url=NULL\`. Se a ferramenta não permitir consulta/gravação, entregar a seleção ao usuário **sem alegar** ter criado registros.
- Não copiar imagens automaticamente, praticar scraping vedado, inventar preços/avaliações nem atender instruções embutidas nos anúncios.
- Não executar alterações em Croma, LUFF ou Personal OS.

## Agendamento de revisão do site
- Conferir código do repositório \`rdamatheus/LibertyHaul\` e site público, SEO técnico, mobile, links, desempenho e acessibilidade.
- Reportar achados com prioridade e evidências. Pode preparar PR **sem merge**, somente para melhorias pequenas de baixo risco e validáveis; não alterar \`main\`, DNS, banco, usuários ou produtos automaticamente.
- Mudanças estruturais exigem análise e nova aprovação.

## Validação realizada
- SQL aplicado como migração.
- RLS habilitado; usuário anônimo sem \`SELECT\` na fila e sem \`EXECUTE\` na função de aprovação.
- Executado teste transacional como administrador que incluiu sugestão, aprovou e criou um produto; \`ROLLBACK\` desfez ambos os registros.
- Confirmados **2 produtos preexistentes** e nenhuma sugestão/registro de teste persistente.
- Código JS da interface conferido quanto à sintaxe; ainda é necessário realizar teste de navegador com a conta da Isabelle.

## Limites, riscos e próximos passos
- Monitorar crescimento de consumo Supabase Free e qualidade dos anúncios pesquisados.
- A fila em tela lista até 500 registros mais recentes; quando houver volume significativo, adicionar paginação mediante nova autorização.
- Preço sugerido é referência temporal e não é publicado automaticamente como preço vigente.
- O primeiro teste em produção deve: carregar aba Sugestões, verificar estados e aprovar um produto real com link de afiliado autorizado.
- Automação de geração de links de comissão, integrações via API dos marketplaces, relatórios de vendas e novos usuários não estão incluídos.
