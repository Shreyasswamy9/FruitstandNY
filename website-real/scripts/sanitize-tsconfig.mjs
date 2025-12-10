import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CONFIG_PATH = resolve(process.cwd(), 'tsconfig.json');

function ensureTsconfigSafety() {
  const raw = readFileSync(CONFIG_PATH, 'utf8');
  const config = JSON.parse(raw);

  const includeList = Array.isArray(config.include) ? config.include : [];
  const excludeList = Array.isArray(config.exclude) ? config.exclude : [];
  const DEV_TYPES_GLOB = '.next/dev/types/**/*.ts';
  const DEV_TYPES_EXCLUDE = '.next/dev/types/**/*';

  let changed = false;

  if (includeList.includes(DEV_TYPES_GLOB)) {
    config.include = includeList.filter((item) => item !== DEV_TYPES_GLOB);
    changed = true;
  }

  if (!excludeList.includes(DEV_TYPES_EXCLUDE)) {
    config.exclude = [...excludeList, DEV_TYPES_EXCLUDE];
    changed = true;
  }

  if (!changed) {
    return;
  }

  writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`);
  console.info('Sanitized tsconfig.json to exclude .next/dev artifacts.');
}

try {
  ensureTsconfigSafety();
} catch (error) {
  console.warn('Unable to sanitize tsconfig.json automatically:', error);
}
