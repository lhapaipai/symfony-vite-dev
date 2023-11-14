<script>
  import svelteLogo from "~/images/logo-svelte.svg";
  import viteLogo from "~/images/logo-vite.svg";
  import Counter from "../components/Counter.svelte";
  export let name;

  import "./app.scss";
</script>

<main class="svelte-app">
  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" width="202.25" height="200" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" width="174.35" height="200" />
    </a>
  </div>
  <h1>Hello {name}</h1>

  <Counter />

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by
    Vite!
  </p>

  <p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>
</main>

<style>
</style>
