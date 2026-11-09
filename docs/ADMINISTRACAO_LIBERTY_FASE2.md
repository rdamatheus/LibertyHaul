# Administração da Liberty Haul — Fase 2

## Objetivo
Cadastrar, editar, publicar e ocultar achadinhos pela área `/admin/`, sem editar arquivos do GitHub.

## Estrutura
- Frontend estático no GitHub Pages: `admin/index.html`, `admin/admin.css`, `admin/admin.js`.
- A vitrine em `achadinhos/` consulta somente produtos publicados do Supabase.
- Banco Supabase existente `croma-hub`, schema exclusivo `liberty`.
- Tabelas `liberty.admins` e `liberty.products`, ambas com Row Level Security (RLS).
- Views `public.liberty_admin_access` e `public.liberty_products` com `security_invoker=true`; acesso limitado por GRANT e RLS.
- Bucket de imagens `liberty-product-images`: imagens visíveis publicamente, envio/alteração/exclusão apenas para administradores.
- Supabase Auth por e-mail e senha. Google não ativado.
- Chave publicável Supabase no frontend. Chaves secretas e service_role jamais devem ser disponibilizadas no navegador.

## Campos e ações
Nome, descrição, categoria, marketplace, link de afiliado HTTPS, imagem, status publicado/rascunho e indicação de produto apresentado em live. Suporta criar, editar, ocultar, publicar e excluir produtos.

## Regras de acesso
- Administrador deve estar autenticado e presente em `liberty.admins`.
- Qualquer visitante vê somente produtos publicados.
- Novos produtos começam em rascunho, salvo escolha explícita de publicação.
- Upload de imagens somente JPEG/PNG/WebP de até 5 MB. Não enviar arquivos confidenciais.
- A exclusão de um produto não apaga automaticamente sua imagem; revisar periodicamente.
- A marcação "produto de live" apenas registra esse atributo nesta etapa. A página `/lives/` continua lendo `data/content.json`.

## Validação e pendências
- Código JavaScript verificado sintaticamente.
- Estruturas Supabase criadas e protegidas com RLS.
- É necessário testar manualmente login e cadastro de um produto de teste após a publicação. Não houve acesso à senha do usuário para teste de ponta a ponta.
- Verificar o aparecimento do produto em `/achadinhos/`, edição, ocultação e remoção.
- Monitorar egress e armazenamento no plano Free.
- Não foram alterados DNS nem dados dos outros sistemas.

## Fora do escopo
Login Google, integrações automáticas Shopee/Mercado Livre/Amazon, análise de cliques, comissões, checkout e automações ISA.
