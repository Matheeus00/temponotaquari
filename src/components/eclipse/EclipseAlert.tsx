import './EclipseAlert.css';

export const EclipseAlert = () => (
  <aside className="eclipse-alert" aria-label="Aviso sobre próximo eclipse">
    <span className="eclipse-icon" aria-hidden="true">
      <img src="/eclipse/solar-eclipse.svg" alt="" />
    </span>
    <span className="eclipse-copy">
      <span className="eclipse-label">ALERTA ASTRONÔMICO</span>
      <span>
        <strong>Próximo eclipse</strong>{/* <strong> · Dia X</strong> */}
      </span>
      <span className="eclipse-description">Data e detalhes serão adicionados em breve.</span>
    </span>
    <span className="eclipse-badge">EM BREVE</span>
  </aside>
);
