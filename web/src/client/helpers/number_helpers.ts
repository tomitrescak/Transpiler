export function totalMark(results: IMark[]) {
  let res = 0;
  for (let result of results) {
    res += parseFloat(result.value);
  }
  return Math.round(res * 100) / 100;
}
