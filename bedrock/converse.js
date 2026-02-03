import { BedrockRuntimeClient, ConverseStreamCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION ?? "us-east-1" });

const cmd = new ConverseStreamCommand({
  modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
  messages: [
    { role: "user", content: [{ text: "What is the capital city of Armenia?" }] },
  ],
});

const res = await client.send(cmd);

// res.stream is an async iterable of events
for await (const event of res.stream) {
  // event types vary; "contentBlockDelta" is a common one to carry text deltas
  const delta = event?.contentBlockDelta?.delta?.text;
  if (delta) process.stdout.write(delta);
}
process.stdout.write("\n");
