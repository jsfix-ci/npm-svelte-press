const lib = require("../../lib/fileSystem");

describe("fileSystem", () => {
  it("should work", () => {
    expect(Object.keys(lib)).toEqual([
      "_caseInsensitive",
      "copy",
      "dirNames",
      "fileNames",
      "list",
      "mkdir",
      "parse",
      "read",
      "removeDir",
      "removeFile",
      "write",
    ]);
  });
}); // fileSystem
