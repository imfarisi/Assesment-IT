<script>
  import Navbar from "../src/Components/Layouts/Navbar.svelte";
  import Credits from "../src/Components/Main/Credits.svelte";
  import DolbyIcon from "../src/Common/svg-netflix/Icons/DolbyIcon.svelte";
  import Dolby2Icon from "../src/Common/svg-netflix/Icons/Dolby2Icon.svelte";
  import PlayButton from "../src/Common/svg-netflix/Icons/PlayButton.svelte";
</script>

<Navbar />
<div class="w-full h-screen relative">
  <div class="absolute w-full h-full z-10 ">
    <div class="px-16  h-full flex items-center justify-start">
      <div class="hidden lg:flex flex-col w-2/5 py-12 ">
        <img
          src="https://occ-0-58-64.1.nflxso.net/dnm/api/v6/LmEnxtiAuzezXBjYXPuDgfZ4zZQ/AAAABe_MJtJKPmsSU3pjUiW7bRyT8Hg_kAJPLRj6rNNltpjGgSphvfVGjXLQ-_Ic1FIYJ319RRDnIdqPk9D8Uq2X8oHSGVrwbHfx3j1dW_6GncJ2IKZ3OVRybWHjTMdUVY_CLeo3z2EQotzC1-faA7LSygaF5sxsqoskzrVPj6n-NS80jg.png?r=4af"
          alt=""
        />
        <h3 class="text-2xl font-semibold text-white mb-4">
          Clifford the Big Red Dog
        </h3>
        <p class="text-xs text-white font-thin text-justify">
          As Emily struggles to fit in at home and at school, she discovers a
          small red puppy who is destined to become her best friend. When
          Clifford magically undergoes one heck of a growth spurt, becomes a
          gigantic dog and attracts the attention of a genetics company, Emily
          and her Uncle Casey have to fight the forces of greed as they go on
          the run across New York City. Along the way, Clifford affects the
          lives of everyone around him and teaches Emily and her uncle the true
          meaning of acceptance and unconditional love.
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
            <span class="text-white font-semibold text-xl">Play Now</span>
            <PlayButton />
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="absolute w-full h-64 bottom-0 bg-gradient-to-t from-black" />
  <video
    class="w-full h-64 lg:h-screen object-cover -mt-8    "
    autoplay
    muted
    loop
  >
    <source
      class="h-screen object-contain"
      src="https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1280_10MG.mp4"
      type="video/mp4"
    />
  </video>
</div>
<Credits />

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
