import { Moon } from '../moon/Moon';
import { EclipseCalendar } from './EclipseCalendar';
import { MeteorShowerCatalog } from './MeteorShowerCatalog';
import { RainbowAlert } from './RainbowAlert';
import { SkyAlerts } from './SkyAlerts';
import './AstronomyPage.css';

interface AstronomyPageProps {
  moonPhase: string;
  precipitationMillimeters?: number;
  cloudCoverPercent?: number;
  latitude: number;
  longitude: number;
  date: Date;
}

export const AstronomyPage = ({
  moonPhase,
  precipitationMillimeters,
  cloudCoverPercent,
  latitude,
  longitude,
  date,
}: AstronomyPageProps) => (
  <section className="astronomy-page" aria-label="Astronomia">
    <Moon moon={moonPhase} />
    <RainbowAlert
      precipitationMillimeters={precipitationMillimeters}
      cloudCoverPercent={cloudCoverPercent}
      latitude={latitude}
      longitude={longitude}
      date={date}
    />
    <SkyAlerts />
    <MeteorShowerCatalog />
    <EclipseCalendar date={date} />
  </section>
);
