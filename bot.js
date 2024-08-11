const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const Queuer = require("./models/queuer");

const bot = new TelegramBot("7398700073:AAEcIVSiRMwvLil7dtOZ3gViU0ka64vzSfQ", {
  polling: true,
});

mongoose.connect(
  "mongodb+srv://programmer:justcode@auto-aif.qmoldzx.mongodb.net/?retryWrites=true&w=majority&appName=auto-aif"
);

// Multer setup for saving images locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

if (!fs.existsSync("uploads/")) {
  fs.mkdirSync("uploads/");
}

const userStates = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  userStates[chatId] = { step: 0, data: {} };
  bot.sendMessage(
    chatId,
    `Assalomu Aleykum, Auto-AIF ga hush kelibsiz, iltimos familiya va ismingiz kiriting:
    
Misol: Aliyev Vali`
  );
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const state = userStates[chatId];

  if (!state) return;

  switch (state.step) {
    case 0:
      state.data.fullName = msg.text;
      state.step++;
      bot.sendMessage(
        chatId,
        `AIF ga registratsiya qilingan raqamingizni kiriting:

Misol: 934445566`
      );
      break;
    case 1:
      state.data.number = msg.text;
      state.step++;
      bot.sendMessage(chatId, "AIF ga kiritgan parolingizni kiriting:");
      break;
    case 2:
      state.data.password = msg.text;
      state.step++;
      bot.sendMessage(
        chatId,
        `
Karta Raqami: 9860 3566 2047 7980
I.F: Azizbek Rozmetov

To'lov summasi: 20$ - 252.000 som

To'lovdan so'ng chek tashashni unutmang!

1-3 kun ichida adminlar ko'rib chiqib sizni qo'shishadi.

Savollar va Takliflar: @TechSunnatillo

        `
      );
      break;
  }
});

bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  const state = userStates[chatId];

  if (state && state.step === 3) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const file = await bot.getFile(fileId);
    const filePath = file.file_path;

    bot
      .downloadFile(fileId, "./uploads/")
      .then(async (path) => {
        state.data.paymentImage = path;

        const newQueuer = new Queuer(state.data);
        await newQueuer.save();

        bot.sendMessage(
          chatId,
          "Malumotlaringiz Yuborildi, Tez Orada Aloqaga Chiqamiz."
        );
        delete userStates[chatId]; // Clear the user's state
      })
      .catch((err) => {
        console.error("Failed to download the file:", err);
        bot.sendMessage(
          chatId,
          "Qandaydir Xatolik, Keyinroq urinib ko'ring, savollar: @TechSunnatillo"
        );
      });
  }
});
