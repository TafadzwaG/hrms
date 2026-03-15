import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const generatedRoot = join(root, 'resources', 'js', 'generated');
const targets = ['actions', 'routes', 'wayfinder'];

rmSync(generatedRoot, { recursive: true, force: true });

execFileSync(
    'php',
    ['artisan', 'wayfinder:generate', '--with-form', '--path=resources/js/generated'],
    {
        cwd: root,
        stdio: 'inherit',
    },
);

for (const target of targets) {
    const source = join(generatedRoot, target);
    const destination = join(root, 'resources', 'js', target);

    rmSync(destination, { recursive: true, force: true });
    mkdirSync(destination, { recursive: true });

    if (existsSync(source)) {
        cpSync(source, destination, { recursive: true });
    }
}
