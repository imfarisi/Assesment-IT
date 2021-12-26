async function getTrending(url) {
	let res = await fetch(
		`https://api.themoviedb.org/3/trending/movie/day?api_key=2710a075a597ce49902180854b8f881a`
	);
	let result = await res.json();
	console.log('test',url)
	return result;
}

export { getTrending };
