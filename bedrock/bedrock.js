import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION ?? "us-east-1" });

const modelId = "anthropic.claude-3-sonnet-20240229-v1:0"; // example modelId

const cmd = new ConverseCommand({
  modelId,
  messages: [
    {
      role: "user",
      content: [{ text: "Write a 2-sentence summary of AWS Bedrock." }],
    },
  ],
});

const res = await client.send(cmd);

// Typical place to find the assistant text:
const text = res.output?.message?.content?.[0]?.text ?? "";
console.log(text);
