
const mongoose = require("mongoose");

module.exports = () => {

    mongoose.connect('mongodb://movie_user:abcd1234@ds135653.mlab.com:35653/movie-api', { useNewUrlParser: true })

    mongoose.connection.on("open", () => {
        console.log("mongoDB : Connected");
    });

    mongoose.connection.on("error", () => {
        console.log("mongoDB : error", err);
    });


    mongoose.Promise = global.Promise;

};
