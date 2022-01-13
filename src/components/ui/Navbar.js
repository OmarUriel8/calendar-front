import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { startLogout } from '../../actions/auth';
import { eventLogout } from '../../actions/events';

export const Navbar = () => {
	const { name } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const handleLogout = () => {
		dispatch(startLogout());
		dispatch(eventLogout());
	};

	return (
		<div className="navbar navbar-dark bg-dark mb-4">
			<span className="navbar-brand">
				{name.split(' ').map((el) => el[0].toUpperCase() + el.slice(1, el.length) + ' ')}
			</span>

			<button className="btn btn-outline-danger" onClick={handleLogout}>
				<i className="fas fa-sign-out-alt"></i>
				<span> Salir</span>
			</button>
		</div>
	);
};
