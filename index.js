const { default: axios } = require("axios");
const cron = require("node-cron");

let videosUrl = "https://aiffily.com/home/video/getList";
let add = "https://aiffily.com/home/userVideo/add";
let tokens = [
    "U11P4SBFdVnKPhnGIFcNFih/JoUCf0ds+Asp/xd7L2YyLjyWTzcRe/AcfaQWYjsiZ2wt2RF8ED/7WiClQ2JvI2tsfYdCJkJpqAo76gI2eGI7f3XDcAZXdehfbLJIA2R7Nn910Bd3R2r8ByDwGSo=",
    // "xb2Q00yL/bks/mA3cpV9xb6f+bdusc+NGcZVA0K5X7WkzuOkI/mZmxbcBFVEoEvx8Yzy632ymN8dmllUEaAf8P2MorUu6MqJTspCG1D0CLGtn6rxHMjflQ6fFUMawRSooJ+q4nu5z4oazVUGQug=",
];

let bootstrap = () => {
    tokens.map(async (token) => {
        try {
            await axios
                .post(
                    videosUrl,
                    {
                        levelText: "(1/4)",
                        levelImg: "/img/level/v1.png",
                        id: 2,
                    },
                    {
                        headers: {
                            Token: token,
                        },
                    }
                )
                .then(async (res) => {
                    let videos = res.data.list;
                    await videos.map(async (item) => {
                        await axios.post(
                            add,
                            { id: item.id, levelId: "2" },
                            {
                                headers: {
                                    Token: token,
                                },
                            }
                        );
                    });
                });
        } catch (error) {
            console.log(error);
        }
        try {
            await axios
                .post(
                    videosUrl,
                    {
                        levelText: "(1/10)",
                        levelImg: "/img/level/v2.png",
                        id: 3,
                    },
                    {
                        headers: {
                            Token: token,
                        },
                    }
                )
                .then(async (res) => {
                    let videos = res.data.list;
                    await videos.map(async (item) => {
                        await axios.post(
                            add,
                            { id: item.id, levelId: "3" },
                            {
                                headers: {
                                    Token: token,
                                },
                            }
                        );
                    });
                });
        } catch (error) {
            console.log(error);
        }
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
