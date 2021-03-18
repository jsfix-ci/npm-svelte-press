const lib = require("../../lib/transformRollup").lib;

describe("transformRollup", () => {
  it("should work", () => {
    expect(Object.keys(lib.transformRollup)).toEqual(["lib"]);
  });
}); // transformRollup
