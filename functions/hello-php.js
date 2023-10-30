import { PhpWeb } from '../PhpWeb.mjs';
export function onRequest(context) {
    return new Promise((accept, reject) => {
        const php = new PhpWeb;
        let output = '';
        let error = '';
        php.addEventListener('output', (event) => output += event.detail);
        php.addEventListener('error', (event) => error += event.detail);
        php.addEventListener('ready', () => php.run('<?php echo "Hello, PHP!";'))
        .then(() => accept(output))
        .catch(() => reject(error));
    });
}
