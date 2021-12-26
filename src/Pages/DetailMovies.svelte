<script>
  import Credits from "../Components//Main/Credits.svelte";
  import DolbyIcon from "../Common/svg-netflix/Icons/DolbyIcon.svelte";
  import Dolby2Icon from "../Common/svg-netflix/Icons/Dolby2Icon.svelte";
  import PlayButton from "../Common/svg-netflix/Icons/PlayButton.svelte";
</script>

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
  <iframe
    class="w-full h-64 lg:h-screen object-cover -mt-8"
    src="https://www.youtube.com/embed/rt-2cxAiPJk?&autoplay=1&loop=1&rel=0&showinfo=0&color=white&iv_load_policy=3&playlist=rt-2cxAiPJk"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  />
</div>
<Credits />

<div class="relative rounded-xl overflow-auto">
  <div class="w-full flex gap-12 snap-x overflow-x-auto py-14">
    <div
      class="snap-start scroll-ml-6 shrink-0 relative first:pl-6 last:pr-[calc(100%-21.5rem)]"
    >
      <div class="bg-stripes-pink w-6 absolute top-0 left-0 bottom-0" />
      <img
        class="relative shrink-0 w-80 h-40 rounded-lg shadow-xl bg-white"
        src="https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=320&amp;h=160&amp;q=80"
      />
    </div>
    <div
      class="snap-start scroll-ml-6 shrink-0 relative first:pl-6 last:pr-[calc(100%-21.5rem)]"
    >
      <div class="bg-stripes-pink w-6 absolute top-0 -left-6 bottom-0" />
      <img
        class="relative shrink-0 w-80 h-40 rounded-lg shadow-xl bg-white"
        src="https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=320&amp;h=160&amp;q=80"
      />
    </div>
    <div
      class="snap-start scroll-ml-6 shrink-0 relative first:pl-6 last:pr-[calc(100%-21.5rem)]"
    >
      <div class="bg-stripes-pink w-6 absolute top-0 -left-6 bottom-0" />
      <img
        class="relative shrink-0 w-80 h-40 rounded-lg shadow-xl bg-white"
        src="https://images.unsplash.com/photo-1622890806166-111d7f6c7c97?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=320&amp;h=160&amp;q=80"
      />
    </div>
    <div
      class="snap-start scroll-ml-6 shrink-0 relative first:pl-6 last:pr-[calc(100%-21.5rem)]"
    >
      <div class="bg-stripes-pink w-6 absolute top-0 -left-6 bottom-0" />
      <img
        class="relative shrink-0 w-80 h-40 rounded-lg shadow-xl bg-white"
        src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=320&amp;h=160&amp;q=80"
      />
    </div>
    <div
      class="snap-start scroll-ml-6 shrink-0 relative first:pl-6 last:pr-[calc(100%-21.5rem)]"
    >
      <div class="bg-stripes-pink w-6 absolute top-0 -left-6 bottom-0" />
      <img
        class="relative shrink-0 w-80 h-40 rounded-lg shadow-xl bg-white"
        src="https://images.unsplash.com/photo-1575424909138-46b05e5919ec?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=320&amp;h=160&amp;q=80"
      />
    </div>
  </div>
</div>
