const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const server = require("../app");

chai.use(chaiHttp);

let token, movieId;

describe("Test başladı...", () => {

  before((done) => {
    chai
      .request(server)
      .post("/authenticate")
      .send({
        username: "matrixomer",
        password: "welcome"
      })
      .end((err, res) => {
        token = res.body.token;
        console.log("token 1 : " + token);
        done();
      });

  });

  describe("/get movies", () => {
    it("tüm filmler alınmalı...", done => {
      chai
        .request(server)
        .get("/api/movies")
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          //console.log(res.body);
          done();
        });
    });
  });

  describe("/post movies", () => {
    it("Bir tane filmi eklemelidir...", (done) => {

      const movie = {
        title: "Udemy",
        director_id: "5bca33ed4bcd3d478481e001",
        category: "Komodi",
        country: "Türkiye",
        year: 1950,
        imdb_score: 8,
        actors: ["Leonardo DiCaprio", "Marion Cotillard", "Joseph Gordon-Levitt", "Ellen Page", "Michael Caine"]
      };

      //console.log("movie.body : " + JSON.stringify(movie.title));

      chai
        .request(server)
        .post("/api/movies")
        .send(movie)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');

          //console.log("movie.body : " + JSON.stringify(res.body));

          res.body.should.have.property("title");
          res.body.should.have.property("director_id");
          res.body.should.have.property("category");
          res.body.should.have.property("country");
          res.body.should.have.property("year");
          res.body.should.have.property("imdb_score");
          res.body.should.have.property("actors");
          movieId = res.body._id;
          done();
        });



    });
  });

  describe("/get movie_id movie", () => {
    it("Verilen movie_id ile bir film vermelidir...", done => {

      chai
        .request(server)
        .get("/api/movies/" + movieId)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("title");
          res.body.should.have.property("director_id");
          res.body.should.have.property("category");
          res.body.should.have.property("country");
          res.body.should.have.property("year");
          res.body.should.have.property("imdb_score");

          res.body.should.have.property("_id").eql(movieId);

          done();

        });

    });
  });

  describe("/put movies", () => {
    it("Bir tane filmi güncellemelidir...", done => {
      const movie = {
        title: "93 Creative",
        director_id: "5bca33ed4bcd3d478481e002",
        category: "Suç",
        country: "Fransa",
        year: 2005,
        imdb_score: 7,
        actors: ["Leonardo DiCaprio", "Marion Cotillard", "Joseph Gordon-Levitt", "Ellen Page", "Michael Caine"]
      };

      chai
        .request(server)
        .put("/api/movies/" + movieId)
        .send(movie)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("title").eql(movie.title);
          res.body.should.have.property("director_id").eql(movie.director_id);
          res.body.should.have.property("category").eql(movie.category);
          res.body.should.have.property("country").eql(movie.country);
          res.body.should.have.property("year").eql(movie.year);
          res.body.should.have.property("imdb_score").eql(movie.imdb_score);
          res.body.should.have.property("actors").eql(movie.actors);

          done();
        });



    });
  });

  describe("/DELETE movies", () => {
    it("Bir tane filmi silmeli...", done => {
      chai
        .request(server)
        .delete("/api/movies/" + movieId)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql(1);

          done();
        });



    });
  });

});

// Örnek test - önce before çalışır..
// describe("Test başladı...", () => {
//   before(done => {
//     console.log("ilk ben çalışacağım.");
//     done();
//   });

//   describe("filmler alınıyor", () => {
//     it("tüm filmler alındı", done => {
//       done();
//     });
//   });
// });
