import { PhpWeb } from '../PhpWeb.mjs';
// import binary from '../php-web.wasm';

export async function onRequest(context) {
    const info = {};

    const php = new PhpWeb({
        async instantiateWasm(info, receive) {
            const response = await fetch('https://php-cloud.pages.dev/php-web.wasm');
            const bytes    = await response.arrayBuffer();
            const {instance, module} = WebAssembly.instantiate(bytes, info);
            receive(instance);
            return instance.exports;
        },
    });

    let output = '';
    let error  = '';

    php.addEventListener('output', (event) => output += event.detail);
    php.addEventListener('error',  (event) => error  += event.detail);

    // php.addEventListener('ready', () => );
    await php.ready;

    php.run('<?php echo "Hello, PHP!";');

    return new Response(output);
}
