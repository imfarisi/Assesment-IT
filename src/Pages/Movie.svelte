<script>
  import Credits from "../Components//Main/Credits.svelte";
  import DolbyIcon from "../Common/svg-netflix/Icons/DolbyIcon.svelte";
  import Dolby2Icon from "../Common/svg-netflix/Icons/Dolby2Icon.svelte";
  import PlayButton from "../Common/svg-netflix/Icons/PlayButton.svelte";
  import { getTrending } from "../api/trending";
  import { getMovie } from "../api/getMovie";
  import ArrowRight from "../Common/svg-netflix/Icons/ArrowRight.svelte";
  import ArrowLeft from "../Common/svg-netflix/Icons/ArrowLeft.svelte";
  import { getMovies } from "../api/getMovies";
  export let params, currentRoute;
  import Genre from "../Components/Main/Genre.svelte";

  let dataMovie = getMovie(currentRoute.path);
  let listGenreIds = [16, 12, 28];
  let listGenre = ["Animated", "Adventure", "Super Hero"];
  let datas = [];

  for (let i = 0; i < listGenreIds.length; i++) {
    datas[i] = getMovies(listGenreIds[i]);
  }

  let data = getTrending();
  let box;
  let x = 0;
  let maxX;

  function scroll() {
    x = box.scrollLeft;
    maxX = box.scrollWidth - box.clientWidth;
  }
</script>

{#await data}
  <p>...waiting</p>
{:then items}
  <div class="py-20">
    <div class="w-full flex gap-8 snap-x overflow-x-auto px-10 lg:px-20">
      {#each items.results.slice(0, 5) as res}
        <div class="snap-center scroll-ml-6 shrink-0 relative w-full ">
          <img
            class="rounded-lg lg:rounded-3xl px-0 filter brightness-75"
            src="https://image.tmdb.org/t/p/original/{res.backdrop_path}"
            alt="poster"
          />
          <div
            class="absolute w-full px-10 lg:px-20 pt-10 lg:pt-20 bottom-0 bg-gradient-to-t from-gray-900 rounded-3xl text-white"
          >
            <div class=" hidden lg:block w-3/6 py-24">
              <h3 class="font-semibold text-white mb-4 text-3xl">
                {res.original_title}
              </h3>
              <p class="text-base text-white font-thin text-justify">
                {res.overview}
              </p>
              <p class="text-xs text-gray-500 font-thin mt-2">
                Sci-Fi, Action, Comedy, Adventure
              </p>
              <div class="flex">
                <DolbyIcon />
                <Dolby2Icon />
              </div>
              <div class="flex space-x-4 flex-row w-full">
                <button
                  class=" px-3 mt-5 items-center shadow-md rounded-lg bg-red-600  space-x-2 py-4 justify-center flex w-56"
                >
                  <span class="text-white font-semibold text-xl">Watch Now</span
                  >
                  <PlayButton />
                </button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/await}

{#await data}
  <p>...waiting</p>
{:then items}
  <div class="">
    <div class="flex justify-between">
      <div>
        <p class="text-white m-5 text-4xl font-bold lg:px-16">Best of all</p>
      </div>
      <div class="mx-10 lg:mx-20">
        <button
          class="p-4 rounded-md button-next-previous"
          disabled={x == 0}
          on:click={() => {
            box.scrollBy({
              left: -box.clientWidth,
              behavior: "smooth",
            });
          }}
        >
          <ArrowLeft />
        </button>

        <button
          disabled={x == maxX}
          class="p-4 rounded-md button-next-previous"
          on:click={() => {
            box.scrollBy({
              left: box.clientWidth,
              behavior: "smooth",
            });
          }}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
    <div
      class="w-full flex gap-2 lg:gap-12 snap-x overflow-x-auto my-10 "
      bind:this={box}
      on:scroll={scroll}
    >
      {#each items.results as res}
        <div
          class="snap-start scroll-ml-6 shrink-0 relative first:pl-5 last:pr-5 lg:first:pl-20 lg:last:pr-20 "
        >
          <img
            class="lg:rounded-3xl filter brightness-75 w-[126px] md:w-[269px] h-[189px] md:h-[403px] rounded-xl"
            width="269"
            height="403"
            src="https://image.tmdb.org/t/p/original/{res.poster_path}"
            alt="poster"
          />
        </div>
      {/each}
    </div>
  </div>
{/await}

{#each datas as dataGenre, i}
  {#await dataGenre}
    <p>...waiting</p>
  {:then items}
    <Genre {items} title={listGenre[i]} {dataMovie} />
  {/await}
{/each}
