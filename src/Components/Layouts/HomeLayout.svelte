<script>
  import Navbar from "./Navbar.svelte";
  import { Route } from "svelte-router-spa";
  export let currentRoute;
  const params = {};
</script>

<div>
  <Navbar />
  <Route {currentRoute}  {params} />
</div>
