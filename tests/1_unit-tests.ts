import chai from "chai";
import { suite, test } from "mocha";
import Solver from "../src/controllers/sudoku-solver";
import { INVALID_CHARACTER, INVALID_LENGTH, INVALID_SOLUTION, VALID_PUZZLE, VALID_SOLUTION } from './mocks';

const assert = chai.assert;
let solver = new Solver();


suite("UnitTests", () => {
  test("Valid puzzle", (done) => {
    assert.equal(solver.validate(VALID_PUZZLE), true);
    done();
  });

  test("Invalid characters in puzzle", (done) => {
    try {
      solver.validate(INVALID_CHARACTER);
    } catch (error:any) {
      assert.equal(error.message, "Invalid characters in puzzle");
      done();
    }
  });

  test("Invalid length puzzle", (done) => {
    try {
      solver.validate(INVALID_LENGTH);
    } catch (error:any) {
      assert.equal(error.message,"Expected puzzle to be 81 characters long")
      done();
    }
  });

  test("Valid row placement", (done) => {
    assert.equal(solver.checkRowPlacement(VALID_PUZZLE, 0, 0, 7), true);
    done();
  });

  test("Invalid row placement", (done) => {
    assert.equal(solver.checkRowPlacement(VALID_PUZZLE, 0, 0, 1), false);
    done();
  });

  test("Valid column placement", (done) => {
    assert.equal(solver.checkColPlacement(VALID_PUZZLE, 0, 0, 7), true);
    done();
  });

  test("Invalid column placement", (done) => {
    assert.equal(solver.checkColPlacement(VALID_PUZZLE, 0, 0, 1), false);
    done();
  });

  test("Valid region placement", (done) => {
    assert.equal(solver.checkRegionPlacement(VALID_PUZZLE, 0, 0, 7), true);
    done();
  });

  test("Invalid region placement", (done) => {
    assert.equal(solver.checkRegionPlacement(VALID_PUZZLE, 0, 0, 2), false);
    done();
  });

  test("Valid completed puzzle passes solver", (done) => {
    assert.equal(solver.solve(VALID_SOLUTION), VALID_SOLUTION);
    done();
  });

  test("Invalid completed puzzle fails the solver", (done) => {
    try {
      solver.solve(INVALID_SOLUTION);
    } catch (error: any) {
      assert.equal(error.message, "Puzzle cannot be solved");
      done();
    }
  });

  test("Expected solution for valid incomplete puzzle", (done) => {
    assert.equal(solver.solve(VALID_PUZZLE), VALID_SOLUTION);
    done()
  });
});
