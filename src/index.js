#!/usr/bin/env node
/**
 * MCP-сервер, который отдаёт акторов Apify аккаунтов lergassy и BlueskyScraper как инструменты агента.
 *
 * Зачем он есть. 28.10.2026 замер показал: в нише транскриптов Instagram первое место в поиске
 * магазина Apify даёт 2324 пользователя в месяц, девятое — 27. Поиск магазина — единственный
 * вход, которым мы пользуемся, и там мы девятые. У конкурента, который первый, есть второй вход,
 * которого у нас нет совсем: один MCP-сервер со всеми его акторами, выложенный в каталоги MCP.
 * Этот файл — наш такой вход.
 *
 * Токен Apify берётся у пользователя (APIFY_TOKEN). Прогон идёт на его счёт — поэтому он
 * становится покупателем актора, а мы получаем и пользователя, и выручку.
 *
 *   APIFY_TOKEN=... npx lergassy-agent-tools
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TOOLS = JSON.parse(fs.readFileSync(path.join(HERE, 'tools.json'), 'utf8'));
const TOKEN = process.env.APIFY_TOKEN || process.env.APIFY_API_TOKEN;
// Сколько строк отдаём агенту за один вызов. Контекст модели не резиновый, а датасет бывает
// на десятки тысяч строк; полный результат всегда остаётся в Apify по ссылке на датасет.
const MAX_ROWS = Number(process.env.MAX_ROWS) || 50;
const TIMEOUT_S = Number(process.env.RUN_TIMEOUT_SECS) || 300;

const server = new Server({ name: 'lergassy-agent-tools', version: '0.1.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map((t) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema })),
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const tool = TOOLS.find((t) => t.name === req.params.name);
    if (!tool) return { isError: true, content: [{ type: 'text', text: `Unknown tool: ${req.params.name}` }] };
    if (!TOKEN) {
        return { isError: true, content: [{ type: 'text', text: 'Set APIFY_TOKEN in the MCP server environment. Get a free token at https://console.apify.com/settings/integrations — the Actor run is billed to that account.' }] };
    }
    const url = `https://api.apify.com/v2/acts/${tool.actor}/run-sync-get-dataset-items`
        + `?token=${encodeURIComponent(TOKEN)}&timeout=${TIMEOUT_S}&limit=${MAX_ROWS}&clean=true`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(req.params.arguments || {}),
            signal: AbortSignal.timeout((TIMEOUT_S + 20) * 1000),
        });
        const text = await res.text();
        if (!res.ok) {
            // Отказ платформы отдаём агенту словами платформы, а не своим пересказом:
            // «придуманная» причина уже один раз увела разбор не туда (урок L188, 27.10.2026).
            return { isError: true, content: [{ type: 'text', text: `Apify answered HTTP ${res.status}: ${text.slice(0, 500)}` }] };
        }
        let rows;
        try { rows = JSON.parse(text); } catch { rows = null; }
        if (!Array.isArray(rows)) return { content: [{ type: 'text', text: text.slice(0, 20000) }] };
        const data = rows.filter((r) => r && r.type !== 'notice');
        const notices = rows.filter((r) => r && r.type === 'notice').map((r) => r.notice).filter(Boolean);
        if (!data.length) {
            // Пусто — это ответ, а не сбой: актор обычно объясняет причину служебной строкой.
            return { content: [{ type: 'text', text: notices.length ? notices.join('\n') : 'The Actor returned no rows for this input.' }] };
        }
        const head = `${data.length} row(s) from ${tool.actor}${notices.length ? `\n${notices.join('\n')}` : ''}`;
        return { content: [{ type: 'text', text: `${head}\n\n${JSON.stringify(data, null, 1)}` }] };
    } catch (err) {
        return { isError: true, content: [{ type: 'text', text: `Request to Apify failed: ${String(err?.message || err).slice(0, 300)}` }] };
    }
});

await server.connect(new StdioServerTransport());
