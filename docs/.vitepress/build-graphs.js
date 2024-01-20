import { readdir, rm } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { run as runMermaid } from '@mermaid-js/mermaid-cli';

const projectDir = dirname(dirname(fileURLToPath(new URL(import.meta.url))));

async function getGraphsInDirectory(directory) {
  const filenames = (await readdir(directory)).filter((file) => {
    return file.endsWith('.mmd');
  });
  return filenames.map((filename) => join(directory, filename));
}

async function emptyDir(directory) {
  const filenames = await readdir(directory);
  for (const filename of filenames) {
    await rm(join(directory, filename), { recursive: true });
  }
}

async function renderGraph(inputFilePath, outDir) {
  let outputFilePath = join(outDir, basename(inputFilePath, '.mmd') + '.svg');
  console.log('renderGraph', inputFilePath);
  await runMermaid(inputFilePath, outputFilePath, {
    puppeteerConfig: {
      args: ['--no-sandbox']
    },
    parseMMDOptions: {
      backgroundColor: 'transparent'
    }
  });
}

async function build(fromDir, toDir) {
  const fromDirAbs = join(projectDir, fromDir);
  const toDirAbs = join(projectDir, toDir);

  emptyDir(toDirAbs);
  let graphPaths = await getGraphsInDirectory(fromDirAbs);

  for (const graphPath of graphPaths) {
    await renderGraph(graphPath, toDirAbs);
  }
}

build('graphs', 'src/public/graphs');
