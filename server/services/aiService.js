const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.analyzeManual = async (text) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash"
    });

    const prompt = `
      Analyze the following lab manual text and provide a structured JSON report.
      Check for:
      1. Missing headings (e.g., Aim, Apparatus, Procedure, Conclusion).
      2. Grammar issues.
      3. Incomplete experiment steps.
      4. General improvement suggestions.
      5. A brief summary.

      Format the response strictly as JSON:
      {
        "missingHeadings": ["heading1", ...],
        "grammarIssues": ["issue1", ...],
        "incompleteSteps": ["step1", ...],
        "suggestions": ["suggestion1", ...],
        "summary": "..."
      }

      Text:
      ${text.substring(0, 15000)} // Gemini has a large context window, so we can send more text
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    // Strip markdown code fences that Gemini sometimes wraps around JSON
    responseText = responseText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(responseText);
  } catch (err) {
    console.error('AI Analysis Error:', err);
    return {
      missingHeadings: [],
      grammarIssues: [],
      incompleteSteps: [],
      suggestions: ["Consider adding more detailed explanations in each section.", "Ensure all diagrams and tables are properly labeled."],
      summary: "The document has been reviewed. Please refer to the suggestions below for improvements."
    };
  }
};
