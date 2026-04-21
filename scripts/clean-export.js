const fs = require("fs/promises");
const path = require("path");

const OUT_DIR = path.join(process.cwd(), "out");

async function pathExists(dir) {
  try {
    await fs.access(dir);
    return true;
  } catch {
    return false;
  }
}

function isTxtExtension(name) {
  return name.toLowerCase().endsWith(".txt");
}

function isRobotsTxt(name) {
  return name.toLowerCase() === "robots.txt";
}

async function walkAndDeleteTxt(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkAndDeleteTxt(fullPath);
    } else if (
      entry.isFile() &&
      isTxtExtension(entry.name) &&
      !isRobotsTxt(entry.name)
    ) {
      await fs.unlink(fullPath);
    }
  }
}

async function main() {
  if (!(await pathExists(OUT_DIR))) {
    return;
  }
  await walkAndDeleteTxt(OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
