<script>
  export let actor;
</script>

<div
  class="mx-8 my-3  md:ml-20 md:mr-56 grid grid-cols-1 md:grid-cols-2 text-white content-center  w-full"
>
  <div class="flex mx-3 w-full">
    <div class="w-20 m-auto">
      <img
        class="object-cover object-center rounded-full w-[64px] h-[64px]"
        src="https://image.tmdb.org/t/p/original/{actor.profile_path}"
        alt="img-netflix"
      />
    </div>

    <div class="flex justify-between m-2 w-40 md:w-60">
      <div class="w-full">
        <p class="font-bold text-[24px]">{actor.name}</p>
        <div class="font-[400] text-[16px] text-gray-500">
          As {actor.character}
        </div>
      </div>
    </div>
  </div>
</div>
