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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjectError, setSubjectError] = useState<string | null>(null);

  // Validação mais robusta: tenta identificar palavras-chave comuns de filmes/séries
  const isMovieOrSeries = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    const keywords = [
      "filme", "filmes", "série", "series", "temporada", "episódio", "filmed", "directed by",
      "cast", "protagonizado", "netflix", "prime video", "hbo", "disney+", "streaming",
      "ficção", "suspense", "drama", "comédia", "ação", "terror", "documentário", "animação",
      "temporadas", "minissérie", "longa-metragem"
    ];
    // Verifica se há pelo menos duas palavras OU se contém uma palavra-chave
    return text.trim().split(/\s+/).length > 1 || keywords.some(keyword => lowerText.includes(keyword));
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
    setSubjectError(null); // Limpa a mensagem de erro ao digitar
  };

  const handleGenerateQuestions = async () => {
    if (!subject.trim()) {
      setSubjectError('Por favor, informe o nome de um filme ou série.');
      return;
    }

    if (!isMovieOrSeries(subject)) {
      setSubjectError('Parece que isso não é um filme ou série. Por favor, digite o nome de um filme ou série.');
      return;
    }

    setLoading(true);
    setError(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setShowResults(false);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Modificado para especificar o tipo de quiz
        body: JSON.stringify({ subject: `10 perguntas sobre o filme ou série "${subject}"` }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Erro ao gerar as perguntas. Por favor, tente novamente.');
      }

      const generatedQuestions: Question[] = await response.json();
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setUserAnswers(Array(generatedQuestions.length).fill(''));
      } else {
        setError('Não foi possível gerar perguntas para este filme/série. Tente um nome diferente ou mais específico.');
      }

    } catch (err: any) {
      console.error('Erro ao chamar a API route:', err);
      setError(err.message || 'Erro ao gerar as perguntas. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers.splice(currentQuestionIndex, 1, answer);
    setUserAnswers(newUserAnswers);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (userAnswers?.[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-quiz">
        <h2 className="title-quiz">Quiz de Filmes e Séries</h2>
        <div className="mb-6">
          <label
            htmlFor="subject"
            className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-3"
          >
            Informe o nome do filme ou série:
          </label>
          <input
            type="text"
            id="subject"
            className="input-field"
            placeholder="Ex: Oppenheimer, The Office, Game of Thrones"
            value={subject}
            onChange={handleSubjectChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleGenerateQuestions();
              }
            }}
          />
          {subjectError && (
            <p className="text-red-500 text-sm mt-1">{subjectError}</p>
          )}
        </div>
        <button
          className="btn-primary w-full"
          onClick={handleGenerateQuestions}
          disabled={loading || !!subjectError} // Desabilita se estiver carregando ou houver erro de validação
        >
          {loading ? 'Gerando Perguntas...' : 'Gerar Quiz'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center" role="alert">
            {error}
          </div>
        )}

        {questions.length > 0 && !showResults && (
          <QuestionCard
            question={questions?.[currentQuestionIndex]?.question}
            options={questions?.[currentQuestionIndex]?.options || []}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            userAnswer={userAnswers?.[currentQuestionIndex] || ''}
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
          <div className="results-card">
            <h2 className="results-title">Resultados do Quiz</h2>
            <p className="results-score">
              Sua pontuação: <span className="font-bold">{score}</span> de <span className="font-bold">{questions.length}</span>
            </p>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {questions.map((question, index) => (
                <li key={index} className="result-item">
                  <p className="result-question-text">
                    {index + 1}. {question.question}
                  </p>
                  <p className="result-answer-text">
                    Sua resposta: <span className="font-medium">{userAnswers?.[index] || 'Não respondido'}</span>
                  </p>
                  <p className="result-answer-text">
                    Resposta correta: <span className="font-medium">{question.correctAnswer}</span>
                  </p>
                  <span
                    className={
                      userAnswers?.[index] === question.correctAnswer
                        ? "result-status-correct"
                        : "result-status-incorrect"
                    }
                  >
                    (
                    {userAnswers?.[index] === question.correctAnswer
                      ? "Correto"
                      : "Incorreto"}
                    )
                  </span>
                </li>
              ))}
            </ul>
            <button
              className="btn-primary w-full mt-6"
              onClick={() => {
                setQuestions([]);
                setShowResults(false);
                setSubject("");
                setUserAnswers([]);
                setScore(0);
                setCurrentQuestionIndex(0);
                setSubjectError(null);
                setError(null);
              }}
            >
              Gerar Novo Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireGenerator;