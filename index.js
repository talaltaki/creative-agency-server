const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9sjrg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 5000;

app.get("/", (req, res) => {
  res.send("Server of Creative Agency");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client.db("creativeAgency").collection("services");
  const feedbackCollection = client
    .db("creativeAgency")
    .collection("feedbacks");
  const adminCollection = client.db("creativeAgency").collection("admins");
  const orderCollection = client.db("creativeAgency").collection("orders");

  app.get("/services", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/feedbacks", (req, res) => {
    feedbackCollection
      .find({})
      .limit(6)
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/add-feedback", (req, res) => {
    const feedback = req.body;
    feedbackCollection.insertOne(feedback).then((result) => {
      res.send(result);
    });
  });

  app.post("/add-service", (req, res) => {
    const service = req.body;
    serviceCollection.insertOne(service).then((result) => {
      res.send(result);
    });
  });

  app.post("/add-admin", (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin).then((result) => {
      res.send(result);
    });
  });

  app.post("/place-order", (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order).then((result) => {
      res.send(result);
    });
  });

  app.get("/orders", (req, res) => {
    orderCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/all-orders", (req, res) => {
    orderCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/admin", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email }).toArray((err, documents) => {
      res.send(documents.length > 0);
    });
  });

  app.patch("/update-status", (req, res) => {
    orderCollection
      .updateOne(
        { _id: ObjectId(req.body.id) },
        {
          $set: { status: req.body.status },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });
});

app.listen(process.env.PORT || port);
