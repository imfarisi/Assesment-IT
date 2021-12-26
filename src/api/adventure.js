
async function getAdventure() {
	let res = await fetch(
		`https://api.themoviedb.org/3/discover/movie?api_key=2710a075a597ce49902180854b8f881a&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=1&with_watch_monetization_types=flatrate&with_genres=12`
	);
	let result = await res.json();

	return result;
}

export { getAdventure };

