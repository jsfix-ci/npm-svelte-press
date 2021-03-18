const lib = require("../../lib/crawlDirectory").lib;

describe("crawlDirectory", () => {
  it("should work", () => {
    expect(Object.keys(lib.crawlDirectory)).toEqual(["lib"]);
  });
}); // crawlDirectory
