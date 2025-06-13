import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-2.0-flash"; // Ou outro modelo que preferir

export async function POST(request: NextRequest) {
  try {
    const { subject } = await request.json();

    if (!subject) {
      return NextResponse.json(
        { error: "O assunto é obrigatório" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API não configurada" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Gere um questionário com 10 perguntas sobre o assunto: "${subject}". Cada pergunta deve ter 4 alternativas, sendo apenas uma correta. Formate a resposta como um array de objetos JSON, onde cada objeto representa uma pergunta e contém os campos "question" (a pergunta), "options" (um array com as 4 alternativas) e "correctAnswer" (a alternativa correta). Certifique-se de que a resposta seja APENAS o array JSON, sem nenhum texto adicional antes ou depois.`;

    const generationConfig = {
      temperature: 0.7, 
      topK: 1,
      topP: 1,
      maxOutputTokens: 8192,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });
    const responseText = result.response.text();
    console.log("Resposta bruta do Gemini:", responseText);

    let parsedQuestions: any[]; // Usamos 'any[]' por enquanto, você pode querer criar uma interface Question para o backend
    try {
      // Tentativa de extrair o JSON de dentro dos marcadores ```json ... ```
      const match = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      let jsonToParse;

      if (match && match[1]) {
        // Se encontrou o padrão ```json ... ```, usa o conteúdo capturado
        jsonToParse = match[1].trim();
        console.log("JSON extraído dos marcadores:", jsonToParse);
      } else {
        // Se não encontrou os marcadores, tenta parsear a resposta inteira como JSON
        // Isso pode acontecer se a API Gemini retornar JSON puro sem os marcadores
        console.warn(
          "Marcadores ```json ... ``` não encontrados. Tentando parsear a resposta diretamente."
        );
        jsonToParse = responseText.trim();
      }
      parsedQuestions = JSON.parse(jsonToParse);

    } catch (parseError) {
      console.error("Erro ao parsear JSON da API Gemini:", parseError);
      console.error("Resposta completa recebida do Gemini:", responseText);
      return NextResponse.json(
        {
          error:
            "Falha ao processar a resposta do Gemini. Verifique o formato do JSON.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedQuestions, { status: 200 });
  } catch (error) {
    console.error("Erro na API Route:", error);
    let errorMessage = "Erro desconhecido ao gerar questões";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Função OPTIONS para CORS
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}