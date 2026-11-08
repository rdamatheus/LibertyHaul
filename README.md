# Liberty — vitrine pública (Fase 1)

Primeira versão estática e responsiva do site **Liberty**, preparada para publicação futura no domínio `libertyhaul.com.br`.

## Escopo autorizado

- Home editorial, navegação de categorias e explicação de funcionamento.
- Página `/isabelle/` dedicada à criadora **Isabelle**.
- Página `/achadinhos/` com busca, filtros e renderização de produtos publicados.
- Página `/lives/` para conteúdos vinculados a lives.
- Página `/transparencia/` com aviso sobre links de afiliados.
- Conteúdo inicial vazio, sem preços, itens ou redes sociais inventados.
- Nenhuma dependência externa, serviço de autenticação ou rastreamento.

## Executar localmente

Na raiz do repositório:

```bash
python -m http.server 8000
```

Abrir `http://localhost:8000/`. Não abrir os arquivos via `file://`: o catálogo depende de `fetch()` por HTTP.

## Estrutura

```text
index.html                 Home
achadinhos/index.html      Busca e filtros
isabelle/index.html        Área da criadora
lives/index.html           Conteúdos e produtos das lives
transparencia/index.html   Transparência de afiliados
assets/css/styles.css      Design responsivo
assets/js/site.js          Interações e catálogo
assets/icons/              Marca ilustrativa provisória (estátua)
data/content.json          Itens e lives vazios, até validação
404.html                   Página não encontrada
```

## Cadastrar produtos na fase de conteúdo

O arquivo `data/content.json` aceita `items` com esta estrutura **de exemplo técnico** (não representa produto comercial real):

```json
{
  "id": "sku-ou-id-unico",
  "title": "Título aprovado do produto",
  "description": "Descrição validada",
  "category": "tech",
  "platform": "Marketplace parceiro",
  "affiliate_url": "https://exemplo.com/produto",
  "image": "assets/media/imagem.webp",
  "published": true
}
```

Valores de `category`: `beleza`, `casa`, `tech`, `estilo`. A imagem é opcional e deve residir no repositório em `assets/media/`. A URL precisa começar com `https:`. **Nunca** publicar sem checar o destino e a autorização comercial do link de afiliado. Nesta Fase 1, `items`, `lives` e `social_links` permanecem vazios.

Para lives, `lives` aceita `title`, `date`, `description`, `url` (URL HTTPS) e `published: true`.

## Publicação futura no GitHub Pages (não executada)

1. Criar repositório **separado** `rdamatheus/LibertyHaul` (GitHub da conexão atual não disponibiliza ação de criação).
2. Enviar os arquivos preservando pastas.
3. Conferir o conteúdo, ativar **Settings → Pages → Deploy from a branch → main / root**, se essa opção estiver disponível ao proprietário.
4. Validar o endereço temporário do GitHub Pages antes de conectar o domínio.
5. Criar a configuração de domínio customizado no GitHub e **somente depois de nova autorização** configurar DNS no Registro.br.
6. Conferir HTTPS e validar redirects antes de considerar a publicação concluída.

**Não há arquivo `CNAME`**, pois a mudança de domínio ficou fora do escopo autorizado.

## Segurança e limites

- Nenhum checkout próprio, painel administrativo, banco, API, Supabase, login ou coleta de métricas está ativo.
- Produtos são publicados apenas quando `published: true` e `affiliate_url` é HTTPS válido.
- Links de afiliados abrem com `rel="sponsored noopener noreferrer"`; o site informa possível comissão.
- CSS e JavaScript não exigem CDNs nem fontes externas.
- `assets/icons/liberty-mark-*.svg` são símbolos **ilustrativos provisórios** da Estátua da Liberdade. Substituir somente após confirmar o arquivo final da marca. A imagem antiga `LOGO PRINCIPAL.jpg` da pasta Drive não foi aplicada por divergir da decisão posterior de usar no site a marca **Liberty** e a estátua como símbolo.
- O arquivo de dados local é um estágio de conteúdo. Para funcionalidades de painel, comissões e controle de links, haverá proposta e implementação posteriores com isolamento de dados e autenticação.

## Próxima fase, ainda não autorizada

Liberty Hub administrativo, ISA, integrações de afiliados, relatórios e Supabase devem ser tratados separadamente. Os projetos Croma Hub, LUFF Store e Personal OS não devem ser alterados para publicar este site.
