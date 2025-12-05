// ======================================================
//  Azure Function: /api/chat
//  Conecta el front con Azure OpenAI (GPT-4o-mini)
// ======================================================

import fetch from "node-fetch";

// Las variables vienen desde GitHub Secrets → App Settings
const OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;
const OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;

export default async function (context, req) {
    try {
        const userMessage = req.body?.message;

        if (!userMessage) {
            context.res = {
                status: 400,
                body: { error: "No message provided" }
            };
            return;
        }

        // Construimos el request al endpoint de Azure OpenAI
        const url = `${OPENAI_ENDPOINT}/openai/deployments/${OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-08-01-preview`;

        const payload = {
            messages: [
                { role: "system", content: "Eres un asistente experto en Azure AI y explicas con claridad." },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 600
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": OPENAI_API_KEY
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Azure OpenAI ERROR:", response.status, errorBody);

            context.res = {
                status: 500,
                body: { error: "Error calling Azure OpenAI" }
            };
            return;
        }

        const data = await response.json();

        const reply = data?.choices?.[0]?.message?.content || "No se pudo generar respuesta.";

        // Respuesta al frontend
        context.res = {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: { reply }
        };

    } catch (error) {
        console.error("Function error:", error);

        context.res = {
            status: 500,
            body: { error: "Server error" }
        };
    }
}
