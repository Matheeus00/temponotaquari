import './EclipseCalendar.css';
import { DismissibleDetails } from '../common/DismissibleDetails';

interface Eclipse {
  date: string;
  type: string;
  visibility: string;
}

const ECLIPSES: Eclipse[] = [
  { date: '2027-02-06', type: 'Eclipse solar anular', visibility: 'América do Sul, Antártida e África' },
  { date: '2027-02-20', type: 'Eclipse lunar penumbral', visibility: 'Américas, Europa, África e Ásia' },
  { date: '2027-08-02', type: 'Eclipse solar total', visibility: 'África, Europa, Oriente Médio e Ásia' },
  { date: '2027-08-17', type: 'Eclipse lunar penumbral', visibility: 'Pacífico e Américas' },
];

const formatEclipseDate = (date: string): string =>
  new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));

interface EclipseCalendarProps {
  date: Date;
}

export const EclipseCalendar = ({ date }: EclipseCalendarProps) => {
  const today = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Sao_Paulo',
  }).format(date);
  const upcomingEclipses = ECLIPSES.filter((eclipse) => eclipse.date >= today);
  const solarEclipses = upcomingEclipses.filter((eclipse) => eclipse.type.startsWith('Eclipse solar'));
  const lunarEclipses = upcomingEclipses.filter((eclipse) => eclipse.type.startsWith('Eclipse lunar'));

  const renderEclipses = (eclipses: Eclipse[]) => (
    eclipses.length > 0 ? (
      <ol className="eclipse-calendar-list">
        {eclipses.map((eclipse) => (
          <li key={eclipse.date}>
            <time dateTime={eclipse.date}>{formatEclipseDate(eclipse.date)}</time>
            <strong>{eclipse.type}</strong>
            <span>Visibilidade geral: {eclipse.visibility}</span>
          </li>
        ))}
      </ol>
    ) : <p className="eclipse-calendar-empty">Nenhum eclipse previsto neste período.</p>
  );

  return (
    <section className="eclipse-calendar" aria-labelledby="eclipse-calendar-title">
      <div className="eclipse-calendar-heading">
        <div>
          <p className="eyebrow">ASTRONOMIA</p>
          <h2 id="eclipse-calendar-title">Próximos eclipses</h2>
        </div>
        <img src="/eclipse/solar-eclipse.svg" alt="" aria-hidden="true" />
      </div>
      <div className="eclipse-calendar-groups">
        <section className="eclipse-calendar-group" aria-labelledby="solar-eclipses-title">
          <h3 id="solar-eclipses-title">Eclipses solares</h3>
          {renderEclipses(solarEclipses)}
        </section>
        <section className="eclipse-calendar-group" aria-labelledby="lunar-eclipses-title">
          <h3 id="lunar-eclipses-title">Eclipses lunares</h3>
          {renderEclipses(lunarEclipses)}
        </section>
      </div>
      <DismissibleDetails
        className="eclipse-calendar-guide"
        summary="Conheça os tipos de eclipses solares e lunares"
      >
        <div className="eclipse-calendar-guide-content">
          <section className="eclipse-explanation-group" aria-labelledby="solar-eclipse-types">
            <h3 id="solar-eclipse-types">Eclipses solares</h3>
            <p>
              <strong>Parcial:</strong> a Lua cobre apenas uma parte do disco solar para quem observa
              de determinada região.
            </p>
            <p>
              <strong>Total:</strong> a Lua cobre completamente o Sol para quem está na faixa estreita
              da totalidade. Fora dela, o eclipse pode ser parcial ou não ser visível.
            </p>
            <p>
              <strong>Anular:</strong> a Lua passa diante do Sol, mas parece menor e não o cobre por
              completo; fica visível um anel luminoso ao redor dela.
            </p>
            <p>
              <strong>Híbrido:</strong> ao longo de diferentes trechos da faixa do eclipse, ele é
              observado como total ou anular, devido à curvatura da Terra e à distância aparente da
              Lua.
            </p>
            <p className="eclipse-safety-note">
              Nunca observe o Sol diretamente sem filtro solar apropriado — isso inclui as fases
              parciais e anulares de um eclipse.
            </p>
          </section>
          <section className="eclipse-explanation-group" aria-labelledby="lunar-eclipse-types">
            <h3 id="lunar-eclipse-types">Eclipses lunares</h3>
            <p>
              A <strong>penumbra</strong> é a parte externa e mais clara da sombra da Terra; a
              <strong> umbra</strong> é a região central e mais escura.
            </p>
            <p>
              <strong>Penumbral:</strong> a Lua atravessa a penumbra, causando um escurecimento
              geralmente sutil. <strong>Parcial:</strong> uma parte da Lua entra na umbra.
            </p>
            <p>
              <strong>Total:</strong> a Lua inteira entra na umbra e pode adquirir um tom avermelhado
              pela luz solar filtrada pela atmosfera da Terra.
            </p>
          </section>
        </div>
      </DismissibleDetails>
      <p className="eclipse-calendar-note">
        A visibilidade depende da região e do horário local. As datas são as do instante de maior eclipse.
      </p>
    </section>
  );
};
