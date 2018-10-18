
const express = require('express');
const router = express.Router();


const Movie = require("../models/Movie");

router.post('/', function (req, res, next) {

  //const { title, imdb_score, category, country, year } = req.body;
  // Yöntem - 1
  // const movie = new Movie(
  //   {
  //     title: title,
  //     imdb_score: imdb_score,
  //     category: category,
  //     country: country,
  //     year: year
  //   }
  // );

  // Yöntem - 2
  const movie = new Movie(req.body);


  // "title" zorunlu alan olduğu için bu veri kaydedilmez.
  // const { title, imdb_score, category, country, year } = req.body;
  // const movie = new Movie(
  //   {
  //     imdb_score: imdb_score,
  //     category: category,
  //     country: country,
  //     year: year
  //   }
  // );


  // Yöntem - 1
  // movie.save((err, data) => {

  //   if (err) {
  //     res.json(err);
  //   }

  //   //res.json(data);
  //   res.json({ status: 1 });

  // });

  // Yöntem - 2

  const promise = movie.save();

  promise.then((data) => {

    res.json({ status: 1 });

  }).catch((err) => {

    res.json(err);

  });


});

module.exports = router;
