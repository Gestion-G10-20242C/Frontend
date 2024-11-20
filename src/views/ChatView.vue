<script>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import HeaderComponent from '@/components/HeaderComponent.vue';

export default {
  name: 'ChatView',
  components: {
    HeaderComponent,
  },
  setup() {
    const route = useRoute();
    const userStore = useUserStore();

    const authorName = ref(route.query.authorName);
    const books = ref([]);
    const messages = ref([]);
    const newMessage = ref('');
    const isWaitingForResponse = ref(false); // Nueva variable de estado

    const accessToken = localStorage.getItem('access_token');

    const sendMessage = async () => {
      if (newMessage.value.trim() !== '') {
        const userMessage = newMessage.value.trim();
        messages.value.push({
          sender: 'Usuario',
          content: userMessage,
        });

        const chatBody = JSON.stringify({
          message: userMessage,
          role: 'author',
          name: authorName.value,
        });

        // Activar estado de espera
        isWaitingForResponse.value = true;

        try {
          const username = userStore.userName;
          const response = await fetch(
            `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}/chat`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: chatBody,
            }
          );

          if (response.ok) {
            const data = await response.json();
            messages.value.push({
              sender: authorName.value,
              content: data.reply,
            });
          } else {
            messages.value.push({
              sender: authorName.value,
              content: 'No puedo responder en este momento. Por favor, intenta más tarde.',
            });
          }
        } catch {
          messages.value.push({
            sender: authorName.value,
            content: 'Hubo un problema al enviar tu mensaje. Intenta nuevamente.',
          });
        }

        // Desactivar estado de espera
        isWaitingForResponse.value = false;

        newMessage.value = '';
      }
    };

    onMounted(() => {
      if (route.query.books) {
        try {
          books.value = JSON.parse(route.query.books);
        } catch (error) {
          console.error('Error al parsear libros:', error);
        }
      }
    });

    return {
      authorName,
      books,
      messages,
      newMessage,
      sendMessage,
      userStore,
      isWaitingForResponse, // Pasamos la variable de estado
    };
  },
};
</script>

<template>
  <HeaderComponent />
  <div class="container">
    <h1>Chatea con {{ authorName }}</h1>

    <!-- Mostrar libros si existen -->
    <div v-if="books.length > 0" class="mt-4">
      <h3>Libros del autor:</h3>
      <ul>
        <li v-for="(book, index) in books" :key="index">
          <strong>{{ book.title }}</strong> - {{ book.publication_date }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No se recibieron libros para este autor.</p>
    </div>

    <!-- Chat -->
    <div class="chat-box mt-5">
      <h3>Chat</h3>
      <div class="messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.sender === 'Usuario' ? 'user-message' : 'author-message']"
        >
          <strong>{{ message.sender }}:</strong> {{ message.content }}
        </div>
      </div>
      <div class="input-container">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          :disabled="isWaitingForResponse" 
          type="text"
          class="form-control"
          placeholder="Escribe tu mensaje..."
        />
        <button @click="sendMessage" class="btn send-btn" :disabled="isWaitingForResponse">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  font-family: 'Arial', sans-serif;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f4f6f9;
}

h1 {
  color: #2c3e50;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 8px;
}

h3 {
  color: #3498db;
  margin-bottom: 10px;
}

.chat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 10px;
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #ddd;
}

.messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
  padding: 8px;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.message {
  margin-bottom: 12px;
}

.user-message {
  text-align: right;
  color: #3498db;
}

.author-message {
  text-align: left;
  color: #2c3e50;
}

.input-container {
  display: flex;
  align-items: center;
  position: relative;
}

input.form-control {
  flex: 1;
  padding-right: 40px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.send-btn {
  position: absolute;
  right: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.send-btn i {
  font-size: 1.5rem;
  color: #3498db;
}

.user-message {
  text-align: right;
  background-color: #3498db;
  color: #ffffff;
  padding: 10px;
  border-radius: 15px;
  max-width: 70%;
  margin-left: auto;
  margin-bottom: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.author-message {
  text-align: left;
  background-color: #2c3e50;
  color: #ffffff;
  padding: 10px;
  border-radius: 15px;
  max-width: 70%;
  margin-right: auto;
  margin-bottom: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
