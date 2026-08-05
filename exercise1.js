// ============================================================
//  EXERCISE 1 - TASK REQUIREMENTS
// ------------------------------------------------------------
//  Write a function that takes an array of integers as input,
//  iterates over the array, and returns a new array.
//  The returned array should contain the result of raising 2
//  to the power of the original input element.
//
//  Example: ([1, 2, 3]) returns [2, 4, 8]
//           because 2^1 = 2, 2^2 = 4, and 2^3 = 8
//
//  Use for, forEach and then map to solve this question,
//  to see the difference between the three ways.
// ============================================================

// WAY 1: for loop
// We create the empty array, we count with i, and we push each result.
function powersOfTwoForLoop(numbers) {
  const result = [];

  for (let i = 0; i < numbers.length; i++) {
    result.push(Math.pow(2, numbers[i]));
  }

  return result;
}

// WAY 2: forEach
// forEach gives us each element, so we no longer need i.
// But forEach returns nothing, so we still build the array ourselves.
function powersOfTwoForEach(numbers) {
  const result = [];

  numbers.forEach(function (number) {
    result.push(Math.pow(2, number));
  });

  return result;
}

// WAY 3: map
// map builds and returns the new array for us.
// We only say how ONE element turns into another.
function powersOfTwoMap(numbers) {
  return numbers.map(function (number) {
    return Math.pow(2, number);
  });
}

// --- Demo ---
console.log("Exercise 1");
console.log("for loop:", powersOfTwoForLoop([1, 2, 3])); // [2, 4, 8]
console.log("forEach :", powersOfTwoForEach([1, 2, 3])); // [2, 4, 8]
console.log("map     :", powersOfTwoMap([1, 2, 3])); // [2, 4, 8]

// This line lets the same file work in Node and in the browser page.
if (typeof module !== "undefined") {
  module.exports = { powersOfTwoForLoop, powersOfTwoForEach, powersOfTwoMap };
}
