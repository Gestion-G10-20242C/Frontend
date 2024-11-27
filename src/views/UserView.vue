<script>
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ref, reactive, onMounted, watch } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'

export default {
  name: 'UserView',
  components: {
    HeaderComponent,
  },
  setup() {
    const loadingPage = ref(true)
    const route = useRoute()
    const username = ref(route.params.username)
    const userStore = useUserStore()

    const userFound = ref(false)
    const isFollowing = ref(false)
    const isLoading = ref(false)
    let currIndex = -1
    const profileData = reactive({
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

    const newBook = ref({
      id: '',
      title: '',
      author: '',
      cover: '',
      publishDate: '',
    })

    const addBook = async () => {
      const book = {
        title: newBook.value.title,
        author: newBook.value.author,
        cover: newBook.value.cover,
        publishDate: newBook.value.publishDate,
      }

      // Close modal
      document.getElementById('close-add-book-modal').click()

      // Upload book on database

      const apiUrl = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username.value}`

      const token = localStorage.getItem('access_token')

      const userData = userStore.getUserData()

      // Add book to user's myBooks
      const books = JSON.parse(userData.myBooks.replace(/'/g, '"'))
      userData.myBooks = [...books, book]

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        })

        if (!response.ok) {
          throw new Error('Error al subir el libro')
        }

        userStore.updateUser(userData)
        fetchUserData()
      } catch (error) {
        console.error('Error al subir el libro:', error)
      }
    }

    const setBookIndex = index => {
      currIndex = index

      newBook.value = {
        title: profileData.myBooks[index].title,
        cover: profileData.myBooks[index].cover,
        author: profileData.myBooks[index].author,
        publishDate: profileData.myBooks[index].publishDate,
      }
    }

    const getBookIndex = () => {
      return currIndex
    }

    const editBook = async index => {
      console.log('Editando libro:', index)

      // Actualizar el libro con los nuevos datos
      const updatedBook = {
        title: newBook.value.title,
        cover: newBook.value.cover,
        publishDate: newBook.value.publishDate,
        author: newBook.value.author,
      }

      // Actualizar el libro en la lista local
      const userData = userStore.getUserData()

      const userBooks = JSON.parse(userData.myBooks.replace(/'/g, '"'))

      // Crear una copia de la lista de libros. Son todos iguales excepto el de indice index
      const updatedBooks = userBooks.map((book, i) => {
        if (i === index) {
          return updatedBook
        }
        return book
      })

      userData.myBooks = updatedBooks

      // Subir los datos actualizados al backend
      const apiUrl = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username.value}`
      const token = localStorage.getItem('access_token')

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        })

        if (!response.ok) {
          throw new Error('Error al actualizar el libro')
        }
        console.log('Libro actualizado con éxito')
      } catch (error) {
        console.error('Error al actualizar el libro:', error)
      } finally {
        // Actualiza y cierra el modal
        fetchUserData()
        document.getElementById('editBookModalCloseButton').click()
      }
    }

    const deleteBook = async index => {
      console.log('Eliminando libro:', index)

      const userData = userStore.getUserData()

      console.log(
        'User data Books:',
        JSON.parse(userData.myBooks.replace(/'/g, '"')),
      )

      const userDataBooks = JSON.parse(userData.myBooks.replace(/'/g, '"'))

      // Remove the book from the local list
      const updatedBooks = userDataBooks.splice(index, 1)

      console.log('Updated Books:', updatedBooks)

      userData.myBooks = updatedBooks

      const username = userStore.userName

      // Update user data in the database
      const apiUrl = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}`
      const token = localStorage.getItem('access_token')

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        })

        if (!response.ok) {
          throw new Error('Error al eliminar el libro')
        }
        console.log('Libro eliminado con éxito')
      } catch (error) {
        console.error('Error al eliminar el libro:', error)
      } finally {
        // Close the modal
        fetchUserData()
        document.getElementById('deleteBookModalCloseButton').click()
      }
    }

    const newUserData = reactive({
      name: '',
      description: '',
      profilePictureLink: '',
    })

    // Detectar cambios en la ruta (cuando la URL cambia)
    watch(
      () => route.params.username,
      newUsername => {
        // Actualizar el username y volver a cargar los datos
        username.value = newUsername
        fetchUserData()
      },
    )

    // Fetch user data from local Storeage
    const fetchUserData = async () => {
      try {
        isLoading.value = true

        // Fetch user data from the route
        const username = route.params.username

        console.log('Fetching user data for:', username)

        const apiUrl = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}`

        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error('Error fetching user data')
        }
        const data = await response.json()

        profileData.name = data.name || username
        profileData.description = data.description || ''
        profileData.profilePicture =
          data.profilePicture ||
          'https://i.pinimg.com/736x/c4/86/8f/c4868fc3f718f95e10eb6341e1305bb6.jpg'

        if (data.myBooks) {
          console.log('My Books:', data.myBooks)
          profileData.myBooks = JSON.parse(data.myBooks.replace(/'/g, '"'))
        }

        if (data.favouriteBook) {
          profileData.favouriteBook = JSON.parse(
            data.favouriteBook.replace(/'/g, '"'),
          )
        } else {
          profileData.favouriteBook = {
            title: 'No hay Libro Favorito',
            cover:
              'https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png',
            description: '',
          }
        }

        const userGroups = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}/groups`,
        )
        const groupsDataResponse = await userGroups.json()
        profileData.groups = groupsDataResponse.groups

        if (data.bookShelf) {
          profileData.bookShelf = JSON.parse(data.bookShelf.replace(/'/g, '"'))
        }

        if (data.readingChallenges) {
          profileData.readingChallenges = JSON.parse(
            data.readingChallenges.replace(/'/g, '"'),
          )
        }

        if (username === userStore.userName) {
          // Inicializa `newUserData` con los datos de `userData`
          newUserData.name = profileData.name
          newUserData.description = profileData.description
          newUserData.profilePictureLink = profileData.profilePicture

          // Si el usuario es el mismo que el usuario actual, actualiza los datos del usuario en el almacenamiento local
          userStore.updateUser(data)

          // Busca las listas de libros
          fetchBookLists()
        }

        userFound.value = true
        checkIfFollowing()
      } catch (error) {
        console.error(error)
        userFound.value = false
      }
      loadingPage.value = false
    }

    const checkIfFollowing = async () => {
      const apiUrl = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${userStore.userName}/following/${username.value}`
      try {
        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error('Error fetching following data')
        }
        const data = await response.json()
        isFollowing.value = data.active
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

    const fetchBookLists = async () => {
      console.log('Fetching book lists for:', username.value)
      const url = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username.value}/booklist`
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Error al obtener las listas de libros')
        }
        const data = await response.json()
        console.log('Book lists fetched:', data)
        profileData.bookShelf = data || []
        console.log('Bookshelf:', profileData.bookShelf)
      } catch (error) {
        console.error('Error al obtener las listas de libros:', error)
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      fetchUserData()
    })

    return {
      loadingPage,
      userFound,
      userData: profileData,
      newUserData,
      username,
      userStore,
      fetchUserData,
      isFollowing,
      toggleFollow,
      isLoading,
      addBook,
      newBook,
      deleteBook,
      editBook,
      setBookIndex,
      getBookIndex,
      fetchBookLists,
    }
  },
  methods: {
    async updateUserInfo() {
      console.log('Updating user info')

      this.isLoading = true

      const userData = this.userStore.getUserData()

      userData.name = this.newUserData.name
      userData.description = this.newUserData.description
      userData.profilePicture = this.newUserData.profilePictureLink
      userData.favoriteGenres = []

      const token = localStorage.getItem('access_token')
      const apiUrl = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${this.username}`

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        })

        if (!response.ok) {
          throw new Error('Error al actualizar la información del usuario')
        }

        // Cerrar el modal y actualizar
        this.fetchUserData()
        this.userStore.updateUser(userData)
        document.getElementById('close-edit-user-info-modal').click()
      } catch (error) {
        console.error('Error al actualizar:', error)
        alert('Hubo un problema al actualizar la información del perfil')
      } finally {
        this.isLoading = false // Desactivar el estado de carga
      }
    },
  },
}
</script>

