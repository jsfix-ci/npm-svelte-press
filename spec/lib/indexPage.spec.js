const lib = require("../../lib/indexPage").lib;

describe("indexPage", () => {
  it("should work", () => {
    expect(Object.keys(lib.indexPage)).toEqual(["lib"]);
  });
}); // indexPage
