const { default: axios } = require("axios");
const cron = require("node-cron");
const Services = require("./services");
let videosUrl = "https://aiffily.com/home/video/getList";
let add = "https://aiffily.com/home/userVideo/add";

let bootstrap = async () => {
    Services.getTokens().then((tokens) => {
        tokens.map(async (token) => {
            try {
                let list = await Services.getTasks(token);
                list.map(async (list) => {
                    console.log({
                        levelText: `(1/${list.times})`,
                        levelImg: list.img,
                        id: list.id,
                    });
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