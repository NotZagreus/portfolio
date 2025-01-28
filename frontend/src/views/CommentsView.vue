<template>
    <section class="comments">
      <h1>Testamonials</h1>
      <div class="grid">
        <div class="comment-card" v-for="comment in comments" :key="comment._id">
          <h2>{{ comment.firstName }} {{ comment.lastName }}</h2>
          <p>{{ comment.comment }}</p>
        </div>
      </div>
    </section>
  </template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Comment {
    _id: string;
    firstName: string;
    lastName: string;
    comment: string;
}

const comments = ref<Comment[]>([]);

const fetchComments = async () => {
    try {
        const response = await axios.get('http://localhost:14344/api/comments');
        comments.value = response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
};

onMounted(fetchComments);
</script>

<style scoped>
.projects {
  padding: 2rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.comment-card {
  background-color: hsla(210, 20%, 25%, 1); /* Dark blue-steel container background */
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px hsla(210, 20%, 10%, 1); /* Dark blue-steel shadow */
  color: hsla(210, 50%, 70%, 1); /* Medium blue-steel text */
}

.commment-card h2 {
  font-size: 1.5rem;
  color: hsla(210, 50%, 80%, 1); /* Light blue-steel */
  margin-top: 1rem;
}

.commment-card p {
  font-size: 1rem;
  color: hsla(210, 50%, 70%, 1); /* Medium blue-steel */
}
</style>