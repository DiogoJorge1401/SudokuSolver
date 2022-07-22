export default class SudokuSolver {
  validate(puzzleStr: string) {
    if (!puzzleStr) throw new Error("Required field missing");

    if (puzzleStr.length !== 81)
      throw new Error("Expected puzzle to be 81 characters long");

    const validPuzzleRegex = /^[\d.]+$/gi;

    if (!validPuzzleRegex.test(puzzleStr))
      throw new Error("Invalid characters in puzzle");

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

  createRows(puzzleStr: string) {
    const grid: string[][] = [];
    const goodArr = puzzleStr.split("");
    for (let i = 0; i < 9; i++) grid.push(goodArr.splice(0, 9));
    return grid;
  }

  createCols(arr: string[][], colNum: number) {
    const cols: string[] = [];
    for (const item of arr) cols.push(item[colNum]);
    return cols;
  }

  createGrids(puzzleStr: string) {
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

  checkRowPlacement(puzzleString, row, column, value): boolean {
    throw new Error("Method not implemented!");
  }

  checkColPlacement(puzzleString, row, column, value): boolean {
    throw new Error("Method not implemented!");
  }

  checkRegionPlacement(puzzleString, row, column, value): boolean {
    throw new Error("Method not implemented!");
  }
}
