const fs = require("fs");
let taskListURL = "https://aiffily.com/home/level/getTaskList";
const axios = require("axios");
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
    addUser(req, res) {
        let { number, password } = req.body;
        let users = JSON.parse(fs.readFileSync("./users.json").toString());
        if (!number || !password) {
            return res.status(400).send({
                message: "Please send valid data",
            });
        }
        if (users.find((item) => item.number == number)) {
            return res.status(400).send({
                message: "User already exists",
            });
        }
        users.push({
            number: number.toString(),
            password: password.toString(),
        });

        fs.writeFileSync("./users.json", JSON.stringify(users));
        res.send("Added successfully");
    }
    updateUser(req, res) {
        let { number } = req.params;
        let { password } = req.body;
        let users = JSON.parse(fs.readFileSync("./users.json").toString());
        let userIndex = users.findIndex((item) => item.number == number);
        if (userIndex == -1) {
            return res.status(404).send({
                message: "User not found",
            });
        }
        users[userIndex] = {
            ...users[userIndex],
            password: password.toString(),
        };
        fs.writeFileSync("./users.json", JSON.stringify(users));
        res.send({
            message: "Updated Successfully",
        });
    }
}

module.exports = new Services();
