import { fetchConToken, fetchSinToken } from '../helpers/fetch';
import { mostrarErrores } from '../helpers/mostrarErrores';
import { types } from '../types/types';

export const startLogin = (email, password) => {
	return async (dispatch) => {
		const res = await fetchSinToken('auth', { email, password }, 'POST');
		const body = await res.json();

		if (body.ok) {
			localStorage.setItem('token', body.token);
			localStorage.setItem('token-init-date', new Date().getTime());

			dispatch(
				login({
					uid: body.uid,
					name: body.name,
				})
			);
		} else {
			mostrarErrores(body);
		}
	};
};

export const startRegister = (email, name, password) => {
	return async (dispatch) => {
		const res = await fetchSinToken('auth/new', { name, email, password }, 'POST');

		const body = await res.json();

		if (body.ok) {
			localStorage.setItem('token', body.token);
			localStorage.setItem('token-init-date', new Date().getTime());

			dispatch(
				login({
					uid: body.uid,
					name: body.name,
				})
			);
		} else {
			mostrarErrores(body);
		}
	};
};

export const startChecking = () => {
	return async (dispatch) => {
		const res = await fetchConToken('auth/renew');

		const body = await res.json();

		if (body.ok) {
			localStorage.setItem('token', body.token);
			localStorage.setItem('token-init-date', new Date().getTime());

			dispatch(
				login({
					uid: body.uid,
					name: body.name,
				})
			);
		} else {
			// mostrarErrores(body);
			dispatch(checkingFinish());
		}
	};
};

const checkingFinish = () => ({
	type: types.authCheckingFinish,
});

const login = (user) => ({
	type: types.authLogin,
	payload: user,
});

export const startLogout = () => {
	return (dispatch) => {
		localStorage.removeItem('token');
		localStorage.removeItem('token-init-date');

		dispatch(logout());
	};
};

const logout = () => ({
	type: types.authLogout,
});
