import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = ts.transpileModule(readFileSync('src/config.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { parseSimulationConfig } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('simulation stays unavailable for missing, invalid, or unsafe configuration', () => {
  for (const value of [null, [], {}, { enabled: false, experienceUrl: 'https://example.com' }, { enabled: 'true', experienceUrl: 'https://example.com' }, ...['http://example.com', 'javascript:alert(1)', '//example.com', 'https://user:secret@example.com', 'bad url'].map(experienceUrl => ({ enabled: true, experienceUrl }))]) {
    assert.deepEqual(parseSimulationConfig(value), { enabled: false, experienceUrl: null });
  }
});
test('explicit HTTPS service is only an external entry, with no credential storage', () => {
  assert.deepEqual(parseSimulationConfig({ enabled: true, experienceUrl: 'https://example.com/sessions' }), { enabled: true, experienceUrl: 'https://example.com/sessions' });
});
