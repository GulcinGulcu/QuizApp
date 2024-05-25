import './styles.css';

export const HomePage = ({setStart}) => {
  return(
    <div className='home-page'>
        <h1>Quizzical</h1>
        <p>Click here to start!</p>
        <button className='start-btn' onClick={() => setStart(true)}>Start Quiz</button>
    </div>
   )
}