const {
  GoogleGenerativeAI,
} = require(
  "@google/generative-ai"
);

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

async function parseProduct(
  command
) {
  const model =
    genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

  const prompt = `
Convert the following product request into valid JSON.

Fields:
title
price
stock
category
brand
description

Return ONLY JSON.

Request:
${command}
`;

  const result =
    await model.generateContent(
      prompt
    );

  return JSON.parse(
    result.response
      .text()
      .replace(
        /```json|```/g,
        ""
      )
  );
}

module.exports = {
  parseProduct,
};