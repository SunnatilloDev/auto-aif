const Services = require("../services/queuer.service.js");

class queuerController {
  async getAllQueuers(req, res) {
    try {
      const queuers = await Services.getAllQueuers();
      res.json(queuers);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async addQueuer(req, res) {
    try {
      const { fullName, number, password } = req.body;
      const result = await Services.addQueuer(number, password, fullName);
      res.status(201).send(result);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }

  async updateQueuer(req, res) {
    try {
      const { id } = req.params;
      const body = req.body;
      const result = await Services.updateQueuer(id, body);
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }

  async deleteQueuer(req, res) {
    try {
      const { id } = req.params;
      const result = await Services.deleteQueuer(id);
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

module.exports = new queuerController();
