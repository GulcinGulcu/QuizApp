import './styles.css';

export const Button = ({setStart, completed}) => {
   
    return <button className='check-btn' onClick={() => completed && setStart(false)}>{completed ? 'Play again' : 'Check Answers'}</button>;
}