const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const Movie = require("../models/Movie");

// between
router.get("/between/:start_year/:end_year", function (req, res, next) {

  const { start_year, end_year } = req.params;

  // $lte : <= (küçük eşit)
  // $gte : >= (büyük eşit)
  // $lt  : <= (küçük)
  // $gt  : >= (büyük)
  // $ne  : != (eşit değil)
  // $eq  : = (eşittir)
  // $in  : array listenin içinde olan
  // $nin  : array listenin içinde olmayanlar


  const promise = Movie.find(
    {
      //year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) }, // start ve end tarihleri arasında olan
      //country : {"$ne" : "italy"} // eşit olmayanlar
      //actors: { "$in": ["Leonardo DiCaprio"] } // 
      actors: { "$nin": ["Leonardo DiCaprio"] } // 
    }
  );

  promise
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});




// Top 10
router.get("/top10", function (req, res, next) {
  const promise = Movie.find({}).limit(10).sort({ imdb_score: -1 });

  promise
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});




// movie id ye göre movie silme
router.delete("/:movie_id", function (req, res, next) {

  if (!mongoose.Types.ObjectId.isValid(req.params.movie_id)) {
    next({ message: "The movie id is not a ObjectId.", code: 2 });
  }

  //const promise = Movie.findOneAndRemove(req.params.movie_id);
  const promise = Movie.findByIdAndRemove(req.params.movie_id);

  promise
    .then((data) => {

      if (!data) {
        next({ message: "The movie was not found.", code: 1 });
      }

      res.json(data);

    })
    .catch(err => {
      res.json(err);
    });

});


//movie güncelleme - 1
router.put("/:movie_id", function (req, res, next) {

  if (!mongoose.Types.ObjectId.isValid(req.params.movie_id)) {
    next({ message: "The movie id is not a ObjectId.", code: 2 });
  }

  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id,
    req.body,
    { new: true }
  );

  promise
    .then((data) => {

      if (!data) {
        next({ message: "The movie was not found.", code: 1 });
      }

      res.json(data);

    })
    .catch(err => {
      res.json(err);
    });

});



// movie güncelleme - 2
router.put("/:movie_id", function (req, res, next) {

  if (!mongoose.Types.ObjectId.isValid(req.params.movie_id)) {
    next({ message: "The movie id is not a ObjectId.", code: 2 });
  }


  // .update yerini updateOne(), updateMany() yada bulkWrite()
  const promise = Movie.update(
    { _id: req.params.movie_id },
    { title: req.body.title },
    (err, data) => {
      res.json(data);
    }
  );

  promise
    .then((data) => {

      if (!data) {
        next({ message: "The movie was not found.", code: 1 });
      }

      res.json(data);

    })
    .catch(err => {
      res.json(err);
    });

});





// movie id ye göre movie getirme
router.get("/:movie_id", function (req, res, next) {

  if (!mongoose.Types.ObjectId.isValid(req.params.movie_id)) {
    next({ message: "The movie id is not a ObjectId.", code: 2 });
  }

  const promise = Movie.findById(req.params.movie_id);

  promise
    .then((data) => {

      if (!data) {
        next({ message: "The movie was not found.", code: 1 });
      }

      res.json(data);

    })
    .catch(err => {
      res.json(err);
    });

});


// Yönetmeli ile birlikte movie getirme

router.get("/", function (req, res, next) {

  const promise = Movie.aggregate([
    {
      $lookup: {
        from: "directors",
        localField: "director_id",
        foreignField: "_id",
        as: "director"
      }
    }, {
      $unwind: "$director"
    }
  ]);

  promise
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});




// tüm movie leri getirme
router.get("/", function (req, res, next) {

  const promise = Movie.find({});

  promise
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});


// router.post("/", function (req, res, next) {
//   const { title, imdb_score, category, country, year, createdAt, actors } = req.body;

//   const movie = new Movie(
//     {
//       title: "Başlangıç (Inception)",
//       imdb_score: 8.9,
//       category: "Bilimkurgu, Aksiyon",
//       country: "ABD, İngiltere",
//       year: 2010,
//       createdAt: "2018-10-19 08:43:38.518",
//       actors: ["Leonardo DiCaprio","Marion Cotillard","Joseph Gordon-Levitt","Ellen Page","Michael Caine"]
//     }
//   );

//   movie.save((err, data) => {

//     if (err) {
//       res.json(err);
//     }

//     res.json(data);

//   });

// });




// movie ekleme - yöntem - 1
// router.post("/", function (req, res, next) {
//   const { title, imdb_score, category, country, year, createdAt, actors } = req.body;

//   const movie = new Movie(
//     {
//       title: title,
//       imdb_score: imdb_score,
//       category: category,
//       country: country,
//       year: year,
//       createdAt : createdAt,
//       actors : actors
//     }
//   );

//   movie.save((err, data) => {

//     if (err) {
//       res.json(err);
//     }

//     res.json(data);

//   });

// });




// movie ekleme - yöntem - 2
// router.post("/", function (req, res, next) {

//   const movie = new Movie(req.body);
//   movie.save((err, data) => {

//     if (err) {
//       res.json(err);
//     }

//     //res.json(data);
//     res.json({status : 1});

//   });

// });



// movie ekleme - yöntem - 3
router.post("/", function (req, res, next) {

  const movie = new Movie(req.body);
  const promise = movie.save();

  promise
    .then(data => {
      //res.json({ status: 1 });
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });

});















module.exports = router;
