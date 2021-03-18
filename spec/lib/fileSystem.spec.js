const lib = require("../../lib/fileSystem");

describe("fileSystem", () => {
  it("should work", () => {
    expect(Object.keys(lib)).toEqual([
      "_caseInsensitive",
      "copy",
      "dirNames",
      "exists",
      "fileNames",
      "list",
      "mkdir",
      "missing",
      "parse",
      "read",
      "removeDir",
      "removeFile",
      "write",
    ]);
  });
}); // fileSystem
