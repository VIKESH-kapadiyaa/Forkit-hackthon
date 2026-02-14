
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Get key from args
const apiKey = process.argv[2];
if (!apiKey) {
    console.error("Please provide API Key as argument");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // Access the model manager directly if possible, or try a generic call
        // The SDK might not expose listModels directly on the main class in all versions
        // But let's try the standard way if available, or just fetch via REST if SDK lacks it.

        // Attempt 1: Fetch via REST to be sure (SDK might wrap it weirdly)
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const resp = await fetch(url);
        const data = await resp.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models found or error:", data);
        }

    } catch (e) {
        console.error("Error listing models:", e);
    }
}

listModels();
