# Central de Adequações — Liberty Haul

Estado: especificação em branch isolada; sem merge, deploy ou alteração de banco.

## Fonte existente e compatibilidade
- Preservar docs/gestao/{00-INICIO,ESTADO-ATUAL,AGENDA,MANUAL,PROTOCOLO-AGENTES,HISTORICO}.md como diretório oficial.
- Reaproveitar liberty.suggestions e fluxo ISA-004 de sugestões → revisão humana → publicação; verificar esquema, UI e autorização antes de qualquer escrita.
- Não confundir sugestões editoriais da ISA com aprovação de alterações estruturais.

## Interface proposta
- Central de Adequações no /admin, com registro de melhorias, campanhas, alterações de interface e decisões críticas.
- Cada item possui ID, empresa, origem, responsável, tipo, impacto, risco, estado, evidências, versões, data e vínculo com sugestão ISA quando aplicável.
- Melhorias de baixo risco executadas e validadas aparecem no histórico; publicação externa, dados reais, integrações e alterações de funcionamento exigem aprovação humana.
- Manual da Marca: nicho de transporte/logística, público, tom, serviços, canais, campanhas e decisões, sem presumir conteúdos específicos não verificados.

## Critérios de aceite
1. Verificar tabelas e UI existentes e impedir duplicação de sugestões.
2. Testar leitura segregada, autoria e trilha de revisão em sessão real.
3. Testar sugestão ISA → revisão → decisão sem publicar automaticamente.
4. Testar mobile, regressões e permissões antes de merge.

Não editar main nem banco nesta etapa. Este documento não registra mudanças funcionais realizadas.