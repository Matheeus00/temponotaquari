import './Rose.css';
import { DismissibleDetails } from '../common/DismissibleDetails';
import { getBeaufortIndex } from '../../utils/utils';
import {
    BEAUFORT_EXTENDED_SCALE,
    BEAUFORT_SCALE,
    getBeaufortLevel,
} from '../../constants/beaufort';

interface RoseProps {
    rotation: number;
    speed: string;
    displaySpeed?: string;
}

export const Rose = ({ rotation, speed, displaySpeed = speed }: RoseProps) => {
    const beaufortIndex = getBeaufortIndex(speed);
    const beaufortLevel = getBeaufortLevel(Number.parseFloat(speed.replace(',', '.')));

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
                <p><strong>{displaySpeed}</strong><span>{beaufortLevel.description}</span></p>
            </div>
            <DismissibleDetails className="beaufort-guide" summary="Como funciona a escala Beaufort?">
                <div className="beaufort-guide-content">
                    <h3>Escala Beaufort tradicional · graus 0 a 12</h3>
                    <p>A versão mais difundida da escala Beaufort vai de 0 a 12. As faixas abaixo estão em km/h.</p>
                    <ul className="beaufort-regular-levels">
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
                    <h3>Escala estendida · graus 13 a 17</h3>
                    <p className="beaufort-extended-note">
                        Essa extensão é menos comum. Alguns países asiáticos, como China e Vietnã, adotam classificações ampliadas para ventos extremos.
                    </p>
                    <ul className="beaufort-extreme-levels">
                        {BEAUFORT_EXTENDED_SCALE.map((level) => (
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
            </DismissibleDetails>
        </div>
    );
};