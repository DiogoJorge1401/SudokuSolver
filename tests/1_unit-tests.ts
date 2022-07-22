import chai from "chai";
import { suite, test } from "mocha";
import { puzzlesAndSolutions as puzzles } from "../src/controllers/puzzle-strings";
import Solver from "../src/controllers/sudoku-solver";
import {
  INVALID_CHARACTER,
  INVALID_LENGTH,
  INVALID_SOLUTION,
  VALID_PUZZLE,
  VALID_SOLUTION
} from "./mocks";

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
    } catch (error: any) {
      assert.equal(error.message, "Invalid characters in puzzle");
      done();
    }
  });

  test("Invalid length puzzle", (done) => {
    try {
      solver.validate(INVALID_LENGTH);
    } catch (error: any) {
      assert.equal(error.message, "Expected puzzle to be 81 characters long");
      done();
    }
  });

  test("Logic handles a valid row placement", () => {
    assert.isTrue(solver.checkRowPlacement(puzzles[0][0], "a", 2, 9));
    assert.isTrue(solver.checkRowPlacement(puzzles[0][0], "b", 2, 4));
  });

  test("Logic handles an invalid row placement", () => {
    assert.isFalse(solver.checkRowPlacement(puzzles[0][0], "a", 2, 1));
    assert.isFalse(solver.checkRowPlacement(puzzles[0][0], "b", 1, 6));
  });

  test("Logic handles a valid column placement", () => {
    assert.isTrue(solver.checkColPlacement(puzzles[0][0], "a", 2, 3));
    assert.isTrue(solver.checkColPlacement(puzzles[0][0], "a", 2, 5));
    assert.isTrue(solver.checkColPlacement(puzzles[0][0], "a", 2, 8));
  });

  test("Logic handles an invalid column placement", () => {
    assert.isFalse(solver.checkColPlacement(puzzles[0][0], "c", 3, 6));
    assert.isFalse(solver.checkColPlacement(puzzles[0][0], "b", 1, 1));
    assert.isFalse(solver.checkColPlacement(puzzles[0][0], "a", 5, 5));
  });

  test("Logic handles a valid region (3x3 grid) placement", () => {
    assert.isTrue(solver.checkRegionPlacement(puzzles[0][0], "a", 2, 3));
    assert.isTrue(solver.checkRegionPlacement(puzzles[0][0], "b", 2, 3));
  });

  test("Logic handles an invalid region (3x3 grid) placement", () => {
    assert.isFalse(solver.checkRegionPlacement(puzzles[0][0], "a", 2, 2));
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
    done();
  });
});
