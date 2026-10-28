import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('dist/licenses', { recursive: true });
await copyFile('node_modules/three/LICENSE', 'dist/licenses/three-LICENSE.txt');
await copyFile('THIRD_PARTY_NOTICES.md', 'dist/licenses/THIRD_PARTY_NOTICES.md');
