import { PhpWeb } from '../PhpWeb.mjs';
// import binary from '../php-web.wasm';
export function onRequest(context) {
    return new Promise((accept, reject) => {
        const info = {};


        fetch('https://php-cloud.pages.dev/php-web.wasm')
        .then((response) => response.arrayBuffer())
        .then((bytes) => WebAssembly.instantiate(bytes, importObject))
        .then(({instance, module}) => {

            const php = new PhpWeb({
                instantiateWasm(info, receive) {
                    receive(instance);
                    return instance.exports;
                },
            });
            let output = '';
            let error = '';
            php.addEventListener('output', (event) => output += event.detail);
            php.addEventListener('error', (event) => error += event.detail);
            php.addEventListener('ready', () => php.run('<?php echo "Hello, PHP!";'))
            .then(() => accept(output))
            .catch(() => reject(error));

        });
    });
}
