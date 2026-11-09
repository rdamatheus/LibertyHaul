# Diretório Mestre ISA — Liberty Haul

**Início:** 08/11/2026 · **Escopo:** `rdamatheus/LibertyHaul` · **Fonte persistente:** branch `main`.

Este diretório é a agenda e o manual operacional do projeto. Não substitui os dados de produção nem autoriza mudanças fora de escopo.

## Leitura obrigatória antes de trabalhar

1. [ESTADO-ATUAL.md](ESTADO-ATUAL.md): o que existe, o que foi validado e o que é incerto.
2. [AGENDA.md](AGENDA.md): ID, responsável, prioridade, dependência e próximo passo de cada pendência.
3. [MANUAL.md](MANUAL.md): arquitetura, regras e decisões aprovadas.
4. [HISTORICO.md](HISTORICO.md): evidências, versões e validações.
5. [PROTOCOLO-AGENTES.md](PROTOCOLO-AGENTES.md): limites de autonomia e rotina de atualização.

**Procedimento:** identificar tarefa já existente → conferir fontes técnicas → avaliar dependências e aprovações → executar somente o autorizado → validar → registrar. Não criar estruturas paralelas.

## Links principais

- [Site](https://libertyhaul.com.br) · [Administração](https://libertyhaul.com.br/admin/) · [Repositório](https://github.com/rdamatheus/LibertyHaul)
- [Supabase croma-hub](https://supabase.com/dashboard/project/xtlubocepsbqanrjabog) — acessar somente objetos da Liberty.
- [Fase 1 — registro histórico](../DECISOES_E_VALIDACAO.md) · [Fase 2 — administração](../ADMINISTRACAO_LIBERTY_FASE2.md) · [Fase 3 — curadoria](../ADMINISTRACAO_LIBERTY_FASE3.md)

## Regra de continuidade

Os arquivos antigos registram o estado **da época**, mesmo quando dizem que o domínio ou o painel ainda não existiam. A versão operacional deve ser confirmada no código, banco e agendamentos, e refletida neste diretório.

**Novo chat/agente:** primeiro consulte o caminho `docs/gestao/00-INICIO.md` na `main`. Não há leitura automática garantida em todos os chats apenas pela existência dos documentos; configure o acesso e esta instrução no ambiente correspondente. Sem acesso ao GitHub, informe a limitação.
