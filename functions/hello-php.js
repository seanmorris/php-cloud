import { PhpWeb } from '../PhpWeb.mjs';
import WasmBinary from '../php-web.wasm';

export function onRequest(context) {
    let output = 'undef';
    let error  = 'undef';

    return new Promise(accept => {
        const php = new PhpWeb({
            instantiateWasm(info, receive) {
                let instance = new WebAssembly.Instance(WasmBinary, info)
                receive(instance)
                return instance.exports
            },
            locateFile: (file, prefix) => {
                const url = `https://php-cloud.pages.dev/${file}`;
                return url;
            },
            postRun: () => {
                output = '';
                error  = '';
                php.addEventListener('output', (event) => output += event.detail);
                php.addEventListener('error',  (event) => error  += event.detail);
                php.run('<?php echo "Hello, PHP!";');

                accept(new Response(output));
            }    
        });
    });
}
