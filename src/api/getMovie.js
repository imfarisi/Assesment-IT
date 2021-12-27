async function getMovie(id) {
  let idMovie = id.replace("/movies/", "");
  let res = await fetch(
    `https://api.themoviedb.org/3/movie/${idMovie}?api_key=2710a075a597ce49902180854b8f881a`
  );
  let result = await res.json();
  return result;
}

export { getMovie };
