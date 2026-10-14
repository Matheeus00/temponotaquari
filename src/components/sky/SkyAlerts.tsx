import './SkyAlerts.css';

interface SkyAlertsProps {
  precipitationMillimeters?: number;
  cloudCoverPercent?: number;
  isDay?: boolean;
}

interface MeteorShower {
  name: string;
  starts: string;
  peak: string;
  ends: string;
}

// Approximate annual activity windows and peaks; review against an astronomy calendar yearly.
const METEOR_SHOWERS: MeteorShower[] = [
  { name: 'Quadrântidas', starts: '12-28', peak: '01-03', ends: '01-12' },
  { name: 'Líridas', starts: '04-14', peak: '04-22', ends: '04-30' },
  { name: 'Eta Aquáridas', starts: '04-19', peak: '05-05', ends: '05-28' },
  { name: 'Delta Aquáridas Austrais', starts: '07-12', peak: '07-30', ends: '08-23' },
  { name: 'Perseidas', starts: '07-17', peak: '08-12', ends: '08-24' },
  { name: 'Oriônidas', starts: '10-02', peak: '10-21', ends: '11-07' },
  { name: 'Leonídeas', starts: '11-06', peak: '11-17', ends: '11-30' },
  { name: 'Gemínidas', starts: '12-04', peak: '12-14', ends: '12-17' },
  { name: 'Úrsidas', starts: '12-17', peak: '12-22', ends: '12-26' },
];

const getMonthDay = (date: Date): string =>
  `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const makeLocalDate = (year: number, monthDay: string): Date => {
  const [month, day] = monthDay.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
};

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' }).format(date);

const getMeteorShowerAlert = (today: Date) => {
  const todayMonthDay = getMonthDay(today);
  const todayYear = today.getFullYear();
  const activeShower = METEOR_SHOWERS.find(({ starts, ends }) =>
    starts <= ends
      ? todayMonthDay >= starts && todayMonthDay <= ends
      : todayMonthDay >= starts || todayMonthDay <= ends,
  );

  if (activeShower) {
    const crossesYear = activeShower.starts > activeShower.ends;
    const peakYear = crossesYear && todayMonthDay >= activeShower.starts
      ? todayYear + 1
      : todayYear;
    const peakDate = makeLocalDate(peakYear, activeShower.peak);

    return {
      title: `${activeShower.name} ativa`,
      description: `Pico previsto em ${formatDate(peakDate)}.`,
      badge: 'ATIVA',
    };
  }

  const nextShower = METEOR_SHOWERS
    .map((shower) => {
      const peakDate = makeLocalDate(todayYear, shower.peak);
      if (peakDate < today) {
        peakDate.setFullYear(todayYear + 1);
      }
      return { shower, peakDate };
    })
    .sort((first, second) => first.peakDate.getTime() - second.peakDate.getTime())[0];

  return {
    title: `Próxima: ${nextShower.shower.name}`,
    description: `Pico previsto em ${formatDate(nextShower.peakDate)}.`,
    badge: 'CALENDÁRIO',
  };
};

export const SkyAlerts = ({
  precipitationMillimeters,
  cloudCoverPercent,
  isDay,
}: SkyAlertsProps) => {
  // A rainbow needs daylight, rain, and some open sky; this only indicates favorable conditions.
  const rainbowConditionsFavorable =
    isDay === true &&
    precipitationMillimeters !== undefined &&
    precipitationMillimeters >= 0.1 &&
    cloudCoverPercent !== undefined &&
    cloudCoverPercent <= 80;
  const canAssessRainbowConditions =
    isDay !== undefined &&
    precipitationMillimeters !== undefined &&
    cloudCoverPercent !== undefined;
  const meteorAlert = getMeteorShowerAlert(new Date());

  return (
    <section className="sky-alerts" aria-label="Alertas do céu">
      {canAssessRainbowConditions && (
        <aside
          className={`sky-alert sky-alert-rainbow${rainbowConditionsFavorable ? '' : ' sky-alert-rainbow-unfavorable'}`}
          aria-label="Condições para arco-íris"
        >
          <span className="sky-alert-icon" aria-hidden="true">
            <img src="/condition/rainbow.svg" alt="" />
          </span>
          <span className="sky-alert-copy">
            <span className="sky-alert-label">
              {rainbowConditionsFavorable ? 'CONDIÇÕES FAVORÁVEIS' : 'OBSERVAÇÃO DO CÉU'}
            </span>
            <strong>Possibilidade de arco-íris</strong>
            <span className="sky-alert-description">
              {rainbowConditionsFavorable
                ? 'Há chuva e períodos de abertura entre nuvens. A observação também depende da posição do Sol e de um horizonte livre.'
                : isDay
                ? 'Não há combinação de chuva e abertura entre nuvens neste momento.'
                : 'À noite não há luz solar para formar arco-íris; as condições podem mudar durante o dia.'}
            </span>
          </span>
          <span className="sky-alert-badge">
            {rainbowConditionsFavorable ? 'FAVORÁVEL' : 'SEM CONDIÇÕES'}
          </span>
        </aside>
      )}
      <aside className="sky-alert sky-alert-meteor" aria-label="Calendário de chuvas de meteoros">
        <span className="sky-alert-icon" aria-hidden="true">
          <img src="/condition/falling-stars.svg" alt="" />
        </span>
        <span className="sky-alert-copy">
          <span className="sky-alert-label">ALERTA ASTRONÔMICO</span>
          <strong>{meteorAlert.title}</strong>
          <span className="sky-alert-description">
            {meteorAlert.description} A visibilidade depende de céu escuro, nuvens, Lua e poluição luminosa.
          </span>
        </span>
        <span className="sky-alert-badge">{meteorAlert.badge}</span>
      </aside>
    </section>
  );
};
