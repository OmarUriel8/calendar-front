import { uiCloseModal, uiOpenModal } from '../../actions/ui';
import { uiReducer } from '../../reducer/uiReducer';

describe('Pruebas en uiReducer', () => {
	const initState = {
		modalOpen: false,
	};
	test('Debe de retornar el estado por defecto ', () => {
		const state = uiReducer(initState, {});
		expect(state).toEqual(initState);
	});

	test('Debe de abbrir y cerrar el modal', () => {
		const modalOpen = uiOpenModal();
		const state = uiReducer(initState, modalOpen);

		expect(state).toEqual({
			modalOpen: true,
		});

		const modalClose = uiCloseModal();
		const stateClose = uiReducer(initState, modalClose);

		expect(stateClose).toEqual({
			modalOpen: false,
		});
	});
});
