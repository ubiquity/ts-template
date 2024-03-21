import { expect, describe, beforeEach, it } from "@jest/globals";
import { CheckEmptyStringsOptions, checkForEmptyStringsInFiles } from "./empty-strings";

const mockReadDir = jest.fn();
const mockReadFile = jest.fn();

const options: CheckEmptyStringsOptions = {
  readDir: mockReadDir,
  readFile: mockReadFile,
  ignorePatterns: [],
};

describe("checkForEmptyStringsInFiles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("identifies files with empty strings", async () => {
    mockReadDir.mockResolvedValue(["file1.ts", "file2.ts"]);
    mockReadFile.mockImplementation((path) => {
      if (path.includes("file1.ts")) {
        return Promise.resolve('const a = "";');
      }
      return Promise.resolve('const b = "notEmpty";');
    });

    const result = await checkForEmptyStringsInFiles(".", options);
    expect(result).toEqual(["file1.ts"]);
  });

  it("ignores files based on ignorePatterns and .gitignore", async () => {
    options.ignorePatterns = ["file2.ts"];
    mockReadDir.mockResolvedValue(["file1.ts", "file2.ts", "file3.ts"]);
    mockReadFile.mockImplementation((path) => {
      if (path === ".gitignore") {
        return Promise.resolve("file3.ts");
      } else if (path.includes("file1.ts")) {
        return Promise.resolve('const a = "";');
      }
      return Promise.resolve('const b = "notEmpty";');
    });

    const result = await checkForEmptyStringsInFiles(".", options);
    expect(result).toEqual(["file1.ts"]);
  });

  it("returns an empty array when no empty strings are found", async () => {
    mockReadDir.mockResolvedValue(["file1.ts"]);
    mockReadFile.mockResolvedValue('const a = "notEmpty";');

    const result = await checkForEmptyStringsInFiles(".", options);
    expect(result).toHaveLength(0);
  });

  it("handles errors gracefully", async () => {
    mockReadDir.mockRejectedValue(new Error("Error reading directory"));

    await expect(checkForEmptyStringsInFiles(".", options)).resolves.toEqual([]);
  });
});
