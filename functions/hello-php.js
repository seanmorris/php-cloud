import { PhpWeb } from '../PhpWeb.mjs';
import WasmBinary from '../php-web.wasm';

export async function onRequest(context) {
    let output = 'undef';
    let error  = 'undef';

    const php = new PhpWeb({
        instantiateWasm(info, receive) {
            let instance = new WebAssembly.Instance(WasmBinary, info)
            receive(instance)
            return instance.exports
        },
        locateFile: (file, prefix) => {
            const url = `https://php-cloud.pages.dev/${file}`;
            return url;
        }
    });

    output = '';
    error  = '';

    console.log('Starting...');

    php.addEventListener('output', (event) => output += event.detail);
    php.addEventListener('error',  (event) => error  += event.detail);

    const init = await new Promise(accept => php.addEventListener('ready', () => accept()));

    console.log({init});

    php.run('<?php echo "Hello, PHP!";');

    return new Response(output);
}
