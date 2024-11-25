<script>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router' // Importar el router
import HeaderComponent from '@/components/HeaderComponent.vue'
import { useUserStore } from '@/stores/user'

export default {
  name: 'FollowUsersView',
  components: {
    HeaderComponent,
  },
  setup() {
    const userStore = useUserStore()
    const searchTerm = ref('')
    const users = reactive([])
    const router = useRouter()
    const isLoading = ref(true)

    const fetchUsers = async () => {
      const currentUserName = userStore.userName

      try {
        // Obtener la lista de usuarios
        const response = await fetch(
          'https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users',
        )
        const data = await response.json()
        isLoading.value = false

        // Recorrer los usuarios y verificar el estado de seguimiento
        for (const user of data.body.users) {
          if (user.username !== currentUserName) {
            // Verificar si el usuario está siendo seguido
            const isFollowingResponse = await fetch(
              `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${currentUserName}/following/${user.username}`,
            )
            const isFollowingData = await isFollowingResponse.json()

            users.push({
              name: user.username,
              profilePicture:
                user.profilePicture ||
                'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
              isFollowing: isFollowingData.active, // Estado de seguimiento
            })
          }
        }
      } catch (error) {
        console.error('Error al obtener los usuarios:', error)
      }
    }

    const toggleFollow = async user => {
      const isFollowing = !user.isFollowing
      user.isFollowing = isFollowing

      const accessToken = localStorage.getItem('access_token')
      const currentUser = userStore.userName

      try {
        const response = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${currentUser}/following/${user.name}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ active: isFollowing }),
          },
        )

        if (!response.ok) {
          throw new Error('Error al actualizar el estado de seguimiento')
        }
      } catch (error) {
        console.error('Error al cambiar el estado de seguimiento:', error)
        user.isFollowing = !isFollowing // Revertir el estado si hay un error
      }
    }

    const viewUserProfile = username => {
      router.push({ name: 'user', params: { username } }) // Redirige a la vista del perfil del usuario
    }

    const filteredUsers = computed(() => {
      return users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
      )
    })

    onMounted(() => {
      fetchUsers()
    })

    return {
      searchTerm,
      users,
      filteredUsers,
      isLoading,
      toggleFollow,
      viewUserProfile, // Exponer la función
    }
  },
}
</script>

<template>
  <HeaderComponent />

  <div
    v-if="isLoading"
    class="d-flex justify-content-center align-items-center my-5"
    style="height: 80vh"
  >
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>

  <div v-else class="container pt-4">
    <div class="row">
      <div class="col">
        <h1>Otros Lectores</h1>
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Buscar usuarios por nombre"
          class="form-control mb-3"
        />
        <div class="list-group">
          <div
            class="list-group-item d-flex justify-content-between align-items-center"
            v-for="(user, index) in filteredUsers"
            :key="index"
          >
            <div
              class="d-flex align-items-center"
              @click="viewUserProfile(user.name)"
              style="cursor: pointer"
            >
              <img
                :src="user.profilePicture"
                alt="Profile"
                width="50"
                height="50"
                class="rounded-circle me-2"
              />
              <div>
                <h5 class="mb-0">{{ user.name }}</h5>
              </div>
            </div>
            <button
              class="btn"
              :class="user.isFollowing ? 'btn-danger' : 'btn-primary'"
              @click="toggleFollow(user)"
            >
              {{ user.isFollowing ? 'Dejar de Seguir' : 'Seguir' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
