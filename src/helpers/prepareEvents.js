import moment from 'moment';

export const prepereEvents = (eventos = []) => {
	return eventos.map((e) => ({
		...e,
		end: moment(e.end).toDate(),
		start: moment(e.start).toDate(),
	}));
};
