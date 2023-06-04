const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Recipe = require("./models/recipeDataModel");
const path = require("path");
require('dotenv').config();

const app = express();

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
   connectTimeoutMS: 30000, // Increased timeout value to 30 seconds
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB", error);
});

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.render("index", { recipes });
  } catch (error) {
    console.error("Error fetching recipes", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/", async (req, res) => {
  try {
    const categoryInput = req.body.category;
    const query = req.body.searchBox;
    const regex = new RegExp(query, 'i');

    let recipes;

    if (categoryInput === "random") {
      const count = await Recipe.countDocuments();
      const randomIndex = Math.floor(Math.random() * count);
      const randomRecipe = await Recipe.findOne().skip(randomIndex);
      res.render("randomIndex", { randomRecipe });
    } else {
      if (categoryInput) {
        recipes = await Recipe.find({ category: { $in: categoryInput } });
      } else if (query) {
        recipes = await Recipe.find({ title: { $regex: regex } });
      } else {
        recipes = [];
      }

      if (recipes.length > 0) {
        res.render("index", { recipes });
      } else {
        res.render("index", { recipes: [] });
      }
    }
  } catch (error) {
    console.error("Error processing form submission", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(process.env.PORT || 3001, function () {
  console.log(`App listening on port 3001!`);
});
