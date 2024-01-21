// Create web server application
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const Comment = require("./models/comment");
const methodOverride = require("method-override");
const flash = require("connect-flash");

// Connect to database
mongoose.connect("mongodb://localhost:27017/comment_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Set up view engine
app.set("view engine", "ejs");
// Set up body parser
app.use(bodyParser.urlencoded({ extended: true }));
// Set up public directory
app.use(express.static(path.join(__dirname, "public")));
// Set up method override
app.use(methodOverride("_method"));
// Set up flash
app.use(flash());

// Set up express-session
app.use(
  require("express-session")({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Set up connect-flash
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});

// Set up routes
app.get("/", (req, res) => {
  res.redirect("/comments");
});

// Index Route
app.get("/comments", (req, res) => {
  Comment.find({}, (err, comments) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { comments: comments });
    }
  });
});

// New Route
app.get("/comments/new", (req, res) => {
  res.render("new");
});

// Create Route
app.post("/comments", (req, res) => {
  Comment.create(req.body.comment, (err, comment) => {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Comment created successfully");
      res.redirect("/comments");
    }
  });
});

// Show Route
app.get("/comments/:id", (req, res) => {
  Comment.findById(req.params.id, (err, comment) => {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { comment: comment });
    }
  });
});
