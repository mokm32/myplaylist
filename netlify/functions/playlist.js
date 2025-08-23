const fetch = require("node-fetch");

exports.handler = async (event) => {
  const userAgent = event.headers["user-agent"] || "";

  // Hanya izinkan OTT Navigator
  if (!userAgent.toLowerCase().includes("ott")) {
    return {
      statusCode: 403,
      body: "Forbidden"
    };
  }

  try {
    // Link asal GitHub Raw
    const url = "https://raw.githubusercontent.com/mokm32/playlist/refs/heads/main/user1";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Gagal fetch dari GitHub");
    }

    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl"
      },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Error: " + err.message
    };
  }
};
