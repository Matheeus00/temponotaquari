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

function getMoonType(type) {
    return types.find((currentType) => currentType.value === type).label;
}

export const Moon = ({moon}) => {
    return (
        <div className="moon-container">
            <img className='moon' src={`./moons/${moon}.svg`} alt='Moon'/>
            <span className='moon-type'>{getMoonType(moon)}</span>
        </div>
    );
};