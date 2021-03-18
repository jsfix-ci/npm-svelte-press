const lib = require("../../lib/indexPage");

describe("indexPage", () => {
  it("should work", () => {
    expect(Object.keys(lib)).toEqual(["_generate", "_includeCss", "create"]);
  });
}); // indexPage
