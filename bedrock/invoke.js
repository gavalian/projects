import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION ?? "us-east-1" });

const modelId = "anthropic.claude-v2"; // example
const body = JSON.stringify({
  prompt: "\n\nHuman: Say hello\n\nAssistant:",
  max_tokens_to_sample: 200,
  temperature: 0.7,
});

const cmd = new InvokeModelCommand({
  modelId,
  contentType: "application/json",
  accept: "application/json",
  body: new TextEncoder().encode(body),
});

const res = await client.send(cmd);

// body is bytes -> decode
const json = JSON.parse(new TextDecoder().decode(res.body));
console.log(json);
