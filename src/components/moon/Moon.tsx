import './Moon.css';

const types = [
    { value: 'new', label: 'Lua nova' },
    { value: 'waxing_crescent', label: 'Lua crescente' },
    { value: 'first_quarter', label: 'Quarto crescente' },
    { value: 'waxing_gibbous', label: 'Gibosa crescente' },
    { value: 'full', label: 'Lua cheia' },
    { value: 'waning_gibbous', label: 'Gibosa minguante' },
    { value: 'last_quarter', label: 'Quarto minguante' },
    { value: 'waning_crescent', label: 'Lua minguante' },
]

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
        </div>
    );
};