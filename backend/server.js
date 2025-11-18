const express = require("express");
const connectDb = require("./config/db");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");



require("dotenv").config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use("/auth", require("./routes/authRoute"));
app.use("/user", require("./routes/userRoute"));
app.use("/department", require("./routes/departmentRoute"));
app.use("/equipment", require("./routes/equipmentRoute"));
app.use("/task", require("./routes/taskRoute"));
app.use("/change", require("./routes/changeRoute"));
app.use("/problem", require("./routes/problemRoute"));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Node Server is running on ${PORT}`.bgMagenta.white);
  });