require('dotenv').config();
const aiService = require('./services/aiService');

const fs = require('fs');
const fs = require('fs');

async function test() {
  console.log("Testing Gemini API with key:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");
  try {
    const result = await aiService.analyzeManual("Aim: To test if this works.\nProcedure: Run script.\nConclusion: Success.");
    fs.writeFileSync('debug.log', JSON.stringify(result, null, 2), 'utf-8');
  } catch (err) {
    fs.writeFileSync('debug.log', err.stack || err.message, 'utf-8');
  }
}

test();
