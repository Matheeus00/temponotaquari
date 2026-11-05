import './SkyAlerts.css';
import { DismissibleDetails } from '../common/DismissibleDetails';

interface MeteorShower {
  name: string;
  abbreviation: string;
  starts: string;
  peak: string;
  ends: string;
}

const METEOR_CALENDAR_YEAR = 2026;

const METEOR_SHOWERS: MeteorShower[] = [
  { name: 'Quadrântidas', abbreviation: 'QUA', starts: '12-28', peak: '01-03', ends: '01-12' },
  { name: 'Alfa-Centaurídeas', abbreviation: 'ACE', starts: '01-31', peak: '02-08', ends: '02-20' },
  { name: 'Líridas', abbreviation: 'LYR', starts: '04-14', peak: '04-22', ends: '04-30' },
  { name: 'Eta Aquáridas', abbreviation: 'ETA', starts: '04-19', peak: '05-05', ends: '05-28' },
  { name: 'Delta Aquáridas do Sul', abbreviation: 'SDA', starts: '07-12', peak: '07-30', ends: '08-23' },
  { name: 'Alfa-Capricornídeas', abbreviation: 'CAP', starts: '07-03', peak: '07-30', ends: '08-15' },
  { name: 'Perseidas', abbreviation: 'PER', starts: '07-17', peak: '08-12', ends: '08-24' },
  { name: 'Oriônidas', abbreviation: 'ORI', starts: '10-02', peak: '10-21', ends: '11-07' },
  { name: 'Leônidas', abbreviation: 'LEO', starts: '11-06', peak: '11-17', ends: '11-30' },
  { name: 'Gemínidas', abbreviation: 'GEM', starts: '12-04', peak: '12-14', ends: '12-20' },
  { name: 'Úrsidas', abbreviation: 'URS', starts: '12-17', peak: '12-22', ends: '12-26' },
];

const makeLocalDate = (year: number, monthDay: string): Date => {
  const [month, day] = monthDay.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (date: Date, includeYear = false): string =>
  new Intl.DateTimeFormat(
    'pt-BR',
    includeYear
      ? { day: 'numeric', month: 'long', year: 'numeric' }
      : { day: 'numeric', month: 'long' },
  ).format(date);

const getMeteorShowerAlert = (today: Date) => {
  if (today.getFullYear() !== METEOR_CALENDAR_YEAR) return null;

  const events = METEOR_SHOWERS.map((shower) => {
    const peak = makeLocalDate(METEOR_CALENDAR_YEAR, shower.peak);
    const starts = makeLocalDate(
      shower.starts > shower.peak ? METEOR_CALENDAR_YEAR - 1 : METEOR_CALENDAR_YEAR,
      shower.starts,
    );
    const ends = makeLocalDate(
      shower.ends < shower.peak ? METEOR_CALENDAR_YEAR + 1 : METEOR_CALENDAR_YEAR,
      shower.ends,
    );
    return { shower, starts, peak, ends };
  });

  const activeEvent = events
    .filter(({ starts, ends }) => today >= starts && today <= ends)
    .sort((first, second) => first.peak.getTime() - second.peak.getTime())[0];

  if (activeEvent) {
    return {
      title: `${activeEvent.shower.name} ativa`,
      starts: activeEvent.starts,
      peak: activeEvent.peak,
      ends: activeEvent.ends,
      badge: 'ATIVA',
    };
  }

  const nextEvent = events
    .filter(({ starts }) => starts > today)
    .sort((first, second) => first.starts.getTime() - second.starts.getTime())[0];

  if (!nextEvent) return null;

  return {
    title: `Próxima: ${nextEvent.shower.name}`,
    starts: nextEvent.starts,
    peak: nextEvent.peak,
    ends: nextEvent.ends,
    badge: 'CALENDÁRIO',
  };
};

export const SkyAlerts = () => {
  const meteorAlert = getMeteorShowerAlert(new Date());

  return (
    <section className="sky-alerts sky-alerts-meteor" aria-label="Calendário de chuvas de meteoros">
      <aside className="sky-alert sky-alert-meteor" aria-label="Calendário de chuvas de meteoros">
        <div className="widget-heading sky-alert-heading">
          <span className="sky-alert-icon" aria-hidden="true">
            <img src="/condition/falling-stars.svg" alt="" />
          </span>
          <div>
            <p className="widget-label">CALENDÁRIO EXOSS {METEOR_CALENDAR_YEAR}</p>
            <h2>Chuvas de meteoros</h2>
          </div>
        </div>
        <div className="sky-alert-copy">
          <strong>{meteorAlert?.title ?? 'Calendário em atualização'}</strong>
          {meteorAlert ? (
            <span className="sky-alert-description">
              <span>Atividade: {formatDate(meteorAlert.starts)} a {formatDate(meteorAlert.ends)}.</span>
              <span>Pico: {formatDate(meteorAlert.peak)}.</span>
            </span>
          ) : (
            <span className="sky-alert-description">
              Calendário EXOSS de {METEOR_CALENDAR_YEAR} encerrado; consulte a fonte para datas atualizadas.
            </span>
          )}
          {meteorAlert && <span className="sky-alert-badge">{meteorAlert.badge}</span>}
        </div>
        <div className="sky-alert-footer">
          <DismissibleDetails className="sky-alert-guide" summary="O que significam esses termos?">
            <div className="sky-alert-guide-content">
              <h3>Como ler o calendário</h3>
              <p>
                Uma chuva de meteoros acontece quando a Terra atravessa rastros de partículas
                deixados por cometas ou asteroides. Os meteoros parecem partir de uma região do céu,
                chamada radiante; o nome da chuva costuma vir da constelação nessa direção.
              </p>
              <p>
                As Oriônidas, por exemplo, recebem esse nome porque seu radiante fica na direção
                da constelação de Órion. Elas não vêm das estrelas da constelação: são partículas
                que entram na atmosfera terrestre.
              </p>
              <p>
                “Atividade” indica o período em que a chuva pode ser observada, e “pico” é a data
                em que se espera maior quantidade de meteoros. O pico não garante mais meteoros
                visíveis em todos os locais: céu escuro, nuvens, Lua e poluição luminosa influenciam
                a observação.
              </p>
            </div>
          </DismissibleDetails>
        </div>
      </aside>
    </section>
  );
};
