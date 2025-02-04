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
    <button class="add-comment-button" @click="showAddModal = true">Add Comment</button>

    <!-- Add Comment Modal -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>Add New Comment</h3>
        <input v-model="newComment.firstName" placeholder="First Name" />
        <div v-if="addError.firstName" class="error-message">{{ addError.firstName }}</div>
        <input v-model="newComment.lastName" placeholder="Last Name" />
        <div v-if="addError.lastName" class="error-message">{{ addError.lastName }}</div>
        <textarea v-model="newComment.comment" placeholder="Comment"></textarea>
        <div v-if="addError.comment" class="error-message">{{ addError.comment }}</div>
        <div class="modal-buttons">
          <button class="modal-button" @click="addComment">Add</button>
          <button class="modal-button" @click="closeAddModal">Cancel</button>
        </div>
      </div>
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
const showAddModal = ref(false);
const newComment = ref<Comment>({ _id: '', firstName: '', lastName: '', comment: '' });
const addError = ref<{ firstName?: string; lastName?: string; comment?: string }>({});

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

const addComment = async () => {
  if (!newComment.value.firstName) {
    addError.value.firstName = 'First name is required.';
  } else {
    addError.value.firstName = '';
  }
  if (!newComment.value.lastName) {
    addError.value.lastName = 'Last name is required.';
  } else {
    addError.value.lastName = '';
  }
  if (!newComment.value.comment) {
    addError.value.comment = 'Comment is required.';
  } else {
    addError.value.comment = '';
  }
  if (addError.value.firstName || addError.value.lastName || addError.value.comment) {
    return;
  }

  try {
    const response = await axios.post('http://localhost:14344/api/comments', {
      firstName: newComment.value.firstName,
      lastName: newComment.value.lastName,
      comment: newComment.value.comment
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    comments.value.push(response.data);
    closeAddModal();
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};

const closeAddModal = () => {
  showAddModal.value = false;
  newComment.value = { _id: '', firstName: '', lastName: '', comment: '' };
  addError.value = {};
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

.add-comment-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: hsla(210, 20%, 25%, 1);
  color: hsla(210, 50%, 70%, 1);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-comment-button:hover {
  background-color: hsla(210, 20%, 35%, 1);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: hsla(210, 20%, 25%, 1);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px hsla(210, 20%, 10%, 1);
  width: 90%;
  max-width: 500px;
  color: hsla(210, 50%, 70%, 1);
}

.modal-content h3 {
  margin-top: 0;
  color: hsla(210, 50%, 80%, 1);
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  border: 1px solid hsla(210, 20%, 35%, 1);
  border-radius: 4px;
  background-color: hsla(210, 20%, 30%, 1);
  color: hsla(210, 50%, 70%, 1);
}

.modal-content input::placeholder,
.modal-content textarea::placeholder {
  color: hsla(210, 50%, 60%, 1);
}

.modal-content input:focus,
.modal-content textarea:focus {
  outline: none;
  border-color: hsla(210, 50%, 70%, 1);
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.modal-button {
  background-color: hsla(210, 20%, 35%, 1);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-button:hover {
  background-color: hsla(210, 20%, 45%, 1);
}

.error-message {
  color: #f87171;
  margin-top: 1rem;
}
</style>
