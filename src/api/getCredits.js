async function getCredits(id) {
  let idMovie = id.replace("/movies/", "");
  console.log(idMovie,'omvie')
  let res = await fetch(
    `https://api.themoviedb.org/3/movie/${idMovie}/credits?api_key=2710a075a597ce49902180854b8f881a&language=en-US`
  );
  let result = await res.json();
  return result;
}

export { getCredits };
