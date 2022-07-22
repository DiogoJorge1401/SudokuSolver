import chai from "chai";
import chaiHttp from "chai-http";
import { suite, test } from "mocha";
import server from "../src/server";
import {
  INVALID_CHARACTER,
  INVALID_LENGTH,
  INVALID_PUZZLE,
  VALID_PUZZLE,
} from "./mocks";
const assert = chai.assert;

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("POST request to /api/solve", () => {
    test("valid puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: VALID_PUZZLE })
        .then((res) => {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.solution,
            "769235418851496372432178956174569283395842761628713549283657194516924837947381625"
          );
          done();
        });
    });

    test("missing puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .then((res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    test("invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: INVALID_CHARACTER })
        .then((res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: INVALID_LENGTH })
        .then((res) => {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("puzzle that cannot be solved", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: INVALID_PUZZLE })
        .then((res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });

  suite("POST request to /api/check", () => {
    test("Check a puzzle placement with all fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({})
        .then((res) => {
          // done()
        });
    });

    test("Check a puzzle placement with single placement conflict", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({})
        .then((res) => {
          // done()
        });
    });

    test("Check a puzzle placement with multiple placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({})
        .then((res) => {
          // done()
        });
    });

    test("Check a puzzle placement with all placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({})
        .then((res) => {
          // done()
        });
    });

    test("Check a puzzle placement with missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({})
        .then((res) => {
          // done()
        });
    });

    test("Check a puzzle placement with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({})
        .then((res) => {
          // done()
        });
    });

    test("Check a puzzle placement with incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({})
        .then((res) => {
          // done()
        });
    });

    test("Check a puzzle placement with invalid placement coordinate", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({})
        .then((res) => {
          // done()
        });
    });

    test("Check a puzzle placement with invalid placement value", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({})
        .then((res) => {
          // done()
        });
    });
  });
});
