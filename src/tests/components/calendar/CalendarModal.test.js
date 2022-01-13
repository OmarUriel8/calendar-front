import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import moment from 'moment';
import { CalendarModal } from '../../../components/calendar/CalendarModal';
import {
	eventClearActiveEvent,
	eventStartAddNew,
	eventStartUpdate,
} from '../../../actions/events';
import { act } from '@testing-library/react';
import Swal from 'sweetalert2';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const now = moment().minutes(0).seconds(0).add(1, 'h');
const nowPlus1 = now.clone().add(1, 'hours');
const initState = {
	calendar: {
		events: [],
		activeEvent: {
			title: 'hola',
			notes: 'bro',
			start: now.toDate(),
			end: nowPlus1.toDate(),
		},
	},
	auth: {
		uid: '123wqe12',
		name: 'carlos',
	},
	ui: {
		modalOpen: true,
	},
};

jest.mock('../../../actions/events', () => ({
	eventStartUpdate: jest.fn(),
	eventClearActiveEvent: jest.fn(),
	eventStartAddNew: jest.fn(),
}));

jest.mock('sweetalert2', () => ({
	fire: jest.fn(),
}));

let store = mockStore(initState);
store.dispatch = jest.fn();

describe('Pruebas en <CalendarModal/>', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const wrapper = mount(
		<Provider store={store}>
			<CalendarModal />
		</Provider>
	);
	test('Debe de mostrar el modal', () => {
		expect(wrapper.find('Modal').prop('isOpen')).toBe(true);
	});

	test('Debe de llamar la accion de actualizar y cerrar modal', () => {
		wrapper.find('form').simulate('submit', {
			preventDefault: jest.fn(),
		});

		expect(eventStartUpdate).toHaveBeenCalledWith(initState.calendar.activeEvent);
		expect(eventClearActiveEvent).toHaveBeenCalled();
	});

	test('Debe de mostrar error si falta el titulo', () => {
		wrapper
			.find('input[name="title"]')
			.simulate('change', { target: { name: 'title', value: '' } });
		wrapper.find('form').simulate('submit', {
			preventDefault: jest.fn(),
		});
		expect(wrapper.find('input[name="title"]').hasClass('is-invalid')).toBe(true);
	});

	test('Debe de crear un nuevo evento', () => {
		const initState = {
			calendar: {
				events: [],
				activeEvent: null,
			},
			auth: {
				uid: '123wqe12',
				name: 'carlos',
			},
			ui: {
				modalOpen: true,
			},
		};
		const store = mockStore(initState);
		store.dispatch = jest.fn();
		const wrapper = mount(
			<Provider store={store}>
				<CalendarModal />
			</Provider>
		);

		wrapper.find('input[name="title"]').simulate('change', {
			target: { name: 'title', value: 'Nuevo evento para las pruebas' },
		});
		wrapper.find('form').simulate('submit', {
			preventDefault: jest.fn(),
		});

		expect(eventStartAddNew).toHaveBeenCalledWith({
			end: expect.anything(),
			start: expect.anything(),
			notes: '',
			title: 'Nuevo evento para las pruebas',
		});

		expect(eventClearActiveEvent).toHaveBeenCalled();
	});

	test('Debe de validar las fechas', () => {
		wrapper.find('input[name="title"]').simulate('change', {
			target: { name: 'title', value: 'Nuevo evento para las pruebas' },
		});

		const hoy = new Date();
		act(() => {
			wrapper.find('DateTimePicker').at(1).prop('onChange')(hoy);
		});
		wrapper.find('form').simulate('submit', {
			preventDefault: jest.fn(),
		});

		expect(Swal.fire).toHaveBeenCalledWith({
			confirmButtonColor: '#007bff',
			icon: 'error',
			text: 'La fecha fin debe ser mayor a la fecha de inicio',
			title: 'Error',
		});
	});
});
