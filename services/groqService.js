const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function parseProduct(command) {
  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "Convert product requests into JSON only.",
        },
        {
          role: "user",
          content: `
Return ONLY valid JSON.

Fields:
title
price
stock
category
brand
description

Request:
${command}
`,
        },
      ],
      temperature: 0.3,
    });

  const text =
    completion.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

  return JSON.parse(text);
}
async function generateProducts(command) {
  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content:
            "Generate ecommerce products in JSON array format only.",
        },
        {
          role: "user",
          content: `
Generate 20 products based on:

${command}

Return ONLY JSON ARRAY.

Fields:
title
price
stock
category
brand
description
`,
        },
      ],

      temperature: 0.8,
    });

  const text =
    completion.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

  return JSON.parse(text);
}
module.exports = {
  parseProduct,
  generateProducts,
};