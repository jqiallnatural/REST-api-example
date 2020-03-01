const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view enginer", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema

const articleSchema = {
  title: String,
  content: String
};

// Finds the articles collection from database
const Article = mongoose.model("Article", articleSchema);

app.get("/articles", function(req, res) {
  Article.find(function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
});

app.post("/articles", function(req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  // Error back to the client
  newArticle.save(function(err) {
    if (!err) {
      res.send("Successfully added a new article");
    } else {
      res.send(err);
    }
  });
});

app.delete("/articles", function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("Successfully deleted all articles.");
    }
  });
});

app.listen(3000, function() {
  console.log("Servers starting at port 3000");
});
