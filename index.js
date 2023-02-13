import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_TOKEN,
}));

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

bot.on("message", async (msg) => {
    let chatId = msg.chat.id;
    let message = msg.text;
    if(message == '/start'){
        return bot.sendMessage(chatId, "Selamat Datang dan silahkan tanya saya apa saja");
    }
    let messageBot = await bot.sendMessage(chatId, "Tunggu Sebentar ya ...");
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    await bot.deleteMessage(chatId,messageBot.message_id);
    await bot.sendMessage(chatId, response.data.choices[0].text);
});
