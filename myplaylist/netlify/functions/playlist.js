export async function handler(event) {
  const token = event.queryStringParameters.token;

  // Check token
  if (token !== "abc123") {
    return {
      statusCode: 403,
      body: "Forbidden - Token salah"
    };
  }

  // URL asal playlist (contoh dari GitHub Raw)
  const playlistUrl = "https://raw.githubusercontent.com/mokm32/playlist/refs/heads/main/user1";

  const response = await fetch(playlistUrl);
  const text = await response.text();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/vnd.apple.mpegurl" },
    body: text
  };
}
