import { Bot, Context, InlineKeyboard } from './deps.deno.ts';
import { botToken, joinCheckId, joinCheckEnabled } from './config.ts';

export const bot = new Bot(botToken);

// custom filters
const joinCheckAndPm = bot.filter(async (ctx: Context) => {
  // if joincheck is not enabled, return true
  if (!joinCheckEnabled) {
    return true;
  }

  // store const's
  const isPrivate = ctx.chat?.type === 'private';
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

  return member && isPrivate;
});

joinCheckAndPm.command(
  'start',
  async (ctx: Context) =>
    await ctx.reply(`Hello ${ctx.from?.first_name}
  
I'm ${ctx.me?.first_name} and I can send the file that you send me, without the forwarded from tag!`),
);

joinCheckAndPm.command(
  'help',
  async (ctx: Context) =>
    await ctx.reply(`This bot will send back the document/file/pic/video/image/text that you forward, back to you, so that the forwarded from tag is removed and it looks like it's forwarded from the bot!!

  Made with ❤️ by @DivideProjects`),
);

joinCheckAndPm.command(
  'ping',
  async (ctx: Context) => await ctx.reply(`Pong! ${new Date()} ${Date.now()}`),
);

joinCheckAndPm
  .on([':media', ':file'])
  .on(
    ':forward_date',
    async (ctx: Context) => await ctx.copyMessage(Number(ctx.chat?.id)),
  );
