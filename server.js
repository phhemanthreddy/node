const express = require("express");
const app = express();
require("@tensorflow/tfjs-node");
const qna = require("@tensorflow-models/qna");

// Middleware to parse JSON in request body
app.use(express.json());

// Set the backend to CPU and load the model asynchronously
const mainfn = async () => {
  // Load the model.
  const model = await qna.load();

  // Define a route to support JSONP
  app.post("/", async (req, res) => {
    const { question, passage } = req.body;

    const answers = await model.findAnswers(question, passage);

    // Wrap the response data in the JSONP callback function
    const jsonResponse = JSON.stringify(answers);
    res.send(jsonResponse);
  });

  // Start the server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });
};

mainfn();
