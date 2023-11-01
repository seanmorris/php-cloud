import { PhpWeb } from '../PhpWeb.mjs';
import WasmBinary from '../php-web.wasm';

export async function onRequest(context) {
    let output = 'undef';
    let error  = 'undef';

    const php = new PhpWeb({
        instantiateWasm(info, receive) {
            let instance = new WebAssembly.Instance(WasmBinary, info)
            receive(instance)
            console.log({WasmBinary, instance, info});
            return instance.exports
        },
        locateFile: (file, prefix) => {
            console.log({file, prefix});
            const url = `https://php-cloud.pages.dev/${file}`;
            console.log({url});
            return url;
        }
    });

    output = '';
    error  = '';

    php.addEventListener('output', (event) => output += event.detail);
    php.addEventListener('error',  (event) => error  += event.detail);

    const init = await new Promise(accept => php.addEventListener('ready', () => accept()));

    console.log({init});

    php.run('<?php echo "Hello, PHP!";');

    return new Response(output);
}
