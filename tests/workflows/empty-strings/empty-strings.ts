export interface CheckEmptyStringsOptions {
  readDir: (path: string) => Promise<string[]>;
  readFile: (path: string, encoding: string) => Promise<string>;
  ignorePatterns?: string[];
}

export async function checkForEmptyStringsInFiles(dir: string, options: CheckEmptyStringsOptions): Promise<string[]> {
  const { readDir, readFile, ignorePatterns = [] } = options;
  const filesWithEmptyStrings: string[] = [];
  const ignoreList: string[] = ["^\\.\\/\\.git", "^\\.\\/\\..*", "^\\.\\/node_modules", "^\\.\\/dist", "^\\.\\/out", ".*\\.test\\.ts$", ...ignorePatterns];

  try {
    const gitignoreContent = await readFile(".gitignore", "utf8");
    gitignoreContent.split("\n").forEach((line) => {
      if (line.trim() !== "") {
        ignoreList.push(`^\\.\\/${line.replace(/\./g, "\\.").replace(/\//g, "\\/")}`);
      }
    });
  } catch (error) {
    console.error("Error reading .gitignore file:", error);
  }

  try {
    const files = await readDir(dir);
    for (const fileName of files) {
      let shouldIgnore = false;
      for (const pattern of ignoreList) {
        if (new RegExp(pattern).test(fileName)) {
          shouldIgnore = true;
          break;
        }
      }
      if (shouldIgnore || !fileName.endsWith(".ts")) continue;

      const fileContent = await readFile(`${dir}/${fileName}`, "utf8");
      if (fileContent.includes('""') || fileContent.includes("''")) {
        filesWithEmptyStrings.push(fileName);
      }
    }
  } catch (error) {
    console.error("Error reading directory or file contents:", error);
  }

  return filesWithEmptyStrings;
}
