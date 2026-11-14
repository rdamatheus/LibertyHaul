# Liberty Haul — vitrine, administração e agentes ISA

A Liberty Haul reúne achadinhos indicados pela Isabelle e direciona visitantes às lojas parceiras. Site público: **https://libertyhaul.com.br**. Administração autenticada: **https://libertyhaul.com.br/admin/**.

## Comece aqui: Diretório Mestre

**Antes de trabalhar neste projeto, leia [docs/gestao/00-INICIO.md](docs/gestao/00-INICIO.md).** É o ponto de entrada para agentes e chats, com agenda, manual, estado atual, histórico e protocolo de atualização.

| Documento | Função |
|---|---|
| [00-INICIO](docs/gestao/00-INICIO.md) | Referência central e caminho de leitura |
| [AGENDA](docs/gestao/AGENDA.md) | Tarefas, responsáveis e próximos passos |
| [ESTADO-ATUAL](docs/gestao/ESTADO-ATUAL.md) | Dados verificados e pendências |
| [MANUAL](docs/gestao/MANUAL.md) | Arquitetura e regras aprovadas |
| [HISTORICO](docs/gestao/HISTORICO.md) | Registros de implementação e validação |
| [PROTOCOLO-AGENTES](docs/gestao/PROTOCOLO-AGENTES.md) | Como manter tudo atualizado com segurança |

## Arquitetura atual

- Site em HTML/CSS/JS hospedado no GitHub Pages; vitrine `/achadinhos/`, detalhes compartilháveis `/produto/?id=<uuid>`, área `/isabelle/`, `/lives/` e transparência.
- `/admin/`: login Supabase, cadastro e publicação de produtos e aba **Sugestões da ISA**.
- Supabase compartilhado no projeto `croma-hub`, com dados exclusivos no schema `liberty`, RLS e acesso protegido.
- A aprovação/publicação de itens sugeridos é sempre humana. A ISA pesquisa e prepara sugestões; revisa o site e propõe melhorias sem implantá-las automaticamente.
- A página `/lives/` ainda usa `data/content.json`, não sincronizada automaticamente ao catálogo.

## Código e registros técnicos

`index.html` · `achadinhos/` · `produto/` · `lives/` · `isabelle/` · `transparencia/` · `admin/` · `assets/` · `data/content.json` · `docs/gestao/`.

Os registros anteriores continuam disponíveis por rastreabilidade: [Fase 1](docs/DECISOES_E_VALIDACAO.md), [Fase 2](docs/ADMINISTRACAO_LIBERTY_FASE2.md), [Fase 3](docs/ADMINISTRACAO_LIBERTY_FASE3.md). A documentação da Fase 1 descreve um estado **histórico**, anterior ao site e ao painel publicados; não use suas afirmações antigas como estado atual.

Para executar arquivos estáticos localmente: `python -m http.server 8000` e abrir `http://localhost:8000/`. Para testar autenticação e catálogo, é necessário acesso às APIs Supabase. Nunca inclua chaves secretas no frontend ou na documentação.
