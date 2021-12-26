<script>
  import { getMovie } from "../api/getMovie";
  export let currentRoute;
  

  let dataMovie = getMovie(currentRoute.path);

  console.log(dataMovie, "testis");
</script>

{#await dataMovie then itemKey}
  {console.log(itemKey)}
  testttt
{/await}

<div class="w-full h-screen relative">

</div>