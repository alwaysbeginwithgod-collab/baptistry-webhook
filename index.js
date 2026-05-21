const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "baptistry_token";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const DIFY_API_KEY = process.env.DIFY_API_KEY;
const DIFY_API_URL = process.env.DIFY_API_URL;

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const messaging = req.body.entry[0].messaging[0];
    const sender = messaging.sender.id;

    if (messaging.message && messaging.message.text) {
      const userMessage = messaging.message.text;

      const difyRes = await fetch(`${DIFY_API_URL}/v1/chat-messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${DIFY_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: {},
          query: userMessage,
          user: sender
        })
      });

const reply =
  difyData.answer ||
  difyData.data?.outputs?.text ||
  "BAPTISTRY is thinking... please try again.";

      await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: sender },
          message: { text: reply }
        })
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("Server running"));
