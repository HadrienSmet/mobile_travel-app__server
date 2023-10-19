const mongoose = require("mongoose");

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connexion to MongoDB established! Happy Coding! "))
    .catch(() => console.log("Connexion to MongoDB failed."));
