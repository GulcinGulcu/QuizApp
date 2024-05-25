import { useState, useEffect, useRef } from "react";
import { Button } from "../Button";
import { shuffle } from "../../Utils";
import { ScoreSentence } from "../Score";
import { decode } from 'html-entities';
import { nanoid } from 'nanoid';
import './styles.css';

export const QuizPage = ({ setStart }) => {
    const [questions, setQuestions] = useState(null);
    const [completed, setCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);
    const [userAnswersData, setUserAnswersData] = useState({});
    const renderAfterCalled = useRef(false);

    useEffect(() => {
        if (!renderAfterCalled.current) {
            fetch(`https://opentdb.com/api.php?amount=4&difficulty=easy&type=multiple`)
                .then(res => res.json())
                .then(questionData => {
                    setQuestions(
                        questionData.results.map(question => {
                            const options = [...question.incorrect_answers, question.correct_answer];
                            shuffle(options);
                            return {
                                ...question,
                                id: nanoid(),
                                question: decode(question.question),
                                correct_answer: decode(question.correct_answer),
                                incorrect_answers: question.incorrect_answers.map(answer => decode(answer)),
                                options: options.map(option => ({
                                    title: decode(option),
                                    id: nanoid(),
                                    classNames: 'label'
                                }))
                            }
                        })
                    )
                })
                .catch(err => console.log(err));
        }
        renderAfterCalled.current = true;
    }, []);

    function handleChange(e, option, questionId) {
        const { name } = e.target;
        setUserAnswersData(prev => {
            return {
                ...prev,
                [name]: option.title
            }
        });

        const updatedQuestions = questions.map(question => {
            if (question.id === questionId) {
                return { ...question, 
                    options: question.options.map(currentOption => currentOption.id === option.id ? 
                        { ...currentOption, classNames: `${currentOption.classNames} clicked` } 
                        : currentOption) }
            } else {
                return question;
            }
        });
        setQuestions(updatedQuestions);

    }

    function checkAnswers(e) {
        e.preventDefault();
        if (Object.entries(userAnswersData).length === 4) {
            setCompleted(true);
            setErrorMessage(null);
            for (let item of questions) {
                for (let key in userAnswersData) {
                    if (userAnswersData[key] === item.correct_answer) {
                        setScore(prevScore => prevScore + 1);
                    }
                }
            }

            const updatedQuestions = questions.map(question => {
                const userAnswer = userAnswersData[question.id];
                if(userAnswer !== undefined) {
                    const updatedOptions = question.options.map(option => {
                        let additionalClasses = '';
                        if(userAnswer === option.title){
                            additionalClasses = option.title === question.correct_answer ? 'correct' : 'incorrect';
                        }
                        if(option.title === question.correct_answer) {
                            additionalClasses = 'correct';
                        }
                        return {
                            ...option, 
                            classNames: `${option.classNames} ${additionalClasses}`,
                        }
                    })
                    return {...question, options: updatedOptions}
                }
                return question;
            })

            setQuestions(updatedQuestions)


        } else {
            setErrorMessage('Please, complete all the questions!');
        }
    }

    return (
        <>
            {questions ? <form onSubmit={checkAnswers}>
                {!completed && errorMessage && <p className="error-msg">{errorMessage}</p>}
                {completed && <ScoreSentence score={score} />}
                {questions.map(question =>
                (
                    <fieldset className="question-block">
                        <p>{question.question}</p>
                        <div className="options">
                            {
                                question.options.map(option => (
                                    <>
                                        <input type='radio' id={option.id} name={question.id} onChange={(e) => handleChange(e, option, question.id)} value={option.title} checked={userAnswersData[question.id] === option.title} disabled={completed}
                                        />
                                        <label className={option.classNames} htmlFor={option.id}>{option.title}</label>
                                    </>
                                ))
                            }
                        </div>
                    </fieldset>
                )
                )}
                <Button completed={completed} setStart={setStart} />
            </form> : <div className="load-msg"><h2>Loading...</h2></div>}
        </>
    )
}