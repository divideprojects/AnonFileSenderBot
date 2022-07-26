import { Bot, Context } from './deps.deno.ts';
import { botToken, joinCheckId, joinCheckEnabled } from './config.ts';

export const bot = new Bot(botToken);

// custom filters
const pm = bot.filter((ctx: Context) => ctx.chat?.type === 'private');
const joinCheck = bot.filter((ctx: Context) => {
  // if joincheck is not enabled, return true
  if (!joinCheckEnabled) {
    return true;
  }

  // store const's
  const userId = Number(ctx.from?.id);
  const member = ctx.api.getChatMember(joinCheckId, userId).then((member) => {
    return (
      member.status === 'member' ||
      member.status === 'creator' ||
      member.status === 'administrator'
    );
  });
  return member;
});

pm.command('start', (ctx: Context) => ctx.reply('Welcome! Up and running.'));
pm.command('ping', (ctx: Context) =>
  ctx.reply(`Pong! ${new Date()} ${Date.now()}`),
);
pm.on([':media', ':file']).on(':forward_date', (ctx: Context) =>
  ctx.copyMessage(Number(ctx.chat?.id)),
);
joinCheck.command('works', (ctx: Context) => {
  ctx.reply('Works!');
});
