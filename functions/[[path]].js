import { PhpWorker } from '../PhpWorker.mjs';
import WasmBinary from '../php-worker.mjs.wasm';

const staticOrigins = {
	'https://php-cloud-dev.pages.dev': 'https://seanmorris.github.io/php-static',
	'https://php-cloud.pages.dev': 'https://seanmorris.github.io/php-static',
	'http://localhost:8788': 'http://localhost:8080',
};

export async function onRequest(context)
{
	const url  = new URL(context.request.url);
    const path = url.pathname !== '/'
	? url.pathname.substr(1)
	: 'index.php';

	const staticOrigin  = staticOrigins[url.origin];
    const fetchResource = fetch(staticOrigin + '/' + path);
	const contentType   = String(context.request.headers.get("content-type"));

	const _POST = {};

	if(contentType.includes("form"))
	{
		const formData = await context.request.formData();

		console.log('formdata', formData);

		for(const entry of formData)
		{
			_POST[entry[0]] = entry[1];
		}
	}

    if('.php' !== path.substr(-4 + path.length, 4))
    {
		// const fetchResource = fetch(staticOrigin + '/' + path);
        return fetchResource;
    }

	const db   = context.env.db;
    const _GET = Object.fromEntries(url.searchParams.entries());

    const { readable, writable } = new TransformStream();
	const encoder = new TextEncoder();
	const writer = writable.getWriter();
    const writes = [];

    const write = event => void writes.push(writer.write(encoder.encode(event.detail)));

	const headers = new Headers;

    headers.set('content-type', 'text/html');

	const php = new PhpWorker({
        _GET, _POST, db,
		responseHeaders: headers,
		staticOrigin,
		origin: url.origin,
        locateFile: (file, prefix) => `${url.origin}/${prefix}${file}`,
        instantiateWasm(info, receive) {
            let instance = new WebAssembly.Instance(WasmBinary, info);
            receive(instance);
            return instance.exports;
        },
    });

    php.addEventListener('output', write);
    php.addEventListener('error',  write);

	const r = await fetchResource;
	const t = await r.text();

	// const runPhp = php.run(t)
	const runPhp = php.run(`<?php echo file_get_contents('https://jsonplaceholder.typicode.com/posts/1');`)
		.then(() => Promise.all(writes))
		.then(() => writer.close());

    context.waitUntil(runPhp);

    return new Response(readable, {
        status: '200',
        statusText: 'OK',
        headers
    });
}
