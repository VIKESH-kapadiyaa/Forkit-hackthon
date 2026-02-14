
const Groq = require("groq-sdk");

const apiKey = process.argv[2];
if (!apiKey) {
    console.error("Please provide API Key as argument");
    process.exit(1);
}

const groq = new Groq({ apiKey });

async function listModels() {
    try {
        const models = await groq.models.list();
        console.log("Available Models:");
        models.data.forEach(m => {
            console.log(`- ${m.id} (Owned by: ${m.owned_by})`);
        });
    } catch (e) {
        console.error("Error listing models:", e);
    }
}

listModels();
