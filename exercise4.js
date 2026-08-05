// ============================================================
//  EXERCISE 4 - TASK REQUIREMENTS
// ------------------------------------------------------------
//  Write a function named fizzbuzz that takes in an array of
//  numbers. Iterate over the array using forEach or map to
//  determine the output based on several rules:
//
//    - divisible by 3          -> add "Fizz"
//    - divisible by 5          -> add "Buzz"
//    - divisible by 3 AND 5    -> add "Fizz Buzz"
//    - otherwise               -> add the number itself
//
//  Return the resulting output array.
// ============================================================

function fizzbuzz(numbers) {
  return numbers.map(function (number) {
    // The "both" rule must be checked FIRST.
    // Otherwise 15 would match "divisible by 3" and stop there.
    if (number % 3 === 0 && number % 5 === 0) {
      return "Fizz Buzz";
    }

    if (number % 3 === 0) {
      return "Fizz";
    }

    if (number % 5 === 0) {
      return "Buzz";
    }

    return number;
  });
}

// --- Demo ---
console.log("Exercise 4");
console.log(fizzbuzz([1, 3, 5, 15])); // [1, "Fizz", "Buzz", "Fizz Buzz"]

// This line lets the same file work in Node and in the browser page.
if (typeof module !== "undefined") {
  module.exports = { fizzbuzz };
}
