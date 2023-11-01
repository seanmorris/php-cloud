import { PhpWeb } from '../PhpWeb.mjs';
import WasmBinary from '../php-web.wasm';

export async function onRequest(context) {
    let output = 'undef';
    let error  = 'undef';

    console.log(WasmBinary);

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

    php.addEventListener('output', (event) => output += event.detail);
    php.addEventListener('error',  (event) => error  += event.detail);

    output = '';
    error = '';
    
    return php.ready
    .then(() => php.run('<?php echo "Hello, PHP!";'))
    .then(() => new Response(output));
}
