import { PhpWeb } from '../PhpWeb.mjs';
// import wasmBinary from '../php-web.wasm';

export async function onRequest(context) {
    let output = 'undef';
    let error  = 'undef';

    // const response = await fetch('https://php-cloud.pages.dev/php-web.wasm');
    // const buffer   = await response.arrayBuffer();

    const php = new PhpWeb({
        // wasmBinary,
        locateFile: (file, prefix) => {
            console.log({file, prefix});
            const url = `https://php-cloud.pages.dev/${file}`;
            console.log({url});
        }
    });

    // php.addEventListener('output', (event) => output += event.detail);
    // php.addEventListener('error',  (event) => error  += event.detail);

    // // php.addEventListener('ready', () => );
    
    // await php.ready;

    output = '';
    error = '';
    
    php.run('<?php echo "Hello, PHP!";');

    return new Response(output);
}
