import { decode } from "html-entities";

export default function Question({ questionData, handleSelectAnswer, resolved, disabled }) {
  const answersElement =
    <div className="answers-container">
      {questionData.answers.map((item, index) => {
        return (
          <button
            className={"answer" + (item.selected ? " selected" : "") + (item.correct ? " correct" : "")}
            key={index}
            onClick={() => handleSelectAnswer(questionData.id, item.id)} disabled={disabled}>
            {decode(item.answer)}
          </button>
        )
      })}
    </div>

  return (
    <div className={resolved ? "question resolved" : "question"}>
      <h1 className="question-title">{decode(questionData.question)}</h1>
      {answersElement}
    </div>
  )
}