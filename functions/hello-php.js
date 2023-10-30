import { PhpWeb } from '../PhpWeb.mjs';

export async function onRequest(context) {
    let output = '';
    let error  = '';

    const response = await fetch('https://php-cloud.pages.dev/php-web.wasm');
    const bytes    = await response.arrayBuffer();

    console.log(response);
    
    // const php = new PhpWeb({
    //     instantiateWasm(imports, receive) {
    //         console.log(imports);
    //         console.log(receive);
    //         const {instance} = WebAssembly.instantiate(bytes, imports);
    //         receive(instance);
    //         return instance.exports;
    //     },
    // });

    // php.addEventListener('output', (event) => output += event.detail);
    // php.addEventListener('error',  (event) => error  += event.detail);

    // // php.addEventListener('ready', () => );
    // await php.ready;

    // php.run('<?php echo "Hello, PHP!";');

    return new Response(output);
}
