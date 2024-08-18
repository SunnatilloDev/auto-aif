const axios = require("axios");
const User = require("../models/user");

const taskListURL = "https://aiffily.com/home/level/getTaskList";
const loginURL = "https://aiffily.com/main/user/login";

class Services {
  async getTokens() {
    const users = await User.find();
    const tokenPromises = users.map(async (user) => {
      try {
        let res = await axios.post(loginURL, {
          type: 1,
          area_code: 998,
          mobile: user.number,
          email: "",
          user_name: "",
          password: user.password,
          code: "",
        });
        
        return res.data.token;
      } catch (error) {
        console.log(error.message);
      }
    });

    try {
      let tokens = await Promise.all(tokenPromises);
      tokens = tokens.filter((token) => token !== undefined);
      return tokens;
    } catch (error) {
      console.error("Error fetching tokens:", error);
      throw error;
    }
  }

  async getTasks(token) {
    let list = [];

    while (list.length == 0) {
      let res = await axios.post(
        taskListURL,
        {},
        {
          headers: {
            Token: token,
          },
        }
      );
      if (res.data.list) {
        list = res.data.list;
      } else {
        console.log(res.data);
      }
    }

    const boughtList = list.filter((item) => item.taskStatus == 1);
    list = boughtList;
    return list;
  }
  async getAllUsers() {
    let users = await User.find();
    return users;
  }

  async updateUsersData() {
    let users = await User.find();

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
          if (token) {
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
            } else {
              user.isDone = false;
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
          }
          return user; // Return the updated user
        } catch (error) {
          console.log(error);

          return user; // Handle the error appropriately
        }
      })
    );
  }

  async addUser(number, password, fullName, isPaid) {
    const existingUser = await User.findOne({ number });
    if (existingUser) {
      throw new Error("User already exists");
    }
    let user = {
      number,
      fullName,
      password,
    };
    if (typeof isPaid != "undefined") {
      user.isPaid = isPaid;
    }
    const newUser = await User.create(user);
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

  async deleteUser(id) {
    await User.deleteOne({ _id: id });
    return { message: "Deleted successfully" };
  }
}

module.exports = new Services();
