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
Os avisos de arco-íris e o calendário de chuvas de meteoros estão temporariamente fora da interface. O código e os ícones permanecem no projeto para uma possível reativação; as datas de meteoros são aproximadas e devem ser revisadas anualmente em `src/components/sky/SkyAlerts.tsx`.

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
- [ ] Adicionar datas comemorativas (distintas de feriados oficiais) e temas visuais relacionados
- [ ] Incluir feriados municipais e regionais com base em fontes oficiais de cada cidade
- [ ] Revisar e validar anualmente o calendário e as regras de datas móveis

## Saúde
- [x] Churrasco
- [x] Mosquito
- [x] Frizz
- [x] Ressecamento de pele
- [x] Gripe/Resfriado
- [x] Vitamina D

## Cotidiano
- [x] Estimativa de condições para secagem de roupas, com explicação dos critérios

## Astronomia
- [ ] Reativar o calendário de chuvas de meteoros (temporariamente fora da interface)
- [x] Estação do ano
- [ ] Possibilidade de arco-íris baseada nas condições atuais (temporariamente fora da interface)

## Dados regionais
- [x] Alertas oficiais INMET
- [ ] Nível do Rio Taquari apenas para municípios atendidos por estações oficiais identificadas, mostrando estação e distância (a API REST da [ANA Hidroweb](https://www.snirh.gov.br/hidroweb/) exige token; validar acesso e cobertura antes de exibir leituras)
- [x] Qualidade do ar (AQI)
- [ ] Risco meteorológico de fogo do INPE, distinguindo-o de focos de calor detectados por satélite
- [ ] Chuva observada em estações próximas para complementar a previsão
- [ ] Condições de estiagem, usando fonte e metodologia oficiais

## Energia
- [x] Indicador estimado de potencial solar em três níveis, com radiação do Open-Meteo e indicação de noite

## Previsão do tempo
- [ ] Criar uma aba dedicada à previsão do tempo
- [x] Exibir a previsão horária das próximas 24 horas e permitir voltar às horas restantes de hoje
- [x] Permitir selecionar outro dia da previsão estendida para ver todas as horas disponíveis

## Transparência
- [ ] Criar uma aba com o quadro de apoiadores voluntários do site

## Mapa e localização
- [ ] Criar uma visualização com mapa centralizado, dados meteorológicos ao redor e painéis laterais recolhíveis
- [ ] Permitir localização atual opcional, com consentimento explícito e sem salvar coordenadas precisas

## Indicadores temporariamente fora da interface
- [ ] Nível de pólen e respectiva explicação