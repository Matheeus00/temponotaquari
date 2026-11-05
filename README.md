# Tempo no Taquari :sunny: :cloud:

WebApp de previsão do tempo para Lajeado e outras 24 cidades principais do Vale do Taquari, no Rio Grande do Sul.

# Utilizações: :white_check_mark:
Nesse projeto estou utilizando:\
[React com TypeScript](https://www.typescriptlang.org/) - Interface e tipagem da aplicação\
[HG Brasil](https://hgbrasil.com/status/weather) - API de Previsão do Tempo\
[Open-Meteo](https://open-meteo.com/) - Previsão por hora, qualidade do ar (dados CAMS), índice UV, ponto de orvalho e estimativa de radiação solar\
[INMET](https://portal.inmet.gov.br/) - Avisos meteorológicos oficiais por município\
[INPE — Programa Queimadas](https://terrabrasilis.dpi.inpe.br/queimadas/portal/) - Referência para dados de focos e risco de fogo\
[Meteocons](https://bas.dev/work/meteocons) - Ícones meteorológicos SVG com animações, criados por Bas Milius

O projeto usa Vite para desenvolvimento e build, com React e TypeScript. A chave da HG Brasil é usada somente pelo servidor e não deve ser adicionada ao código do cliente.
Os dados da previsão por hora, da qualidade do ar, do índice UV, do ponto de orvalho, da umidade e da radiação solar são consultados pelo servidor no Open-Meteo; a qualidade do ar também é atribuída ao CAMS, conforme a licença CC BY 4.0. A previsão horária permite ver as próximas 24 horas, o restante do dia de hoje ou todas as horas disponíveis de um dia selecionado na previsão estendida, no fuso de Brasília. O potencial solar é uma estimativa baseada na radiação em W/m², não uma medição da energia produzida por um sistema fotovoltaico. O índice de secagem de roupas combina previsão horária de temperatura, umidade, vento, radiação e chuva; é uma referência, não um tempo exato de secagem. Se o Open-Meteo não fornecer o ponto de orvalho, ele é estimado com temperatura e umidade da HG Brasil pela fórmula de Magnus-Tetens.
Os avisos do INMET são consultados no servidor, filtrados para o município selecionado e armazenados em cache por 10 minutos. As orientações exibidas são fornecidas pelo próprio aviso.
As condições atuais são consultadas novamente a cada 10 minutos. O cabeçalho exibe o horário da consulta concluída ao servidor; esse horário não representa necessariamente o instante da observação meteorológica na fonte. A previsão horária, a qualidade do ar e o índice UV usam cache de servidor/CDN por até 10 minutos, com possibilidade de servir dados antigos enquanto são revalidados.
O aviso de possibilidade de arco-íris combina precipitação e nebulosidade estimadas pelo Open-Meteo com a elevação solar calculada pelo SunCalc. É uma heurística, não confirma que um arco-íris esteja visível; orientação em relação ao Sol e horizonte livre também influenciam. O calendário de chuvas de meteoros usa períodos e picos publicados pela [EXOSS](https://press.exoss.org/calendario/) para 2026; revise e atualize os dados quando a fonte publicar um novo calendário.

O arquivo `public/robots.txt` permite a indexação das páginas públicas pelos mecanismos de busca e aponta para o sitemap. Endpoints de API não são destinados à indexação.

O ícone específico de qualidade do ar ainda não está disponível; aguardamos sua inclusão no Meteocons.

# Deploy na Vercel
Em **Project Settings → Environment Variables**, crie `WEATHER_API_KEY` com a chave da HG Brasil e habilite-a para os ambientes desejados (Production, Preview e/ou Development). Não use o prefi[...]

# Executar localmente
```bash
npm install
cp .env.example .env
# Configure WEATHER_API_KEY no arquivo .env
npm run dev
```

O servidor local aplica um limite de 120 consultas por IP a cada 15 minutos. Os avisos do INMET são armazenados em cache por 10 minutos para evitar consultas repetidas à fonte. Para verificar os tipos, execute `npm run typecheck`; para gerar a versão de produção, execute `npm run build`.

# Infraestrutura
- [x] Completar o mapeamento das **Condições do Tempo**
- [x] Melhorar a disposição do itens na tela
- [x] Implementar os resto dos dados da previsão do tempo utilizando os dados da **HG Brasil**
- [ ] Criar uma persistência que armazena os dados por alguns dias
- [x] Adaptar para que funcione nos smartphones e dispositivos menores
- [x] Solicitar a cidade na primeira visita e salvar a escolha para as próximas visitas
- [x] Marcar feriados nacionais e estaduais do RS na previsão estendida, incluindo data móvel calculada para a Sexta-feira Santa, com destaque visual discreto
- [x] Exibir datas municipais fornecidas para os municípios atendidos, distinguindo ponto facultativo
- [X] Validar anualmente as datas e as fontes oficiais de cada município

## Saúde
- [x] Churrasco
- [x] Mosquito
- [x] Frizz
- [x] Ressecamento de pele
- [x] Gripe/Resfriado
- [x] Vitamina D
- [x] Estimar condições para churrasco usando somente a nebulosidade atual e a previsão de hoje

## Cotidiano
- [x] Estimativa de condições para secagem de roupas, com explicação dos critérios

## Astronomia
- [x] Reunir fase da Lua, estimativa de arco-íris, chuvas de meteoros e eclipses em cards explicativos
- [x] Exibir a chuva de meteoros ativa ou a próxima, com períodos e picos do calendário EXOSS 2026
- [x] Estação do ano
- [x] Indicar possibilidade de arco-íris com chuva, nebulosidade e elevação solar; tratar como estimativa, não confirmação

## Dados regionais
- [x] Alertas oficiais INMET
- [ ] Nível do Rio Taquari apenas para municípios atendidos por estações oficiais identificadas, mostrando estação e distância (a API REST da [ANA Hidroweb](https://www.snirh.gov.br/hidroweb/) exige token; validar acesso e cobertura antes de exibir leituras)
- [x] Qualidade do ar (AQI)
- [ ] Risco meteorológico de fogo do INPE, distinguindo-o de focos de calor detectados por satélite
- [ ] Chuva observada em estações próximas para complementar a previsão
- [ ] Condições de estiagem, usando fonte e metodologia oficiais

## Energia
- [x] Indicador estimado de potencial solar em três níveis, com radiação do Open-Meteo e indicação de noite
- [x] Exibir o potencial solar em um card próprio abaixo das informações de vento
- [x] Exibir ícone noturno dedicado para o potencial solar

## Previsão do tempo
- [x] Organizar a navegação principal nas abas Painel, Previsão e Sobre
- [x] Criar uma aba dedicada à previsão do tempo, com navegação entre horas, dias e índices
- [x] Exibir a previsão horária das próximas 24 horas e permitir voltar às horas restantes de hoje
- [x] Permitir selecionar outro dia da previsão estendida para ver todas as horas disponíveis
- [x] Exibir no painel principal a maior probabilidade de chuva nas próximas 6 horas
- [x] Exibir no cabeçalho o horário da última consulta das condições atuais e informar a atualização automática a cada 10 minutos
- [x] Permitir atualizar o relógio manualmente; consultar os dados sem recarregar a página somente após o intervalo de 10 minutos

## Agro
- [x] Criar uma aba Agro com temas de estiagem, fogo, geada, chuva, calor e vento identificados como em breve
- [x] Exibir um mapa esquemático com a localização das sedes dos 25 municípios, sem camadas de dados
- [ ] Avaliar fontes e integrar dados meteorológicos e ambientais relevantes para o campo

## Sobre e transparência
- [x] Criar uma aba Sobre com apresentação do projeto, cobertura, contato e feedback
- [x] Informar fontes de dados, estimativas, limitações e frequência de atualização
- [x] Exibir apoiadores e seus perfis sociais autorizados, com ícones das plataformas; manter os dados em `src/data/supporters.json`
- [x] Exibir notas de novidades datadas, mantidas em `src/data/releaseNotes.json`

As novidades formam uma timeline, da mais recente para a mais antiga. Para publicar uma atualização relevante, adicione uma entrada com data, título e resumo em `src/data/releaseNotes.json`; mantenha as entradas anteriores.

## Indicadores temporariamente fora da interface
- [ ] Nível de pólen e respectiva explicação