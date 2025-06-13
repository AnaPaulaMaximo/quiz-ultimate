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
    <div className="mt-8 p-4 border rounded shadow-md md:w-96 w-full">
      <h3 className="text-xl font-semibold mb-2">
        Pergunta {currentQuestionIndex + 1} de {totalQuestions}
      </h3>
      <p className="mb-4">{question}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option, index) => (
          <button
            key={index}
            className={`w-full py-2 px-4 rounded border ${
              userAnswer === option
                ? 'bg-blue-200 border-blue-500'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => onAnswerSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        {!isFirstQuestion && (
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onPreviousQuestion}
          >
            Anterior
          </button>
        )}
        {!isLastQuestion ? (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onNextQuestion}
          >
            Próxima
          </button>
        ) : (
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onSubmitQuiz}
          >
            Enviar
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;