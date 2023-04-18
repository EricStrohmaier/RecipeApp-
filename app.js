// Importing necessary packages
const express = require("express"); // A popular web framework for Node.js
const mongoose = require("mongoose"); // A MongoDB object modeling tool designed to work in an asynchronous environment
const bodyParser = require("body-parser"); // A middleware that parses incoming request bodies in a middleware before your handlers
const Recipe = require("./models/recipeDataModel");
const recipeDataModel = require("./models/recipeDataModel");

// Initializing an Express application
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/recipes", { useNewUrlParser : true} ,{ useUnifiedTopology: true},{ useCreateIndex: true})

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

randomRecipe =[];

app.get("/", async (req, res) => {

    const recipe = await Recipe.find({})
  res.render("index",{recipe: recipe });
});
app.post("/", async (req, res) => {
  const categoryInput = req.body.category;
  let recipe;
  let randomRecipe;
  let query = req.body.searchBox;
  let regex = new RegExp(query, 'i');
  
let dataDisplay = await Recipe.find({ "$or": [{title: { $regex: regex }}] });

   if (categoryInput === "random") {
    const count = await Recipe.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    randomRecipe = await Recipe.findOne().skip(randomIndex);

    res.render("randomIndex", { randomRecipe: randomRecipe });
  } else {
    recipe = await Recipe.find({ category: { $in: categoryInput } });
    
    if (recipe.length > 0) {
      res.render("index", { recipe: recipe });
    } else if (dataDisplay.length > 0) {
      res.render("searchIndex", { dataDisplay: dataDisplay });
    } else {
      res.render("index", { recipe: [] });
    }
  }
});




app.listen(3000, function () {
  console.log(`App listening on port 3000!`);
});
