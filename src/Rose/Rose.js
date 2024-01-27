import './Rose.css';
import { getBeaufortIndex } from '../Util'; 

export const Rose = ({rotation, speed}) => {
    const beaufortIndex = getBeaufortIndex(speed);

    return (
        <div className='rose-container'>
            <table className='rose'>
                <tbody>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>N</th>
                        <th></th>
                        <th></th>
                    </tr>
                    <tr>
                        <td></td>
                        <td>NO</td>
                        <td></td>
                        <td>NE</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>O</td>
                        <td></td>
                        <td>
                            <img className='compass' src='./rose/compass.svg' alt='Direction' style={{transform: `rotate(${rotation}deg)`, height: '100px'}}/>
                        </td>
                        <td></td>
                        <td>L</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>SO</td>
                        <td></td>
                        <td>SE</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>S</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <hr />
            <div className='rose-footer'>
                <img className='beaufort' src={`./wind/wind-beaufort-${beaufortIndex}.svg`} alt='Wind' style={{height: '100px'}}/>
                <p>{speed}</p>
            </div>
        </div>
    );
};