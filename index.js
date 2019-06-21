const { Obj } = require("@masaeedu/fp");

// # IMPLEMENTATION

// :: lens s a = { view: s -> a, update: s -> a -> s }

// :: extract {              } {         ..._ } = {                          }
// :: extract { [k]: l, ...x } { [k]: v, ...i } = { [l]: v, ...(extract x i) }

// :: r -> lens i (extract r i)
const extract = (() => {
  const view = Obj.match({
    Empty: _ => {},
    With: k => l => o => ({ [k]: v, ...x }) => ({ [l]: v, ...view(o)(x) })
  });

  const update = Obj.match({
    Empty: s => _ => s,
    With: k => l => o => ({ [k]: _, ...x }) => ({ [l]: v, ...y }) => ({
      [k]: v,
      ...update(o)(x)(y)
    })
  });

  return mapping => ({ view: view(mapping), update: update(mapping) });
})();

// # TEST
// The lens
// :: lens i (extract { foo: "bar" } i)
const { view, update } = extract({ foo: "bar" });

// The value we'll be viewing and updating
// :: { foo: 1, baz: "quux" }
const input = { foo: 1, baz: "quux" };

// prettier-ignore
const tests = [
  view(input),
  // => { bar: 1 }
  update(input)({ bar: 42 })
  // => { foo: 42, baz: "quux" }
];

console.log(tests);
