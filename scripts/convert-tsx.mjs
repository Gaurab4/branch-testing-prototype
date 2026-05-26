import fs from "fs";
import path from "path";
import * as esbuild from "esbuild";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "src");

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.name.endsWith(".tsx")) out.push(p);
  }
  return out;
}

function postProcess(code) {
  return code
    .replace(/^"use client";\n\n?/gm, "")
    .replace(/^import type \{[^}]+\} from [^;]+;\n/gm, "")
    .replace(/import \{([^}]*), type ([^}]*)\} from/g, "import {$1$2} from")
    .replace(/from "@\/lib\/utils"/g, 'from "@/lib/utils.js"')
    .replace(/from "@\/lib\/mock-data"/g, 'from "@/lib/mock-data.js"')
    .replace(/expandedIds\.has\(/g, "expandedIds.includes(")
    .replace(/: React\.[A-Za-z<>,\s|.?]+(?=[,)])/g, "")
    .replace(/<TestStep>/g, "")
    .replace(/<Branch>/g, "")
    .replace(/<FlowStatus>/g, "")
    .replace(/<StepStatus>/g, "")
    .replace(/extends React\.[^{]+/g, "")
    .replace(/extends VariantProps<[^>]+>/g, "")
    .replace(/VariantProps<typeof [^>]+>/g, "")
    .replace(/Record<[^>]+>/g, "");
}

for (const file of walk(src)) {
  if (file.includes(`${path.sep}app${path.sep}`)) continue;
  const raw = fs.readFileSync(file, "utf8");
  const { code } = await esbuild.transform(raw, {
    loader: "tsx",
    jsx: "preserve",
    target: "es2020",
  });
  const outPath = file.replace(/\.tsx$/, ".jsx");
  fs.writeFileSync(outPath, postProcess(code));
  console.log("wrote", path.relative(root, outPath));
}
