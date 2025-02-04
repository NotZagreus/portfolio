<template>
  <section class="comments">
    <h1>Testimonials</h1>
    <div class="carousel">
      <button class="arrow left-arrow" @click="prevComment">‹</button>
      <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div
          class="comment-card"
          v-for="comment in comments"
          :key="comment._id"
        >
          <h2>{{ comment.firstName }} {{ comment.lastName }}</h2>
          <p>{{ comment.comment }}</p>
        </div>
      </div>
      <button class="arrow right-arrow" @click="nextComment">›</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

interface Comment {
  _id: string;
  firstName: string;
  lastName: string;
  comment: string;
}

const comments = ref<Comment[]>([]);
const currentIndex = ref(0);
const delay = 7777;

const fetchComments = async () => {
  try {
    const response = await axios.get('http://localhost:14344/api/comments');
    comments.value = response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

const nextComment = () => {
  currentIndex.value = (currentIndex.value + 1) % comments.value.length;
};

const prevComment = () => {
  currentIndex.value = (currentIndex.value - 1 + comments.value.length) % comments.value.length;
};

onMounted(() => {
  fetchComments();
  setInterval(nextComment, delay);

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      prevComment();
    } else if (event.key === 'ArrowRight') {
      nextComment();
    }
  };

  window.addEventListener('keydown', handleKeydown);

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
});
</script>

<style scoped>
.comments {
  padding: 2rem;
}

.carousel {
  position: relative;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.comment-card {
  flex: 0 0 100%;
  background-color: hsla(210, 20%, 25%, 1);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px hsla(210, 20%, 10%, 1);
  color: hsla(210, 50%, 70%, 1);
  text-align: center;
}

.comment-card h2 {
  font-size: 1.5rem;
  color: hsla(210, 50%, 80%, 1);
  margin-top: 1rem;
}

.comment-card p {
  font-size: 1rem;
  color: hsla(210, 50%, 70%, 1);
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 2rem;
  color: hsla(210, 50%, 70%, 1);
  cursor: pointer;
}

.left-arrow {
  left: 10px;
  z-index: 1;
}

.right-arrow {
  right: 10px;
}
</style>
