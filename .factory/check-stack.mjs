#!/usr/bin/env node
// Fails when .factory/stack.json and the code disagree about the stack (ADR 0006 in Software Factory).
// Managed by Software Factory; overwritten on Update kit. Rules come from .factory/detect.json.
// Usage: node .factory/check-stack.mjs [--quiet]   (exit 0: in step, 1: drift or a broken file)
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

// not import.meta.dirname: imported repos may run Node older than 20.11
const root = fileURLToPath(new URL('..', import.meta.url))
const quiet = process.argv.includes('--quiet')
const read = (p) => (existsSync(join(root, p)) ? readFileSync(join(root, p), 'utf8') : null)

function fail(lines) {
  console.error(['check-stack: .factory/stack.json doesn\'t match the code', ...lines.map((l) => `  - ${l}`)].join('\n'))
  process.exit(1)
}

const stackText = read('.factory/stack.json')
if (stackText === null) fail(['.factory/stack.json is missing: press "Detect stack" on the project in the factory, or write it by hand.'])
let stack
try {
  stack = JSON.parse(stackText)
} catch (e) {
  fail([`.factory/stack.json isn't valid JSON: ${e.message}`])
}
const options = new Set(stack.options ?? [])
const ignore = stack.ignore ?? {}
const rules = JSON.parse(read('.factory/detect.json') ?? '{"rules":[]}').rules

// tracked and untracked files, minus ignored ones (node_modules, build output); a plain walk outside git
function listFiles() {
  try {
    const out = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] })
    return out.toString().split('\0').filter(Boolean)
  } catch {
    const files = []
    const walk = (dir) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (e.name === 'node_modules' || e.name === '.git') continue
        const p = join(dir, e.name)
        if (e.isDirectory()) walk(p)
        else files.push(relative(root, p).split('\\').join('/'))
      }
    }
    walk(root)
    return files
  }
}

const files = listFiles()
const manifest = JSON.parse(read('package.json') ?? '{}')
const packages = new Set([...Object.keys(manifest.dependencies ?? {}), ...Object.keys(manifest.devDependencies ?? {})])
const texts = {}
for (const p of new Set(rules.flatMap((r) => r.content.flatMap((c) => c.paths)))) {
  const t = read(p)
  if (t !== null) texts[p] = t
}

const found = new Map()
for (const rule of rules) {
  const pkg = rule.packages.find((p) => packages.has(p))
  const file = rule.files.find((f) => (f.endsWith('/') ? files.some((x) => x.startsWith(f)) : files.includes(f)))
  const content = rule.content.find((c) => c.paths.some((p) => texts[p]?.includes(c.includes)))
  const evidence = pkg
    ? `${pkg} in package.json`
    : file
      ? `${file} in the repo`
      : content
        ? `"${content.includes}" in ${content.paths.find((p) => texts[p]?.includes(content.includes))}`
        : null
  if (evidence) found.set(rule.id, evidence)
}

const byId = new Map(rules.map((r) => [r.id, r]))
const problems = []
for (const id of options) {
  if (ignore[id] !== undefined) continue
  const rule = byId.get(id)
  if (!rule) problems.push(`${id}: not an option the factory knows. Check the id, or describe it under "described".`)
  else if (rule.packages.length + rule.files.length + rule.content.length > 0 && !found.has(id)) {
    problems.push(`${rule.label} (${id}): declared, but nothing in the repo uses it. Remove it from options.`)
  }
}
for (const [id, evidence] of found) {
  if (!options.has(id) && ignore[id] === undefined) problems.push(`${byId.get(id).label} (${id}): ${evidence}, but not declared. Add "${id}" to options.`)
}

if (problems.length) {
  fail([...problems, 'Detection wrong for this repo? Add the option to "ignore" with the reason: "ignore": { "<id>": "why" }'])
}
if (!quiet) console.log(`check-stack: ${options.size} option${options.size === 1 ? '' : 's'} declared, in step with the code`)
