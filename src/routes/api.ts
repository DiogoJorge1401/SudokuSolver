import { Application } from "express";
import SudokuSolver from "../controllers/sudoku-solver";

export default function (app: Application) {
  let solver = new SudokuSolver();

  app.post("/api/check", (req, res) => {
    try {
      const { puzzle, coordinate, value } = req.body;
      const validRows = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
      const validCols = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      solver.requiredFields({ puzzle, coordinate, value });
      solver.validChars(puzzle);
      solver.validLength(puzzle);
      solver.validateField<string>(
        coordinate,
        (coordinate) =>
          coordinate.length <= 2 &&
          validRows.includes(coordinate[0]) &&
          validCols.includes(+coordinate[1]),
        "Invalid coordinate"
      );
      solver.validateField<string>(
        value,
        (value) => validCols.includes(+value),
        "Invalid value"
      );

      const row = coordinate[0];
      const col = coordinate[1];

      const rowCheck = solver.checkRowPlacement(puzzle, row, +col, +value);
      const colCheck = solver.checkColPlacement(puzzle, row, +col, +value);
      const gridCheck = solver.checkRegionPlacement(puzzle, row, +col, +value);

      const result = { row: rowCheck, column: colCheck, region: gridCheck };
      const valid = rowCheck && colCheck && gridCheck;
      const response: any = { valid };

      if (!valid) response.conflict = [];

      for(const prop in result)
        if(!result[prop]) response.conflict.push(prop);

      return res.json(response);
    } catch (error: any) {
      return res.json({ error: error.message });
    }
  });

  app.post("/api/solve", (req, res) => {
    try {
      const puzzle = req.body.puzzle;
      const result = solver.solve(puzzle);
      return res.json({ solution: result });
    } catch (error: any) {
      return res.json({ error: error.message });
    }
  });
}
