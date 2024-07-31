const fs = require("fs");
let taskListURL = "https://aiffily.com/home/level/getTaskList";
const axios = require("axios")
class Services {
    async getTokens() {
        let users = JSON.parse(fs.readFileSync("./users.json").toString());
        let tokenPromises = users.map(async (user) => {
            let res = await axios.post("https://aiffily.com/main/user/login", {
                type: 1,
                area_code: 998,
                mobile: user.number,
                email: "",
                user_name: "",
                password: user.password,
                code: "",
            });
            return res.data.token;
        });

        try {
            let tokens = await Promise.all(tokenPromises);
            return tokens;
        } catch (error) {
            console.error("Error fetching tokens:", error);
            throw error;
        }
    }
    async getTasks(token) {
        let res = await axios.post(
            taskListURL,
            {},
            {
                headers: {
                    Token: token,
                },
            }
        );

        let { list } = res.data;
        let boughtList = list.filter((item) => {
            return item.taskStatus == 1;
        });
        return boughtList;
    }
}

module.exports = new Services();
