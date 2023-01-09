const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((con) => {
  console.log('-> mongoose has been connected successfully to mongodb database.')
  })
  .catch((err) => {
    console.log(`-> mongoose error conection: ${err}.`)
  })

// const conn = mongoose.connection;

// conn.on("error", () => console.error.bind(console, "connection error"));

// conn.once("open", () => console.info("Connection to Database is successful"));

// module.exports = conn;