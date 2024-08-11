const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.route.js");
const queuerRoutes = require("./routes/queuer.route.js");
const cron = require("node-cron");
config();
connectDB();

const app = express();
app.use(express.json());
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use("/", express.static("uploads"));

app.use(cors(corsOptions));
app.use("/user", userRoutes);
app.use("/queuer", queuerRoutes);
app.listen(3000, () => {
  console.log("Server is running");
});

const bootstrap = async () => {
  try {
    const tokens = await require("./services/userService").getTokens();
    for (const token of tokens) {
      try {
        const list = await require("./services/userService").getTasks(token);
        for (const task of list) {
          const response = await axios.post(
            "https://aiffily.com/home/video/getList",
            { id: task.id },
            {
              headers: {
                Token: token,
              },
            }
          );

          const videos = response.data.list;
          for (let i = 0; i < task.times; i++) {
            console.log(i + 1);
            await axios.post(
              "https://aiffily.com/home/userVideo/add",
              { id: videos[i].id, levelId: task.id },
              {
                headers: {
                  Token: token,
                },
              }
            );
          }
          console.log(task.title + " Done");
        }
        console.log(token + " User is done");
      } catch (error) {
        console.log(error);
      }
    }
    console.log("ALL DONE");
  } catch (error) {
    console.error("Error during bootstrap:", error);
  }
};

// Uncomment to run the bootstrap immediately
// bootstrap();

cron.schedule(
  "5 11 * * *",
  () => {
    bootstrap();
    console.log("Code successfully was ran");
  },
  {
    scheduled: true,
    timezone: "Asia/Tashkent",
  }
);
