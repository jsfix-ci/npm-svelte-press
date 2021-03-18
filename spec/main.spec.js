const lib = require("../main").lib;

describe("main", () => {
  it("should work", () => {
    expect(Object.keys(lib.main)).toEqual(["lib"]);
  });
}); // main
