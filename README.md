# Taquari no Tempo :sunny: :cloud:

WebApp de previsão do tempo para Lajeado e outras 24 cidades principais do Vale do Taquari, no Rio Grande do Sul.

# Utilizações: :white_check_mark:
Nesse projeto estou utilizando:\
[React com TypeScript](https://www.typescriptlang.org/) - Interface e tipagem da aplicação\
[HG Brasil](https://hgbrasil.com/status/weather) - API de Previsão do Tempo\
[Meteocons](https://bas.dev/work/meteocons) - Ícones SVG com animações

O projeto usa Vite para desenvolvimento e build, com React e TypeScript. A chave da HG Brasil é usada somente pelo servidor e não deve ser adicionada ao código do cliente.

O ícone específico de qualidade do ar ainda não está disponível; aguardamos sua inclusão no Meteocons.

# Deploy na Vercel
Em **Project Settings → Environment Variables**, crie `WEATHER_API_KEY` com a chave da HG Brasil e habilite-a para os ambientes desejados (Production, Preview e/ou Development). Não use o prefixo `VITE_`: essa variável é lida exclusivamente pela função serverless `api/weather.ts`. Depois de salvar ou alterar a variável, faça um novo deploy para ela entrar em vigor.

# Executar localmente
```bash
npm install
cp .env.example .env
# Configure WEATHER_API_KEY no arquivo .env
npm run dev
```

O servidor local aplica um limite de 60 consultas por IP a cada 15 minutos. Para verificar os tipos, execute `npm run typecheck`; para gerar a versão de produção, execute `npm run build`. O servidor de produção pode ser iniciado com `npm start` (ou `npm run preview`) e requer `WEATHER_API_KEY` configurada no ambiente.

# O que ainda será feito :rocket:
- [x] Completar o mapeamento das **Condições do Tempo**
- [ ] Migrar as **Condições do Tempo** para um **JSON**
- [ ] Melhorar a disposição do itens na tela
- [ ] Implementar os a previsão do tempo utilizando os dados da **HG Brasil**
- [ ] Criar uma persistência que armazena os dados por alguns dias
- [ ] Criar uma **API** bem completa para retorno dos dados armazenados e coletados
- [ ] Coleta dos dados da [OccuWeather API](https://developer.accuweather.com/) e [OpenWeather](https://openweathermap.org/) para compor a aplicação
- [ ] Adaptar para que funciona nos smartphones e dispositivos menores
