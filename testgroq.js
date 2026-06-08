require("dotenv").config();

const {
  parseProduct,
} = require("./services/groqService");

(async () => {
  const data =
    await parseProduct(
      "Add a premium black Nike running shoe for men with stock 50 and price 2999"
    );

  console.log(data);
})();