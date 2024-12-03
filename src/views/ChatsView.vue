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
      const chats = ref([])
      const accessToken = localStorage.getItem('access_token')
  
      const fetchChats = async () => {
        try {
          const username = userStore.userName
          const response = await fetch(
            `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}/chat`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
  
          if (response.ok) {
            const data = await response.json()
            chats.value = data
          } else {
            console.error('Error al obtener los chats:', response.statusText)
          }
        } catch (error) {
          console.error('Error al obtener los chats:', error)
        }
      }
  
      onMounted(fetchChats)
  
      return {
        chats,
      }
    },
  }
  </script>
  
  <template>
    <HeaderComponent />
    <div class="chats-view">
      <h1>Chats</h1>
      <ul v-if="chats.length">
        <li v-for="chat in chats" :key="chat.id">
          <router-link :to="{ name: 'ChatAuthorView', params: { authorName: chat.username } }">
            {{ chat.username }}
          </router-link>
        </li>
      </ul>
      <p v-else>No hay chats disponibles.</p>
    </div>
  </template>

  <style scoped>
  .chats-view {
    padding: 16px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 8px;
  }
  
  a {
    text-decoration: none;
    color: #007bff;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>
  