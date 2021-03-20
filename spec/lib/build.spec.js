const lib = require("../../lib/build").lib;

describe("build", () => {
  it("should work", () => {
    expect(Object.keys(lib.build)).toEqual(["lib"]);
  });
}); // build
