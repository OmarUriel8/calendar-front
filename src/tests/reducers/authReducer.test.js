import { authReducer } from '../../reducer/authReducer';
import { types } from '../../types/types';

describe('Pruebas en el authReducer ', () => {
	const initialState = {
		checking: true,
		// uid:null,
		// name: null,
	};
	test('Debe retornar el estado por defecto', () => {
		const state = authReducer(initialState, {});
		expect(state).toEqual(initialState);
	});

	test('Debe de funcionar la opcion authLogin', () => {
		const state = authReducer(initialState, {
			type: types.authLogin,
			payload: {
				uid: '12341asda',
				name: 'omar',
			},
		});

		expect(state).toEqual({
			checking: false,
			uid: '12341asda',
			name: 'omar',
		});
	});

	test('Debe de funcionar la opcion authCheckingFinish', () => {
		const state = authReducer(initialState, { type: types.authCheckingFinish });

		expect(state).toEqual({ checking: false });
	});

	test('dede de funcionar la opcion authLogout', () => {
		const state = authReducer(initialState, { type: types.authLogout });

		expect(state).toEqual({ checking: false });
	});
});
