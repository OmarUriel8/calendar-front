import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';
import { eventStartDelete } from '../../../actions/events';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};
let store = mockStore(initState);
store.dispatch = jest.fn();

jest.mock('../../../actions/events', () => ({
	eventStartDelete: jest.fn(),
}));
describe('Pruebas en <DeleteEventFab/>', () => {
	const wrapper = mount(
		<Provider store={store}>
			<DeleteEventFab />
		</Provider>
	);
	beforeEach(() => {
		store = mockStore(initState);
	});

	test('Debe de mostrarse correctamente', () => {
		expect(wrapper).toMatchSnapshot();
	});

	test('Debe de disparar la accion de eventStartDelete', () => {
		wrapper.find('button').prop('onClick')();

		expect(eventStartDelete).toHaveBeenCalled();
		// expect(store.dispatch).toHaveBeenCalled();
		// expect(store.dispatch).toHaveBeenCalledTimes(1);
	});
});
