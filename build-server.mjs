import { execSync } from "node:child_process";
import {
  rmSync,
  mkdirSync,
  mkdtempSync,
  existsSync,
  createWriteStream,
  renameSync,
  chmodSync,
} from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const SERVER = "server";

// Node runtime bundled as a Tauri sidecar.
const NODE_VERSION = "22.23.4";
const BINARIES_DIR = "src-tauri/binaries";

const PLATFORMS = {
  linux: { node: "linux", archive: "tar.xz", binary: "node" },
  darwin: { node: "darwin", archive: "tar.gz", binary: "node" },
  win32: { node: "win", archive: "zip", binary: "node.exe" },
};

const ARCHES = {
  x64: { node: "x64", triple: "x86_64" },
  arm64: { node: "arm64", triple: "aarch64" },
  arm: { node: "armv7l", triple: "armv7" },
  ia32: { node: "x86", triple: "i686" },
};

function targetTriple(platform, arch) {
  const { triple } = ARCHES[arch];
  if (platform === "linux") {
    return arch === "arm"
      ? "armv7-unknown-linux-gnueabihf"
      : `${triple}-unknown-linux-gnu`;
  }
  if (platform === "darwin") return `${triple}-apple-darwin`;
  return `${triple}-pc-windows-msvc`;
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok || !res.body) {
    throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
  }
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

async function ensureNodeBinary() {
  const platform = process.platform;
  const arch = process.arch;
  const platformInfo = PLATFORMS[platform];
  const archInfo = ARCHES[arch];

  if (!platformInfo || !archInfo) {
    throw new Error(`Unsupported platform for Node sidecar: ${platform}-${arch}`);
  }

  const triple = targetTriple(platform, arch);
  const dest = join(
    BINARIES_DIR,
    `node-${triple}${platform === "win32" ? ".exe" : ""}`
  );

  if (existsSync(dest)) {
    console.log(`Node sidecar already present: ${dest}`);
    return;
  }

  const distName = `node-v${NODE_VERSION}-${platformInfo.node}-${archInfo.node}`;
  const root = `${distName}`;
  const member =
    platform === "win32"
      ? `${root}/${platformInfo.binary}`
      : `${root}/bin/${platformInfo.binary}`;
  const strip = platform === "win32" ? 1 : 2;
  const url = `https://nodejs.org/dist/v${NODE_VERSION}/${distName}.${platformInfo.archive}`;

  mkdirSync(BINARIES_DIR, { recursive: true });
  const tmpDir = mkdtempSync(join(BINARIES_DIR, ".node-download-"));
  const archivePath = join(tmpDir, `${distName}.${platformInfo.archive}`);
  const extractDir = join(tmpDir, "extract");

  try {
    console.log(`Downloading Node v${NODE_VERSION} for ${platform}-${arch}...`);
    await download(url, archivePath);

    mkdirSync(extractDir);
    const flag =
      platformInfo.archive === "tar.xz"
        ? "-xJf"
        : platformInfo.archive === "tar.gz"
          ? "-xzf"
          : "-xf";
    execSync(
      `tar ${flag} "${archivePath}" -C "${extractDir}" --strip-components=${strip} "${member}"`,
      { stdio: "inherit" }
    );

    renameSync(join(extractDir, platformInfo.binary), dest);
    if (platform !== "win32") chmodSync(dest, 0o755);

    console.log(`Node sidecar ready: ${dest}`);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

await ensureNodeBinary();

execSync("npm ci --omit=dev", { cwd: SERVER, stdio: "inherit" });
