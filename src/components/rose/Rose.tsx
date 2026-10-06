import './Rose.css';
import { getBeaufortIndex } from '../../utils/utils';
import { BEAUFORT_SCALE, getBeaufortLevel } from '../../constants/beaufort';

interface RoseProps {
    rotation: number;
    speed: string;
}

export const Rose = ({ rotation, speed }: RoseProps) => {
    const beaufortIndex = getBeaufortIndex(speed);
    const beaufortLevel = getBeaufortLevel(Number.parseFloat(speed));

    return (
        <div className='rose-container'>
            <div className="widget-heading">
                <span className="widget-icon" aria-hidden="true">↗</span>
                <div><p className="widget-label">VENTO</p><h2>Direção e velocidade</h2></div>
            </div>
            <div className="rose" role="img" aria-label={`Rosa dos ventos, direção ${rotation} graus`}>
                <span className="rose-direction rose-north">N</span>
                <span className="rose-direction rose-northwest">NO</span>
                <span className="rose-direction rose-northeast">NE</span>
                <span className="rose-direction rose-west">O</span>
                <span className="rose-direction rose-east">L</span>
                <span className="rose-direction rose-southwest">SO</span>
                <span className="rose-direction rose-southeast">SE</span>
                <span className="rose-direction rose-south">S</span>
                <img className='compass' src='/rose/compass.svg' alt='' style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}/>
            </div>
            <div className='rose-footer'>
                <img className='beaufort' src={`/wind/wind-beaufort-${beaufortIndex}.svg`} alt=''/>
                <p><strong>{speed}</strong><span>km/h · força {beaufortIndex} — {beaufortLevel.description}</span></p>
            </div>
            <details className="beaufort-guide">
                <summary>Como funciona a escala Beaufort?</summary>
                <div className="beaufort-guide-content">
                    <p>A escala classifica a intensidade do vento de 0 (calmaria) a 12 (furacão), relacionando a velocidade em km/h com seus efeitos observáveis.</p>
                    <ul>
                        {BEAUFORT_SCALE.map((level) => (
                            <li key={level.force}>
                                <strong>{level.force} · {level.description}</strong>
                                <span>
                                    {level.minSpeed === 0 ? '0–0,9' : `${level.minSpeed}–${level.maxSpeed ?? '+'}`} km/h
                                    {' — '}{level.effect}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </details>
        </div>
    );
};