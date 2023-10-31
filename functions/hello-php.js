import { PhpWeb } from '../PhpWeb.mjs';

export async function onRequest(context) {
    let output = 'undef';
    let error  = 'undef';

    const php = new PhpWeb({locateFile: (file, prefix) => {
        console.log({file, prefix});
        const url = `https://php-cloud.pages.dev/${file}`;
        console.log({url});
        return url;
    }});

    php.addEventListener('output', (event) => output += event.detail);
    php.addEventListener('error',  (event) => error  += event.detail);

    await php.ready;

    output = '';
    error = '';
    php.run('<?php echo "Hello, PHP!";');
 

    return new Response(output);
}
