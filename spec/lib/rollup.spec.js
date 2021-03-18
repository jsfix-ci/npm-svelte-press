const lib = require("../../lib/rollup");

describe("rollup", () => {
  it("should work", () => {
    expect(Object.keys(lib)).toEqual(["_transform", "build"]);
  });
}); // rollup
