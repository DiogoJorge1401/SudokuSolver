type ValidationFn<T> = (value: T) => boolean;

export default class SudokuSolver {
  validate(puzzleStr: string) {
    if (!puzzleStr) throw new Error("Required field missing");

    this.validLength(puzzleStr);
    this.validChars(puzzleStr);

    const rows = this.createRows(puzzleStr);
    const cols: string[][] = [];

    for (let i = 0; i < 9; i++) {
      const col = this.createCols(rows, i);
      cols.push(col);
    }

    const grids = this.createGrids(puzzleStr);

    for (let j = 0; j < 9; j++) {
      const row = rows[j];
      const col = cols[j];
      const grid = grids[j];

      const rowTest = row.some(
        (num) => row.indexOf(num) !== row.lastIndexOf(num) && num !== "."
      );
      const colTest = col.some(
        (num) => col.indexOf(num) !== col.lastIndexOf(num) && num !== "."
      );
      const gridTest = grid.some(
        (num) => grid.indexOf(num) !== grid.lastIndexOf(num) && num !== "."
      );

      if (rowTest || colTest || gridTest)
        throw new Error("Puzzle cannot be solved");
    }

    return true;
  }

  solve(puzzleStr: string): string {
    this.validate(puzzleStr);

    const grids = this.createGrids(puzzleStr);
    const gridsCopy = grids.slice();
    const nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const ordered = grids.sort(
      (a, b) =>
        b.filter((char) => char != ".").length -
        a.filter((char) => char != ".").length
    );
    while (![...puzzleStr].every((curr) => curr !== "."))
      for (const arr of ordered) {
        const indexKey = {
          0: 0,
          1: 3,
          2: 6,
          3: 27,
          4: 30,
          5: 33,
          6: 54,
          7: 57,
          8: 60,
        };
        const strIndex = indexKey[gridsCopy.indexOf(arr)];

        arr.forEach((item, idx) => {
          if (item !== ".") return;

          const puzzle_index = strIndex + 9 * Math.floor(idx / 3) + (idx % 3);
          const puzzle_diff = puzzle_index % 9;
          const puzzle_row_i = Array.from(
            puzzleStr.substr(puzzle_index - puzzle_diff, 9)
          );

          function setCharAt(str: string, index: number, chr) {
            if (index > str.length - 1) return str;
            return str.substring(0, index) + chr + str.substring(index + 1);
          }

          const colArr: string[] = [];

          for (let count = puzzle_diff; count < 81; count += 9)
            colArr.push(puzzleStr[count]);

          const filteredKeywords = nums.filter((num) => !arr.includes(num));
          const colFilteredNums = filteredKeywords.filter(
            (num) => !colArr.includes(num)
          );
          const rowFilteredNums = filteredKeywords.filter(
            (num) => !puzzle_row_i.includes(num)
          );
          const correlate_nums = colFilteredNums.filter((num) =>
            rowFilteredNums.includes(num)
          );
          if (correlate_nums.length === 1)
            puzzleStr = setCharAt(puzzleStr, puzzle_index, correlate_nums[0]);
        });
      }

    return puzzleStr;
  }

  checkRowPlacement(
    puzzleStr: string,
    row: string,
    column: number,
    value: number
  ): boolean {
    const grid = this.createRows(puzzleStr);
    const rows = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
    const strRow = grid[rows.indexOf(row)];
    const rowVal = strRow[column - 1];

    if (+rowVal === value) strRow.splice(column - 1, 1);
    else if (rowVal !== ".") return false;

    // +strRow[column - 1] === value ? strRow.splice(column - 1, 1) : strRow;

    return strRow.indexOf(value.toString()) === -1;
  }

  checkColPlacement(
    puzzleStr: string,
    row: string,
    column: number,
    value: number
  ): boolean {
    const grid = this.createRows(puzzleStr);
    const strCol = this.createCols(grid, column - 1);
    const rowKey = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8 };
    const colVal = strCol[rowKey[row]];

    if (+colVal === value) strCol.splice(rowKey[row], 1);
    else if (colVal !== ".") return false;

    return strCol.indexOf(value.toString()) === -1;
  }

  checkRegionPlacement(
    puzzleStr: string,
    row: string,
    column: number,
    value: number
  ): boolean {
    const grids = this.createGrids(puzzleStr);
    const key = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
      g: 7,
      h: 8,
      i: 9,
    };
    const rowNum = key[row];
    let grid: string[] = [];

    if (rowNum <= 3) {
      if (column <= 3) grid = grids[0];
      else if (column <= 6) grid = grids[1];
      else if (column <= 9) grid = grids[2];
    } else if (rowNum <= 6) {
      if (column <= 3) grid = grids[3];
      else if (column <= 6) grid = grids[4];
      else if (column <= 9) grid = grids[5];
    } else if (rowNum <= 9) {
      if (column <= 3) grid = grids[6];
      else if (column <= 6) grid = grids[7];
      else if (column <= 9) grid = grids[8];
    }

    const row_calc = { a: 0, b: 1, c: 2, d: 0, e: 1, f: 2, g: 0, h: 1, i: 2 };
    const col_cal = (column - 1) % 3;
    const grid_calc = row_calc[row] * 3 + col_cal;
    const grid_val = grid[grid_calc];

    if (+grid_val === value) grid.splice(grid_calc, 1);
    else if (grid_val !== ".") return false;

    return grid.indexOf(value.toString()) === -1;
  }

  requiredFields({ puzzle, coordinate, value }) {
    if (!puzzle || !coordinate || !value)
      throw new Error("Required field(s) missing");
  }

  validateField<T>(value: T, fn: ValidationFn<T>, errorMessage: string) {
    if (!fn(value)) throw new Error(errorMessage);
  }

  validChars(puzzleStr: string) {
    const validPuzzleRegex = /^[\d.]+$/gi;

    if (!validPuzzleRegex.test(puzzleStr))
      throw new Error("Invalid characters in puzzle");
  }

  validLength(puzzleStr: string) {
    if (puzzleStr.length !== 81)
      throw new Error("Expected puzzle to be 81 characters long");
  }

  private createRows(puzzleStr: string) {
    const grid: string[][] = [];
    const goodArr = puzzleStr.split("");
    for (let i = 0; i < 9; i++) grid.push(goodArr.splice(0, 9));
    return grid;
  }

  private createCols(arr: string[][], colNum: number) {
    const cols: string[] = [];
    for (const item of arr) cols.push(item[colNum]);
    return cols;
  }

  private createGrids(puzzleStr: string) {
    const grids: string[][] = [];
    const subarrs: string[] = [];

    for (let i = 0; i < 3; i++) subarrs.push(puzzleStr.substr(i * 27, 27));

    for (const arr of subarrs)
      for (let i = 0; i <= 6; i += 3) {
        const grid: string[] = [];

        for (let j = i; j < 27; j += 9)
          grid.push(...arr.substr(j, 3).split(""));

        grids.push(grid);
      }
    return grids;
  }
}