<template>
  <!-- Loading page -->
  <template v-if="loadingPage">
    <HeaderComponent />
    <div class="loading-spinner"></div>
  </template>

  <!-- User found -->
  <template v-else-if="!loadingPage && userFound">
    <HeaderComponent />
    <div class="container pt-4">
      <div class="row">
        <div class="col-3 d-flex flex-column align-items-center">
          <!-- Profile picture with author badge -->
          <div class="position-relative">
            <img
              :src="userData.profilePicture"
              alt="Profile picture"
              class="logo rounded-circle mx-auto"
              width="140"
              height="140"
            />
            <!-- Display author badge if user has books -->
            <span v-if="userData.myBooks.length > 0" class="author-badge"
              >Autor</span
            >
          </div>

          <!-- Name -->
          <h2 class="mb-0">{{ userData.name || username }}</h2>

          <!-- User name -->
          <h3 class="mb-0">{{ username }}</h3>

          <!-- User description -->
          <p class="mb-0">
            {{ userData.description || '' }}
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

          <!-- Button to add a new book -->
          <button
            v-if="username === userStore.userName"
            class="btn btn-sm btn-primary mt-2 py-0 w-100"
            data-bs-toggle="modal"
            data-bs-target="#addBookModal"
          >
            Subir un libro
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

      <!-- Books section -->
      <div
        class="row mt-4"
        v-if="userData.myBooks && userData.myBooks.length > 0"
      >
        <div class="col">
          <h3>Mis Libros</h3>
          <div class="row">
            <div
              v-for="(book, index) in userData.myBooks"
              :key="index"
              class="col-4 mb-4"
            >
              <div class="card" style="width: 18rem">
                <!-- Book cover with fixed size and centered -->
                <div
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 45vh;
                    overflow: hidden;
                  "
                >
                  <img
                    :src="book.cover"
                    class="card-img-top"
                    alt="Book cover"
                    style="height: 45vh; width: auto"
                  />
                </div>
                <div class="card-body">
                  <h5 class="card-title">{{ book.title }}</h5>
                  <p class="card-text">Autor: {{ book.author }}</p>
                  <p class="card-text">Publicado: {{ book.publishDate }}</p>
                  <!-- Edit and Delete buttons -->
                  <button
                    v-if="username === userStore.userName"
                    class="btn btn-sm btn-warning mt-2 me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#editBookModal"
                    @click="setBookIndex(index)"
                  >
                    Editar
                  </button>
                  <button
                    v-if="username === userStore.userName"
                    class="btn btn-sm btn-danger mt-2"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteBookModal"
                    @click="setBookIndex(index)"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <!-- Biblioteca -->
        <div class="col">
          <h3>Biblioteca</h3>
          <ul class="list-group">
            <li
              v-for="booklist in userData.bookShelf"
              :key="booklist.name"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              {{ booklist.name }}
              <span class="badge bg-primary rounded-pill">{{
                booklist.books.length
              }}</span>
            </li>
          </ul>
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
              @click="
                $router.push(`/communities/${encodeURIComponent(group.name)}`)
              "
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
              <span
                class="input-group-text"
                id="inputGroup-sizing-default"
                style="min-height: 200px"
              >
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

    <!-- Modal to add a book -->
    <div
      v-if="username === userStore.userName"
      class="modal fade"
      id="addBookModal"
      tabindex="-1"
      aria-labelledby="addBookModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="addBookModalLabel">
              Subir un libro
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="bookTitle">Título</label>
              <input
                type="text"
                id="bookTitle"
                class="form-control"
                v-model="newBook.title"
              />
            </div>
            <div class="form-group">
              <label for="bookAuthor">Autor</label>
              <input
                type="text"
                id="bookAuthor"
                class="form-control"
                v-model="newBook.author"
              />
            </div>
            <div class="form-group">
              <label for="bookCover">Link de la portada</label>
              <input
                type="text"
                id="bookCover"
                class="form-control"
                v-model="newBook.cover"
              />
            </div>
            <div class="form-group">
              <label for="bookDate">Fecha de publicación</label>
              <input
                type="date"
                id="bookDate"
                class="form-control"
                v-model="newBook.publishDate"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              id="close-add-book-modal"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
            <button type="button" class="btn btn-primary" @click="addBook">
              Subir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Book Modal -->
    <div
      class="modal fade"
      id="editBookModal"
      tabindex="0"
      aria-labelledby="editBookModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editBookModalLabel">Editar Libro</h5>
            <button
              type="button"
              id="editBookModalCloseButton"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <input
              v-model="newBook.title"
              class="form-control mb-2"
              placeholder="Título del libro"
            />
            <input
              v-model="newBook.author"
              class="form-control mb-2"
              placeholder="Autor"
            />
            <input
              v-model="newBook.cover"
              class="form-control mb-2"
              placeholder="Enlace de la portada"
            />
            <input
              v-model="newBook.publishDate"
              type="date"
              class="form-control mb-2"
              placeholder="Fecha de publicación"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              @click="editBook(getBookIndex())"
              type="button"
              class="btn btn-primary"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Book Modal -->
    <div
      class="modal fade"
      id="deleteBookModal"
      tabindex="0"
      aria-labelledby="deleteBookModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteBookModalLabel">
              Eliminar Libro
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar este libro?</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              id="deleteBookModalCloseButton"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteBook(getBookIndex())"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <template v-else>
    <HeaderComponent />
    <div class="p-4 d-flex justify-content-center">
      <h1>Usuario no encontrado!</h1>
    </div></template
  >
</template>

<style scoped>
.author-badge {
  top: 0;
  right: 0;
  background-color: #ffbb00;
  color: white;
  padding: 5px 10px;
  border-radius: 50%;
  font-weight: bold;
  position: absolute;
  right: -35px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top-color: #fad155;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
  margin: 50px auto;
}
</style>
