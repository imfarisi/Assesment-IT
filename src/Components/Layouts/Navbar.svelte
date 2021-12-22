<script>
  import NetflixIcon from "../../Common/svg-netflix/Icons/NetflixIcon.svelte";
  import MagnifierIcon from "../../Common/svg-netflix/Icons/MagnifierIcon.svelte";
  import ArrowDown from "../../Common/svg-netflix/Icons/ArrowDown.svelte";
</script>

<div
  class="text-white body-font fixed top-0 bg-gradient-to-b from-black w-full z-50 "
>
  <div class="px-24 flex-wrap md:flex  p-5 justify-between">
    <div>
      <a href="#"
        class="flex title-font font-medium items-center text-white mb-4 md:mb-0"
      >
        <NetflixIcon />
      </a>
    </div>
    <div>
      <div class="hidden lg:flex flex-row w-full text-base font-thin">
        <div class="mx-3">All Genre</div>
        <div class="mx-3 flex"><MagnifierIcon />Search</div>
        <div class="mx-3">View Plans</div>
      </div>
    </div>
    <div class="hidden lg:flex">
      <button
        type="button"
        class="text-white-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
      >
        <span class="sr-only">View notifications</span>
        <div class="flex">
          <div>
            <p class="text-white text-base">EN</p>
          </div>
          <div class="mt-2 mx-2">
            <ArrowDown/>
          </div>
        </div>
      </button>
    </div>
  </div>
</div>
