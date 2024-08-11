const axios = require("axios");
const Queuer = require("../models/queuer");

class Services {
  async getAllQueuers() {
    let queuers = await Queuer.find();

    return queuers;
  }

  async addQueuer(number, password, fullName) {
    const existingQueuer = await Queuer.findOne({ number });
    if (existingQueuer) {
      throw new Error("Queuer already exists");
    }

    const newQueuer = await Queuer.create({ number, password, fullName });
    return { message: "Added successfully", newQueuer };
  }


  async deleteQueuer(id) {
    await Queuer.deleteOne({ _id: id });
    return { message: "Deleted successfully" };
  }
}

module.exports = new Services();
