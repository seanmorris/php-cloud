import { PhpWeb } from '../PhpWeb.mjs';

export async function onRequest(context) {
    let output = 'undef';
    let error  = 'undef';

    const response = await fetch('https://php-cloud.pages.dev/php-web.wasm');
    const buffer   = await response.arrayBuffer();

    console.log(buffer);

    // const php = new PhpWeb({buffer});

    // php.addEventListener('output', (event) => output += event.detail);
    // php.addEventListener('error',  (event) => error  += event.detail);

    // // php.addEventListener('ready', () => );
    
    // await php.ready;

    output = '';
    error = '';
    
    // php.run('<?php echo "Hello, PHP!";');

    return new Response(output);
}
