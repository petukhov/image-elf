import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
	const error = useRouteError();
	return (
		<>
			<h1>Oops...</h1>
			<p>
				{isRouteErrorResponse(error)
					? 'An unexpected error occurred...'
					: 'This page does not exist'}
			</p>
		</>
	);
};

export default ErrorPage;
