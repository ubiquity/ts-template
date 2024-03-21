export interface CheckFileNamesOptions {
  readDir: (path: string) => Promise<string[]>;
  readFile: (path: string, encoding: string) => Promise<string>;
  ignorePatterns?: string[];
}

export async function checkFileNames(dir: string, options: CheckFileNamesOptions): Promise<string[]> {
  const { readDir, readFile, ignorePatterns = [] } = options;
  const nonCompliantFiles: string[] = [];
  const ignoreList: string[] = ["^\\.\\/\\.git", "^\\.\\/\\..*", "^\\.\\/[^\\/]*$", "^\\.\\/node_modules", ".*\\.test\\.ts$", ...ignorePatterns];

  try {
    const gitignoreContent = await readFile(".gitignore", "utf8");
    gitignoreContent.split("\n").forEach((line) => {
      if (line.trim() !== "") {
        ignoreList.push(`.*${line}`);
      }
    });
  } catch (error) {
    console.error("Error reading .gitignore file:", error);
  }

  try {
    const files = await readDir(dir);
    filesLoop: for (const fileName of files) {
      for (const pattern of ignoreList) {
        if (new RegExp(pattern).test(fileName)) {
          continue filesLoop;
        }
      }

      if (!fileName.match(/^[a-z0-9]+(-[a-z0-9]+)*\.(ts|js)$/)) {
        nonCompliantFiles.push(fileName);
      }
    }
  } catch (error) {
    console.error("Error reading directory:", error);
  }

  return nonCompliantFiles;
}
