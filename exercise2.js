// ============================================================
//  EXERCISE 2 - TASK REQUIREMENTS
// ------------------------------------------------------------
//  Write a function that takes an array of numbers as input,
//  uses map to return a new array where each element is either
//  the string "even" or the string "odd", based on each value.
//
//  If any element in the array is not a number, the resulting
//  array should have the string "N/A" in its place.
//
//  Example: ([1, 2, 3, "Rawan"]) returns
//           ["odd", "even", "odd", "N/A"]
// ============================================================

function evenOrOdd(values) {
  return values.map(function (value) {
    // Not a number at all (a string, a boolean, ...)
    if (typeof value !== "number") {
      return "N/A";
    }

    // NaN is technically of type "number", so we check it separately.
    if (Number.isNaN(value)) {
      return "N/A";
    }

    // A number divided by 2 with no remainder is even.
    if (value % 2 === 0) {
      return "even";
    }

    return "odd";
  });
}

// --- Demo ---
console.log("Exercise 2");
console.log(evenOrOdd([1, 2, 3, "Rawan"])); // ["odd", "even", "odd", "N/A"]

// This line lets the same file work in Node and in the browser page.
if (typeof module !== "undefined") {
  module.exports = { evenOrOdd };
}
