const express = require("express");
const cors = require("cors");
const bodyParser = require("bodyParser");

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9sjrg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 5000;

app.get("/", (req, res) => {
  res.send("Server of Creative Agency");
});

const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect((err) => {
  const serviceCollection = client.db("creativeAgency").collection("services");
});

app.listen(process.env.PORT || port);
