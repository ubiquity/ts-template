import { checkFileNames } from "./kebab-case";
import { expect, describe, beforeEach, it } from "@jest/globals";

jest.mock("fs", () => ({
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
}));

const NON_COMPLIANT_FILE = "NonCompliantFile.ts";
const COMPLIANT_FILE = "compliant-file.ts";
const COMPLIANT_FILE2 = "another-compliant-file.ts";
const TEST_FILE = "example.test.ts";

describe("checkFileNames", () => {
  const gitignoreContent = `# macOS\n.DS_Store\n# node\nnode_modules\n# yarn2\n.yarn\n.pnp.cjs\n.pnp.loader.mjs\n.env\nstatic/dist`;
  const dir = "some-dir";
  const readDir = jest.fn();
  const readFile = jest.fn();
  const ignorePatterns: string[] = [];

  const options = { readDir, readFile, ignorePatterns };

  beforeEach(() => {
    readDir.mockClear();
    readFile.mockClear();
    readDir.mockResolvedValue([COMPLIANT_FILE, NON_COMPLIANT_FILE, COMPLIANT_FILE2, ".env", TEST_FILE]);
    readFile.mockResolvedValue(gitignoreContent);
  });

  it("should detect non-kebab-case file names, excluding ignored ones and test files", async () => {
    const nonCompliantFiles = await checkFileNames(dir, options);
    expect(nonCompliantFiles).toEqual([NON_COMPLIANT_FILE]);
  });

  it("should ignore files listed in .gitignore and test files", async () => {
    const nonCompliantFiles = await checkFileNames(dir, options);
    // Expect to only get the non-kebab-case file, ignoring .env (from .gitignore) and the test file
    expect(nonCompliantFiles).toEqual([NON_COMPLIANT_FILE]);
    expect(readFile).toHaveBeenCalledWith(".gitignore", "utf8");
  });

  it("should ignore all styling patterns", async () => {
    const badNames = ["camelCase.ts", "PascalCase.ts", "snake_case.ts", "UPPER_CASE.ts", "dot.case.ts", "space case.ts", "Title Case.ts", "Sentence case.ts"];
    readDir.mockResolvedValue([...badNames, COMPLIANT_FILE]);
    const nonCompliantFiles = await checkFileNames(dir, options);
    expect(nonCompliantFiles).toEqual(badNames);
    expect(readFile).toHaveBeenCalledWith(".gitignore", "utf8");
  });

  it("should properly handle empty directory", async () => {
    readDir.mockResolvedValue([]);
    const nonCompliantFiles = await checkFileNames(dir, { readDir, readFile, ignorePatterns });
    expect(nonCompliantFiles).toEqual([]);
  });

  it("should handle readDir error", async () => {
    readDir.mockRejectedValue(new Error("readDir error"));
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    const nonCompliantFiles = await checkFileNames(dir, options);
    expect(nonCompliantFiles).toEqual([]);
    expect(consoleError).toHaveBeenCalledWith("Error reading directory:", new Error("readDir error"));
    consoleError.mockRestore();
  });
});
