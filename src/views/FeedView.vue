<script>
import { reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import HeaderComponent from '@/components/HeaderComponent.vue'
import BookListsSidebar from '@/components/BookListsSidebar.vue' // Importa el nuevo componente
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export default {
  name: 'FeedView',
  components: { HeaderComponent, BookListsSidebar }, // Agrega el componente aquí
  setup() {
    const follows = reactive([])
    const userStore = useUserStore()
    const router = useRouter()
    const isLoading = ref(true)
    const errorMessage = ref('')

    const fetchFollowing = async () => {
      const currentUserName = userStore.userName
      try {
        const response = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${currentUserName}/following/`,
        )
        const data = await response.json()
        follows.push(...data)
        isLoading.value = false
      } catch (error) {
        // Cuando el usuario no sigue a nadie, la respuesta es un array vacío
        // Sin embargo se detecta como un error, bug?
        console.log('No followed users found: ', error)
      }

      // Add profile picture to each user
      for (const user of follows) {
        const response = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${user.following}`,
        )
        const data = await response.json()
        user.profilePicture = data.profilePicture
      }
    }

    onMounted(() => {
      fetchFollowing()
    })

    return {
      follows,
      userName: userStore.userName, // Retorna el nombre del usuario para pasarlo como prop
      router,
      isLoading,
      errorMessage,
    }
  },
}
</script>

<template>
  <HeaderComponent />
  <div class="container pt-4 content-wrapper">
    <div class="row">
      <!-- Columna principal con el feed -->
      <div class="col feed-column">
        <h1>Feed</h1>
        <h2>Sigues a:</h2>
        <div class="list-group list-group-flush">
          <div
            class="list-group-item"
            v-for="(user, index) in follows"
            :key="index"
          >
            <img
              :src="
                user.profilePicture ??
                'https://cdn-icons-png.flaticon.com/512/1077/1077114.png'
              "
              alt="Icono de seguimiento"
              class="rounded-circle me-2"
              style="height: 5vh; width: 5vh"
            />
            <router-link class="user-link" :to="`/user/${user.following}`">
              {{ user.following }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- Columna del sidebar -->
      <div class="col-3 booklist-sidebar">
        <BookListsSidebar :username="userName" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-group-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.follow-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.user-link {
  color: black;
  text-decoration: none;
}

.user-link:hover {
  text-decoration: underline;
}

/* Estilo para el sidebar */
.booklist-sidebar {
  border-left: 1px solid #ddd;
  padding-left: 15px;
}
</style>
