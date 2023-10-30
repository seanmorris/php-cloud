import { PhpWeb } from '../PhpWeb.mjs';
// import binary from '../php-web.wasm';
export function onRequest(context) {
    return new Promise((accept, reject) => {
        const php = new PhpWeb({
            instantiateWasm(info, receive) {
                WebAssembly.instantiateStreaming(fetch('/php-web.wasm'), info)
                .then(({instance}) => {
                    receive(instance)
                    return instance.exports;
                });
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
}
