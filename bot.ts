import { Bot } from './deps.deno.ts';
import { botToken } from './config.ts';

export const bot = new Bot(botToken);

// custom filters
const pm = bot.filter((ctx) => ctx.chat?.type === 'private');

pm.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));
pm.command('ping', (ctx) => ctx.reply(`Pong! ${new Date()} ${Date.now()}`));
pm.on([':media', ':file']).on(':forward_date', (ctx) =>
  ctx.copyMessage(ctx.chat.id),
);
