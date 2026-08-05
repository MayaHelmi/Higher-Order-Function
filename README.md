# Higher Order Function

JavaScript exercises on higher order functions (`for`, `forEach`, `map`).

## Live page

**https://mayahelmi.github.io/Higher-Order-Function/**

The live page runs every exercise in the browser and animates each array operation step by step.

Each `exercise*.js` file **opens with a comment box containing the exact task requirements**, so the
requirement and the code that answers it sit side by side:

```javascript
// ============================================================
//  EXERCISE 1 - TASK REQUIREMENTS
// ------------------------------------------------------------
//  Write a function that takes an array of integers as input,
//  ...
// ============================================================
```

The code is written in a deliberately plain, beginner style: `function` declarations instead of
arrow functions, one `if` per rule instead of stacked ternaries, `Math.pow(2, n)` instead of
`2 ** n`, and a short comment above each function saying what it returns.

## Files

| File | Exercise |
| --- | --- |
| `exercise1.js` | Raise 2 to the power of each element — solved with `for`, `forEach`, and `map` |
| `exercise2.js` | Map numbers to `"even"` / `"odd"`, non-numbers to `"N/A"` |
| `exercise3.js` | Return all names in an array using `forEach` |
| `exercise4.js` | `fizzbuzz` over an array of numbers, using `map` |
| `exercise5.js` | One task per array method — `forEach`, `map`, `filter`, `find`, `includes`, `push`, `pop`, `shift`, `unshift`, `indexOf`, `reduce` |
| `index.html` | Interactive page (Tailwind) that explains and **runs** all five exercises |
| `visualizer.js` | Step-by-step **animation** — boxes for elements, played one step at a time |
| `styles.css` | The only hand-written CSS (keyframes + reduced-motion). Everything else is Tailwind |

## Run

```bash
node exercise1.js
node exercise2.js
node exercise3.js
node exercise4.js
node exercise5.js
```

## The web page

Open it live at **https://mayahelmi.github.io/Higher-Order-Function/**, or open `index.html`
locally (double-click it, or serve the folder).

It loads the same `exercise*.js` files with `<script>` tags and calls the real functions, so
every result you see is genuinely computed — there are no hardcoded outputs in the HTML.
Exercises 1, 2 and 4 take a live input; exercise 5 has a button per array method that shows
what that method **returns**.

### The animation

The **▶ Watch it run** panel at the top of the page draws every array element as a box and walks
through the operation one step at a time. Pick an operation, then **Play**, or **Step ›** / **‹ Back**
to move at your own pace. The line of code currently executing is highlighted, and a note explains
what just happened.

Colours: indigo = being looked at right now, green = kept or added, red strike-through = dropped or
removed, grey = already visited, dashed = never looked at.

Fifteen operations are animated, chosen to show the differences that are hard to see in text:

- **`for` vs `forEach` vs `map`** on the same input — watch `for` and `forEach` push into an array
  you made yourself, while `map` produces the array for you
- **`filter`** shrinking the array; **`map`** never changing its length
- **`find`** stopping at the first match, leaving the rest of the boxes dashed and unread
- **`shift`** renumbering every remaining element, while **`pop`** disturbs nothing
- **`push` / `unshift`** returning a *length*, but **`pop` / `shift`** returning an *element*
- **`reduce`** collapsing six numbers into one, with the running total visible at every step

Each animation ends by calling the real function from the exercise files and comparing it against
what the animation produced, then showing a ✓ badge. If the animation ever drifted from the code,
the badge would turn red and say so.

Two notes:

- Styling uses the **Tailwind Play CDN**, so the page needs an internet connection to look
  right. It is the CDN meant for demos and prototyping, not a compiled production build.
- There are no `<style>` blocks and no `style=""` attributes anywhere. Layout and colour are
  Tailwind utility classes in the markup; the handful of rules Tailwind cannot express
  (the `boxPop` keyframes and the reduced-motion overrides) live in `styles.css`, which is
  linked after the Tailwind script so it wins on conflicts.
- The `exercise*.js` files wrap their `module.exports` in a
  `typeof module !== "undefined"` guard so the exact same file runs in both Node and the browser.

## Notes

- **`for`** — you control the index and build the result array yourself.
- **`forEach`** — cleaner iteration, but it always returns `undefined`, so you still push into your own array.
- **`map`** — returns a brand new array of the same length; best fit when every input maps to one output.

### Array method reference (Exercise 5)

| Method | What it does | Returns |
| --- | --- | --- |
| `forEach()` | Runs a function for every element | Nothing (`undefined`) |
| `map()` | Creates a new transformed array | New array |
| `filter()` | Keeps only elements that match a condition | New array |
| `find()` | Finds the first matching element | One element or `undefined` |
| `includes()` | Checks if an element exists | `true` / `false` |
| `push()` | Adds to the end | New length |
| `pop()` | Removes the last element | Removed element |
| `shift()` | Removes the first element | Removed element |
| `unshift()` | Adds to the beginning | New length |
| `indexOf()` | Finds an element's index | Index or `-1` |
| `reduce()` | Combines all elements into one value | One single value |

`push`, `pop`, `shift`, and `unshift` **mutate** the original array. `map`, `filter`, `find`, `includes`, `indexOf`, and `reduce` do not.

In `exercise5.js` each method gets one small function that returns *exactly* what the method
returns, so the "Returns" column above can be read straight off the code:

| Function | Method it demonstrates |
| --- | --- |
| `printGrades(list)` | `forEach` |
| `toPercentages(list)` | `map` |
| `passingGrades(list)` | `filter` |
| `firstFailingGrade(list)` | `find` |
| `isEnrolled(list, name)` | `includes` |
| `positionOf(list, name)` | `indexOf` |
| `totalGrades(list)` | `reduce` |
| `addToEnd(list, name)` | `push` |
| `removeLast(list)` | `pop` |
| `removeFirst(list)` | `shift` |
| `addToStart(list, name)` | `unshift` |
