/**
 * Собирает src/tools.json — по одному инструменту MCP на актор.
 *
 * Схема ввода берётся из последней сборки актора в Apify, поэтому описание инструмента
 * всегда совпадает с тем, что актор на самом деле принимает. Список закреплён руками:
 * агенту нужен короткий внятный набор, а не 211 строк.
 *
 *   node scripts/generate-tools.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const ACTORS = JSON.parse(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'actors.json'), 'utf8'));
const token = await (await import(path.join(os.homedir(), 'bots/claud/scripts/keys.mjs'))).ownerToken('lergassy');

const out = [];
for (const id of ACTORS) {
    const slug = id.replace('/', '~');
    const a = (await fetch(`https://api.apify.com/v2/acts/${slug}?token=${token}`).then((r) => r.json())).data;
    if (!a) { console.error('нет актора:', id); continue; }
    const buildId = a.taggedBuilds?.latest?.buildId;
    let schema = null;
    if (buildId) {
        const b = (await fetch(`https://api.apify.com/v2/actor-builds/${buildId}?token=${token}`).then((r) => r.json())).data;
        if (b?.inputSchema) { try { schema = JSON.parse(b.inputSchema); } catch { /* пропуск */ } }
    }
    if (!schema) { console.error('нет схемы ввода:', id); continue; }
    // MCP не знает полей Apify (editor, prefill, sectionCaption) — оставляем только то, что понимает JSON Schema.
    const props = {};
    for (const [k, v] of Object.entries(schema.properties || {})) {
        const p = { type: v.type, description: [v.title, v.description].filter(Boolean).join(' — ').replace(/<[^>]+>/g, '').slice(0, 300) };
        if (v.enum) p.enum = v.enum;
        if (v.default !== undefined) p.default = v.default;
        if (v.type === 'array') p.items = v.items || { type: 'string' };
        if (v.type === 'object') p.additionalProperties = true;
        props[k] = p;
    }
    out.push({
        name: id.split('/')[1].replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 60),
        actor: slug,
        description: `${a.title}. ${String(a.description || '').replace(/\s+/g, ' ')}`.slice(0, 900),
        inputSchema: { type: 'object', properties: props, required: schema.required || [] },
    });
    process.stderr.write(`· ${id} — полей ${Object.keys(props).length}\n`);
}
fs.writeFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'src', 'tools.json'), JSON.stringify(out, null, 1));
console.log(`инструментов собрано: ${out.length}`);
