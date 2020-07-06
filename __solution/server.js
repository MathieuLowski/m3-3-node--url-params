'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Require the DATA
const { top50 } = require('./data/top50');

// FUNCTIONS
const handleList = (req, res) => {
  res.render('pages/top50', {
    title: 'Top 50 Songs Streamed on Spotify',
    top50: top50,
  });
};

const handlePopularArtist = (req, res) => {
  const artists = [];
  const artistCount = {};
  top50.forEach((song) => {
    if (!artists.includes(song.artist)) {
      artists.push(song.artist);
    }
  });
  artists.forEach((artist) => {
    let count = 0;
    top50.forEach((song) => {
      if (song.artist === artist) count += 1;
    });
    artistCount[artist] = count;
  });

  const rankedArtists = [];
  Object.values(artistCount).forEach((count, id) => {
    const artist = Object.keys(artistCount)[id];
    rankedArtists.push({
      artist: artist,
      count: count,
    });
  });
  const mostPopularArtist = rankedArtists.sort((a, b) =>
    a.count < b.count ? 1 : -1
  )[0].artist;

  res.render('pages/popularArtist', {
    title: 'Most Popular Artist',
    songs: top50.filter((song) => song.artist === mostPopularArtist),
  });
};

const handleSongRank = (req, res) => {
  const rank = req.params.rank - 1;
  if (top50[rank]) {
    res.render('pages/songPage', {
      title: `Song #${top50[rank].rank}`,
      song: top50[rank],
    });
  } else {
    res.status(404);
    res.render('pages/fourOhFour', {
      title: 'I got nothing',
      path: req.originalUrl,
    });
  }
};

const handleFourOhFour = (req, res) => {
  res.status(404);
  res.render('pages/fourOhFour', {
    title: 'I got nothing',
    path: req.originalUrl,
  });
};

// SERVER SETUP
const app = express();
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// endpoints
app.get('/top50', handleList);
app.get('/top50/popular-artist', handlePopularArtist);
app.get('/top50/song/:rank', handleSongRank);

// handle 404s
app.get('*', handleFourOhFour);

app.listen(8000, () => console.log(`Listening on port 8000`));
