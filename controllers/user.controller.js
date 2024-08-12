const Services = require("../services/user.service.js");

class userController {
  async getAllUsers(req, res) {
    try {
      const users = await Services.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async addUser(req, res) {
    try {
      const { fullName, number, password, isPaid } = req.body;
      const result = await Services.addUser(number, password, fullName, isPaid);
      res.status(201).send(result);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const body = req.body;
      const result = await Services.updateUser(id, body);
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await Services.deleteUser(id);
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
  isAdmin(req, res) {
    let { login, password } = req.body;
    console.log(req.body);

    if (login === "sunnatillo@gmail.com" && password === "sudoaptupdate") {
      res.send(true);
    } else {
      res.send(true);
    }
  }
}

module.exports = new userController();
