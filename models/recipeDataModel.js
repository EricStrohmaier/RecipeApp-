const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const recipeDataSchema = new mongoose.Schema({
  title: String,
  link: String,
  category: [String]
});
const Recipe  = mongoose.model("Recipe", recipeDataSchema);

const urls = Array.from({ length: 101 }, (v, i) => `https://pinchofyum.com/recipes/all/page/${i + 1}`);

// Declare an empty array to store categories
let categories = [];

Promise.all(urls.map((url) => axios.get(url)))
  .then((responses) => {
    responses.forEach((response) => {
      const $ = cheerio.load(response.data);

      $("article").each(async (i, element) => {
        const link = $(element).find("a.block").attr("href");

        // Check if the recipe already exists in the database
        const existingRecipe = await Recipe.findOne({ link: link });
        if (existingRecipe) {
          //console.log("existing")
          return;
        }

        const category = $(element).attr("class").split(" ").filter(c => c.startsWith("category-")&& c !== 'category-sos-series'&& c !== 'category-soup' && c !== 'category-quinoa'&& c !== 'category-healthy-choices'&& c !== 'category-january-meal-planning-bootcamp'&& c !== 'category-casserole'&& c !== 'category-legume'&& c !== 'category-avocado' && c !== 'category-dairy-free' && c !== 'category-the-soup-series' && c !== 'category-holiday-series' && c !== 'category-meal-prep' && c !== "category-life" && c !== 'category-5-ingredients' && c !== "category-recipes" && c !== "category-all").map((c) => c.substring(9));
        if(category == "" ) {
          // Don't print empty category 
        } else {
          const title = $(element).find("h3").text();
          // Create a new recipe document and save it to the database with all the categories
          categories.push(category);
          const recipe = new Recipe({ title: title, link: link, category: category });
          recipe.save()
        }    
      });
    });
  })
  .catch((err) => console.error(err));


  module.exports = mongoose.model("Recipe", recipeDataSchema);

