import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { AppRouter } from '../../routers/AppRouter';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// store.dispatch = jest.fn();

describe('Pruebas en <AppRouter/>', () => {
	// beforeEach(() => {
	// 	store = mockStore(initState);
	// });

	// test('Debe de mostrar el "espere"', () => {
	//   const initState = {
	//     auth: {
	//       checking: true,
	//     },
	//   };
	//   const store = mockStore(initState);

	// 	const wrapper = mount(
	// 		<Provider store={store}>
	// 			<AppRouter />
	// 		</Provider>
	// 	);

	// 	expect(wrapper).toMatchSnapshot();
	// 	expect(wrapper.find('.loading-screen').exists()).toBe(true);
	// });

	test('Debe de mostrar la ruta publica', () => {
		const initState = {
			auth: {
				checking: false,
				uid: null,
			},
		};
		const store = mockStore(initState);

		const wrapper = mount(
			<Provider store={store}>
				<AppRouter />
			</Provider>
		);

		expect(wrapper).toMatchSnapshot();
		expect(wrapper.find('.login-container').exists()).toBe(true);
	});

	test('Debe de mostrar la ruta privada', () => {
		const initState = {
			auth: {
				checking: false,
				uid: '123123asd12',
				name: 'carlos test',
			},
			calendar: { events: [] },
			ui: { modalOpen: false },
		};
		const store = mockStore(initState);

		const wrapper = mount(
			<Provider store={store}>
				<AppRouter />
			</Provider>
		);

		// Puede fallar por el cambio de mes, lo mejor es comprobar si existen ciertas clases de algun componente
		// expect(wrapper).toMatchSnapshot();
		expect(wrapper.find('.navbar-brand').text()).toBe('Carlos Test ');
		expect(wrapper.find('.calendar-page').exists()).toBe(true);
	});
});
