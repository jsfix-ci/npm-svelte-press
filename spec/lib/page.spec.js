const lib = require("../../lib/page").lib;

describe("page", () => {
  describe("_kebabCase", () => {
    it("should handle nothing", () => {
      expect(lib._kebabCase()).toEqual(undefined);
      expect(lib._kebabCase(null)).toEqual(null);
    });
    it("should handle a single word", () => {
      expect(lib._kebabCase("ABOUT")).toEqual("about");
      expect(lib._kebabCase("about")).toEqual("about");
      expect(lib._kebabCase("About")).toEqual("about");
    });
    it("should handle a simple phrase", () => {
      expect(lib._kebabCase("ABOUT LAST NIGHT")).toEqual("about-last-night");
      expect(lib._kebabCase("about last night")).toEqual("about-last-night");
      expect(lib._kebabCase("About Last Night")).toEqual("about-last-night");
      expect(lib._kebabCase("   About      Last      Night   ")).toEqual(
        "about-last-night"
      );
    });
    it("should handle a complex phrase", () => {
      expect(lib._kebabCase("2001: A Space Odyssey (1968)")).toEqual(
        "2001-a-space-odyssey-1968"
      );
      expect(lib._kebabCase("Where's the beef?")).toEqual("wheres-the-beef");
    });
    it("should handle a dash phrase", () => {
      const correct = "behind-the-scenes";
      expect(lib._kebabCase("Behind-The-Scenes")).toEqual(correct);
      expect(lib._kebabCase("Behind----The----Scenes")).toEqual(correct);
      expect(lib._kebabCase("Behind ---- The ---- Scenes")).toEqual(correct);
      expect(lib._kebabCase("-Behind-The-Scenes-")).toEqual(correct);
    });
  }); // _kebabCase

  describe("_pascalCase", () => {
    it("should handle nothing", () => {
      expect(lib._pascalCase()).toEqual(undefined);
      expect(lib._pascalCase(null)).toEqual(null);
    });
    it("should handle a single word", () => {
      const correct = "About";
      expect(lib._pascalCase("ABOUT")).toEqual(correct);
      expect(lib._pascalCase("about")).toEqual(correct);
      expect(lib._pascalCase("About")).toEqual(correct);
    });
    it("should handle a simple phrase", () => {
      const correct = "AboutLastNight";
      expect(lib._pascalCase("ABOUT LAST NIGHT")).toEqual(correct);
      expect(lib._pascalCase("about last night")).toEqual(correct);
      expect(lib._pascalCase("About Last Night")).toEqual(correct);
      expect(lib._pascalCase("   About      Last      Night   ")).toEqual(
        correct
      );
    });
    it("should handle a complex phrase", () => {
      const correct = "2001ASpaceOdyssey1968";
      expect(lib._pascalCase("2001: A Space Odyssey (1968)")).toEqual(correct);
    });
    it("should handle a complex phrase", () => {
      const correct = "WheresTheBeef";
      expect(lib._pascalCase("Where's the beef?")).toEqual(correct);
    });
    it("should handle a dash phrase", () => {
      const correct = "BehindTheScenes";
      expect(lib._pascalCase("Behind-The-Scenes")).toEqual(correct);
      expect(lib._pascalCase("Behind----The----Scenes")).toEqual(correct);
      expect(lib._pascalCase("Behind ----  The ---- Scenes")).toEqual(correct);
      expect(lib._pascalCase("-Behind-The-Scenes-")).toEqual(correct);
    });
  }); // _kebabCase
}); // page
