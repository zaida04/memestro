const mongoose = require("mongoose");

(async () => {
    await mongoose.connect("mongodb://localhost:27017/dev");
    await mongoose.connection.db.dropDatabase();
    console.log("DROPPED LOCAL DATABASE");
    mongoose.disconnect();
    return void 0;
})();