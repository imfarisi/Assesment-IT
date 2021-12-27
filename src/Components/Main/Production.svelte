<script>
  export let production
</script>

<div class="mx-8 my-3 md:mr-56 md:ml-20 grid grid-cols-1 md:grid-cols-2 text-white">
  <div class="w-40 md:w-72">
    <p class="font-medium text-[24px]">{production.name}</p>
    <div class="font-thin text-[20px] text-gray-500">{production.origin_country}</div>
  </div>
</div>
