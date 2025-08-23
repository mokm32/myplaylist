const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  const token = event.queryStringParameters.token;

  if (token !== "abc123") {
    return {
      statusCode: 403,
      body: "Forbidden - Token salah"
    };
  }

  try {
    // cari file dalam folder yang sama dengan playlist.js
    const filePath = path.join(__dirname, "playlist.m3u");
    const text = fs.readFileSync(filePath, "utf8");

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
      body: "Error baca playlist.m3u → " + err.message
    };
  }
};
