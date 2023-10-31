import { PhpWeb } from '../PhpWeb.mjs';

export async function onRequest(context) {
    let output = 'undef';
    let error  = 'undef';

    const response   = await fetch('https://php-cloud.pages.dev/php-web.wasm');
    const wasmBinary = await response.arrayBuffer();

    const php = new PhpWeb({wasmBinary});

    php.addEventListener('output', (event) => output += event.detail);
    php.addEventListener('error',  (event) => error  += event.detail);

    await php.ready;

    output = '';
    error = '';
    
    php.run('<?php echo "Hello, PHP!";');

    return new Response(output);
}
