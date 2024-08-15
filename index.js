const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.route.js");
const queuerRoutes = require("./routes/queuer.route.js");
const cron = require("node-cron");
const { default: axios } = require("axios");
config();
connectDB();

const app = express();
app.use(express.json());
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use("/uploads", express.static("uploads"));

app.use(cors(corsOptions));
app.use("/user", userRoutes);
app.use("/queuer", queuerRoutes);
app.listen(3001, () => {
  console.log("Server is running");
});
const bootstrap = async () => {
  try {
    const tokens = await require("./services/user.service").getTokens();
    let tokenIndex = 0;

    while (tokenIndex < tokens.length) {
      const token = tokens[tokenIndex];
      try {
        const list = await require("./services/user.service").getTasks(token);
        let taskIndex = 0;

        while (taskIndex < list.length) {
          const task = list[taskIndex];
          console.time("Task");
          const response = await axios.post(
            "https://aiffily.com/home/video/getList",
            { id: task.id },
            {
              headers: {
                Token: token,
              },
            }
          );
          console.timeEnd("Task");

          const videos = response.data.list;

          let i = 0;
          while (i <= task.times) {
            try {
              await axios.post(
                "https://aiffily.com/home/userVideo/add",
                { id: videos[i].id, levelId: task.id },
                {
                  headers: {
                    Token: token,
                  },
                }
              );
              i++;
              console.log(i);
            } catch (error) {
              console.log(error.message);
            }
          }
          console.log(task.title + " Done");
          taskIndex++;
        }
        console.log(token + " User is done");
      } catch (error) {
        console.log(error);
      }
      tokenIndex++;
    }
    console.log("ALL DONE");
  } catch (error) {
    console.error("Error during bootstrap:", error);
  }
};

// Uncomment to run the bootstrap immediately
bootstrap();

cron.schedule(
  "05 11 * * *",
  async () => {
    await bootstrap();
    console.log("Code successfully was ran");
  },
  {
    scheduled: true,
    timezone: "Asia/Tashkent",
  }
);
