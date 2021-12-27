<script>
  import PlayButton from "../Common/svg-netflix/Icons/PlayButton.svelte";
  import BgNetflix from "../Common/svg-netflix/Icons/BgNetflix.svelte";
  import BgNetflixMb from "../Common/svg-netflix/Icons/BgNetflixMb.svelte";
</script>

<div class="hidden md:block">
  <div class="w-full h-screen relative">
    <div class="absolute w-full h-full z-10 ">
      <div class="px-20  h-full flex items-center justify-start">
        <div class="hidden lg:flex flex-col w-4/5 py-12 bottom-20">
          <h3 class="text-6xl font-semibold text-white mb-4">
            Explore 50.000+ Movies
          </h3>
          <p class="text-5xl text-white font-thin text-justify">
            Watch anywhere. Cancel anytime
          </p>

          <div class="flex space-x-4 flex-row w-full">
            <a
              href="/movie"
              class=" px-3 mt-5 items-center shadow-md rounded-lg bg-red-600  space-x-2 py-4 justify-center flex w-56"
            >
              <span class="text-white font-semibold text-xl">Play Now</span>
              <PlayButton />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute w-full h-64 bottom-0 bg-gradient-to-t from-black" />
    <BgNetflix />
  </div>
</div>

<div class="block md:hidden">
  <div
    class="w-full  top-0  md:mx-auto absolute h-full bg-cover bg-center bg-mobile  bg-no-repeat"
  >
    <div class="absolute w-full h-full z-10 color-dob">
      <div class="h-full flex items-end justify-center">
        <div class="lg:flex flex-col w-4/5 py-12 bottom-0">
          <h3 class="text-[42px] font-semibold text-white mb-4">
            Explore 50.000+ Movies
          </h3>
          <p class="text-[24px] text-white font-thin text-justify tracking-[2px]">
            Watch anywhere. Cancel anytime
          </p>

          <div class="flex space-x-4 flex-row w-full mt-16">
            <a
              href="/movie"
              class=" px-3 mt-5 items-center shadow-md rounded-lg bg-red-600  space-x-2 py-4 justify-center flex w-full"
            >
              <span class="text-white font-semibold text-xl">Play Now</span>
              <PlayButton />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute w-full h-64 bottom-0 bg-gradient-to-t from-black" />
  </div>
</div>

<style>
  .bg-mobile {
    background-image: url("/assets/images/netmobile.png");
  }
  .color-dob {
    background: linear-gradient(180deg, rgba(4, 7, 10, 0.29) 0%, #0f161d 100%);
  }
</style>
