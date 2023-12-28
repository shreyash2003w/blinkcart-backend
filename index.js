const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
 require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 8080;

// MONGOOSE CONNECTION

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DB_STRING)
  .then(() => console.log("Connected to database"))
  .catch((error) => console.log(error));

//SCHEMAS
// User Schema

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  image: String,
});

//Model
const userModel = mongoose.model("user", userSchema);

// PRODUCT SCHEMA
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  brandName: {
    type: String,
  },
  ram: {
    type: String,
  },
  rom: {
    type: String,
  },
  os: {
    type: String,
  },
});

const productModel = mongoose.model("product", productSchema);

app.get("/", (req, res) => {
  res.send("server is running...");
});

// SIGN UP USER (REGISTRATION)

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  const emailexist = await userModel.findOne({
    email: email,
  });
  if (emailexist) {
    res.send({ message: "Email already exist", alert: false });
  }
  if (!emailexist) {
    const data = userModel(req.body);
    const save = data.save();
    res.send({ message: "Successfully sign up", alert: true });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const emailexist = await userModel.findOne({
    email: email,
  });
  if (emailexist) {
    const dataSend = {
      firstName: emailexist.firstName,
      lastName: emailexist.lastName,
      email: emailexist.email,
      password: emailexist.password,
      image: emailexist.image,
    };

    if (password === emailexist.password) {
      res.send({ message: "Login Successfully!", alert: true, data: dataSend });
    } else {
      res.send({ message: "Enter the Correct Password", alert: false });
    }
  } else {
    res.send({
      message: "Email is not available, please sign up",
      alert: false,
    });
  }
});

// Upload/Save  New Products

app.post("/uploadProduct", async (req, res) => {
  console.log(req.body);
  const data = await productModel(req.body);
  const dataSave = await data.save();
  res.send({ message: "upload Successfully!" });
});

// Load Products

app.get("/product", async (req, res) => {
  const data = await productModel.find({});
  res.send(JSON.stringify(data));
});

app.listen(PORT, () => console.log("Server is running on port " + PORT));
