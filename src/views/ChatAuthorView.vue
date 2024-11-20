<script>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import HeaderComponent from '@/components/HeaderComponent.vue'

export default {
  name: 'ChatAuthorView',
  props: {
    authorName: {
      type: String,
      required: true,
    },
  },
  components: {
    HeaderComponent,
  },
  setup() {
    const route = useRoute()
    const userStore = useUserStore()
    const chatStore = useChatStore()

    const authorName = ref(route.params.authorName)
    const books = ref([])
    const newMessage = ref('')
    const isWaitingResponse = ref(false) // Controla si se puede escribir
    const accessToken = localStorage.getItem('access_token')

    // Recuperar mensajes del autor del store
    const messages = ref(chatStore.getMessages(authorName.value))

    const sendMessage = async () => {
      if (newMessage.value.trim() !== '' && !isWaitingResponse.value) {
        const userMessage = newMessage.value.trim()

        // Guardar mensaje del usuario en el store
        chatStore.addMessage(authorName.value, {
          sender: 'Usuario',
          content: userMessage,
        })

        const chatBody = JSON.stringify({
          message: userMessage,
          role: 'author',
          name: authorName.value,
        })

        isWaitingResponse.value = true
        try {
          const username = userStore.userName
          const response = await fetch(
            `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}/chat`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: chatBody,
            },
          )

          if (response.ok) {
            const data = await response.text()

            // Guardar respuesta del autor en el store
            chatStore.addMessage(authorName.value, {
              sender: authorName.value,
              content: data,
            })
          } else {
            chatStore.addMessage(authorName.value, {
              sender: authorName.value,
              content:
                'No puedo responder en este momento. Por favor, intenta más tarde.',
            })
          }
        } catch (error) {
          console.log('Error al enviar mensaje:', error)
          chatStore.addMessage(authorName.value, {
            sender: authorName.value,
            content:
              'Hubo un problema al enviar tu mensaje. Intenta nuevamente.',
          })
        } finally {
          isWaitingResponse.value = false // Desbloquear el input
        }

        newMessage.value = ''
      }
    }

    onMounted(() => {
      if (route.query.books) {
        try {
          books.value = JSON.parse(route.query.books)
        } catch (error) {
          console.error('Error al parsear libros:', error)
        }
      }
    })

    return {
      books,
      messages,
      newMessage,
      isWaitingResponse,
      sendMessage,
      userStore,
    }
  },
}
</script>

<template>
  <HeaderComponent />
  <div class="container">
    <h1>Chatea con {{ authorName }}</h1>

    <!-- Chat -->
    <div class="chat-box mt-5">
      <h3>Chat</h3>
      <div class="messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="[
            'message',
            message.sender === 'Usuario' ? 'user-message' : 'author-message',
          ]"
        >
          <strong>{{ message.sender }}:</strong> {{ message.content }}
        </div>
      </div>
      <div class="input-container">
        <input
          v-model="newMessage"
          :disabled="isWaitingResponse"
          @keyup.enter="sendMessage"
          type="text"
          class="form-control"
          placeholder="Escribe tu mensaje..."
        />
        <button
          @click="sendMessage"
          :disabled="isWaitingResponse"
          class="btn send-btn"
        >
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
html,
body {
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
  background-color: #3498db; /* Azul para el mensaje del usuario */
  color: #ffffff; /* Texto blanco */
  padding: 10px;
  border-radius: 15px;
  max-width: 70%;
  margin-left: auto;
  margin-bottom: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.author-message {
  text-align: left;
  background-color: #2c3e50; /* Gris oscuro para el mensaje del autor */
  color: #ffffff; /* Texto blanco */
  padding: 10px;
  border-radius: 15px;
  max-width: 70%;
  margin-right: auto;
  margin-bottom: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

input:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
