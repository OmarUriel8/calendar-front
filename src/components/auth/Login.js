import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import validator from 'validator';
import { startLogin } from '../../actions/auth';
import { useForm } from '../../hooks/useForm';
import './login-register.css';

export const Login = () => {
	const [emailValid, setEmailValid] = useState(true);
	const [passwordValid, setPasswordValid] = useState(true);
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();

	const [formValues, handleInputChange] = useForm({
		email: 'correo@correo.com',
		password: '123456',
	});

	const { email, password } = formValues;

	const handleLogin = (e) => {
		let valid = true;
		e.preventDefault();
		setEmailValid(true);
		setPasswordValid(true);
		if (!validator.isEmail(email)) {
			setEmailValid(false);
			valid = false;
		}
		if (!validator.isLength(password, { min: 6 })) {
			setPasswordValid(false);
			valid = false;
		}

		if (valid) {
			setLoading(true);
			dispatch(startLogin(email, password));
		}
	};
	return (
		<div className="container login-container mb-5">
			<div className="row">
				<div className="col-md-6 login-form-1 offset-md-3">
					<h3>Ingreso</h3>
					<form onSubmit={handleLogin}>
						<div className="form-group">
							<input
								type="email"
								className={`form-control ${!emailValid && 'is-invalid'} `}
								placeholder="Correo"
								name="email"
								value={email}
								onChange={handleInputChange}
							/>
						</div>
						<div className="form-group">
							<input
								type="password"
								className={`form-control ${!passwordValid && 'is-invalid'} `}
								placeholder="Contraseña"
								name="password"
								value={password}
								onChange={handleInputChange}
							/>
						</div>
						<div className="form-group">
							<input
								type="submit"
								className={`btnSubmit`}
								value="Login"
								disabled={loading}
							/>
						</div>
						<Link to="/auth/register">¿Aún no tienes una cuenta?, Registrate</Link>
					</form>
				</div>
			</div>
		</div>
	);
};
