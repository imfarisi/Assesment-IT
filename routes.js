import Index from "./src/Pages/Index.svelte";
import DetailMovies from "./src/Pages/DetailMovies.svelte";
import HomeLayout from "./src/Components/Layouts/HomeLayout.svelte";
import Movie from "./src/Pages/Movie.svelte";
import Movies from "./src/Pages/Movies.svelte";

const routes = [
  {
    name: "/detailmovies",
    component: DetailMovies,
    layout: HomeLayout,
  },
  {
    name: "/",
    component: Index,
    layout: HomeLayout,
  },
  {
    name: "/movie",
    component: Movie,
    layout: HomeLayout,
  },
  { name: "movies/:id", component: Movies, layout: HomeLayout },
];
export { routes };
