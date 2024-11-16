<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import GenreSidebar from '@/components/GenreSidebar.vue';
import { ref } from 'vue';
import { useSearchStore } from '@/stores/search';
import { GET } from '@/utils/fetch_async';

const searchStore = useSearchStore();

export default {
  name: 'BooksView',
  components: {
    HeaderComponent,
    GenreSidebar,
  },
  setup() {
    const searchInput = ref(
      searchStore.getSearchQuery() ? searchStore.getSearchQuery() : '',
    );
    const selectedOption = ref('title');
    const results = ref([]);
    const selectedBook = ref({});
    const errorMessage = ref('');

    return {
      searchInput,
      selectedOption,
      results,
      selectedBook,
      errorMessage,
    };
  },
  methods: {
    async fetch_books(rel_path) {
      console.log('Buscando...', this.searchInput);

      try {
        const response = await GET('GET', rel_path, null, null);

        if (!response || response.error) {
          throw new Error('Error al obtener datos del servidor');
        }

        this.results = response;
        
        if (this.results.message) {
          this.errorMessage = 'Hubo un problema al obtener los libros. Intenta nuevamente más tarde.';
        } else {
          this.errorMessage = '';
        }

      } catch (error) {
        console.error('Error al obtener libros:', error);
      }
    },

    async searchBooks() {
      if (this.searchInput.length < 3) {
        return;
      }
      console.log('Searching for:', this.searchInput, 'by', this.selectedOption);

      const rel_path = `/search?query=${this.searchInput}&field=${this.selectedOption}`;
      console.log('Fetching books from:', rel_path);

      await this.fetch_books(rel_path);

      if (!this.errorMessage) {
        // Filtra los libros según la búsqueda solo si no hubo errores
        this.results = this.results.filter((book) => {
          if (this.selectedOption === 'title') {
            return book.title
              .toLowerCase()
              .includes(this.searchInput.toLowerCase());
          } else if (this.selectedOption === 'author_name') {
            return book.author_name
              .toLowerCase()
              .includes(this.searchInput.toLowerCase());
          } else if (this.selectedOption === 'genres') {
            return book.genres
              .toLowerCase()
              .includes(this.searchInput.toLowerCase());
          }
          return false;
        });
      }
    },

    setSelectedBook(book) {
      this.selectedBook = book;
    },

    navigateToBook(book) {
      this.$router.push({
        name: 'book',
        params: { isbn: book.isbn },
      });
    },
  },
};
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

      <!-- Mensaje de error -->
      <div v-if="errorMessage">
        <div v-if="selectedOption === 'title'">
          <h2>Libros</h2>
        </div>
        <div v-else-if="selectedOption === 'author_name'">
          <h2>Autores</h2>
        </div>
        <div v-else-if="selectedOption === 'genres'">
          <h2>Géneros</h2>
        </div>
        <div class="alert alert-danger">
        {{ errorMessage }}
        </div>
      </div>

      <!-- Resultados -->
      <div>
        <div class="container">
          <div v-if="selectedOption === 'title' && !errorMessage">
            <h2 class="mb-4">Libros</h2>
            <div v-for="book in results" :key="book.title" class="row mb-4">
              <div class="col-2 text-center">
                <img alt="Book cover" :src="book.image_url" height="150vh" />
              </div>
              <div class="col">
                <h3 class="text-body-emphasis" @click="navigateToBook(book)">
                  {{ book.title }}
                </h3>
                <h5 class="text-body-secondary">{{ book.author_name }}</h5>
                <h5 class="text-body-tertiary">{{ book.publication_date }}</h5>
              </div>
              <div class="col-1">
                <button
                  @click="setSelectedBook(book)"
                  class="btn btn-sm btn-primary mt-n4 fs-5"
                  data-bs-toggle="modal"
                  data-bs-target="#changeFavouriteBookModal"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div v-else-if="selectedOption === 'author_name' && !errorMessage">
            <h2 class="mb-4">Autores</h2>
            <div v-for="book in results" :key="book.name" class="row mb-4">
              <div class="col-2 text-center">
                <img alt="Book cover" :src="book.image_url" height="150vh" />
              </div>
              <div class="col">
                <h3 class="text-body-emphasis" @click="navigateToBook(book)">
                  {{ book.title }}
                </h3>
                <h5 class="text-body-secondary">{{ book.author_name }}</h5>
                <h5 class="text-body-tertiary">{{ book.publication_date }}</h5>
              </div>
            </div>
          </div>
          <div v-else-if="!errorMessage">
            <h2 class="mb-4">Generos</h2>
            <div v-for="book in results" :key="book.name" class="row mb-4">
              <div class="col-2 text-center">
                <img alt="Author cover" :src="book.image_url" height="150vh" />
              </div>
              <div class="col">
                <h3 class="text-body-emphasis" @click="navigateToBook(book)">
                  {{ book.title }}
                </h3>
                <h5 class="text-body-secondary">{{ book.author_name }}</h5>
                <h5 class="text-body-tertiary">{{ book.publication_date }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de Géneros -->
    <GenreSidebar />
  </div>

  <!-- Modal Libro seleccionado -->
  <div
    class="modal fade"
    id="changeFavouriteBookModal"
    tabindex="-1"
    aria-labelledby="changeFavouriteBookModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row">
              <div class="col-4 text-center">
                <img
                  alt="Book cover"
                  :src="selectedBook.image_url"
                  height="300vh"
                  width="auto"
                />
              </div>
              <div class="col">
                <h3 class="text-body-emphasis">{{ selectedBook.title }}</h3>
                <h5 class="text-body-secondary">
                  {{ selectedBook.author_name }}
                </h5>
                <h5 class="text-body-tertiary mb-3">
                  {{ selectedBook.publication_date }}
                </h5>
                <div>
                  <h5 class="text-body-emphasis">Género</h5>
                  <p>{{ selectedBook.genres }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  width: 70%;
}
</style>
