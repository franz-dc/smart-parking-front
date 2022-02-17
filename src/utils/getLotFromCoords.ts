// const getLotCoords = (cols: number, lot: number) => {
//   const row = Math.floor(lot / cols);
//   const col = lot % cols;
//   return {
//     row,
//     col,
//   };
// };

export const getLotFromCoords = (cols: number, row: number, col: number) =>
  cols * (row - 1) + col;
