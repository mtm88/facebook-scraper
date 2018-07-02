function parseQueryParams(rawURL) {
	const queryParams = {};
	rawURL.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), ($0, $1, $2, $3) => queryParams[$1] = $3);

	return queryParams;
}

export {
	parseQueryParams,
};
