<template>
  <section class="about">
    <h1>This is an about page</h1>
    <button class="cv-button" @click="downloadCV('en')">Download CV (English)</button>
    <button class="cv-button" @click="downloadCV('fr')">Download CV (French)</button>
  </section>
</template>

<script>
export default {
  methods: {
    downloadCV(language) {
      const link = document.createElement('a');
      if (language === 'en') {
        link.href = '../assets/Artem Kozlov - CV - EN.pdf';
        link.download = 'Artem Kozlov - CV - EN.pdf';
      } else if (language === 'fr') {
        link.href = '../assets/Artem Kozlov - CV - FR.pdf';
        link.download = 'Artem Kozlov - CV - FR.pdf';
      }
      link.click();
    }
  }
}
</script>

<style scoped>
.about {
  text-align: center;
  padding: 20px;
}

.cv-button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.cv-button:hover {
  background-color: #45a049;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
}
</style>
