# Eternity AI — secure AI-connected starter

The pink Eternity website sends chat messages to `/api/chat`. The backend calls the OpenAI
Responses API. Your secret API key stays on the server and is never placed in browser JavaScript.

## Run locally
1. Extract this folder and install Node.js 20+.
2. In this folder run: `npm install`
3. Copy `.env.example` to `.env`.
4. Put your secret key after `OPENAI_API_KEY=` in `.env`. Never share or upload this file publicly.
5. Run: `npm start`
6. Open `http://localhost:3000`

## Deploy
Deploy this Node app to a host supporting Node.js. Set `OPENAI_API_KEY` and optionally
`OPENAI_MODEL` as environment variables in the hosting dashboard. Do not commit `.env`.
The frontend and `/api/chat` should be served from the same origin.

## Important
This is a ready-to-configure integration, not a hosted/live service. It will give real AI answers
after you add your own API key and run/deploy the backend. API usage may incur charges.
The default model is `gpt-5.5`; change `OPENAI_MODEL` if your account uses another available model.
