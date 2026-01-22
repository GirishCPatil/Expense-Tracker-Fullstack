require("dotenv").config();
const    {GoogleGenAI}   = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
console.log("Gemini API Key:", process.env.GEMINI_API_KEY);
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});


const getCategorySuggestions = async (req,res) => {
    const prompt = req.query.prompt;
    try {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `give one word category based on the description given by user ${prompt}`,
  });
  console.log("Category Suggestion:", response);

  return res.json({response});

} catch (error) {
  console.error("Error generating category suggestion:", error);
  throw error;
}
};

module.exports = {
  getCategorySuggestions
};