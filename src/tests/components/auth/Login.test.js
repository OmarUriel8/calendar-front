import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Login } from '../../../components/auth/Login';
import { MemoryRouter } from 'react-router';
import { startLogin } from '../../../actions/auth';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};
let store = mockStore(initState);
store.dispatch = jest.fn();

jest.mock('../../../actions/auth', () => ({
	startLogin: jest.fn(),
}));

describe('Pruebas en <Login/>', () => {
	const wrapper = mount(
		<Provider store={store}>
			<MemoryRouter>
				<Login />
			</MemoryRouter>
		</Provider>
	);
	beforeEach(() => {
		store = mockStore(initState);
	});

	test('Debe mostrarse correctamente', () => {
		expect(wrapper).toMatchSnapshot();
	});

	test('Debe de llamar el dispatch del login', () => {
		wrapper.find('input[name="email"]').simulate('change', {
			target: {
				name: 'email',
				value: 'omar@correo.com',
			},
		});

		wrapper.find('input[name="password"]').simulate('change', {
			target: {
				name: 'password',
				value: 'asdfgh',
			},
		});

		wrapper.find('form').prop('onSubmit')({
			preventDefault: jest.fn(),
		});

		expect(startLogin).toHaveBeenCalledWith('omar@correo.com', 'asdfgh');
	});
});
