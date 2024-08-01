const fs = require("fs");
const taskListURL = "https://aiffily.com/home/level/getTaskList";
const axios = require("axios");
class Services {
    async getTokens() {
        const users = JSON.parse(fs.readFileSync("./users.json").toString());
        const tokenPromises = users.map(async (user) => {
            const res = await axios.post(
                "https://aiffily.com/main/user/login",
                {
                    type: 1,
                    area_code: 998,
                    mobile: user.number,
                    email: "",
                    user_name: "",
                    password: user.password,
                    code: "",
                }
            );
            return res.data.token;
        });

        try {
            const tokens = await Promise.all(tokenPromises);
            return tokens;
        } catch (error) {
            console.error("Error fetching tokens:", error);
            throw error;
        }
    }

    async getTasks(token) {
        const res = await axios.post(
            taskListURL,
            {},
            {
                headers: {
                    Token: token,
                },
            }
        );

        const { list } = res.data;
        const boughtList = list.filter((item) => item.taskStatus == 1);
        return boughtList;
    }

    addUser(req, res) {
        const { number, password } = req.body;
        const users = JSON.parse(fs.readFileSync("./users.json").toString());

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
        const { number } = req.params;
        const { password } = req.body;
        const users = JSON.parse(fs.readFileSync("./users.json").toString());
        const userIndex = users.findIndex((item) => item.number == number);

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

    deleteUser(req, res) {
        const { number } = req.params;
        const users = JSON.parse(fs.readFileSync("./users.json").toString());
        const filteredUsers = users.filter((item) => item.number != number);

        fs.writeFileSync("./users.json", JSON.stringify(filteredUsers));
        res.send({
            message: "Deleted successfully",
        });
    }
}

module.exports = new Services();
