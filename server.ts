import { serve } from 'https://deno.land/x/sift@0.5.0/mod.ts';
import { bot } from './bot.ts';
import { botToken } from './config.ts';
import { webhookCallback } from './deps.deno.ts';

const handleUpdate = webhookCallback(bot, 'std/http');
let updates = 0;

serve({
  ['/' + botToken]: async (req) => {
    if (req.method == 'POST') {
      try {
        updates++;
        return await handleUpdate(req);
      } catch (err) {
        console.error(err);
      }
    }
    return new Response();
  },
  '/': () => {
    return new Response(
      JSON.stringify({ alive: true, updates: updates }, null, 2),
    );
  },
});
