<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import GenreSidebar from '@/components/GenreSidebar.vue';
import { ref } from 'vue';
import { useSearchStore } from '@/stores/search';

// Importa los datos de libros desde un archivo JSON o fuente similar
import booksData from '@/resources/books.json';

const searchStore = useSearchStore();

export default {
  name: 'BooksView',
  components: {
    HeaderComponent,
    GenreSidebar,
  },
  setup() {
    const searchInput = ref(searchStore.getSearchQuery() ? searchStore.getSearchQuery() : '');
    const selectedOption = ref('title');
    const results = ref([]);
    const selectedBook = ref({});

    return {
      searchInput,
      selectedOption,
      results,
      selectedBook,
    };
  },
  methods: {
    searchBooks() {
      if (this.searchInput.length < 3) {
        return;
      }
      console.log('Searching for:', this.searchInput, 'by', this.selectedOption);

      // Filtra los libros según la búsqueda
      this.results = booksData.filter((book) => {
        if (this.selectedOption === 'title') {
          return book.title.toLowerCase().includes(this.searchInput.toLowerCase());
        } else if (this.selectedOption === 'author') {
          return book.author.toLowerCase().includes(this.searchInput.toLowerCase());
        } else if (this.selectedOption === 'genre') {
          return book.genre.toLowerCase().includes(this.searchInput.toLowerCase());
        }
        return false;
      });
    },
    setSelectedBook(book) {
      this.selectedBook = book;
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
            @input="searchBooks"
            type="text"
            class="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-lg"
          />
        </div>

        <div class="input-group mb-3">
          <label class="input-group-text" for="inputGroupSelect01">Buscar por</label>
          <select
            class="form-select"
            v-model="selectedOption"
            @change="searchBooks"
          >
            <option value="title">Título</option>
            <option value="author">Autor</option>
            <option value="genre">Género</option>
          </select>
        </div>
      </div>

      <!-- Resultados -->
      <div>
        <h2 class="mb-4">Resultados</h2>
        <div class="container">
          <div v-for="book in results" :key="book.title" class="row mb-4">
            <div class="col-2 text-center">
              <img 
                alt="Book cover" 
                :src="book.cover" 
                height="150vh" 
              />
            </div>
            <div class="col">
              <h3 class="text-body-emphasis">{{ book.title }}</h3>
              <h5 class="text-body-secondary">{{ book.author }}</h5>
              <h5 class="text-body-tertiary">{{ book.releaseYear }}</h5>
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
                  :src="selectedBook.cover"
                  height="300vh"
                  width="auto"
                />
              </div>
              <div class="col">
                <h3 class="text-body-emphasis">{{ selectedBook.title }}</h3>
                <h5 class="text-body-secondary">{{ selectedBook.author }}</h5>
                <h5 class="text-body-tertiary mb-3">
                  {{ selectedBook.releaseYear }}
                </h5>
                <div>
                  <h5 class="text-body-emphasis">Sinopsis</h5>
                  <p>{{ selectedBook.sinopsis }}</p>
                </div>
                <div>
                  <h5 class="text-body-emphasis">Género</h5>
                  <p>{{ selectedBook.genre }}</p>
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
