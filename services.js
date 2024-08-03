const fs = require("fs");
const taskListURL = "https://aiffily.com/home/level/getTaskList";
const axios = require("axios");
const User = require("./schemas/user.schema");
class Services {
    async getTokens() {
        const users = await User.find();
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
    async getAllUsers(req, res) {
        let users = await User.find();
        res.send(users);
    }
    async addUser(req, res) {
        const { number, password } = req.body;
        const users = await User.find();

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

        await User.create({
            number,
            password,
        });

        res.send({ message: "Added successfully" });
    }

    async updateUser(req, res) {
        const { number } = req.params;
        const { password } = req.body;
        await User.findOneAndUpdate({ number }, { password });

        res.send({
            message: "Updated Successfully",
        });
    }

    async deleteUser(req, res) {
        const { number } = req.params;
        await User.deleteOne({ number });
        res.send({
            message: "Deleted successfully",
        });
    }
}

module.exports = new Services();
