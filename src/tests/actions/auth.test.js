import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';
import {
	startChecking,
	startLogin,
	startLogout,
	startRegister,
} from '../../actions/auth';
import * as fetchModulo from '../../helpers/fetch';
import { types } from '../../types/types';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};
let store = mockStore(initState);

Storage.prototype.setItem = jest.fn();
Storage.prototype.removeItem = jest.fn();

jest.mock('sweetalert2', () => ({
	fire: jest.fn(),
}));

let token = '';

describe('Pruebas en las acciones de auth', () => {
	beforeEach(() => {
		store = mockStore(initState);
	});

	test('Debe de ejecutar startLogin correctamente', async () => {
		await store.dispatch(startLogin('correo@correo.com', '123456'));
		const actions = store.getActions();

		console.log(actions);

		expect(actions[0]).toEqual({
			type: types.authLogin,
			payload: {
				uid: expect.any(String),
				name: expect.any(String),
			},
		});

		expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
		expect(localStorage.setItem).toHaveBeenCalledWith(
			'token-init-date',
			expect.any(Number)
		);

		// Obtener el valor del localStorage cuando se usa jest para generar un  mock
		// console.log(localStorage.setItem.mock.calls[0][1]);
		token = localStorage.setItem.mock.calls[0][1];
	});

	test('StartLogin incorrecto', async () => {
		await store.dispatch(startLogin('correo@correo.com', '1234567Mal'));
		let actions = store.getActions();

		expect(actions).toEqual([]);
		expect(Swal.fire).toHaveBeenCalled();
		expect(Swal.fire).toHaveBeenCalledWith('Error', 'Password incorrecto', 'error');
		await store.dispatch(startLogin('correo@correoFake.com', '123456'));
		actions = store.getActions();
		expect(Swal.fire).toHaveBeenCalledWith(
			'Error',
			'El usuario no existe con ese correo',
			'error'
		);
	});

	test('startRegister correcto', async () => {
		// Creaccion de un mock para unas sola prueba
		fetchModulo.fetchSinToken = jest.fn(() => ({
			json() {
				return {
					ok: true,
					uid: '123',
					name: 'carlos',
					token: '123456',
				};
			},
		}));

		await store.dispatch(startRegister('test@test.com', 'omar test', '123456'));

		const actions = store.getActions();

		// console.log(actions);
		expect(actions[0]).toEqual({
			type: types.authLogin,
			payload: {
				uid: '123',
				name: 'carlos',
			},
		});
		expect(localStorage.setItem).toHaveBeenCalledWith('token', '123456');
		expect(localStorage.setItem).toHaveBeenCalledWith(
			'token-init-date',
			expect.any(Number)
		);
	});

	test('startChecking debe de funcionar correctamente', async () => {
		fetchModulo.fetchConToken = jest.fn(() => ({
			json() {
				return {
					ok: true,
					uid: '123',
					name: 'carlos',
					token: '123456ABCTOKEN',
				};
			},
		}));
		await store.dispatch(startChecking());

		const actions = store.getActions();

		// console.log(actions);
		// console.log(token);

		expect(actions[0]).toEqual({
			type: types.authLogin,
			payload: {
				uid: '123',
				name: 'carlos',
			},
		});
		expect(localStorage.setItem).toHaveBeenCalledWith('token', '123456ABCTOKEN');
	});

	test('startLogout funciona', async () => {
		await store.dispatch(startLogout());

		const actions = store.getActions();

		expect(actions[0]).toEqual({
			type: types.authLogout,
		});

		expect(localStorage.removeItem).toHaveBeenCalledWith('token');
		expect(localStorage.removeItem).toHaveBeenCalledWith('token-init-date');
	});
});
