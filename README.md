# Tempo no Taquari :sunny: :cloud:

WebApp de previsão do tempo para Lajeado e outras 24 cidades principais do Vale do Taquari, no Rio Grande do Sul.

# Utilizações: :white_check_mark:
Nesse projeto estou utilizando:\
[React com TypeScript](https://www.typescriptlang.org/) - Interface e tipagem da aplicação\
[HG Brasil](https://hgbrasil.com/status/weather) - API de Previsão do Tempo\
[Open-Meteo](https://open-meteo.com/) - Qualidade do ar (dados CAMS), índice UV e ponto de orvalho\
[INMET](https://portal.inmet.gov.br/) - Avisos meteorológicos oficiais por município\
[INPE — Programa Queimadas](https://terrabrasilis.dpi.inpe.br/queimadas/portal/) - Referência para dados de focos e risco de fogo\
[Meteocons](https://bas.dev/work/meteocons) - Ícones meteorológicos SVG com animações, criados por Bas Milius

O projeto usa Vite para desenvolvimento e build, com React e TypeScript. A chave da HG Brasil é usada somente pelo servidor e não deve ser adicionada ao código do cliente.
Os dados de qualidade do ar, do índice UV e do ponto de orvalho são consultados pelo servidor no Open-Meteo; a qualidade do ar também é atribuída ao CAMS, conforme a licença CC BY 4.0. Se o Open-Meteo não fornecer o ponto de orvalho, ele é estimado com temperatura e umidade da HG Brasil pela fórmula de Magnus-Tetens.
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
- [ ] Criar uma **API** bem completa para retorno dos dados armazenados e coletados
- [x] Adaptar para que funcione nos smartphones e dispositivos menores
- [ ] Adicionar temas com base em datas comemorativas, tanto da região, quanto do estado e do país, bem como "salientar" na previsão os dias com tal feriado

## Saúde
- [x] Churrasco
- [x] Mosquito
- [x] Frizz
- [x] Ressecamento de pele
- [x] Gripe/Resfriado
- [x] Vitamina D

## Astronomia
- [ ] Reativar o calendário de chuvas de meteoros (temporariamente fora da interface)
- [x] Estação do ano
- [ ] Possibilidade de arco-íris baseada nas condições atuais (temporariamente fora da interface)

## Dados regionais
- [x] Alertas oficiais INMET
- [ ] Nível do Rio Taquari e contexto hidrológico (avaliar estações da [ANA Hidroweb](https://www.snirh.gov.br/hidroweb/))
- [x] Qualidade do ar (AQI)
- [ ] Risco meteorológico de fogo do INPE, distinguindo-o de focos de calor detectados por satélite
- [ ] Chuva observada em estações próximas para complementar a previsão
- [ ] Condições de estiagem, usando fonte e metodologia oficiais

## Energia
- [ ] Indicador de potencial de geração de energia em três níveis, com ícones Meteocons

## Previsão do tempo
- [ ] Criar uma aba dedicada à previsão do tempo
- [ ] Ter a previsão de hora a hora de hoje e do dia selecionado

## Transparência
- [ ] Criar uma aba com o quadro de apoiadores voluntários do site

## Mapa e localização
- [ ] Criar uma visualização com mapa centralizado, dados meteorológicos ao redor e painéis laterais recolhíveis
- [ ] Permitir localização atual opcional, com consentimento explícito e sem salvar coordenadas precisas

## Indicadores temporariamente fora da interface
- [ ] Nível de pólen e respectiva explicação