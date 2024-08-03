const { default: mongoose } = require("mongoose");

mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log("Connected db successfully");
    })
    .catch((err) => {
        console.log(err.message);
        console.log("Not connected to DB");
    });
