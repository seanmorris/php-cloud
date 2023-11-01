import { PhpWeb } from '../PhpWeb.mjs';
import WasmBinary from '../php-web.wasm';

export function onRequest(context) {

    const _GET = {};
    
    const url = new URL(context.request.url);

    for (const [key, value] of url.searchParams.entries())
    {
        _GET[key] = value;
    }
    
    const db = context.env.db;
    
    const php = new PhpWeb({
        _GET, db,
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

    const write = event => writer.write(encoder.encode(event.detail));

    php.addEventListener('output', write);
    php.addEventListener('error',  write);

    const path = context.params.path
        ? context.params.path.join('/')
        : 'index.php';

    context.waitUntil(fetch('https://seanmorris.github.io/php-static/' + path)
    .then(r => r.text())
    .then(r => php.run(r)));

    const headers = new Headers;

    headers.set('content-type', 'text/html');
    
    return php.binary.then(() => new Response(readable, {
        status: '200',
        statusText: 'OK',
        headers
    }));
}
