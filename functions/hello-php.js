import { PhpWeb } from '../PhpWeb.mjs';
import WasmBinary from '../php-web.wasm';

export function onRequest(context) {

    globalThis._env = env;
    
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

    const { readable, writable } = new TransformStream();

	const writer  = writable.getWriter();
	const encoder = new TextEncoder();

    return php.binary.then(() =>{
        const write = event => writer.write(encoder.encode(event.detail));

        php.addEventListener('output', write);
        php.addEventListener('error',  write);
        
        context.waitUntil(php.run('<?php phpinfo();'));

        return new Response(readable, {
            status: '200',
            statusText: 'OK',
            'content-type': 'text/html'
        });
    });
}
