import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es-mx';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Navbar } from '../ui/Navbar';
import { messages } from '../../helpers/messages-español';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import {
	eventClearActiveEvent,
	eventStartAddNew,
	eventStartLoader,
	setActive,
} from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';
import Swal from 'sweetalert2';

moment.locale('es-mx');
const localizer = momentLocalizer(moment);

export const CalendarPage = () => {
	const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

	const dispatch = useDispatch();
	const { modalOpen } = useSelector((state) => state.ui);
	const { uid } = useSelector((state) => state.auth);
	const { events, activeEvent } = useSelector((state) => state.calendar);

	useEffect(() => {
		dispatch(eventStartLoader());
	}, [dispatch]);

	const onDobleClick = (e) => {
		dispatch(uiOpenModal());
	};

	const onSelectEvent = (e) => {
		dispatch(setActive(e));
	};

	const onViewChange = (e) => {
		// console.log(e);
		setLastView(e);
		localStorage.setItem('lastView', e);
	};

	const eventStyleGetter = (event, start, end, isSelected) => {
		const style = {
			// backgroundColor: '#367cf7',
			// backgroundColor: '#0284C7',
			backgroundColor: event.user._id === uid ? '#06B6D4' : '#465660',
			borderRadius: '0px',
			opacity: '0.8',
			display: 'block',
			color: 'white',
		};

		return { style };
	};

	const onSelectSlot = (e) => {
		// console.log(e);
		dispatch(eventClearActiveEvent());

		Swal.fire({
			title: '¿Estas seguro de crear un nuevo evento?',
			// text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, continuar',
			cancelButtonText: 'No, cancelar',
		}).then((result) => {
			if (result.isConfirmed) {
				const { start, end } = e;
				const event = {
					start,
					end,
					title: 'Nuevo evento...',
					notes: '',
				};
				dispatch(eventStartAddNew(event));
				dispatch(setActive(event));
				dispatch(uiOpenModal());
			}
		});
	};

	return (
		<div
			className="calendar-page"
			style={modalOpen ? { overflow: 'hidden', height: '100vh' } : {}}
		>
			<Navbar />

			<Calendar
				localizer={localizer}
				events={events}
				startAccessor="start"
				endAccessor="end"
				messages={messages}
				eventPropGetter={eventStyleGetter}
				onSelectSlot={onSelectSlot}
				selectable={true}
				components={{
					event: CalendarEvent,
				}}
				view={lastView}
				//eventos
				onDoubleClickEvent={onDobleClick}
				onSelectEvent={onSelectEvent}
				onView={onViewChange}
			/>
			<CalendarModal />
			<AddNewFab />
			{activeEvent && <DeleteEventFab />}
		</div>
	);
};

// const myEventsList = [
// 	{
// 		title: 'Cumpleaños del jefe',
// 		start: moment().toDate(),
// 		end: moment().add(2, 'hour').toDate(),
// 		bgColor: '#fafafa',
// 		notes: 'Comprar el pastel',
// 		user: {
// 			_id: '123',
// 			name: 'Omar',
// 		},
// 	},
// ];
