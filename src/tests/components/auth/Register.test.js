import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { startRegister } from '../../../actions/auth';
import { Register } from '../../../components/auth/Register';
import Swal from 'sweetalert2';
import { act } from '@testing-library/react';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};
let store = mockStore(initState);
store.dispatch = jest.fn();

jest.mock('../../../actions/auth', () => ({
	startRegister: jest.fn(),
}));
jest.mock('sweetalert2', () => ({
	fire: jest.fn(),
}));
describe('Pruebas en <Register/>', () => {
	const wrapper = mount(
		<Provider store={store}>
			<MemoryRouter>
				<Register />
			</MemoryRouter>
		</Provider>
	);
	beforeEach(() => {
		store = mockStore(initState);
		jest.clearAllMocks();
	});

	test('No hay registro si las constraseñas son diferentes', () => {
		wrapper.find('input[name="password2"]').simulate('change', {
			target: { value: '12345qwe', name: 'password2' },
		});
		wrapper.find('input[name="password"]').simulate('change', {
			target: { value: '12345988', name: 'password' },
		});

		wrapper.find('form').simulate('submit', {
			preventDefault: jest.fn(),
		});

		expect(startRegister).not.toHaveBeenCalled();

		expect(Swal.fire).toHaveBeenCalledWith(
			'Error',
			'Las contraseñas no son iguales',
			'error'
		);
	});

	test('Registro con contraseñas iguales', () => {
		wrapper.find('input[name="password2"]').simulate('change', {
			target: { value: '12345qwe', name: 'password2' },
		});
		wrapper.find('input[name="password"]').simulate('change', {
			target: { value: '12345qwe', name: 'password' },
		});

		wrapper.find('form').simulate('submit', {
			preventDefault: jest.fn(),
		});

		expect(startRegister).toHaveBeenCalledWith('correo2@correo.com', 'kenny', '12345qwe');
		expect(Swal.fire).not.toHaveBeenCalled();
	});
});
