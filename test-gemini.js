const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const HARDCODED_KEY = "PASTE_YOUR_ACTUAL_AIzaSy_KEY_HERE"; 


const ENV_KEY = process.env.GEMINI_API_KEY;

async function runTests() {
    console.log("⏳ Starting Gemini API Connection Verification...");

    // EXECUTE TEST 1 
    if (HARDCODED_KEY !== "PASTE_YOUR_ACTUAL_AIzaSy_KEY_HERE") {
        console.log("📡 Running Test 1: Testing with Hardcoded Key...");
        try {
            const aiDirect = new GoogleGenerativeAI(HARDCODED_KEY);
            const modelDirect = aiDirect.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const resultDirect = await modelDirect.generateContent("Respond with the single word: 'SUCCESS'");
            console.log(`✅ Test 1 Result: ${resultDirect.response.text().trim()}\n`);
        } catch (err) {
            console.error("❌ Test 1 Failed (Hardcoded Key is invalid according to Google):\n", err.message, "\n");
        }
    } else {
        console.log("⚠️ Skipping Test 1: No hardcoded key was provided to test.\n");
    }

    // EXECUTE TEST 2 
    console.log("📡 Running Test 2: Testing with process.env.GEMINI_API_KEY...");
    console.log(`🔍 Detected Key in .env: ${ENV_KEY ? `${ENV_KEY.substring(0, 7)}... (Length: ${ENV_KEY.length})` : "❌ NOT FOUND / UNDEFINED"}`);
    
    if (!ENV_KEY) {
        console.error("❌ Test 2 Failed: dotenv cannot find your GEMINI_API_KEY. Verify your terminal is in the same folder as your .env file.\n");
        return;
    }

    try {
        const aiEnv = new GoogleGenerativeAI(ENV_KEY);
        const modelEnv = aiEnv.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const resultEnv = await modelEnv.generateContent("Respond with the single word: 'SUCCESS'");
        console.log(`✅ Test 2 Result: ${resultEnv.response.text().trim()}\n`);
    } catch (err) {
        console.error("❌ Test 2 Failed (Key found in .env, but rejected by Google):\n", err.message, "\n");
    }
}

runTests();