import { json } from '@sveltejs/kit';

export function GET({ locals }) {
	if (locals.user) {
		return json({
			success: true,
			user: locals.user
		});
	}

	return json(
		{
			success: false,
			message: 'Nicht authentifiziert'
		},
		{ status: 401 }
	);
}
