import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Login } from '../components/auth/Login';
import { Register } from '../components/auth/Register';

export const AuthRouter = () => {
	return (
		<Switch>
			<Route path="/auth/login" component={Login} />

			<Route path="/auth/register" component={Register} />

			<Redirect to="/auth/login" />
		</Switch>
	);
};
