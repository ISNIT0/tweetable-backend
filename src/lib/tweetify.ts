import { Configuration, OpenAIApi } from "openai";
import { TWEETABLE_SYSTEM_PROMPT } from "./prompts";
import { downloadAndExtractContent } from "./downloadAndExtractContent";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface TweetifyParams {
  urls: string[];
  textContent: string;
}

export async function tweetify({ urls, textContent }: TweetifyParams) {
  const webDocumentsContent = await Promise.all(
    urls.map((url) => {
      return downloadAndExtractContent(url);
    })
  );

  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    messages: [
      { role: "system", content: TWEETABLE_SYSTEM_PROMPT },
      {
        role: "user",
        content: `${webDocumentsContent.join("\n\n")}

User's Request: ${textContent}`,
      },
    ],
  });

  return chatCompletion.data.choices[0].message?.content || "";
}
