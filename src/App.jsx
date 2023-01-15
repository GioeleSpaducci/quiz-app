import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import Question from './components/Question.jsx';

function App() {
  const [request, setRequest] = useState(true);
  const [layout, setLayout] = useState("start");
  const [questions, setQuestions] = useState([]);
  const [resolvedStatus, setResolvedStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false)

  //api data request
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple").then(response => response.json()).then(json => {
      setQuestions(
        json.results.map(result => {
          const answers = result.incorrect_answers.map(answer => {
            return {
              id: nanoid(),
              answer: answer,
              correct: false,
              selected: false
            }
          });
          const rightAnswer = {
            id: nanoid(),
            answer: result.correct_answer,
            correct: true,
            selected: false
          }
          answers.push(rightAnswer)
          return {
            ...result,
            answers: shuffleArray(answers),
            resolved: false,
            id: nanoid()
          }
        })
      );
    })
  }, [request])

  //set status for future layout conditional rendering, based on user having answered questions
  function handleStatus() {
    if (layout === "start") setLayout("quiz")
    if (layout === "quiz") {
      const areQuestionsAnswered = questions.filter(question => question.resolved === true)
      if (areQuestionsAnswered.length === questions.length) {
        setResolvedStatus(true);
        setErrorMessage(false);
        setLayout("end")
      } else setErrorMessage(true)
    }
    if (layout === "end") {
      setLayout("start")
      setRequest(prev => !prev);
    }
  }

  function handleSelectAnswer(questionId, answerId) {
    setQuestions(prevQuestions => {
      return prevQuestions.map(question => {
        if (question.id === questionId) {
          const newAnswers = question.answers.map(answer => {
            if (answer.id === answerId) return { ...answer, selected: true }
            else return { ...answer, selected: false }
          })

          return {
            ...question,
            answers: newAnswers,
            resolved: true,
          }
        } else return question
      })
    })
  }

  //shuffle function for questions order
  function shuffleArray(arr) {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array
  }


  return (
    <div className='container'>
      {layout === "start" &&
        <main>
          <h1 className='title'>Quiz App</h1>
          <p className='description'>Get ready to answer those questions!</p>
          <button className="submit-button" onClick={handleStatus}>start</button>
        </main>
      }
      {layout === "quiz" &&
        <main>
          {questions.map(question => <Question questionData={question} key={question.id} resolved={false} handleSelectAnswer={handleSelectAnswer} />)}
          {errorMessage && <h2 className='error-message'>Please answer all questions.</h2>}
          <button className='submit-button' onClick={handleStatus}>Show answers</button>
        </main>
      }
      {layout === "end" &&
        <main>
          {questions.map(question => <Question questionData={question} key={question.id} resolved={true} handleSelectAnswer={handleSelectAnswer} disabled={true} />)}
          <button className='submit-button' onClick={handleStatus}>Play Again</button>
        </main>
      }
    </div>
  )
}

export default App