import './AboutPage.css';
import supporters from '../../data/supporters.json';
import releaseNotes from '../../data/releaseNotes.json';

const sources = [
  {
    name: 'HG Brasil',
    detail: 'Condições atuais e previsão estendida para as cidades selecionadas.',
    href: 'https://hgbrasil.com/status/weather',
  },
  {
    name: 'Open-Meteo',
    detail: 'Previsão horária, índice UV, ponto de orvalho, radiação solar e qualidade do ar.',
    href: 'https://open-meteo.com/',
  },
  {
    name: 'CAMS',
    detail: 'Fonte dos dados de qualidade do ar disponibilizados pelo Open-Meteo.',
    href: 'https://atmosphere.copernicus.eu/',
  },
  {
    name: 'INMET',
    detail: 'Avisos meteorológicos oficiais por município.',
    href: 'https://portal.inmet.gov.br/',
  },
  {
    name: 'EXOSS',
    detail: 'Calendário de chuvas de meteoros, com períodos de atividade e datas de pico.',
    href: 'https://press.exoss.org/calendario/',
  },
  {
    name: 'IAU Meteor Data Center',
    detail: 'Catálogo de chuvas de meteoros estabelecidas e dados de seus radiantes.',
    href: 'https://www.ta3.sk/IAUC22DB/MDC2022/Roje/roje_lista.php?corobic_roje=1&sort_roje=0',
  },
  {
    name: 'NASA — eclipses solares',
    detail: 'Catálogo e previsões de eclipses solares.',
    href: 'https://eclipse.gsfc.nasa.gov/SEdecade/SEdecade2021.html',
  },
  {
    name: 'NASA — eclipses lunares',
    detail: 'Catálogo e previsões de eclipses lunares.',
    href: 'https://eclipse.gsfc.nasa.gov/LEdecade/LEdecade2021.html',
  },
  {
    name: 'Meteocons',
    detail: 'Ícones meteorológicos de Bas Milius.',
    href: 'https://bas.dev/work/meteocons',
  },
];

const sortedReleaseNotes = [...releaseNotes]
  .sort((first, second) => Date.parse(second.date) - Date.parse(first.date));
const [latestRelease, ...olderReleases] = sortedReleaseNotes;

const renderReleaseNote = (release: (typeof releaseNotes)[number]) => (
  <article className="release-note" key={release.date}>
    <time dateTime={release.date}>
      {new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'long',
        timeZone: 'UTC',
      }).format(new Date(`${release.date}T00:00:00Z`))}
    </time>
    <h3>{release.title}</h3>
    <ul>
      {release.items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  </article>
);

export const AboutPage = () => (
  <div className="about-page">
    <header className="about-intro">
      <p className="eyebrow">SOBRE O PROJETO</p>
      <h1>O tempo do Vale do Taquari, de um jeito simples.</h1>
      <p>
        O Tempo no Taquari reúne previsão e informações meteorológicas de 25 cidades
        do Vale do Taquari, no Rio Grande do Sul.
      </p>
      <div className="about-actions">
        <a href="mailto:contato@temponotaquari.com.br">Fale com a gente</a>
        <a href="https://forms.gle/Qdpy1CjZKuJyub6X7" target="_blank" rel="noreferrer">
          Envie um feedback
        </a>
      </div>
    </header>

    <section className="about-section about-release-notes" aria-labelledby="release-notes-title">
      <div className="about-section-heading">
        <p className="eyebrow">ACOMPANHE O PROJETO</p>
        <h2 id="release-notes-title">Novidades</h2>
        <p>Veja o que mudou no Tempo no Taquari.</p>
      </div>
      <div className="release-notes-list">
        {latestRelease && renderReleaseNote(latestRelease)}
        {olderReleases.length > 0 && (
          <details className="release-notes-history">
            <summary>Ver histórico anterior ({olderReleases.length})</summary>
            <div className="release-notes-list">
              {olderReleases.map(renderReleaseNote)}
            </div>
          </details>
        )}
      </div>
    </section>

    <section className="about-section" aria-labelledby="transparency-title">
      <div className="about-section-heading">
        <p className="eyebrow">DADOS ABERTOS SOBRE O SERVIÇO</p>
        <h2 id="transparency-title">Transparência</h2>
        <p>Veja de onde vêm as informações e como interpretar as estimativas.</p>
      </div>

      <div className="about-source-grid">
        {sources.map((source) => (
          <article className="about-source-card" key={source.name}>
            <h3>
              <a href={source.href} target="_blank" rel="noreferrer">{source.name}</a>
            </h3>
            <p>{source.detail}</p>
          </article>
        ))}
      </div>

      <div className="about-method-grid">
        <article className="about-info-card">
          <h3>Estimativas, não medições locais</h3>
          <p>
            O potencial solar usa a radiação estimada em W/m² e não representa a
            energia produzida por um painel específico. O índice de secagem de roupas
            combina previsão horária de temperatura, umidade, vento, radiação e chuva;
            não prevê um tempo exato de secagem.
          </p>
        </article>
        <article className="about-info-card">
          <h3>Limites e disponibilidade</h3>
          <p>
            A cobertura e a precisão variam conforme a fonte e a localização. O ponto
            de orvalho pode ser estimado quando a fonte não o fornece. O nível de pólen
            não é exibido porque não há dados disponíveis para a região. Leituras do
            Rio Taquari dependem da validação de estações oficiais e de acesso à API
            da ANA.
          </p>
        </article>
        <article className="about-info-card">
          <h3>Atualização</h3>
          <p>
            Os dados são consultados nos provedores meteorológicos e podem permanecer
            em cache por alguns minutos. Avisos do INMET são armazenados em cache por
            10 minutos. Consulte a fonte oficial para decisões que exijam informação
            de segurança atualizada.
          </p>
        </article>
      </div>

      <section className="about-supporters" aria-labelledby="supporters-title">
        <div>
          <p className="eyebrow">COMUNIDADE</p>
          <h3 id="supporters-title">Apoiadores voluntários</h3>
          <p>Reconhecemos com gratidão quem desenvolve e apoia o projeto.</p>
        </div>
        <div className="about-supporters-list">
          {supporters.map((supporter) => (
            <article className="about-supporter" key={supporter.name}>
              <div>
                <h4>{supporter.name}</h4>
                <p>{supporter.role}</p>
              </div>
              <nav className="about-supporter-profiles" aria-label={`Perfis de ${supporter.name}`}>
                {supporter.profiles.map((profile) => (
                  <a
                    href={profile.href}
                    key={profile.name}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span
                      className={`about-social-icon about-social-icon-${profile.platform}`}
                      aria-hidden="true"
                    />
                    <span>{profile.name}</span>
                  </a>
                ))}
              </nav>
            </article>
          ))}
        </div>
      </section>
    </section>
  </div>
);
