import { Bot, Context, InlineKeyboard } from './deps.deno.ts';
import { botToken, joinCheckId, joinCheckEnabled } from './config.ts';

export const bot = new Bot(botToken);

// custom filters
const pm = bot.filter((ctx: Context) => ctx.chat?.type === 'private');
const joinCheck = bot.filter(async (ctx: Context) => {
  // if joincheck is not enabled, return true
  if (!joinCheckEnabled) {
    return true;
  }

  // store const's
  const userId = Number(ctx.from?.id);
  const member = await ctx.api
    .getChatMember(joinCheckId, userId)
    .then((member) => {
      return (
        member.status === 'member' ||
        member.status === 'creator' ||
        member.status === 'administrator'
      );
    });

  // if user is not a member, also send a message to ask user to join channel
  if (!member) {
    const joinChannel = 'DivideProjects';
    await ctx.reply(`You have to join my channel @${joinChannel} to use me!`, {
      reply_markup: new InlineKeyboard().url(
        'Join Channel',
        `https://t.me/${joinChannel}`,
      ),
    });
  }

  return member;
});

pm.command(
  'start',
  async (ctx: Context) => await ctx.reply('Welcome! Up and running.'),
);
pm.command(
  'ping',
  async (ctx: Context) => await ctx.reply(`Pong! ${new Date()} ${Date.now()}`),
);
pm.on([':media', ':file']).on(
  ':forward_date',
  async (ctx: Context) => await ctx.copyMessage(Number(ctx.chat?.id)),
);
joinCheck.command('works', async (ctx: Context) => {
  await ctx.reply('Works!');
});
