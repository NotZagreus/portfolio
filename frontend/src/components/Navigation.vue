<template>
  <nav>
    <div class="logo">
      <img src="@/assets/logo.svg" alt="Logo" />
    </div>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/projects">Projects</router-link></li>
      <li><router-link to="/about">About</router-link></li>
      <li><router-link to="/comments">Comments</router-link></li>
      <li><router-link to="/contact">Contact</router-link></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
</script>

<style scoped>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: hsla(210, 20%, 20%, 1); /* Dark blue-steel background */
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px hsla(210, 20%, 10%, 1); /* Dark blue-steel shadow */
  }

  .logo {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    background-color: hsla(210, 20%, 20%, 1); /* Dark blue-steel background */
    border-radius: 8px;
  }

  .logo img {
    height: 40px;
  }

  ul {
    list-style: none;
    display: flex;
    gap: 1rem;
    padding: 0;
    margin: 0;
  }

  li {
    margin: 0;
  }

  a {
    text-decoration: none;
    color: hsla(210, 50%, 80%, 1); /* Light blue-steel */
    font-size: 1.1rem;
    padding: 0.5rem;
    transition: color 0.3s, background-color 0.3s;
  }

  a:hover {
    color: hsla(210, 50%, 60%, 1); /* Dark blue-steel */
    background-color: hsla(210, 20%, 30%, 1); /* Darker blue-steel */
    border-radius: 5px;
  }
</style>