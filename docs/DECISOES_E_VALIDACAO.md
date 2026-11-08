# Liberty — Registro de decisões e validação

## Objetivo

Preparar a vitrine pública independente da Liberty, voltada a achadinhos, conteúdos da Isabelle e referências de lives, para futuramente ser associada a `libertyhaul.com.br`.

## Decisões preservadas

- Marca de apresentação pública: **Liberty**.
- Nome da criadora: **Isabelle**.
- Símbolo para a interface: **Estátua da Liberdade**; a variação definitiva será incorporada após confirmação.
- A compra ocorre no **marketplace**, fora da Liberty; não existe checkout próprio.
- Repositório independente, sem acrescentar código a Croma Hub, LuffStore ou Personal OS.
- Fase 1: arquivos do site apenas. **Sem DNS, Supabase ou banco de dados**.

## Implementação da Fase 1

- Site responsivo multi-página, HTML/CSS/JS sem dependências externas.
- Catálogo com filtros e pesquisa, renderização segura dos links disponíveis.
- Áreas ainda não alimentadas apresentam estado vazio honesto.
- Aviso de afiliação e informações sobre responsabilidade do marketplace.
- Navegação por teclado e rótulos básicos de acessibilidade.

## Limitações

- O conector GitHub disponível nesta sessão não oferece criação de repositórios, portanto nenhum repositório foi criado.
- O site está entregue em arquivos locais para serem enviados ao futuro repositório.
- Não existe publicação pública, domínio apontado, catálogo importado nem integrações ativas.
- Logo oficial ainda precisa de uma versão aprovada; os SVGs são apenas ícones da estátua para a interface.

## Validação

Testes executados em 04/11/2026:

- `node --check assets/js/site.js`: OK.
- `python -m json.tool data/content.json`: OK.
- Links relativos das 6 páginas HTML: OK, nenhum destino local faltante.
- 5 páginas renderizadas em desktop (1440 px) e mobile (390 px) em Chromium via conteúdo local incorporado: OK, sem erros de JavaScript ou rolagem horizontal.
- Menu mobile abre: OK.
- Página Achadinhos apresenta estado vazio e responde aos filtros: OK.
- Página Lives apresenta estado vazio: OK.

**Limitação da validação:** o Chromium desta execução bloqueou navegação HTTP local por política do ambiente. Para inspecionar o layout, os ativos locais foram incorporados em cada página durante o teste e `fetch` recebeu uma resposta simulada com catálogo vazio. Portanto, **não houve teste fim a fim de rede ou GitHub Pages**. Um teste real de publicação permanece pendente após a criação do repositório.
