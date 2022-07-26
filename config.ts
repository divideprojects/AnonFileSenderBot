export const botToken = Deno.env.get("BOT_TOKEN") || "";
export const joinCheckId = Number(Deno.env.get("JOIN_CHECK_ID")) || 0;
export const joinCheckEnabled = Boolean(Deno.env.get("JOIN_CHECK")) || false;
