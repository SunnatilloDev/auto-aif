const axios = require("axios");
const express = require("express");
const cron = require("node-cron");
const Services = require("./services");
const videosUrl = "https://aiffily.com/home/video/getList";
const add = "https://aiffily.com/home/userVideo/add";
const app = express();
app.use(express.json());

app.post("/user", Services.addUser);
app.put("/user/:number", Services.updateUser);
app.delete("/user/:number", Services.deleteUser);

app.listen(3000, () => {
    console.log("Server is running");
});

const bootstrap = async () => {
    try {
        const tokens = await Services.getTokens();
        for (const token of tokens) {
            try {
                const list = await Services.getTasks(token);
                for (const task of list) {
                    const response = await axios.post(
                        videosUrl,
                        {
                            id: task.id,
                        },
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
                            add,
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
bootstrap()
cron.schedule(
    "15 11 * * *",
    () => {
        bootstrap();
        console.log("Code successfully was ran");
    },
    {
        scheduled: true,
        timezone: "Asia/Tashkent",
    }
);
