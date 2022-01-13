import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import validator from 'validator';
import { startRegister } from '../../actions/auth';
import { useForm } from '../../hooks/useForm';
import './login-register.css';

export const Register = () => {
	const [nameValid, setNameValid] = useState(true);
	const [emailValid, setEmailValid] = useState(true);
	const [passwordValid, setPasswordValid] = useState(true);
	const [passwordValid2, setPasswordValid2] = useState(true);
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();

	const [formValues, handleInputChange] = useForm({
		name: 'kenny',
		email: 'correo2@correo.com',
		password: '123456',
		password2: '123456',
	});

	const { email, password, password2, name } = formValues;

	const handleRegister = (e) => {
		let valid = true;
		e.preventDefault();
		setEmailValid(true);
		setNameValid(true);
		setPasswordValid(true);
		setPasswordValid2(true);

		if (!validator.isEmail(email)) {
			setEmailValid(false);
			valid = false;
		}

		if (!validator.isAlpha(name)) {
			setNameValid(false);
			valid = false;
		}

		if (!validator.isLength(password, { min: 6 })) {
			setPasswordValid(false);
			valid = false;
		}

		if (!validator.isLength(password2, { min: 6 })) {
			setPasswordValid2(false);
			valid = false;
		}

		if (password !== password2) {
			setPasswordValid2(false);
			Swal.fire('Error', 'Las contraseñas no son iguales', 'error');
			valid = false;
		}

		if (valid) {
			setLoading(true);
			dispatch(startRegister(email, name, password));
		}
	};
	return (
		<div className="container login-container mb-5">
			<div className="row">
				<div className="col-md-6 login-form-2 offset-md-3">
					<h3>Registro</h3>
					<form onSubmit={handleRegister}>
						<div className="form-group">
							<input
								type="text"
								className={`form-control ${!nameValid && 'is-invalid'} `}
								placeholder="Nombre"
								onChange={handleInputChange}
								value={name}
								name="name"
							/>
						</div>
						<div className="form-group">
							<input
								type="email"
								className={`form-control ${!emailValid && 'is-invalid'} `}
								placeholder="Correo"
								onChange={handleInputChange}
								value={email}
								name="email"
							/>
						</div>
						<div className="form-group">
							<input
								type="password"
								className={`form-control ${!passwordValid && 'is-invalid'} `}
								placeholder="Contraseña"
								onChange={handleInputChange}
								value={password}
								name="password"
							/>
						</div>

						<div className="form-group">
							<input
								type="password"
								className={`form-control ${!passwordValid2 && 'is-invalid'} `}
								placeholder="Repita la contraseña"
								onChange={handleInputChange}
								value={password2}
								name="password2"
							/>
						</div>

						<div className="form-group">
							<input
								type="submit"
								className="btnSubmit"
								value="Crear cuenta"
								disabled={loading}
							/>
						</div>
						<Link to="/auth/login" className="back-login">
							¿Ya tienes una cuenta?, Iniciar Sesión
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
};
