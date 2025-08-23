const fs = require("fs");
const path = require("path");

export async function handler(event) {
  const token = event.queryStringParameters.token;

  if (token !== "abc123") {
    return {
      statusCode: 403,
      body: "Forbidden - Token salah"
    };
  }

  try {
    const filePath = path.join(process.cwd(), "playlist.m3u");
    const text = await readFile(filePath, "utf8");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/vnd.apple.mpegurl" },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Error baca playlist.m3u → " + err.message
    };
  }
}
