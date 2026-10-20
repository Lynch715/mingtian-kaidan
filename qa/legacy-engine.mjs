// 既有规则与历史路线的回归专用入口。新开局节奏另由 month-pace.test.mjs 验证。
import * as E from '../engine.js';
import {CLIENT_SEEDS} from '../data.js';
export * from '../engine.js';
export function newGame(...args){const s=E.newGame(...args);s.flags=s.flags.filter(f=>f!=='month-pace-2');for(const p of s.clients)p.ready=CLIENT_SEEDS.find(c=>c.id===p.id).ready;return s;}
