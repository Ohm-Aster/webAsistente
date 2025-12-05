/* ======================================================
   chat-service.js
   Encapsula la llamada al backend (/api/chat)
   que se conectará a Azure OpenAI usando secrets.
====================================================== */

/**
 * Envía un mensaje al backend que conecta con Azure OpenAI.
 * @param {string} userMessage - Texto enviado por el usuario.
 * @returns {Promise<string>} - Respuesta generada por el modelo.
 */
async function sendMessageToAssistant(userMessage) {
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            console.error("HTTP error:", response.status, await response.text());
            throw new Error("Error en la solicitud");
        }

        const data = await response.json();

        if (!data.reply) {
            throw new Error("Respuesta inválida del backend");
        }

        return data.reply;

    } catch (error) {
        console.error("Error en chat-service:", error);
        throw error;
    }
}
