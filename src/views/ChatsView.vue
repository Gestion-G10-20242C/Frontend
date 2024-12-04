<template>
  <HeaderComponent />
  <div v-if="loadingChats" class="loading-container">
    <div class="loading-spinner"></div>
    <p class="text-center">Cargando...</p>
  </div>
  <div v-else class="layout">
    <!-- Sidebar de chats -->
    <aside class="chat-sidebar">
      <h1>Chats</h1>
      <div v-if="chats.length" class="chat-list">
        <div
          v-for="chat in chats"
          :key="chat.id"
          class="chat-item"
          @click="selectChat(chat)"
        >
          {{ chat.history[0].content.split(' de')[15] }}
        </div>
      </div>
      <p v-else class="no-chats">No hay chats disponibles.</p>
    </aside>

    <!-- Área de mensajes -->
    <main class="chat-main">
      <div v-if="selectedChat" class="chat-box">
        <h3>
          Chateando con
          {{
            selectedChat.history[0].content.split(' de')[15].replace('.', '')
          }}
        </h3>
        <div class="messages-container">
          <div class="messages">
            <div
              v-for="(message, index) in selectedChat.history.slice(1)"
              :key="index"
              :class="[
                'message',
                message.role === 'user' ? 'user-message' : 'author-message',
              ]"
            >
              <div v-if="message.role != 'system'">
                <div v-if="message.role === 'user'">
                  {{ message.content }}
                </div>
                <div
                  v-else-if="message.role === 'assistant'"
                  class="author-message"
                >
                  {{ message.content }}
                </div>
              </div>
            </div>
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
      <p v-else class="no-chat-selected">
        Selecciona un chat para ver los mensajes.
      </p>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import HeaderComponent from '@/components/HeaderComponent.vue'

export default {
  name: 'ChatsView',
  components: {
    HeaderComponent,
  },
  setup() {
    const userStore = useUserStore()
    const username = userStore.userName
    const chats = ref([])
    const selectedChat = ref(null)
    const newMessage = ref('')
    const isWaitingResponse = ref(false)
    const accessToken = localStorage.getItem('access_token')
    const loadingChats = ref(true)

    const fetchChats = async () => {
      try {
        const response = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}/chat`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )

        if (response.ok) {
          const data = await response.json()
          loadingChats.value = false

          chats.value = data
        } else {
          console.error('Error al obtener los chats:', response.statusText)
        }
      } catch (error) {
        console.error('Error al obtener los chats:', error)
      }
    }

    const selectChat = chat => {
      selectedChat.value = chat
    }

    const sendMessage = async () => {
      if (!newMessage.value.trim()) return

      isWaitingResponse.value = true

      try {
        const chatId = selectedChat.value.id

        const username = useUserStore().userName

        const chatBody = JSON.stringify({
          message: newMessage.value.trim(),
          role: 'author',
          name: selectedChat.value.history[0].content
            .split(' de')[15]
            .replace('.', ''),
        })

        const response = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}/chat/${chatId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: chatBody,
          },
        )

        if (response.ok) {
          const newChatMessage = await response.json()
          selectedChat.value.history.push(newChatMessage)
          newMessage.value = ''
        } else {
          console.error('Error al enviar el mensaje:', response)
        }
      } catch (error) {
        console.error('Error al enviar el mensaje:', error)
      } finally {
        isWaitingResponse.value = false
      }
    }

    onMounted(() => {
      fetchChats()
    })

    return {
      loadingChats,
      chats,
      selectedChat,
      newMessage,
      isWaitingResponse,
      fetchChats,
      selectChat,
      sendMessage,
      username,
    }
  },
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh; /* Ocupa toda la altura de la ventana */
}

.chat-sidebar {
  width: 25%;
  background: #f4f4f4;
  padding: 1rem;
  border-right: 1px solid #ddd;
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-item {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.chat-item:hover {
  background: #eaeaea;
}

.no-chats {
  color: #777;
  font-style: italic;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-box {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 1rem;
  background: #f9f9f9;
}

.message {
  margin-bottom: 1rem;
}

.user-message {
  text-align: right;
  color: #1d72b8;
}

.author-message {
  text-align: left;
  color: #444;
}

.input-container {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  border-top: 1px solid #ddd;
  background: #fff; /* Fondo blanco para el input */
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.send-btn {
  background: #1d72b8;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.no-chat-selected {
  font-size: 1.2rem;
  color: #777;
  text-align: center;
  margin-top: 2rem;
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
</style>
