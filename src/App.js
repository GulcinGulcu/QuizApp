import './App.css';
import { HomePage } from './Components/HomePage';
import { QuizPage } from './Components/QuizPage';
import { useState } from 'react';
function App() {
  const [start, setStart] = useState(false);

  return (
    <div className="App">
      {!start ? <HomePage setStart={setStart}/> :
           <QuizPage setStart={setStart} start={start}/>
      }
    </div>
  );
}

export default App;
