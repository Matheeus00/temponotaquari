import { METEOR_SHOWER_CATALOG } from '../../data/meteorShowerCatalog';

export const MeteorShowerCatalog = () => (
  <section className="meteor-catalog-card" aria-labelledby="meteor-catalog-title">
    <div className="widget-heading meteor-catalog-heading">
      <span className="meteor-catalog-icon" aria-hidden="true">
        <img src="/condition/falling-stars.svg" alt="" />
      </span>
      <div>
        <p className="widget-label">CATÁLOGO IAU MDC · 172 CHUVAS</p>
        <h2 id="meteor-catalog-title">Chuvas de meteoros estabelecidas</h2>
      </div>
    </div>
    <p className="meteor-catalog-intro">
      Catálogo do IAU Meteor Data Center, consultado em 3 de novembro de 2026. Cada item mostra
      a região aparente do céu de onde a chuva parece surgir — não sua origem nas estrelas.
    </p>
    <details className="meteor-catalog-details">
      <summary>Ver as 172 chuvas e seus radiantes</summary>
      <ul className="meteor-catalog-list">
        {METEOR_SHOWER_CATALOG.map(({ name, radiant }) => (
          <li key={name}>
            <strong>{name}</strong>
            <span>Radiante: {radiant}</span>
          </li>
        ))}
      </ul>
    </details>
  </section>
);
