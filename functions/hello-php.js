import { PhpWeb } from 'php-wasm/PhpWeb.mjs';

export function onRequest(context) {
    const php = new PhpWeb;
    return new Promise((accept, reject) => {

        let output = '', error = '';
            
        php.addEventListener('output', (event) => {
            output += event.detail;
        });
        
        php.addEventListener('error', (event) => {
            console.log(event.detail);
            error += event.detail;
        });
        
        php.addEventListener('ready', () => {
            php.run('<?php echo "Hello, PHP!";');
        })
        .then(() => accept(output))
        .catch(() => reject(error));
    });    
}
