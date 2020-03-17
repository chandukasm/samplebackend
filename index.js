const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("./routes/admin");
const auth = require("./routes/auth");
const traveler = require("./routes/traveler");
const config = require("config");
const { Client } = require("pg");
const connectionString = "postgresql://postgres:eleos@localhost:5432/test";

// const group = require("./routes/group");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const client = new Client({
  connectionString: connectionString
});
client.connect();

const createScript =
  "CREATE TABLE IF NOT EXISTS public.vacations (id int NOT NULL ,name varchar(255) NOT NULL )";

execute = async () => {
  try {
    const result = await client.query(createScript);
    console.log(result.rows);
  } catch (error) {
    console.error(error);
  }
};

execute();

//middleware
app.use(express.json());
app.use(bodyParser.json());
// app.use(cors);
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/admin", admin);
app.use("/api/auth", auth);
app.use("/api/traveler", traveler);
// app.use("/api/group", group);

if (!config.get("jwtPrivateKey")) {
  console.error("FATEL ERROR: JWT PRIVATE KEY NOT DEFINED");
  process.exit(1);
}

app.get("/", (req, res) => {
  res.send("your request recieved welcome to yellow!");
});

app.get("/all", (req, res) => {
  res.send("all the systems");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listining on ${port}...`);
});
