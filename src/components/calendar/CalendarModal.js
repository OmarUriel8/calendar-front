import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import {
	eventClearActiveEvent,
	eventStartAddNew,
	eventStartUpdate,
} from '../../actions/events';

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};

if (process.env.NODE_ENV !== 'test') {
	Modal.setAppElement('#root');
}

const now = moment().minutes(0).seconds(0).add(1, 'h');
const nowPlus1 = now.clone().add(1, 'hours');

const initEvent = {
	title: 'Evento',
	notes: '',
	start: now.toDate(),
	end: nowPlus1.toDate(),
};

export const CalendarModal = () => {
	const dispatch = useDispatch();
	const { modalOpen } = useSelector((state) => state.ui);
	const { activeEvent } = useSelector((state) => state.calendar);

	const [dateStart, setDateStart] = useState(now.toDate());
	const [dateEnd, setDateEnd] = useState(nowPlus1.toDate());
	const [titleValid, setTitleValid] = useState(true);

	const [formValues, setFormValues] = useState(initEvent);

	const { title, notes, start, end } = formValues;

	useEffect(() => {
		if (activeEvent) {
			setFormValues(activeEvent);
			setDateStart(activeEvent.start);
			setDateEnd(activeEvent.end);
		} else {
			setFormValues(initEvent);
			setDateStart(now.toDate());
			setDateEnd(nowPlus1.toDate());
		}
	}, [activeEvent]);

	const handleInputChange = ({ target }) => {
		setFormValues({
			...formValues,
			[target.name]: target.value,
		});
	};

	const handleStartDateChange = (e) => {
		setDateStart(e);
		setFormValues({
			...formValues,
			start: e,
		});
	};

	const handleEndDateChange = (e) => {
		setDateEnd(e);
		setFormValues({
			...formValues,
			end: e,
		});
	};

	const closeModal = () => {
		setFormValues(initEvent);
		setDateStart(now.toDate());
		setDateEnd(nowPlus1.toDate());
		dispatch(uiCloseModal());
		dispatch(eventClearActiveEvent());
	};

	const handleSubmitForm = (e) => {
		e.preventDefault();
		const momentStart = moment(start);
		const momentEnd = moment(end);

		if (momentStart.isSameOrAfter(momentEnd)) {
			return Swal.fire({
				title: 'Error',
				text: 'La fecha fin debe ser mayor a la fecha de inicio',
				icon: 'error',
				confirmButtonColor: '#007bff',
			});
		}
		if (title.trim().length < 2) {
			return setTitleValid(false);
		}
		if (notes.trim().length > 250) {
			return Swal.fire({
				title: 'Error',
				text: 'El número de caracteres de las notas debe ser menor a 250',
				icon: 'error',
				confirmButtonColor: '#007bff',
			});
		}
		if (activeEvent) {
			dispatch(eventStartUpdate(formValues));
		} else {
			dispatch(eventStartAddNew(formValues));
		}

		setTitleValid(true);
		closeModal();
	};

	return (
		<Modal
			className="modal"
			overlayClassName="modal-fondo"
			closeTimeoutMS={200}
			isOpen={modalOpen}
			// onAfterOpen={afterOpenModal}
			onRequestClose={closeModal}
			style={customStyles}
			contentLabel="Example Modal"
		>
			<div className="box-title-close container">
				<button className="btn-close text-danger" onClick={closeModal}>
					<i className="far fa-times-circle"></i>
				</button>
				<h1>{activeEvent ? 'Editar Evento' : 'Nuevo evento'}</h1>
			</div>

			<hr />
			<form className="container" onSubmit={handleSubmitForm}>
				<div className="form-group">
					<label>Fecha y hora inicio</label>
					<DateTimePicker
						className="form-control"
						format="y-MM-dd h:mm a"
						onChange={handleStartDateChange}
						value={dateStart}
					/>
				</div>

				<div className="form-group">
					<label>Fecha y hora fin</label>
					<DateTimePicker
						className="form-control"
						format="y-MM-dd h:mm a"
						onChange={handleEndDateChange}
						value={dateEnd}
						minDate={dateStart}
					/>
				</div>

				<hr />
				<div className="form-group">
					<label>Titulo y notas</label>
					<input
						type="text"
						className={`form-control ${!titleValid && 'is-invalid'}`}
						placeholder="Título del evento"
						name="title"
						autoComplete="off"
						value={title}
						onChange={handleInputChange}
					/>
					<small id="emailHelp" className="form-text text-muted">
						Una descripción corta
					</small>
				</div>

				<div className="form-group">
					<textarea
						style={{ resize: 'none' }}
						type="text"
						className="form-control"
						placeholder="Notas"
						rows="5"
						name="notes"
						value={notes}
						onChange={handleInputChange}
					></textarea>
					<small id="emailHelp" className="form-text text-muted">
						Información adicional
					</small>
				</div>

				<button type="submit" className="btn btn-outline-primary btn-block">
					<i className="far fa-save"></i>
					<span> Guardar</span>
				</button>
			</form>
		</Modal>
	);
};
