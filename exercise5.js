// ============================================================
//  EXERCISE 5 - TASK REQUIREMENTS
// ------------------------------------------------------------
//  One task per array method. What it does, and what it RETURNS:
//
//   forEach()   runs a function for every element  -> nothing (undefined)
//   map()       creates a new transformed array    -> new array
//   filter()    keeps elements that match          -> new array
//   find()      finds the first matching element   -> one element or undefined
//   includes()  checks if an element exists        -> true / false
//   push()      adds to the end                    -> new length
//   pop()       removes the last element           -> removed element
//   shift()     removes the first element          -> removed element
//   unshift()   adds to the beginning              -> new length
//   indexOf()   finds an element's index           -> index or -1
// ============================================================

const students = ["Rawan", "Wesam", "Hind", "Muhammad", "Esraa", "Dareen"];
const grades = [88, 45, 92, 60, 33, 75];

// forEach -> returns nothing (undefined)
function printGrades(list) {
  list.forEach(function (grade) {
    console.log(grade);
  });
}

// map -> returns a new array
function toPercentages(list) {
  return list.map(function (grade) {
    return grade + "%";
  });
}

// filter -> returns a new array with only what passed
function passingGrades(list) {
  return list.filter(function (grade) {
    return grade >= 60;
  });
}

// find -> returns the first match, or undefined
function firstFailingGrade(list) {
  return list.find(function (grade) {
    return grade < 60;
  });
}

// includes -> returns true or false
function isEnrolled(list, name) {
  return list.includes(name);
}

// indexOf -> returns the index, or -1 if it is not there
function positionOf(list, name) {
  return list.indexOf(name);
}

// The next four CHANGE the array they are given.

// push -> returns the new length
function addToEnd(list, name) {
  return list.push(name);
}

// pop -> returns the removed element
function removeLast(list) {
  return list.pop();
}

// shift -> returns the removed element
function removeFirst(list) {
  return list.shift();
}

// unshift -> returns the new length
function addToStart(list, name) {
  return list.unshift(name);
}

// --- Demo ---
console.log("Exercise 5");

console.log("forEach:");
printGrades(grades);

console.log("map     ->", toPercentages(grades)); // ["88%", "45%", ...]
console.log("filter  ->", passingGrades(grades)); // [88, 92, 60, 75]
console.log("find    ->", firstFailingGrade(grades)); // 45
console.log("includes->", isEnrolled(students, "Hind")); // true
console.log("indexOf ->", positionOf(students, "Esraa")); // 4

// push, pop, shift and unshift change the array,
// so we work on a copy and keep the original safe.
const roster = [...students];

console.log("push    ->", addToEnd(roster, "Layan")); // 7 (new length)
console.log("pop     ->", removeLast(roster)); // "Layan"
console.log("shift   ->", removeFirst(roster)); // "Rawan"
console.log("unshift ->", addToStart(roster, "Rawan")); // 6 (new length)

console.log("original students:", students); // unchanged

// This line lets the same file work in Node and in the browser page.
if (typeof module !== "undefined") {
  module.exports = {
    students,
    grades,
    printGrades,
    toPercentages,
    passingGrades,
    firstFailingGrade,
    isEnrolled,
    positionOf,
    addToEnd,
    removeLast,
    removeFirst,
    addToStart,
  };
}
