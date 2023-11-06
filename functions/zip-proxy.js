export async function onRequest(context) {
	const url  = new URL(context.request.url);
	const zipUrl = url.searchParams.get('zip');
	const fetchZip = fetch(zipUrl, {headers: {'User-Agent': 'google-chrome lol'}});
	const response = await fetchZip;

	console.log(zipUrl, response.headers.get('content-type'));

	if('application/zip' !== response.headers.get('content-type')) {
		return new Response('ERROR', {
			status: '400',
			statusText: 'OK'
		});
	}

	return response;
}
