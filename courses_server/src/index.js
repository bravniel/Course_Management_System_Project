const express = require("express");
const cors = require("cors");

const port = process.env.PORT;
require("./db/mongoose");
const professorsRouter = require("./routers/professorsRouter");
const studentsRouter = require("./routers/studentsRouter");
const coursesRouter = require("./routers/coursesRouter");

const app = express();

app.use(cors());
app.use(express.json());
app.use(professorsRouter);
app.use(studentsRouter);
app.use(coursesRouter);

app.listen(port, () => {
    console.log("-> server has been connected successfully to port:", port, "!");
    // console.log(`Server running at http://127.0.0.1:${port}/`);
});

module.exports = app;

// To run server --> npm run dev