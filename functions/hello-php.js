import { PhpWeb } from '../PhpWeb.mjs';
export function onRequest(context) {
    const php = new PhpWeb;
    return new Promise((accept, reject) => {
        let output = '';
        let error = '';
        // php.addEventListener('output', (event) => output += event.detail);
        // php.addEventListener('error', (event) => error += event.detail);
        // php.addEventListener('ready', () => php.run('<?php echo "Hello, PHP!";'))
        // .then(() => accept(output))
        // .catch(() => reject(error));
    });
}
