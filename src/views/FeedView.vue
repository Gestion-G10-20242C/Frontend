<script>
import { reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import HeaderComponent from '@/components/HeaderComponent.vue'
import { useRouter } from 'vue-router' // Importa useRouter

export default {
  name: 'FeedView',
  components: {
    HeaderComponent,
  },
  setup() {
    const follows = reactive([])
    const userStore = useUserStore()
    const router = useRouter() // Inicializa el router

    const fetchFollowing = async () => {
      const currentUserName = userStore.userName
      try {
        const response = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${currentUserName}/following/`,
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()

        console.log(data)

        follows.push(...data) // Suponiendo que la respuesta es un array de usuarios
      } catch (error) {
        console.error('Error fetching following:', error)
      }
    }

    onMounted(() => {
      fetchFollowing()
    })

    return {
      follows,
      router, // Retorna el router
    }
  },
}
</script>

<template>
  <HeaderComponent />
  <div class="container pt-4 content-wrapper">
    <div class="row">
      <div class="col feed-column">
        <h1>Feed</h1>
        <div class="list-group">
          <div
            class="list-group-item"
            v-for="(user, index) in follows"
            :key="index"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
              alt="Icono de seguimiento"
              class="follow-icon"
            />
            <router-link class="user-link" :to="`/user/${user.following}`">{{
              user.following
            }}</router-link>
            <!-- Envolver el nombre en un router-link -->
          </div>
        </div>
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
  width: 20px; /* Ajusta el tamaño según lo necesites */
  height: 20px; /* Ajusta el tamaño según lo necesites */
  margin-right: 10px; /* Espacio entre el icono y el nombre */
}

.user-link {
  color: black; /* Cambia el color del texto a negro */
  text-decoration: none; /* Quita el subrayado del enlace */
}

.user-link:hover {
  text-decoration: underline; /* Agrega subrayado al pasar el mouse */
}
</style>
