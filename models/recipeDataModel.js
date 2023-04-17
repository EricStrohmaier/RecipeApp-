const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const recipeDataSchema = new mongoose.Schema({
  title: String,
  link: String
});
const Recipe  = mongoose.model("Recipe", recipeDataSchema);

const urls = Array.from({ length: 101 }, (v, i) => `https://pinchofyum.com/recipes/all/page/${i + 1}`);

Promise.all(urls.map((url) => axios.get(url)))
  .then((responses) => {
    responses.forEach((response) => {
      const $ = cheerio.load(response.data);

      $("article.category-all").each((i, element) => {
        const link = $(element).find("a.block").attr("href");
        const title = $(element).find("h3").text();

        // Create a new recipe document and save it to the database
        const recipe = new Recipe({ title: title, link: link });
        recipe.save()
      });
    });
  })
  .catch((err) => console.error(err));
  
  module.exports = mongoose.model("Recipe", recipeDataSchema);

