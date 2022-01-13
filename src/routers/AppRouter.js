import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { startChecking } from '../actions/auth';
import { CalendarPage } from '../components/calendar/CalendarPage';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { AuthRouter } from './AuthRouter';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

export const AppRouter = () => {
	const dispatch = useDispatch();

	const { checking, uid } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(startChecking());
	}, [dispatch]);

	if (checking) {
		return <LoadingScreen />;
	}
	return (
		<Router>
			<div>
				<Switch>
					<PublicRoute path="/auth" component={AuthRouter} isAuthenticated={!!uid} />

					<PrivateRoute exact path="/" component={CalendarPage} isAuthenticated={!!uid} />

					<Redirect to="/auth" />
				</Switch>
			</div>
		</Router>
	);
};
