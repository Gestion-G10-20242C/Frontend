<script>
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ref, reactive, onMounted , watch} from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'

export default {
  name: 'UserView',
  components: {
    HeaderComponent,
  },
  setup() {
    const route = useRoute()
    const username = ref(route.params.username);
    const userStore = useUserStore()

    const userFound = ref(false)
    const isFollowing = ref(false) 
    const isLoading = ref(false)
    const userData = reactive({
      name: '',
      profilePicture: '',
      description: '',
      favouriteBook: {
        title: '',
        cover: '',
        description: '',
      },
      groups: [],
      bookShelf: [],
      myBooks: [],
      readingChallenges: [],
    })

    const newUserData = reactive({
      name: '',
      description: '',
      profilePictureLink: '',
    })

      // Detectar cambios en la ruta (cuando la URL cambia)
      watch(() => route.params.username, (newUsername) => {
      // Actualizar el username y volver a cargar los datos
      username.value = newUsername
      fetchUserData()
    })

    // Fetch user data from API
    const fetchUserData = async () => {
      const apiUrl = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username.value}`
      try {
        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error('Error fetching user data')
        }
        const data = await response.json()
        userData.name = data.name
        userData.profilePicture = data.profilePicture || "https://i.pinimg.com/736x/c4/86/8f/c4868fc3f718f95e10eb6341e1305bb6.jpg"
        userData.description = data.description || 'No hay descripción'
        userData.favouriteBook = {
          title: data.favouriteBook?.title || 'No hay libro favorito',
          cover: data.favouriteBook?.cover || "https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png",
          description: data.favouriteBook?.description || 'No hay descripción',
        }
        userData.groups = data.groups || []
        userData.bookShelf = data.bookShelf || []
        userData.myBooks = data.myBooks || []
        userData.readingChallenges = data.readingChallenges || []

        // Inicializa `newUserData` con los datos de `userData`
        newUserData.name = userData.name
        newUserData.description = userData.description
        newUserData.profilePictureLink = userData.profilePicture

        userFound.value = true
        checkIfFollowing() // Verificar si ya sigue al usuario
      } catch (error) {
        console.error(error)
        userFound.value = false
      }
    }

    const checkIfFollowing = async () => {
      const apiUrl = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${userStore.userName}/following/${username.value}`
      try {
        const response = await fetch(apiUrl)
        isFollowing.value = response.ok
      } catch (error) {
        console.error(error)
      }
    }

    const toggleFollow = async () => {
      const newIsFollowing = !isFollowing.value
      isFollowing.value = newIsFollowing

      const accessToken = localStorage.getItem('access_token')
      const currentUser = userStore.userName

      try {
        const response = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${currentUser}/following/${username.value}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ active: newIsFollowing }),
          },
        )
        
        if (!response.ok) {
          throw new Error('Error al actualizar el estado de seguimiento')
        }
        console.log('Estado de seguimiento actualizado con éxito')
      } catch (error) {
        console.error('Error al cambiar el estado de seguimiento:', error)
        isFollowing.value = !newIsFollowing // Revertir el estado si hay un error
      }
    }

    onMounted(() => {
      fetchUserData()
    })

    return {
      userFound,
      userData,
      newUserData,
      username,
      userStore,
      fetchUserData,
      isFollowing,
      toggleFollow, 
      isLoading,
    }
  },
  methods: {
    async updateUserInfo() {
      console.log('Updating user info');

      this.isLoading = true;

      const updatedData = {
        name: this.newUserData.name || this.userData.name,
        description: this.newUserData.description || this.userData.description,
        profilePicture: this.newUserData.profilePictureLink || this.userData.profilePicture,
      }

      const token = localStorage.getItem('access_token')
      const apiUrl = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${this.username}`

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        })

        if (!response.ok) {
          throw new Error('Error al actualizar la información del usuario')
        }
        
        // Actualizar los datos en `userData`
        this.userData.name = updatedData.name
        this.userData.description = updatedData.description
        this.userData.profilePicture = updatedData.profilePicture

        // Actualizar el usuario en el store
        this.userStore.updateUser(updatedData)

        // Cerrar el modal
        document.getElementById('close-edit-user-info-modal').click()
      } catch (error) {
        console.error('Error al actualizar:', error)
        alert('Hubo un problema al actualizar la información del perfil')
            } finally {
        this.isLoading = false;  // Desactivar el estado de carga
      }
    },
  }
}
</script>


<template>
  <!-- User found -->
  <template v-if="userFound">
    <HeaderComponent />
    <div class="container pt-4">
      <div class="row">
        <div class="col-3 d-flex flex-column align-items-center">
          <!-- Profile picture -->
          <img
            :src="userData.profilePicture"
            alt="Profile picture"
            class="logo rounded-circle mx-auto"
            width="140"
            height="140"
          />

          <!-- Name -->
          <h2 class="mb-0">{{ userData.name || username }}</h2>

          <!-- User name -->
          <h3 class="mb-0">{{ username }}</h3>

          <!-- User description -->
          <p class="mb-0">
            {{ userData.description }}
          </p>

          <!-- Follow/Unfollow button visible only for other users -->
          <button
            v-if="username !== userStore.userName"
            class="btn"
            :class="isFollowing ? 'btn-danger' : 'btn-primary'"
            @click="toggleFollow"
          >
            {{ isFollowing ? 'Dejar de Seguir' : 'Seguir' }}
          </button>
          <!-- Edit user button -->
          <button
            v-if="username === userStore.userName"
            class="btn btn-primary mt-2 py-0 w-100"
            data-bs-toggle="modal"
            data-bs-target="#editUserInfoModal"
          >
            Editar
          </button>
        </div>

        <!-- Favourite book -->
        <div class="col-9">
          <div class="container bg-primary p-4 rounded">
            <div class="row">
              <h1>{{ userData.favouriteBook.title }}</h1>
            </div>
            <div class="row">
              <div class="col-2">
                <img
                  alt="Book cover"
                  class="logo"
                  :src="userData.favouriteBook.cover"
                  width="100%"
                />
              </div>
              <div class="col">
                {{ userData.favouriteBook.description }}
              </div>
            </div>
          </div>
          <button
            v-if="username === userStore.userName"
            class="btn btn-sm btn-danger mt-n4 w-100"
            data-bs-toggle="modal"
            data-bs-target="#changeFavouriteBookModal"
          >
            Editar
          </button>
        </div>
      </div>

      <div class="row mt-4">
        <!-- Biblioteca -->
        <div class="col">
          <h3>Biblioteca</h3>
        </div>

        <!-- Reading Challenges -->
        <div class="col">
          <h3>Reading Challenges</h3>
        </div>

        <!-- Grupos -->
        <div class="col" >
          <h3>Grupos</h3>
          <ul class="list-group">
            <li
              v-for="group in userData.groups"
              :key="group.name"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              {{ group.name }}
              <span class="badge bg-primary rounded-pill">
                <div>
                  <template v-if="group.members < 1000">
                    {{ group.members }}
                  </template>
                  <template v-else> 999+ </template>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-people"
                    viewBox="0 0 16 16"
                  >
                    <path
                    d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0"
                    />
                  </svg>
                </div>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Modal change description -->
    <div
      v-if="username === userStore.userName"
      class="modal fade"
      id="editUserInfoModal"
      tabindex="-1"
      aria-labelledby="editUserInfoModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="editUserInfoModalLabel">
              Cambiar descripción
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Profile picture URL input -->
            <div class="input-group mb-3">
            <span class="input-group-text" id="inputGroup-sizing-default">
              Enlace de foto de perfil
              </span>
              <input
                type="text"
                class="form-control"
                v-model="newUserData.profilePictureLink"
              />
            </div>
          
            <!-- Change name -->
            <div class="input-group mb-3">
              <span class="input-group-text" id="inputGroup-sizing-default">
                Nombre
              </span>
              <input
                type="text"
                class="form-control"
                v-model="newUserData.name"
              />
            </div>
          
            <!-- Change description -->
            <div class="input-group mb-3 h-100">
              <span class="input-group-text" id="inputGroup-sizing-default" style="min-height: 200px;">
                Descripción
              </span>
              <textarea
                type="text"
                class="form-control"
                justify-content="flex-start"
                v-model="newUserData.description"
              ></textarea>
            </div>

            <!-- Mostrar mensaje de carga si isLoading es true -->
            <div v-if="isLoading" class="text-center">
              <p>Actualizando...</p>
            </div>

          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              id="close-edit-user-info-modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="updateUserInfo"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>



  </template>
</template>
