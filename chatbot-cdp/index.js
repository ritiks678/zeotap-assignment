require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Predefined responses for common questions
const responses = {
  "how to integrate zeotap": "You can integrate Zeotap with various platforms using their API. Check the docs at https://docs.zeotap.com/home/en-us/",
  "how to set up a new source": "To set up a new source, go to the Zeotap dashboard, click 'Sources', and follow the steps.",
  "how to view customer data": "You can view customer data by accessing the Zeotap Data Explorer under 'Reports'.",
  "how to delete a customer record": "To delete a customer record, go to your Zeotap account, navigate to 'Customer Data', and select 'Delete'."
};

// Chatbot API Route
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  const lowerCaseQuestion = question.toLowerCase();

  // Check predefined responses first
  for (let key in responses) {
    if (lowerCaseQuestion.includes(key)) {
      return res.json({ answer: responses[key] });
    }
  }

  // If no predefined response, fetch from Zeotap documentation
  try {
    const response = await axios.get("https://docs.zeotap.com/home/en-us/");
    const data = response.data;

    // Extract only text (removing HTML tags)
    const cleanData = data.replace(/<[^>]+>/g, "").substring(0, 300);

    res.json({ answer: `I found this in the docs: ${cleanData}...` });
  } catch (error) {
    console.error("Error fetching documentation:", error.message);
    res.json({ error: "Sorry, I couldn't fetch the documentation right now. Please try again later." });
  }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Chatbot running on port ${PORT}`));
