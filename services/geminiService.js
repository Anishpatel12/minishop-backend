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
    model: "gemini-2.0-flash",
  });

  const prompt = `
Convert the product request into JSON.

Fields:
title
price
stock
category
brand
description

Return only valid JSON.

Request:
${command}
`;

  const result =
    await model.generateContent(
      prompt
    );

  const text =
    result.response
      .text()
      .replace(
        /```json/g,
        ""
      )
      .replace(
        /```/g,
        ""
      )
      .trim();

  return JSON.parse(text);
}

module.exports = {
  parseProduct,
};