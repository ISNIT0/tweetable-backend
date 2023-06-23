
import axios from "axios";
import unfluff from "unfluff";

export async function downloadAndExtractContent(url: string) {
  const { data } = await axios.get(url);
  const article = unfluff(data);

  return article.text;
}
