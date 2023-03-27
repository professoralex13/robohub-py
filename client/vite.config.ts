import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { readdirSync } from 'fs';

const absolutePathAliases: { [key: string]: string } = {};
const srcPath = path.resolve('./src/');
const srcRootContent = readdirSync(srcPath, { withFileTypes: true }).map((dirent) => dirent.name.replace(/(\.ts){1}(x?)/, ''));

srcRootContent.forEach((directory) => {
    absolutePathAliases[directory] = path.join(srcPath, directory);
});

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    resolve: {
        alias: {
            ...absolutePathAliases,
        },
    },
    plugins: [react()],
});
