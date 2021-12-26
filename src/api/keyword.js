async function getKeyword(url) {
  let urlKey = url.replace("/movies/", "");

  urlKey = encodeURIComponent(urlKey.toLowerCase().replace(/-/g, " "));
  let res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=2710a075a597ce49902180854b8f881a&language=en-US&query=${urlKey}`
  );
  let result = await res.json();
  return result.results[0];
}

export { getKeyword };
