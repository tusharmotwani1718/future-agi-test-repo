import { register, ProjectType } from "@traceai/fi-core";
import { OpenAIInstrumentation } from "@traceai/openai";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import OpenAI from "openai";
import dotenv from "dotenv";
import * as openaiModule from "openai";
dotenv.config();

// Connect to Future AGI and create (or reuse) a project
const tracerProvider = register({
  projectType: ProjectType.OBSERVE,
  projectName: "open_ai_app",
});

// Auto-instrument OpenAI: every call is now traced
const openaiInstrumentation = new OpenAIInstrumentation();
registerInstrumentations({
  instrumentations: [openaiInstrumentation],
  tracerProvider,
});
openaiInstrumentation.manuallyInstrument(openaiModule);

// Use OpenAI exactly as you normally would
const client = new OpenAI();
const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "Say hello to Future AGI in one sentence." }],
});

await tracerProvider.shutdown();
console.log(response.choices[0].message.content);