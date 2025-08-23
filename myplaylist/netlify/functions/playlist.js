import { readFile } from "fs/promises";
import path from "path";

export async function handler(event) {
  const token = event.queryStringParameters.token;

  if (token !== "abc123") {
    return {
      statusCode: 403,
      body: "Forbidden - Token salah"
    };
  }

  // Baca file .m3u dari repo sendiri (bukan GitHub raw)
  const filePath = path.resolve("playlist.m3u");
  const text = await readFile(filePath, "utf8");

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/vnd.apple.mpegurl" },
    body: text
  };
}
