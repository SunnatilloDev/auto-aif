const { default: axios } = require("axios");
let express = require("express");
const cron = require("node-cron");
const Services = require("./services");
let videosUrl = "https://aiffily.com/home/video/getList";
let add = "https://aiffily.com/home/userVideo/add";
let app = express();
app.use(express.json());
app.post("/user", Services.addUser);
app.put("/user/:number", Services.updateUser);
app.listen(3000, () => {
    console.log("Server is running");
});
let bootstrap = async () => {
    Services.getTokens().then((tokens) => {
        tokens.map(async (token) => {
            try {
                let list = await Services.getTasks(token);
                list.map(async (list) => {
                    await axios
                        .post(
                            videosUrl,
                            {
                                levelText: `(1/${list.times})`,
                                levelImg: list.img,
                                id: list.id,
                            },
                            {
                                headers: {
                                    Token: token,
                                },
                            }
                        )
                        .then(async (res) => {
                            console.log(res.data);
                            let videos = res.data.list;
                            await videos.map(async (item) => {
                                await axios.post(
                                    add,
                                    { id: item.id, levelId: list.id },
                                    {
                                        headers: {
                                            Token: token,
                                        },
                                    }
                                );
                            });
                        });
                });
            } catch (error) {
                console.log(error);
            }
        });
    });
};
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
