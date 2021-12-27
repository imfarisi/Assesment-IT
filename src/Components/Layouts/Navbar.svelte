<script>
  import NetflixIcon from "../../Common/svg-netflix/Icons/NetflixIcon.svelte";
  import MagnifierIcon from "../../Common/svg-netflix/Icons/MagnifierIcon.svelte";
  import ArrowDown from "../../Common/svg-netflix/Icons/ArrowDown.svelte";
  import HamburgerIcon from "../../Common/svg-netflix/Icons/HamburgerIcon.svelte";
  import { fade, fly } from "svelte/transition";
  let isShow = false;
  let value;
  let predection;

  function searchWord() {
    predection = "Spirderman";
  }
</script>

<!-- <div
  class=" p-9 blur-sm fixed top-0 w-full z-40 bg-gradient-to-b from-gray-600 opacity-50 "
/> -->

<div
  class="p-9 blur-movies fixed top-0 left-0 w-full blur-[5px] backdrop-blur-[5px] z-40"
/>

<div
  class="text-white body-font fixed top-0 w-full z-50 g-gradient-to-t bg-transparent"
>
  {#if !isShow}
    <!-- start between -->
    <div
      class="md:px-24 flex-wrap md:flex  p-5 justify-between"
      in:fade={{
        delay: 500,
        duration: 500,
      }}
    >
      <div class="flex justify-between">
        <div class="flex">
          <a
            href="/"
            class="flex title-font font-medium items-center text-white mb-4 md:mb-0"
          >
            <NetflixIcon />
          </a>
        </div>

        <div class="lg:hidden flex">
          <!-- <HamburgerIcon/> -->
        </div>
        <div class="lg:hidden flex">
          <HamburgerIcon />
        </div>
      </div>

      <div>
        <div class="hidden lg:flex flex-row w-full text-base font-thin">
          <div class="mx-3">All Genre</div>
          <div class="mx-3 flex">
            <MagnifierIcon />
            <button
              class="mx-auto bg-transparent text-white "
              on:click={() => (isShow = true)}
            >
              Search
            </button>
          </div>
          <div class="mx-3">View Plans</div>
        </div>
      </div>
      <div class="hidden lg:flex">
        <button
          type="button"
          class="text-white-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        >
          <div class="flex">
            <div>
              <p class="text-white font-medium">En</p>
            </div>
            <div class="mt-2 mx-2">
              <ArrowDown />
            </div>
          </div>
        </button>
      </div>
    </div>
    <!-- end between -->
  {:else}
    <div
      class="px-24 flex-wrap md:flex  p-5 justify-start"
      in:fly={{ x: 200, duration: 500 }}
      out:fly={{ x: 200, duration: 500 }}
    >
      <div class="mx-3">
        <a
          href="#"
          class="flex title-font font-medium items-center text-white mb-4 md:mb-0"
        >
          <NetflixIcon />
        </a>
      </div>
      <MagnifierIcon />

      <div class="flex">
        <input class="bg-transparent " disabled bind:value={predection} />
        <input
          bind:value
          class="absolute bg-transparent outline-none"
          on:input={searchWord}
          on:blur={() => (isShow = false)}
        />
      </div>
    </div>
  {/if}
</div>

<style>
  .blur-movies {
    background: linear-gradient(
      180deg,
      rgba(15, 22, 29, 0.56) 0%,
      rgba(15, 22, 29, 0) 100%
    );
  }
</style>
