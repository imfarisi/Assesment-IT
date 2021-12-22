<script>
  export let size = "100%";

  if (size !== "100%") {
    size =
      size.slice(-1) === "x"
        ? size.slice(0, size.length - 1) + "em"
        : parseInt(size) + "px";
  }
</script>

<svg
  class="w-6 h-6 font-bold mx-2"
  fill="currentColor"
  viewBox="0 0 20 20"
  xmlns="http://www.w3.org/2000/svg"
  ><path
    fill-rule="evenodd"
    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
    cdivp-rule="evenodd"
  /></svg
>
