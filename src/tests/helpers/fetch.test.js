import { fetchConToken, fetchSinToken } from '../../helpers/fetch';

describe('Pruebas en el helper fetch', () => {
	let token = '';
	test('fetchSinToken debe funcionar', async () => {
		const resp = await fetchSinToken(
			'auth',
			{ email: 'correo@correo.com', password: '123456' },
			'POST'
		);
		const body = await resp.json();
		// console.log(body);
		token = body.token;
		expect(resp instanceof Response).toBe(true);

		expect(body.ok).toBe(true);
	});

	test('fetchConToken debe funcionar', async () => {
		localStorage.setItem('token', token);

		const resp = await fetchConToken('events', {}, 'GET');
		const body = await resp.json();

		expect(body.ok).toBe(true);
		expect(body.eventos).toEqual(expect.any(Array));
	});
});
