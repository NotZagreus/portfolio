<template>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/projects">Projects</router-link></li>
        <li><router-link to="/about">About</router-link></li>
      </ul>
    </nav>
  </template>
  
  <script setup lang="ts">
  </script>
  
  <style scoped>
  nav {
    display: flex;
  }
  
  ul {
    list-style: none;
    display: flex;
    gap: 1rem;
  }
  
  li {
    margin: 0;
  }
  
  a {
    text-decoration: none;
    color: #333;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>