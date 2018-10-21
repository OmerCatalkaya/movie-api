const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Director = require("../models/Director");

router.post("/", function(req, res, next) {
  const director = new Director(req.body);
  const promise = director.save();

  promise
    .then(data => {
      res.json({ data });
    })
    .catch(err => {
      res.json(err);
    });
});


router.get("/", function(req, res, next) {
  const promise = Director.aggregate([
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "director_id",
        as: "movies"
      }
    },
    {
      $unwind: {
        path: "$movies",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          _id: "$_id",
          name: "$name",
          surname: "$surname",
          bio: "@bio"
        },
        movies: {
          $push: "$movies"
        }
      }
    },
    {
      $project: {
        _id: "$_id._id",
        name: "$_id.name",
        surname: "$_id.surname",
        movies: "$movies"
      }
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



router.get("/:director_id", function(req, res, next) {
  const promise = Director.aggregate([
    {
      $match: {
        "_id": mongoose.Types.ObjectId(req.params.director_id)        
      }
    },
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "director_id",
        as: "movies"
      }
    },
    {
      $unwind: {
        path: "$movies",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          _id: "$_id",
          name: "$name",
          surname: "$surname",
          bio: "@bio"
        },
        movies: {
          $push: "$movies"
        }
      }
    },
    {
      $project: {
        _id: "$_id._id",
        name: "$_id.name",
        surname: "$_id.surname",
        movies: "$movies"
      }
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






//director güncelleme
router.put("/:director_id", function (req, res, next) {

  if (!mongoose.Types.ObjectId.isValid(req.params.director_id)) {
    next({ message: "The director id is not a ObjectId.", code: 2 });
  }

  const promise = Director.findByIdAndUpdate(
    req.params.director_id,
    req.body,
    { new: true }
  );

  promise
    .then((data) => {

      if (!data) {
        next({ message: "The director was not found.", code: 1 });
      }

      res.json(data);

    })
    .catch(err => {
      res.json(err);
    });

});






//director silme
router.delete("/:director_id", function (req, res, next) {

  if (!mongoose.Types.ObjectId.isValid(req.params.director_id)) {
    next({ message: "The director id is not a ObjectId.", code: 2 });
  }

  const promise = Director.findByIdAndDelete(req.params.director_id);

  promise
    .then((data) => {

      if (!data) {
        next({ message: "The director was not found.", code: 1 });
      }

      res.json(data);

    })
    .catch(err => {
      res.json(err);
    });

});






module.exports = router;
