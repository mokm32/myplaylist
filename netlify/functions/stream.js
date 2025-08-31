// netlify/functions/stream.js
const fetch = require("node-fetch");

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisCommand(command, ...args) {
  const body = JSON.stringify([command, ...args]);
  const res = await fetch(REDIS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body,
  });
  const data = await res.json();
  return data.result;
}

exports.handler = async (event) => {
  const { src, token, user } = event.queryStringParameters || {};
  const ip = event.headers["x-nf-client-connection-ip"] || "unknown";

  if (!user || !token) return { statusCode: 400, body: "Missing parameters" };

  const sessionKey = `session:${user}`;

  // Dapatkan devices aktif
  let devices = await redisCommand("SMEMBERS", sessionKey);
  devices = devices || [];

  const MAX_DEVICES = 1; // limit per user
  if (devices.length >= MAX_DEVICES && !devices.includes(ip)) {
    return { statusCode: 403, body: "Max device limit reached" };
  }

  // Tambah / refresh device
  await redisCommand("SADD", sessionKey, ip);
  await redisCommand("EXPIRE", sessionKey, 300); // expire 5 minit

  // Fetch stream asal
  const response = await fetch(src);
  const buffer = await response.arrayBuffer();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/octet-stream",
    },
    body: Buffer.from(buffer).toString("base64"),
    isBase64Encoded: true,
  };
};
