// Animated visualizer for the exercises.
//
// Every scenario below is pre-built into a list of "frames". A frame is a full
// snapshot of what the screen should look like at one moment: which boxes exist,
// which one is highlighted, what the note says, which line of code is running.
// Play/Step/Reset just move an index through that list, so stepping backwards
// and forwards is always consistent.
//
// Wrapped in an IIFE so none of these names leak into the global scope shared by
// exercise1-5.js (that shared scope is exactly what caused the redeclaration bug).

(function () {
  "use strict";

  // ---------------------------------------------------------------- helpers

  // Show a value the way you would write it in code: strings keep their quotes.
  function fmt(value) {
    if (typeof value === "string") return '"' + value + '"';
    return String(value);
  }

  function box(item) {
    const styles = {
      idle: "border-slate-300 bg-white text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100",
      active: "border-indigo-500 bg-indigo-50 text-indigo-900 ring-4 ring-indigo-200 scale-110 dark:bg-indigo-950 dark:text-indigo-100 dark:ring-indigo-900/70",
      done: "border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500",
      kept: "border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200",
      fresh: "border-emerald-400 bg-emerald-50 text-emerald-800 box-pop dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200",
      dropped: "border-rose-300 bg-rose-50 text-rose-400 line-through dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400",
      leaving: "border-rose-400 bg-rose-100 text-rose-700 scale-90 opacity-60 line-through dark:border-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
      untouched: "border-dashed border-slate-300 bg-transparent text-slate-400 dark:border-slate-700 dark:text-slate-600",
    };
    const label =
      item.i === undefined
        ? ""
        : `<span class="mt-1 block text-center text-[10px] font-normal text-slate-400 dark:text-slate-600">${item.i}</span>`;
    return `<div class="shrink-0">
      <div class="flex h-12 min-w-[3.5rem] items-center justify-center rounded-lg border-2 px-3 font-mono text-sm font-semibold transition-all duration-300 ${styles[item.mark] || styles.idle}">${item.v}</div>
      ${label}
    </div>`;
  }

  // A frame is just data — deep-copied so later mutations cannot rewrite history.
  function snap(state) {
    return {
      source: state.source.map((o) => ({ ...o })),
      output: state.output.map((o) => ({ ...o })),
      log: state.log.slice(),
      note: state.note,
      line: state.line,
      ret: state.ret === undefined ? null : state.ret,
      extra: state.extra || null,
    };
  }

  function indexed(values, mark) {
    return values.map((v, i) => ({ v: fmt(v), mark: mark || "idle", i }));
  }

  function reindex(list) {
    list.forEach((item, i) => (item.i = i));
    return list;
  }

  // ---------------------------------------------------------------- scenarios
  //
  // Each scenario returns { frames, verify }. `verify` re-runs the REAL function
  // from the exercise files and compares it to what the animation ended up with,
  // so the animation cannot silently drift away from the code it is explaining.

  const scenarios = {};

  function register(id, config) {
    scenarios[id] = config;
  }

  // ---- Exercise 1: three ways to do the same thing ----

  register("ex1-for", {
    group: "Exercise 1 — powers of two",
    label: "for loop",
    outputLabel: "result (you build it)",
    code: [
      "const result = [];",
      "for (let i = 0; i < numbers.length; i++) {",
      "    result.push(Math.pow(2, numbers[i]));",
      "}",
      "return result;",
    ],
    build() {
      const input = [1, 2, 3];
      const state = {
        source: indexed(input),
        output: [],
        log: [],
        note: "The result array starts empty. We control the index ourselves.",
        line: 0,
      };
      const frames = [snap(state)];

      input.forEach((value, i) => {
        state.source.forEach((s, j) => (s.mark = j < i ? "done" : "idle"));
        state.source[i].mark = "active";
        state.line = 1;
        state.extra = `i = ${i}`;
        state.note = `i is ${i}, so numbers[${i}] is ${value}. ${i} < ${input.length} is true, so the loop body runs.`;
        frames.push(snap(state));

        state.line = 2;
        state.output.push({ v: fmt(2 ** value), mark: "fresh" });
        reindex(state.output);
        state.note = `Math.pow(2, ${value}) = ${2 ** value}. We push it onto result ourselves.`;
        frames.push(snap(state));
        state.output[state.output.length - 1].mark = "kept";
      });

      state.source.forEach((s) => (s.mark = "done"));
      state.line = 4;
      state.extra = `i = ${input.length}`;
      state.note = `i is now ${input.length}, so ${input.length} < ${input.length} is false — the loop stops and we return result.`;
      state.ret = "[2, 4, 8]";
      frames.push(snap(state));

      return {
        frames,
        verify: () => ({
          animation: state.output.map((o) => Number(o.v)),
          real: powersOfTwoForLoop(input),
          call: "powersOfTwoForLoop([1, 2, 3])",
        }),
      };
    },
  });

  register("ex1-forEach", {
    group: "Exercise 1 — powers of two",
    label: "forEach",
    outputLabel: "result (you still build it)",
    code: [
      "const result = [];",
      "numbers.forEach(function (number) {",
      "  result.push(Math.pow(2, number));",
      "});",
      "return result;",
    ],
    build() {
      const input = [1, 2, 3];
      const state = {
        source: indexed(input),
        output: [],
        log: [],
        note: "forEach hands us one element at a time — no index to manage.",
        line: 0,
      };
      const frames = [snap(state)];

      input.forEach((value, i) => {
        state.source.forEach((s, j) => (s.mark = j < i ? "done" : "idle"));
        state.source[i].mark = "active";
        state.line = 1;
        state.note = `forEach calls the function with number = ${value}.`;
        frames.push(snap(state));

        state.line = 2;
        state.output.push({ v: fmt(2 ** value), mark: "fresh" });
        reindex(state.output);
        state.note = `Math.pow(2, ${value}) = ${2 ** value}, pushed onto result.`;
        frames.push(snap(state));
        state.output[state.output.length - 1].mark = "kept";
      });

      state.source.forEach((s) => (s.mark = "done"));
      state.line = 4;
      state.note =
        "forEach itself returned undefined — the only reason we have an array is that we built it by hand.";
      state.ret = "[2, 4, 8]  (forEach returned undefined)";
      frames.push(snap(state));

      return {
        frames,
        verify: () => ({
          animation: state.output.map((o) => Number(o.v)),
          real: powersOfTwoForEach(input),
          call: "powersOfTwoForEach([1, 2, 3])",
        }),
      };
    },
  });

  register("ex1-map", {
    group: "Exercise 1 — powers of two",
    label: "map",
    outputLabel: "new array (map builds it)",
    code: ["return numbers.map(function (number) {", "  return Math.pow(2, number);", "});"],
    build() {
      const input = [1, 2, 3];
      const state = {
        source: indexed(input),
        output: [],
        log: [],
        note: "map creates the new array for us. We only say how one element becomes another.",
        line: 0,
      };
      const frames = [snap(state)];

      input.forEach((value, i) => {
        state.source.forEach((s, j) => (s.mark = j < i ? "done" : "idle"));
        state.source[i].mark = "active";
        state.line = 1;
        state.note = `number = ${value}`;
        frames.push(snap(state));

        state.output.push({ v: fmt(2 ** value), mark: "fresh" });
        reindex(state.output);
        state.note = `Returning Math.pow(2, ${value}) = ${2 ** value}. map drops it into the new array at the same index.`;
        frames.push(snap(state));
        state.output[state.output.length - 1].mark = "kept";
      });

      state.source.forEach((s) => (s.mark = "done"));
      state.line = 2;
      state.note =
        "Same length in, same length out — that is the promise of map. The original array was never touched.";
      state.ret = "[2, 4, 8]";
      frames.push(snap(state));

      return {
        frames,
        verify: () => ({
          animation: state.output.map((o) => Number(o.v)),
          real: powersOfTwoMap(input),
          call: "powersOfTwoMap([1, 2, 3])",
        }),
      };
    },
  });

  // ---- Exercise 2 ----

  register("ex2", {
    group: "Exercise 2 — even / odd / N/A",
    label: "map with a guard",
    outputLabel: "new array",
    code: [
      "return values.map(function (value) {",
      '  if (typeof value !== "number" || Number.isNaN(value)) return "N/A";',
      '  return value % 2 === 0 ? "even" : "odd";',
      "});",
    ],
    build() {
      const input = [1, 2, 3, "Rawan"];
      const state = {
        source: indexed(input),
        output: [],
        log: [],
        note: "Four elements — but one of them is not a number.",
        line: 0,
      };
      const frames = [snap(state)];

      input.forEach((value, i) => {
        state.source.forEach((s, j) => (s.mark = j < i ? "done" : "idle"));
        state.source[i].mark = "active";
        const isNumber = typeof value === "number" && !Number.isNaN(value);
        state.line = 1;
        state.note = isNumber
          ? `typeof ${fmt(value)} is "number", so the guard does not fire.`
          : `typeof ${fmt(value)} is "${typeof value}", not "number" — the guard fires.`;
        frames.push(snap(state));

        const result = isNumber ? (value % 2 === 0 ? "even" : "odd") : "N/A";
        if (isNumber) {
          state.line = 2;
          state.note = `${value} % 2 is ${value % 2}, so this element is "${result}".`;
          frames.push(snap(state));
        }
        state.output.push({ v: fmt(result), mark: "fresh" });
        reindex(state.output);
        state.note = `"${result}" goes into the new array at index ${i}.`;
        frames.push(snap(state));
        state.output[state.output.length - 1].mark = "kept";
      });

      state.source.forEach((s) => (s.mark = "done"));
      state.line = 3;
      state.note =
        "Still four elements out. map never skips anything — every input produces exactly one output.";
      state.ret = '["odd", "even", "odd", "N/A"]';
      frames.push(snap(state));

      return {
        frames,
        verify: () => ({
          animation: state.output.map((o) => JSON.parse(o.v)),
          real: evenOrOdd(input),
          call: 'evenOrOdd([1, 2, 3, "Rawan"])',
        }),
      };
    },
  });

  // ---- Exercise 3 ----

  register("ex3", {
    group: "Exercise 3 — the names",
    label: "forEach prints each name",
    outputLabel: null,
    logLabel: "console output",
    code: ["list.forEach(function (name) {", "  console.log(name);", "});"],
    build() {
      const input = names; // the real array from exercise3.js
      const state = {
        source: indexed(input),
        output: [],
        log: [],
        note: "forEach visits every element once, in order, and never skips.",
        line: 0,
      };
      const frames = [snap(state)];

      input.forEach((value, i) => {
        state.source.forEach((s, j) => (s.mark = j < i ? "done" : "idle"));
        state.source[i].mark = "active";
        state.line = 1;
        state.log.push(value);
        state.note = `console.log("${value}") — printed, but nothing is collected.`;
        frames.push(snap(state));
      });

      state.source.forEach((s) => (s.mark = "done"));
      state.line = 2;
      state.note =
        "All six printed. forEach returns undefined, so if you want an array back you must push into one yourself (that is what getNames does).";
      state.ret = "undefined";
      frames.push(snap(state));

      return {
        frames,
        verify: () => ({
          animation: state.log,
          real: getNames(names),
          call: "getNames(names)",
        }),
      };
    },
  });

  // ---- Exercise 4 ----

  register("ex4", {
    group: "Exercise 4 — FizzBuzz",
    label: "map with four rules",
    outputLabel: "new array",
    code: [
      "return numbers.map(function (number) {",
      '  if (n % 3 === 0 && n % 5 === 0) return "Fizz Buzz";',
      '  if (n % 3 === 0) return "Fizz";',
      '  if (n % 5 === 0) return "Buzz";',
      "  return number;",
      "});",
    ],
    build() {
      const input = [1, 3, 5, 15];
      const state = {
        source: indexed(input),
        output: [],
        log: [],
        note: "Watch 15 in particular — it is why the order of the checks matters.",
        line: 0,
      };
      const frames = [snap(state)];

      input.forEach((value, i) => {
        state.source.forEach((s, j) => (s.mark = j < i ? "done" : "idle"));
        state.source[i].mark = "active";

        const by3 = value % 3 === 0;
        const by5 = value % 5 === 0;
        let result, line, why;
        if (by3 && by5) {
          result = "Fizz Buzz";
          line = 1;
          why = `${value} is divisible by 3 AND 5 — this check is first, so it wins.`;
        } else if (by3) {
          result = "Fizz";
          line = 2;
          why = `${value} % 3 is 0 but ${value} % 5 is ${value % 5} → "Fizz".`;
        } else if (by5) {
          result = "Buzz";
          line = 3;
          why = `${value} % 5 is 0 but ${value} % 3 is ${value % 3} → "Buzz".`;
        } else {
          result = value;
          line = 4;
          why = `${value} is divisible by neither, so the number itself is returned.`;
        }

        state.line = line;
        state.note = why;
        frames.push(snap(state));

        state.output.push({ v: fmt(result), mark: "fresh" });
        reindex(state.output);
        state.note = `${fmt(result)} added to the output array.`;
        frames.push(snap(state));
        state.output[state.output.length - 1].mark = "kept";
      });

      state.source.forEach((s) => (s.mark = "done"));
      state.line = 5;
      state.note =
        'If the "divisible by both" check came last, 15 would stop at "Fizz" and never reach it.';
      state.ret = '[1, "Fizz", "Buzz", "Fizz Buzz"]';
      frames.push(snap(state));

      return {
        frames,
        verify: () => ({
          animation: state.output.map((o) => JSON.parse(o.v)),
          real: fizzbuzz(input),
          call: "fizzbuzz([1, 3, 5, 15])",
        }),
      };
    },
  });

  // ---- Exercise 5: the methods ----

  register("m-filter", {
    group: "Exercise 5 — array methods",
    label: "filter() — keeps some",
    outputLabel: "new array (only what passed)",
    code: ["return list.filter(function (grade) {", "  return grade >= 60;", "});"],
    build() {
      const input = grades;
      const state = {
        source: indexed(input),
        output: [],
        log: [],
        note: "filter asks a yes/no question about every element.",
        line: 0,
      };
      const frames = [snap(state)];

      input.forEach((value, i) => {
        state.source.forEach((s, j) => {
          if (s.mark === "active") s.mark = input[j] >= 60 ? "done" : "dropped";
        });
        state.source[i].mark = "active";
        const passes = value >= 60;
        state.line = 1;
        state.note = `${value} >= 60 is ${passes} — ${passes ? "keep it" : "drop it"}.`;
        frames.push(snap(state));

        if (passes) {
          state.output.push({ v: fmt(value), mark: "fresh" });
          reindex(state.output);
          state.note = `${value} passed, so it is copied into the new array.`;
          frames.push(snap(state));
          state.output[state.output.length - 1].mark = "kept";
          state.source[i].mark = "done";
        } else {
          state.source[i].mark = "dropped";
          state.note = `${value} failed the test — it simply never appears in the result.`;
          frames.push(snap(state));
        }
      });

      state.line = 2;
      state.note = `Six went in, ${state.output.length} came out. That is the difference from map: filter can change the length.`;
      state.ret = "[88, 92, 60, 75]";
      frames.push(snap(state));

      return {
        frames,
        verify: () => ({
          animation: state.output.map((o) => Number(o.v)),
          real: passingGrades(grades),
          call: "passingGrades(grades)",
        }),
      };
    },
  });

  register("m-find", {
    group: "Exercise 5 — array methods",
    label: "find() — stops early",
    outputLabel: null,
    code: ["return list.find(function (grade) {", "  return grade < 60;", "});"],
    build() {
      const input = grades;
      const state = {
        source: indexed(input),
        output: [],
        log: [],
        note: "find looks for the FIRST match and then stops. Watch how much it never reads.",
        line: 0,
      };
      const frames = [snap(state)];

      let found;
      let stopIndex = -1;
      for (let i = 0; i < input.length; i++) {
        state.source.forEach((s, j) => {
          if (j < i) s.mark = "done";
          else if (j > i) s.mark = "idle";
        });
        state.source[i].mark = "active";
        const match = input[i] < 60;
        state.line = 1;
        state.note = `${input[i]} < 60 is ${match}.`;
        frames.push(snap(state));
        if (match) {
          found = input[i];
          stopIndex = i;
          break;
        }
      }

      state.source.forEach((s, j) => {
        if (j < stopIndex) s.mark = "done";
        else if (j === stopIndex) s.mark = "kept";
        else s.mark = "untouched";
      });
      state.line = 2;
      state.note = `Match found at index ${stopIndex}. The dashed boxes were never even looked at — find returns immediately.`;
      state.ret = String(found);
      frames.push(snap(state));

      return {
        frames,
        verify: () => ({
          animation: found,
          real: firstFailingGrade(grades),
          call: "firstFailingGrade(grades)",
        }),
      };
    },
  });

  register("m-includes", {
    group: "Exercise 5 — array methods",
    label: "includes() — true / false",
    outputLabel: null,
    code: ['return list.includes(name);'],
    build() {
      const target = "Hind";
      const state = {
        source: indexed(students),
        output: [],
        log: [],
        note: `Looking for ${fmt(target)}. includes only answers yes or no.`,
        line: 0,
      };
      const frames = [snap(state)];

      let stopIndex = -1;
      for (let i = 0; i < students.length; i++) {
        state.source.forEach((s, j) => {
          if (j < i) s.mark = "done";
          else if (j > i) s.mark = "idle";
        });
        state.source[i].mark = "active";
        const match = students[i] === target;
        state.note = `${fmt(students[i])} === ${fmt(target)} → ${match}`;
        frames.push(snap(state));
        if (match) {
          stopIndex = i;
          break;
        }
      }

      state.source.forEach((s, j) => {
        if (j < stopIndex) s.mark = "done";
        else if (j === stopIndex) s.mark = "kept";
        else s.mark = "untouched";
      });
      state.note =
        "Found it, so it stops. Note what you get back: just true — not the element, not its position.";
      state.ret = "true";
      frames.push(snap(state));

      return {
        frames,
        verify: () => ({
          animation: true,
          real: isEnrolled(students, target),
          call: 'isEnrolled(students, "Hind")',
        }),
      };
    },
  });

  register("m-indexOf", {
    group: "Exercise 5 — array methods",
    label: "indexOf() — index or -1",
    outputLabel: null,
    code: ['return list.indexOf(name);'],
    build() {
      const target = "Esraa";
      const state = {
        source: indexed(students),
        output: [],
        log: [],
        note: `Same scan as includes, but this one reports WHERE it found ${fmt(target)}.`,
        line: 0,
      };
      const frames = [snap(state)];

      let stopIndex = -1;
      for (let i = 0; i < students.length; i++) {
        state.source.forEach((s, j) => {
          if (j < i) s.mark = "done";
          else if (j > i) s.mark = "idle";
        });
        state.source[i].mark = "active";
        const match = students[i] === target;
        state.note = `index ${i}: ${fmt(students[i])} === ${fmt(target)} → ${match}`;
        frames.push(snap(state));
        if (match) {
          stopIndex = i;
          break;
        }
      }

      state.source.forEach((s, j) => (s.mark = j === stopIndex ? "kept" : j < stopIndex ? "done" : "untouched"));
      state.note = `Returns ${stopIndex}. If the name were missing you would get -1 — which is why you compare against -1 instead of checking for a falsy value (0 is a real index!).`;
      state.ret = String(stopIndex);
      frames.push(snap(state));

      return {
        frames,
        verify: () => ({
          animation: stopIndex,
          real: positionOf(students, target),
          call: 'positionOf(students, "Esraa")',
        }),
      };
    },
  });

  register("m-reduce", {
    group: "Exercise 5 — array methods",
    label: "reduce() — many into one",
    outputLabel: "total so far (the accumulator)",
    code: [
      "return list.reduce(function (total, grade) {",
      "  return total + grade;",
      "}, 0);",
    ],
    build() {
      const input = grades;
      const state = {
        source: indexed(input),
        output: [{ v: "0", mark: "fresh" }],
        log: [],
        note: "reduce starts from the 0 we passed in. That single box is the running total.",
        line: 0,
      };
      const frames = [snap(state)];
      state.output[0].mark = "kept";

      let total = 0;
      input.forEach((value, i) => {
        state.source.forEach((s, j) => (s.mark = j < i ? "done" : "idle"));
        state.source[i].mark = "active";
        state.line = 1;
        state.note = `total is ${total}, grade is ${value}. Returning ${total} + ${value}.`;
        frames.push(snap(state));

        total = total + value;
        state.output[0] = { v: String(total), mark: "fresh" };
        state.note = `That returned value becomes the new total: ${total}.`;
        frames.push(snap(state));
        state.output[0].mark = "kept";
      });

      state.source.forEach((s) => (s.mark = "done"));
      state.line = 2;
      state.note =
        "Six numbers went in and ONE number came out. That is what makes reduce different from map and filter, which both hand back an array.";
      state.ret = String(total);
      frames.push(snap(state));

      return {
        frames,
        verify: () => ({
          animation: total,
          real: totalGrades(grades),
          call: "totalGrades(grades)",
        }),
      };
    },
  });

  // Mutating methods — the array itself changes, so there is no second row.

  function mutatorScenario({ id, label, code, note, apply, verify }) {
    register(id, {
      group: "Exercise 5 — methods that CHANGE the array",
      label,
      outputLabel: null,
      mutates: true,
      code: [code],
      build() {
        const working = [...students];
        const state = {
          source: indexed(working),
          output: [],
          log: [],
          note,
          line: 0,
        };
        const frames = [snap(state)];
        const result = apply(state, working, frames);
        return { frames, verify: () => verify(result, working) };
      },
    });
  }

  mutatorScenario({
    id: "m-push",
    label: "push() — add to the end",
    code: 'students.push("Layan");',
    note: "Six elements. push adds to the END and hands back the new length.",
    apply(state, working, frames) {
      working.push("Layan");
      state.source.push({ v: fmt("Layan"), mark: "fresh", i: state.source.length });
      state.note = '"Layan" is appended at index 5 — the existing boxes do not move at all.';
      frames.push(snap(state));

      state.source[state.source.length - 1].mark = "kept";
      state.note =
        "push returns 7, the NEW LENGTH — not the array, and not the element you added. This trips people up constantly.";
      state.ret = "7";
      frames.push(snap(state));
      return 7;
    },
    verify(result, working) {
      const copy = [...students];
      const realLength = addToEnd(copy, "Layan");
      return {
        animation: { length: result, list: working },
        real: { length: realLength, list: copy },
        call: 'addToEnd(copy, "Layan")',
      };
    },
  });

  mutatorScenario({
    id: "m-pop",
    label: "pop() — remove the last",
    code: "students.pop();",
    note: "pop takes the LAST element off and gives you that element back.",
    apply(state, working, frames) {
      const last = state.source[state.source.length - 1];
      last.mark = "leaving";
      state.note = `${last.v} is the last element — it is on its way out.`;
      frames.push(snap(state));

      const removed = working.pop();
      state.source.pop();
      reindex(state.source);
      state.note = "The array is now shorter. Nothing else had to move.";
      frames.push(snap(state));

      state.note =
        "pop returns the removed element itself. Compare that with push, which returns a number — the pair is not symmetrical.";
      state.ret = fmt(removed);
      frames.push(snap(state));
      return removed;
    },
    verify(result, working) {
      const copy = [...students];
      const realRemoved = removeLast(copy);
      return {
        animation: { removed: result, list: working },
        real: { removed: realRemoved, list: copy },
        call: "removeLast(copy)",
      };
    },
  });

  mutatorScenario({
    id: "m-shift",
    label: "shift() — remove the first",
    code: "students.shift();",
    note: "shift removes from the FRONT — which means every other element has to slide down.",
    apply(state, working, frames) {
      const first = state.source[0];
      first.mark = "leaving";
      state.note = `${first.v} sits at index 0 and is being removed.`;
      frames.push(snap(state));

      const removed = working.shift();
      state.source.shift();
      reindex(state.source);
      state.source.forEach((s) => (s.mark = "fresh"));
      state.note =
        "Look at the index labels: every remaining element got a new index. Wesam was 1, now it is 0.";
      frames.push(snap(state));

      state.source.forEach((s) => (s.mark = "idle"));
      state.note =
        "That renumbering is why shift is slower than pop on big arrays — the whole array is reindexed.";
      state.ret = fmt(removed);
      frames.push(snap(state));
      return removed;
    },
    verify(result, working) {
      const copy = [...students];
      const realRemoved = removeFirst(copy);
      return {
        animation: { removed: result, list: working },
        real: { removed: realRemoved, list: copy },
        call: "removeFirst(copy)",
      };
    },
  });

  mutatorScenario({
    id: "m-unshift",
    label: "unshift() — add to the front",
    code: 'students.unshift("Layan");',
    note: "unshift is the opposite of shift: it inserts at the front and pushes everyone up.",
    apply(state, working, frames) {
      working.unshift("Layan");
      state.source.unshift({ v: fmt("Layan"), mark: "fresh" });
      reindex(state.source);
      state.note =
        '"Layan" takes index 0, and every original element moved one slot to the right.';
      frames.push(snap(state));

      state.source.forEach((s) => (s.mark = "idle"));
      state.source[0].mark = "kept";
      state.note =
        "Like push, unshift returns the new length — 7. Not the array, not the element.";
      state.ret = "7";
      frames.push(snap(state));
      return 7;
    },
    verify(result, working) {
      const copy = [...students];
      const realLength = addToStart(copy, "Layan");
      return {
        animation: { length: result, list: working },
        real: { length: realLength, list: copy },
        call: 'addToStart(copy, "Layan")',
      };
    },
  });

  // ---------------------------------------------------------------- player

  const els = {
    select: document.getElementById("viz-select"),
    play: document.getElementById("viz-play"),
    step: document.getElementById("viz-step"),
    back: document.getElementById("viz-back"),
    reset: document.getElementById("viz-reset"),
    speed: document.getElementById("viz-speed"),
    code: document.getElementById("viz-code"),
    source: document.getElementById("viz-source"),
    sourceLabel: document.getElementById("viz-source-label"),
    output: document.getElementById("viz-output"),
    outputLabel: document.getElementById("viz-output-label"),
    outputWrap: document.getElementById("viz-output-wrap"),
    log: document.getElementById("viz-log"),
    logWrap: document.getElementById("viz-log-wrap"),
    note: document.getElementById("viz-note"),
    ret: document.getElementById("viz-ret"),
    progress: document.getElementById("viz-progress"),
    verify: document.getElementById("viz-verify"),
    extra: document.getElementById("viz-extra"),
  };

  // If the markup is missing, do nothing rather than throwing.
  if (!els.select) return;

  let current = null; // { config, frames, verify }
  let index = 0;
  let timer = null;

  function load(id) {
    stop();
    const config = scenarios[id];
    const built = config.build();
    current = { config, frames: built.frames, verify: built.verify };
    index = 0;
    // Keep the dropdown in step, in case load() was called from somewhere else.
    els.select.value = id;
    els.code.innerHTML = config.code
      .map(
        (line, i) =>
          `<div data-line="${i}" class="whitespace-pre rounded px-2 py-0.5 transition-colors duration-200">${escapeHTML(line) || "&nbsp;"}</div>`
      )
      .join("");
    els.outputWrap.classList.toggle("hidden", !config.outputLabel);
    els.outputLabel.textContent = config.outputLabel || "";
    els.logWrap.classList.toggle("hidden", !config.logLabel);
    if (config.logLabel) els.logWrap.querySelector("p").textContent = config.logLabel;
    els.sourceLabel.textContent = config.mutates
      ? "the array itself (this one gets changed)"
      : "input array (never modified)";
    render();
  }

  function escapeHTML(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function render() {
    const frame = current.frames[index];

    els.source.innerHTML = frame.source.map(box).join("");
    els.output.innerHTML = frame.output.length
      ? frame.output.map(box).join("")
      : '<p class="py-3 text-sm italic text-slate-400 dark:text-slate-600">empty so far</p>';
    els.log.innerHTML = frame.log.length
      ? frame.log.map((line) => `<div class="font-mono text-sm">${escapeHTML(String(line))}</div>`).join("")
      : '<p class="text-sm italic text-slate-400 dark:text-slate-600">nothing printed yet</p>';

    els.note.textContent = frame.note;
    els.extra.textContent = frame.extra || "";
    els.extra.classList.toggle("hidden", !frame.extra);

    els.code.querySelectorAll("[data-line]").forEach((el) => {
      const active = Number(el.dataset.line) === frame.line;
      el.className =
        "whitespace-pre rounded px-2 py-0.5 transition-colors duration-200 " +
        (active
          ? "bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-500/40"
          : "text-slate-400");
    });

    if (frame.ret !== null) {
      els.ret.classList.remove("hidden");
      els.ret.innerHTML = `<span class="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">returns</span> <code class="ml-2 font-mono text-sm">${escapeHTML(frame.ret)}</code>`;
    } else {
      els.ret.classList.add("hidden");
    }

    els.progress.textContent = `step ${index + 1} / ${current.frames.length}`;

    // Only claim a match once the animation has actually finished.
    if (index === current.frames.length - 1) {
      const check = current.verify();
      const ok = JSON.stringify(check.animation) === JSON.stringify(check.real);
      els.verify.classList.remove("hidden");
      els.verify.className = ok
        ? "mt-3 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
        : "mt-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300";
      els.verify.innerHTML = ok
        ? `✓ This animation matches what <code class="font-mono">${escapeHTML(check.call)}</code> really returns.`
        : `✗ Mismatch — the animation says <code class="font-mono">${escapeHTML(JSON.stringify(check.animation))}</code> but <code class="font-mono">${escapeHTML(check.call)}</code> returns <code class="font-mono">${escapeHTML(JSON.stringify(check.real))}</code>.`;
    } else {
      els.verify.classList.add("hidden");
    }
  }

  function stepForward() {
    if (index < current.frames.length - 1) {
      index++;
      render();
      return true;
    }
    stop();
    return false;
  }

  function stepBack() {
    stop();
    if (index > 0) {
      index--;
      render();
    }
  }

  function play() {
    if (timer) return stop();
    if (index === current.frames.length - 1) index = 0;
    els.play.textContent = "Pause";
    timer = setInterval(() => {
      if (!stepForward()) stop();
    }, Number(els.speed.value));
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    if (els.play) els.play.textContent = "Play";
  }

  // Build the dropdown, grouped.
  const groups = {};
  Object.keys(scenarios).forEach((id) => {
    const group = scenarios[id].group;
    (groups[group] = groups[group] || []).push(id);
  });
  Object.keys(groups).forEach((group) => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = group;
    groups[group].forEach((id) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = scenarios[id].label;
      optgroup.appendChild(option);
    });
    els.select.appendChild(optgroup);
  });

  els.select.addEventListener("change", () => load(els.select.value));
  els.play.addEventListener("click", play);
  els.step.addEventListener("click", () => {
    stop();
    stepForward();
  });
  els.back.addEventListener("click", stepBack);
  els.reset.addEventListener("click", () => {
    stop();
    index = 0;
    render();
  });
  els.speed.addEventListener("change", () => {
    if (timer) {
      stop();
      play();
    }
  });

  // Expose a tiny hook so the page can be checked automatically.
  window.__viz = {
    ids: () => Object.keys(scenarios),
    runToEnd(id) {
      load(id);
      index = current.frames.length - 1;
      render();
      const check = current.verify();
      return {
        id,
        steps: current.frames.length,
        ok: JSON.stringify(check.animation) === JSON.stringify(check.real),
        call: check.call,
      };
    },
  };

  load(els.select.value || Object.keys(scenarios)[0]);
})();
