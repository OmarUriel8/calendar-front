import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { CalendarPage } from '../../../components/calendar/CalendarPage';
import { messages } from '../../../helpers/messages-español';
import { types } from '../../../types/types';
import * as eventsModules from '../../../actions/events';
import { uiOpenModal } from '../../../actions/ui';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {
	calendar: {
		events: [],
	},
	auth: {
		uid: '123wqe12',
		name: 'carlos',
	},
	ui: {
		modalOpen: false,
	},
};
let store = mockStore(initState);
store.dispatch = jest.fn();
Storage.prototype.setItem = jest.fn();

jest.mock('../../../actions/ui', () => ({
	uiOpenModal: jest.fn(),
}));
const wrapper = mount(
	<Provider store={store}>
		<CalendarPage />
	</Provider>
);

describe('Pruebas en <CalendarPage/>', () => {
	beforeEach(() => {
		store = mockStore(initState);
		jest.clearAllMocks();
	});

	test('Debe de mostrarse corrrectamente', () => {
		expect(wrapper).toMatchSnapshot();
	});

	test('Pruebas con las interacciones del calendario', () => {
		eventsModules.setActive = jest.fn();
		const calendar = wrapper.find('Calendar');

		const calendarMessages = calendar.prop('messages');
		expect(calendarMessages).toEqual(messages);

		calendar.prop('onDoubleClickEvent')();

		expect(uiOpenModal).toHaveBeenCalled();

		calendar.prop('onSelectEvent')({ start: 'hola' });
		expect(eventsModules.setActive).toHaveBeenCalledWith({ start: 'hola' });

		calendar.prop('onView')('week');
		expect(localStorage.setItem).toHaveBeenCalledWith('lastView', 'week');
	});
});
