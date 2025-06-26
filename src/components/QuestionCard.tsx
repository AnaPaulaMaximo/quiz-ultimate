interface QuestionCardProps {
  question: string;
  options: string[];
  currentQuestionIndex: number;
  totalQuestions: number;
  userAnswer: string;
  onAnswerSelect: (answer: string) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onSubmitQuiz: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  options,
  currentQuestionIndex,
  totalQuestions,
  userAnswer,
  onAnswerSelect,
  onNextQuestion,
  onPreviousQuestion,
  onSubmitQuiz,
  isFirstQuestion,
  isLastQuestion,
}) => {
  return (
    <div className="question-card">
      <h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">
        Pergunta {currentQuestionIndex + 1} de {totalQuestions}
      </h3>
      <p className="question-text">{question}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              userAnswer === option ? 'selected border-blue-500' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => onAnswerSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        {!isFirstQuestion && (
          <button
            className="btn-secondary"
            onClick={onPreviousQuestion}
          >
            Anterior
          </button>
        )}
        {!isLastQuestion ? (
          <button
            className="btn-success"
            onClick={onNextQuestion}
            disabled={!userAnswer} /* Desabilita se não houver resposta */
          >
            Próxima
          </button>
        ) : (
          <button
            className="btn-accent"
            onClick={onSubmitQuiz}
            disabled={!userAnswer} /* Desabilita se não houver resposta */
          >
            Finalizar Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;