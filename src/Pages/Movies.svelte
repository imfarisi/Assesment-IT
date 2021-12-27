<script>
  import { getMovie } from "../api/getMovie";
  import DolbyIcon from "../Common/svg-netflix/Icons/DolbyIcon.svelte";
  import Dolby2Icon from "../Common/svg-netflix/Icons/Dolby2Icon.svelte";
  import PlayButton from "../Common/svg-netflix/Icons/PlayButton.svelte";
  import Credits from "../Components//Main/Credits.svelte";
  import Kredits from "../Components//Main/Kredits.svelte";
  import Production from "../Components/Main/Production.svelte";
  import { fly, fade, scale } from "svelte/transition";
  import StarIcon from "../Common/svg-netflix/Icons/StarIcon.svelte";
  import { getCredits } from "../api/getCredits";
  import { onMount } from "svelte";
  export let currentRoute;
  let isShow = false;
  let isHide = false;
  let dataCredits = getCredits(currentRoute.path);
  let dataMovie = getMovie(currentRoute.path);

  function getStyleFromURL(url) {
    return `--bg-image-url:url('${url}');`;
  }

  let params = new URLSearchParams(window.location.search);

  $: if (params.has("play")) {
    if (params.get("play") === "1") {
      isShow = true;
      isHide = true;
    }
  }
</script>

{#await dataMovie then itemKey}
  {#await dataCredits then credits}
    <div class="w-full md:h-screen relative">
      <!-- image dynamic -->
      {#if !isHide == true}
        <div class="relative">
          <div
            class=" md:w-full bg-center bg-movies h-screen"
            style={getStyleFromURL(
              `https://image.tmdb.org/t/p/original/${itemKey.backdrop_path}`
            )}
          />
        </div>
      {/if}
      <!-- end image -->
      <!-- caption -->
      {#if isShow == false}
        <div class="onlyme absolute top-0 left-0 h-full w-full" />
        <div
          class="absolute h-full z-10 top-72 md:top-44 left-4 right-4 md:left-24 text-white"
          out:fly={{ y: 600, duration: 800 }}
        >
          <h3 class="text-[42px] font-[900] text-white mb-4">
            {itemKey.title}
          </h3>
          <div class="flex flex-col">
            <p
              class="text-[16px] text-white font-normal md:w-[522px] order-last md:order-first my-2"
            >
              {itemKey.overview}
            </p>
            <p class="text-xs text-gray-500 font-thin mt-2">
              {#each itemKey.genres as genres}
                {genres.name} ,
              {/each}
            </p>

            <div class="flex">
              <DolbyIcon />
              <Dolby2Icon />
            </div>

            <div class="flex">
              <div class="mx-2"><StarIcon /></div>
              {itemKey.vote_average}
            </div>

            <div class="flex space-x-4 flex-row w-full">
              <button
                class=" px-3 mt-5 items-center shadow-md rounded-lg bg-[#FF4244]  space-x-2 py-4 justify-center flex w-full md:w-[301px] h-[50px] md:h-[75px]"
                on:click={() => {
                  isShow = !isShow;
                  isHide = !isHide;
                }}
              >
                <span class="text-white font-semibold text-xl">Play Now</span>
                <PlayButton />
              </button>
            </div>
          </div>
        </div>
      {:else}
        <div
          class="absolute w-full text-white top-0 z-30"
          in:scale={{ delay: 200, duration: 1000, start: 0.8 }}
        >
          <div class="h-[35vh] md:h-screen w-full absolute video-container">
            <iframe
              class="w-full h-full"
              src="https://www.youtube.com/embed/rt-2cxAiPJk?&autoplay=1&loop=1&rel=0&showinfo=0&color=white&iv_load_policy=3&playlist=rt-2cxAiPJk"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
        </div>
      {/if}
      <!-- end caption -->
    </div>

    <!-- credit  -->
    <div class="mt-5 grid grid-cols-1 md:grid-cols-2 w-full">
      {#if isShow}
        <div
          class="px-4 md:px-20 text-white left-4 mt-[17rem] md:mt-0"
          in:fade={{ delay: 400, duration: 10 }}
        >
          <h3 class="text-[32px] md:text-[42px] font-[900] text-white mb-4">
            {itemKey.title}
          </h3>
          <div class="md:flex-col">
            <p
              class="text-[16px] text-white font-normal md:w-[522px] order-last md:order-first my-2"
            >
              {itemKey.overview}
            </p>
            <p class="text-xs text-gray-500 font-thin mt-2">
              {#each itemKey.genres as genres}
                {genres.name} ,
              {/each}
            </p>

            <div class="flex">
              <DolbyIcon />
              <Dolby2Icon />
            </div>
            <div class="flex">
              <div class="mx-2"><StarIcon /></div>
              {itemKey.vote_average}
            </div>
          </div>
        </div>

        <div
          class="w-2/3 px-2 md:px-4 text-white"
          in:fly={{ x: -300, duration: 800 }}
        >
          <div class="px-4 md:px-20">
            <h3 class="text-[32px] font-bold ">Credits</h3>
          </div>
          {#each credits.cast as actor}
            <Credits {actor} />
          {/each}
        </div>
      {:else}
        <div class="w-2/3 px-2 md:px-4 text-white">
          <div class="px-4 md:px-20">
            <h3 class="text-[32px] font-bold">Credits</h3>
          </div>
          {#each credits.cast as actor}
            <Credits {actor} />
          {/each}
        </div>
        <div class="w-2/3 px-2 md:px-4 text-white">
          <div class="px-4 md:px-20">
            <h3 class="text-[32px] font-bold">Production</h3>
          </div>
          {#each itemKey.production_companies as production}
            <Production {production} />
          {/each}
        </div>
      {/if}
    </div>
  {/await}
{/await}

<style>
  .onlyme {
    background: linear-gradient(180deg, rgba(4, 7, 10, 0.29) 0%, #0f161d 100%);
  }
  .bg-movies {
    background-image: var(--bg-image-url);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .video-container {
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 30px;
    height: 0;
    overflow: hidden;
  }

  .video-container iframe,
  .video-container object,
  .video-container embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-height: 100vh;
  }
</style>
