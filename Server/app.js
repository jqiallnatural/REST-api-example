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

// Request targeting all articles

app
  .route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
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
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      }
    });
  });

// Request targeting a specific articles

app
  .route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.find({ title: req.params.articleTitle }, function(
      err,
      foundArticle
    ) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found");
      }
    });
  })
  .put(function(req, res) {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function(err) {
        if (!err) {
          res.send("Successfully updated article.");
        }
      }
    );
  })
  .patch(function(req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function(err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function(req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function(err) {
      if (!err) {
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function() {
  console.log("Servers starting at port 3000");
});
