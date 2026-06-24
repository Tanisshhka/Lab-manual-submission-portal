const { OpenAI } = require('openai');
require('dotenv').config({ path: 'c:/Users/harsh/OneDrive/Desktop/Lab-Manual-submission-portal FINAL/server/.env' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function test() {
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say test' }]
    });
    console.log('Success:', res.choices[0].message.content);
  } catch (err) {
    console.error('Failure:', err.message, err.type, err.code);
  }
}

test();
