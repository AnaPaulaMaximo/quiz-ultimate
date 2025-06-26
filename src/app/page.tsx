import QuestionnaireGenerator from '@/components/QuestionnaireGenerator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-50 dark:bg-gray-900">
      <QuestionnaireGenerator />
    </main>
  );
}