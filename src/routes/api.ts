import { Application } from "express";
import SudokuSolver from "../controllers/sudoku-solver";

export default function (app: Application) {
  let solver = new SudokuSolver();

  app.post("/api/check", (req, res) => {});

  app.post("/api/solve", (req, res) => {
    try {
      const puzzle = req.body.puzzle as string;
      const result = solver.solve(puzzle);
      return res.json({ solution: result });
    } catch (error: any) {
      return res.json({ error: error.message });
    }
  });
}
