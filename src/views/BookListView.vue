<script>
import HeaderComponent from '@/components/HeaderComponent.vue'

export default {
  name: 'BookListView',
  components: { HeaderComponent },
  props: {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      books: [],
      bookListName: '',
      isLoading: true,
      error: null,
      bookToDelete: null, // Almacena el libro a eliminar
      showModal: false, // Controla la visibilidad del modal
    }
  },
  methods: {
    async fetchBookList() {
      const url = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${this.username}/booklist`
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Error al obtener los libros de la lista')
        }
        const data = await response.json()

        const list = data.find(list => list.name === this.name)
        this.books = list.books || []
        this.bookListName = list.name
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
    async deleteBook() {
      if (!this.bookToDelete) return

      const url = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${this.username}/booklist/${this.bookListName}`
      const payload = {
        id: this.bookToDelete.id,
      }

      const token = localStorage.getItem('access_token')

      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error('Error al eliminar el libro')
        }

        // Elimina el libro de la lista después de la eliminación exitosa
        this.books = this.books.filter(book => book.id !== this.bookToDelete.id)
        this.showModal = false
      } catch (error) {
        this.error = error.message
      }
    },
    openModal(book) {
      this.bookToDelete = book // Almacena el libro a eliminar
      this.showModal = true // Muestra el modal
    },
    closeModal() {
      this.showModal = false
      this.bookToDelete = null
    },
  },
  mounted() {
    this.fetchBookList()
  },
}
</script>

<template>
  <HeaderComponent />

  <div v-if="isLoading" class="loading-spinner"></div>

  <div v-else class="container mt-5">
    <h1>{{ bookListName }}</h1>

    <!-- Lista de libros -->
    <div class="container">
      <div class="row">
        <div
          v-for="book in books"
          :key="book.title"
          class="col-md-4 mb-4 text-center"
        >
          <img
            alt="Book cover"
            :src="book.image_url"
            class="img-fluid"
            style="height: 150px; width: auto"
          />
          <RouterLink
            :to="`/book/${book.isbn}`"
            class="d-block mt-2 text-decoration-none text-body-emphasis"
          >
            <h4>{{ book.title }}</h4>
          </RouterLink>
          <button @click="openModal(book)" class="btn btn-danger mt-2">
            Borrar
          </button>
        </div>
      </div>
    </div>

    <div v-if="books.length === 0" class="text-center mt-4">
      <p>No hay libros en esta lista.</p>
    </div>

    <!-- Overlay oscuro cuando el modal está abierto -->
    <div v-if="showModal" class="overlay" @click="closeModal"></div>

    <!-- Modal de confirmación -->
    <div
      v-if="showModal"
      class="modal show"
      tabindex="-1"
      style="display: block"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar eliminación</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              ¿Estás seguro de que deseas eliminar el libro "{{
                bookToDelete ? bookToDelete.title : ''
              }}"?
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deleteBook">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 10px;
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.main-content {
  width: 70%;
  margin-top: -100;
}

/* Estilos del modal */
.modal.show {
  display: block;
  margin-top: 100px;
  z-index: 1050;
}

/* Overlay oscuro */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

/* Estilos para el modal */
.modal-content {
  z-index: 1050;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
