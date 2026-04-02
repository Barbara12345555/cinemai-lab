import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { readFile, mkdir } from "fs/promises";
import path from "path";

const CWD = process.cwd();
const OUTPUT_PATH = path.join(CWD, "out", "video.mp4");

function runRemotion(): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn("npm", ["run", "remotion:render"], {
      cwd: CWD,
      shell: true,
      stdio: "pipe",
    });

    let stderr = "";
    proc.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });

    const timeout = setTimeout(() => {
      proc.kill();
      reject(new Error("Timeout: render demorou mais de 5 minutos."));
    }, 300_000);

    proc.on("close", (code) => {
      clearTimeout(timeout);
      if (code === 0) resolve();
      else reject(new Error(`Remotion falhou (código ${code}): ${stderr.slice(-500)}`));
    });

    proc.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

export async function POST() {
  try {
    await mkdir(path.join(CWD, "out"), { recursive: true });
    await runRemotion();
    const video = await readFile(OUTPUT_PATH);

    return new NextResponse(video, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="cinemai-video.mp4"',
        "Content-Length": String(video.byteLength),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao renderizar";
    console.error("[render API]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
