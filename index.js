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
app.delete("/user/:number", Services.deleteUser);
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
                            let videos = res.data.list;

                            for (let i = 0; i < list.times; i++) {
                                
                                await axios.post(
                                    add,
                                    { id: videos[i].id, levelId: list.id },
                                    {
                                        headers: {
                                            Token: token,
                                        },
                                    }
                                );
                            }
                        });
                });
            } catch (error) {
                console.log(error);
            }
        });
    });
};
bootstrap();

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
