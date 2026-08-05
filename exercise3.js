// ============================================================
//  EXERCISE 3 - TASK REQUIREMENTS
// ------------------------------------------------------------
//  Use forEach to return all the names in the array
//  ["Rawan", "Wesam", "Hind", "Muhammad", "Esraa", "Dareen"]
//  using loops.
// ============================================================

const names = ["Rawan", "Wesam", "Hind", "Muhammad", "Esraa", "Dareen"];

// Print every name, one by one.
function printNames(list) {
  list.forEach(function (name) {
    console.log(name);
  });
}

// Collect every name into a new array and return it.
// forEach returns nothing, so we push into our own array.
function getNames(list) {
  const result = [];

  list.forEach(function (name) {
    result.push(name);
  });

  return result;
}

// --- Demo ---
console.log("Exercise 3");
printNames(names);
console.log("returned:", getNames(names));

// This line lets the same file work in Node and in the browser page.
if (typeof module !== "undefined") {
  module.exports = { names, printNames, getNames };
}
