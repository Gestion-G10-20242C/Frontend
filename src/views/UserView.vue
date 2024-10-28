<script>
import HeaderComponent from '../components/HeaderComponent.vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ref, reactive } from 'vue'

export default {
  name: 'UserView',
  components: {
    HeaderComponent,
  },
  setup() {
    const route = useRoute()
    const username = route.params.username
    const userStore = useUserStore()

    // We should run a query from the extracted username to get the user data
    // const userData = await fetchUser(username);
    const userFound = true

    // Mocked as of now - If empty should return a not found page
    const userData = reactive({
      name: 'Carlos Fontela',
      profilePicture:
        'https://cysingsoft.wordpress.com/wp-content/uploads/2009/01/carlosfontela6.jpg?w=584',
      description:
        'Hola! Mi nombre es Carlos Fontela, soy un desarrollador de software amante de las metodologías ágiles.',
      favouriteBook: {
        title: 'Java y UML',
        cover:
          'https://sbslibreria.vtexassets.com/arquivos/ids/466160/9789871104888.jpg?v=638156213260000000',
        description:
          'Me gusto mucho, coincido con varios de los aspectos nombrados por el autor. Java es un lenguaje de programación de propósito general, concurrente, orientado a objetos que fue diseñado específicamente para tener tan pocas dependencias de implementación como fuera posible. UML es un lenguaje de modelado gráfico que se utiliza para especificar, visualizar, construir y documentar un sistema de software.',
      },
      groups: [
        {
          name: 'Agile beasts',
          members: 14,
        },
        {
          name: 'FIUBA',
          members: 518,
        },
        {
          name: 'Borges Lovers',
          members: 1234,
        },
      ],
    })

    const newUserData = reactive({
      name: userData.name,
      description: userData.description,
    })

    // Used for profile picture change
    const selectedFile = ref(null)
    const previewImage = ref(null)
    const base64Image = ref(null)

    return {
      userFound,
      userData,
      username,
      userStore,
      newUserData,
      selectedFile,
      previewImage,
      base64Image,
    }
  },
  methods: {
    async updateUserInfo() {
      console.log('updateUserInfo()')

      this.userData.name = this.newUserData.name
      this.userData.description = this.newUserData.description
      this.userData.profilePicture = this.base64Image

      // Send the new user data to the backend
      // TODO!

      // Close the modal programmatically
      document.getElementById('close-edit-user-info-modal').click()
    },

    onFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFile = file
        this.previewImage = URL.createObjectURL(file) // Creates a preview URL for the image

        // Convert the file to Base64
        const reader = new FileReader()
        reader.onload = e => {
          this.base64Image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
  },
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

          <!-- User name -->
          <h2 class="mb-0">{{ userData.name }}</h2>

          <!-- User username -->
          <h5 class="fw-normal">@{{ username }}</h5>

          <!-- User description -->
          <p class="mb-0">
            {{ userData.description }}
          </p>

          <!-- Edit user button -->
          <button
            v-if="username === userStore.userName"
            class="btn btn-primary mt-2 py-0 w-100"
            data-bs-toggle="modal"
            data-bs-target="#editUserInfoModal"
          >
            Edit
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
            Edit
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
        <div class="col">
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
                      d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"
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
      <div class="modal-dialog">
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
            <!-- Change profile picture -->
            <div class="input-group mb-3">
              <label class="input-group" for="customFile">Foto de perfil</label>
              <input
                type="file"
                class="form-control"
                id="customFile"
                @change="onFileChange"
              />
            </div>
            <div class="d-flex justify-content-center mb-3">
              <img
                v-if="previewImage"
                :src="previewImage"
                alt="Profile Picture Preview"
                class="logo rounded-circle mx-auto"
                style="max-width: 140px"
              />
            </div>

            <!-- Change name -->
            <div class="input-group mb-3">
              <span class="input-group-text" id="inputGroup-sizing-default"
                >Nombre</span
              >
              <input
                type="text"
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                v-model="newUserData.name"
              />
            </div>
            <!-- Change description -->
            <div class="input-group">
              <span class="input-group-text">Descripción</span>
              <textarea
                class="form-control"
                aria-label="With textarea"
                v-model="newUserData.description"
                style="min-height: 200px"
              ></textarea>
            </div>
          </div>

          <!-- Close and Save buttons -->
          <div class="modal-footer">
            <button
              id="close-edit-user-info-modal"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
            <button
              type="button"
              @click="updateUserInfo"
              class="btn btn-success"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal change favourite book -->
    <div
      v-if="username === userStore.userName"
      class="modal fade"
      id="changeFavouriteBookModal"
      tabindex="-1"
      aria-labelledby="changeFavouriteBookModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="changeFavouriteBookModalLabel">
              Cambiar libro favorito
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">...</div>
          <div class="modal-footer">
            <button
              id="close-edit-profile-picture-modal"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
            <button type="button" class="btn btn-success">
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <!-- User not found -->
  <template v-else>
    <HeaderComponent />
    <div class="p-4 d-flex justify-content-center">
      <h1>Usuario no encontrado!</h1>
    </div>
  </template>
</template>
