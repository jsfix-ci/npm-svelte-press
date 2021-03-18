const lib = require("../../lib/copyFile").lib;

describe("copyFile", () => {
  it("should work", () => {
    expect(Object.keys(lib.copyFile)).toEqual(["lib"]);
  });
}); // copyFile
