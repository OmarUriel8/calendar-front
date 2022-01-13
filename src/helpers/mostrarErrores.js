import Swal from 'sweetalert2';
export const mostrarErrores = (body) => {
	if (body.msg) {
		Swal.fire('Error', body.msg, 'error');
	} else {
		let msgs = '';
		Object.values(body.errors)
			.map((er) => er.msg)
			.forEach((msg) => (msgs += msg + '<br>'));
		Swal.fire('Error', msgs, 'error');
	}
};
