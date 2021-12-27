<script>
  import ArrowRight from "../../Common/svg-netflix/Icons/ArrowRight.svelte";
  import ArrowLeft from "../../Common/svg-netflix/Icons/ArrowLeft.svelte";
  export let items;
  export let title;

  let box;
  let x = 0;
  let maxX;

  function scrollMovies() {
    x = box.scrollLeft;
    maxX = box.scrollWidth - box.clientWidth;
  }
</script>

<div class="">
  <div class="flex justify-between">
    <div>
      <p class="text-white m-5 text-4xl font-bold lg:px-16">
        {title}
      </p>
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
        class="p-4 rounded-md button-next-previous"
        disabled={x == maxX}
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
    class="w-full flex gap-2 lg:gap-12 snap-x overflow-x-auto my-10 hide-scroll"
    bind:this={box}
    on:scroll={scrollMovies}
  >
    {#each items.results as res}
      <div
        class="snap-start scroll-ml-6 shrink-0 relative first:pl-5 last:pr-5 lg:first:pl-20 lg:last:pr-20"
      >
        <a
          href={`/movies/${res.id}`}
        >
          <img
            class="lg:rounded-3xl filter brightness-75 w-[126px] md:w-[269px] h-[189px] md:h-[403px] rounded-xl"
            src="https://image.tmdb.org/t/p/original/{res.poster_path}"
            alt="poster"
          />
        </a>
      </div>
    {/each}
  </div>
</div>
