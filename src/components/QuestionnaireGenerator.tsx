"use client";
import { useState } from "react";
import QuestionCard from "@/components/QuestionCard";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const QuestionnaireGenerator = () => {
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
  };

  const handleGenerateQuestions = async () => {
    if (!subject) {
      alert('Por favor, informe um assunto.');
      return;
    }

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData?.error || 'Erro ao gerar as perguntas. Por favor, tente novamente.');
        return;
      }

      const generatedQuestions: Question[] = await response.json();
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setCurrentQuestionIndex(0);
        setUserAnswers(Array(generatedQuestions.length).fill(''));
        setScore(0);
        setShowResults(false);
      } else {
        alert('Não foi possível gerar as perguntas. Por favor, tente novamente com outro assunto.');
      }

    } catch (error) {
      console.error('Erro ao chamar a API route:', error);
      alert('Erro ao gerar as perguntas. Por favor, tente novamente.');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newUserAnswers);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-4">Gerador de Questionários</h2>
      <div className="mb-4">
        <label
          htmlFor="subject"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Informe o assunto:
        </label>
        <input
          type="text"
          id="subject"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={subject}
          onChange={handleSubjectChange}
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleGenerateQuestions}
      >
        Gerar Questionário
      </button>

      {questions.length > 0 && !showResults && (
        <QuestionCard
          question={questions[currentQuestionIndex].question}
          options={questions[currentQuestionIndex].options}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          userAnswer={userAnswers[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
          onNextQuestion={handleNextQuestion}
          onPreviousQuestion={() =>
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
          }
          onSubmitQuiz={handleSubmitQuiz}
          isFirstQuestion={currentQuestionIndex === 0}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
        />
      )}

      {showResults && (
        <div className="mt-8 p-4 border rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Resultados</h2>
          <p className="mb-2">
            Sua pontuação: {score} de {questions.length}
          </p>
          <ul>
            {questions.map((question, index) => (
              <li key={index} className="mb-2">
                <strong>Pergunta {index + 1}:</strong> {question.question}
                <br />
                Sua resposta: {userAnswers[index]}
                <br />
                Resposta correta: {question.correctAnswer}
                <span
                  className={
                    userAnswers[index] === question.correctAnswer
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  (
                  {userAnswers[index] === question.correctAnswer
                    ? "Correto"
                    : "Incorreto"}
                  )
                </span>
              </li>
            ))}
          </ul>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              setQuestions([]);
              setShowResults(false);
              setSubject("");
            }}
          >
            Gerar Novo Questionário
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireGenerator;