<script>
import HeaderComponent from '@/components/HeaderComponent.vue'
import GenreSidebar from '@/components/GenreSidebar.vue'
import { ref } from 'vue'
import { useSearchStore } from '@/stores/search'
import { GET } from '@/utils/fetch_async'

const searchStore = useSearchStore()

export default {
  name: 'BooksView',
  components: {
    HeaderComponent,
    GenreSidebar,
  },
  setup() {
    const searchInput = ref(searchStore.getSearchQuery() || '')
    const selectedOption = ref('title')
    const results = ref([])
    const selectedBook = ref({})
    const errorMessage = ref('')
    const hasSearched = ref(false)
    const isLoading = ref(false) // Estado de carga

    return {
      searchInput,
      selectedOption,
      results,
      selectedBook,
      errorMessage,
      hasSearched,
      isLoading, // Exportar la variable
    }
  },
  methods: {
    async fetch_books(rel_path) {
      console.log('Buscando...', this.searchInput)

      try {
        const response = await GET('GET', rel_path, null, null)

        if (!response || response.error) {
          throw new Error('Error al obtener datos del servidor')
        }

        console.log('Response:', response)

        if (!response) {
          this.errorMessage = 'No se encontraron resultados'
          return
        }
        console.log(response)
        this.results = response
      } catch (error) {
        console.error('Error al obtener libros:', error)
      }
    },

    async searchBooks() {
      if (this.searchInput.length < 3) {
        return
      }

      this.hasSearched = true
      this.isLoading = true // Activa el estado de carga
      console.log('Searching for:', this.searchInput, 'by', this.selectedOption)

      if (this.selectedOption === 'genres') {
        this.searchInput = this.searchInput.toLowerCase()
      }

      const rel_path = `/search?query=${this.searchInput}&field=${this.selectedOption}`
      console.log('Fetching books from:', rel_path)

      await this.fetch_books(rel_path)

      if (!this.errorMessage) {
        // Filtra los libros según la búsqueda solo si no hubo errores
        this.results = this.results.filter(book => {
          if (this.selectedOption === 'title') {
            return book.title
              .toLowerCase()
              .includes(this.searchInput.toLowerCase())
          } else if (this.selectedOption === 'author_name') {
            return book.author_name
              .toLowerCase()
              .includes(this.searchInput.toLowerCase())
          } else if (this.selectedOption === 'genres') {
            return book.genres
              .toLowerCase()
              .includes(this.searchInput.toLowerCase())
          }
          return false
        })
      }

      this.isLoading = false // Desactiva el estado de carga
    },

    setSelectedBook(book) {
      this.selectedBook = book
    },

    navigateToBook(book) {
      this.$router.push({
        name: 'book',
        params: { isbn: book.isbn },
      })
    },
  },
}
</script>

<template>
  <HeaderComponent />

  <div class="m-5 d-flex">
    <!-- Contenido principal de búsqueda y resultados -->
    <div class="main-content me-5">
      <!-- Busqueda -->
      <div class="mb-5">
        <h1 class="mb-4">Encuentra tu próximo mundo</h1>

        <div class="input-group input-group-lg mb-4">
          <input
            v-model="searchInput"
            @keyup.enter="searchBooks"
            type="text"
            class="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-lg"
          />
        </div>

        <div class="input-group mb-3">
          <label class="input-group-text" for="inputGroupSelect01"
            >Buscar por</label
          >
          <select
            class="form-select"
            v-model="selectedOption"
            @change="searchBooks"
          >
            <option value="title">Título</option>
            <option value="author_name">Autor</option>
            <option value="genres">Género</option>
          </select>
        </div>
      </div>

      <!-- Rueda de carga -->
      <div v-if="isLoading" class="text-center my-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-if="errorMessage && !isLoading">
        <div class="alert alert-danger">
          {{ errorMessage }}
        </div>
      </div>

      <!-- Resultados -->
      <div v-else-if="!isLoading">
        <div class="container">
          <div v-if="results.length > 0">
            <div v-for="book in results" :key="book.title" class="row mb-4">
              <div class="col-2 text-center">
                <img alt="Book cover" :src="book.image_url" height="150vh" />
              </div>
              <div class="col">
                <h3 class="text-body-emphasis" @click="navigateToBook(book)">
                  {{ book.title }}
                </h3>
                <RouterLink :to="`/author/${book.author_name}`">
                  <h5 class="text-body-secondary">{{ book.author_name }}</h5>
                </RouterLink>
                <h5 class="text-body-tertiary">{{ book.publication_date }}</h5>
              </div>
            </div>
          </div>
          <div v-else>
            <h3>Sin resultados</h3>
          </div>
        </div>
      </div>
    </div>

    <GenreSidebar />
  </div>
</template>

<style scoped>
.main-content {
  width: 70%;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  color: #fad155;
}
</style>
