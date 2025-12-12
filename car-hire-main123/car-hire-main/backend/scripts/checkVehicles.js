const mongoose = require("mongoose");
const Vehicle = require("./models/Vehicle");

const MONGODB_URI = "mongodb+srv://spaceborne:bornespace%402030@spaceborne.moqedze.mongodb.net/car-hire?retryWrites=true&w=majority&appName=spaceborne";

mongoose.connect(MONGODB_URI).then(async () => {
    const vehicles = await Vehicle.find({});
    console.log("All vehicles:", JSON.stringify(vehicles, null, 2));
    process.exit(0);
}).catch(err => {
    console.error("Error:", err);
    process.exit(1);
});
