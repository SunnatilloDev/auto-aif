const axios = require("axios");
const User = require("../models/user");

const taskListURL = "https://aiffily.com/home/level/getTaskList";
const loginURL = "https://aiffily.com/main/user/login";

class Services {
  async getTokens() {
    const users = await User.find();
    const tokenPromises = users.map(async (user) => {
      const res = await axios.post(loginURL, {
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

  async getAllUsers() {
    let users = await User.find();

    // Map over users and return a promise for each user
    users = await Promise.all(
      users.map(async (user) => {
        try {
          let tokenResponse = await axios.post(loginURL, {
            type: 1,
            area_code: 998,
            mobile: user.number,
            email: "",
            user_name: "",
            password: user.password,
            code: "",
          });

          let token = tokenResponse.data.token;
          let tasks = await this.getTasks(token);

          user.packages = tasks.map((item) => item.title);
          let howManyDone = 0;
          tasks.map((task) => {
            if (task.finishNums == task.times) {
              howManyDone++;
            }
          });
          if (howManyDone == tasks.length) {
            user.isDone = true;
          }
          // Fetch user's info
          let infoRes = await axios.post(
            "https://aiffily.com/home/user/getInfo",
            {},
            { headers: { Token: token } }
          );

          user.allBalance = infoRes.data.info.balance;
          user.fullName = infoRes.data.info.userReal.name;
          // Fetch user's total info
          let totalInfoRes = await axios.post(
            "https://aiffily.com/home/user/getTotalInfo",
            {},
            { headers: { Token: token } }
          );

          user.todaysBalance = totalInfoRes.data.info.todayAmount;

          await user.save();

          return user; // Return the updated user
        } catch (error) {
          console.log(error);

          return null; // Handle the error appropriately
        }
      })
    );


    return users;
  }

  async addUser(number, password, fullName) {
    const existingUser = await User.findOne({ number });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = await User.create({ number, password, fullName });
    return { message: "Added successfully", newUser };
  }

  async updateUser(id, body) {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...body },
      { new: true }
    );
    return { message: "Updated Successfully", updatedUser };
  }

  async deleteUser(number) {
    await User.deleteOne({ number });
    return { message: "Deleted successfully" };
  }
}

module.exports = new Services();
