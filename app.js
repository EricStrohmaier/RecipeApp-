// Importing necessary packages
const express = require("express"); // A popular web framework for Node.js
const mongoose = require("mongoose"); // A MongoDB object modeling tool designed to work in an asynchronous environment
const bodyParser = require("body-parser"); // A middleware that parses incoming request bodies in a middleware before your handlers
const Recipe = require("./models/recipeDataModel");

// Initializing an Express application
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/recipes", { useNewUrlParser : true} ,{ useUnifiedTopology: true},{ useCreateIndex: true})

app.set('view engine', 'ejs');


app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


app.get("/", async (req, res) => {
    const recipes = await Recipe.find()

  res.render("index",{recipes: recipes});
});


app.listen(3000, function () {
  console.log(`App listening on port 3000!`);
});
