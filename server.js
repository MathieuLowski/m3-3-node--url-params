"use strict";
const express = require("express");
const morgan = require("morgan");

const { top50 } = require("./data/top50");

const PORT = process.env.PORT || 8000;

const app = express();
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: 200, data: { message: "This is the homepage" } });
});

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
//console.log(top50);
// endpoints here

// We get the ending point nested in the wwww.etc
app.get("/top50", (req, res) => {
  // We render the inside of the page by putting the endpoint of the ejs file.
  res.render("pages/top50", {
    title: "Top 50 Songs Streamed on Spotify",

    top50: top50,
  });
});

app.get("/top50/song/:rank", (req, res) => {
  //console.log(req.params);
  const rank = req.params.rank - 1;
  //if rank# not found ===> display alt page (404)
  if (top50[rank]) {
    //path for the ejs folder
    res.render("pages/song1", {
      //updating title accessing object data from top50 file.
      title: `Song#${top50[rank].rank}`,
      song: top50[rank],
    });
  } else {
    //default 404 render status
    res.status(404);
    res.render("pages/fourOhFour", {
      title: "I got nothing",
      path: req.originalUrl,
    });
  }
});

// handle 404s
app.get("*", (req, res) => {
  res.status(404);
  res.render("pages/fourOhFour", {
    title: "I got nothing",
    path: req.originalUrl,
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
