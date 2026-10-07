import './Moon.css';
import { DismissibleDetails } from '../common/DismissibleDetails';

const types = [
    { value: 'new', label: 'Lua nova', description: 'A face iluminada fica voltada para o Sol, e a Lua quase não aparece no céu.' },
    { value: 'waxing_crescent', label: 'Lua crescente', description: 'Um arco iluminado começa a surgir e aumenta a cada noite.' },
    { value: 'first_quarter', label: 'Quarto crescente', description: 'Metade do disco lunar visível está iluminada; a parte iluminada continua aumentando.' },
    { value: 'waxing_gibbous', label: 'Gibosa crescente', description: 'Mais da metade está iluminada, e a porção iluminada segue aumentando.' },
    { value: 'full', label: 'Lua cheia', description: 'O disco lunar visível aparece completamente iluminado.' },
    { value: 'waning_gibbous', label: 'Gibosa minguante', description: 'Mais da metade continua iluminada, mas a porção iluminada diminui.' },
    { value: 'last_quarter', label: 'Quarto minguante', description: 'Metade do disco lunar visível está iluminada; a parte iluminada continua diminuindo.' },
    { value: 'waning_crescent', label: 'Lua minguante', description: 'Resta um arco iluminado cada vez menor antes da próxima Lua nova.' },
] as const;

interface MoonProps {
    moon: string;
}

function getMoonType(type: string): string {
    return types.find((currentType) => currentType.value === type)?.label ?? 'Fase lunar desconhecida';
}

export const Moon = ({ moon }: MoonProps) => {
    return (
        <div className="moon-container">
            <div className="widget-heading">
                <span className="moon-widget-icon" aria-hidden="true">◐</span>
                <div><p className="widget-label">CICLO LUNAR</p><h2>Fase da lua</h2></div>
            </div>
            <div className="moon-content">
                <img className='moon' src={`/moons/${moon}.svg`} alt=''/>
                <div><span className='moon-type'>{getMoonType(moon)}</span><span className="moon-caption">Iluminação natural da noite</span></div>
            </div>
            <DismissibleDetails className="moon-guide" summary="Conheça as fases da Lua">
                <div className="moon-guide-content">
                    <h3>O ciclo lunar</h3>
                    <p>
                        A Lua não produz luz: vemos a parte de sua superfície iluminada pelo Sol.
                        Conforme ela orbita a Terra, essa porção visível muda e percorre um ciclo
                        de cerca de 29,5 dias.
                    </p>
                    <ul>
                        {types.map((phase) => (
                            <li key={phase.value}>
                                <img src={`/moons/${phase.value}.svg`} alt="" />
                                <span>
                                    <strong>{phase.label}</strong>
                                    <span>{phase.description}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </DismissibleDetails>
        </div>
    );
};