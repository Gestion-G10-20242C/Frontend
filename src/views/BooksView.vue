<script>
import HeaderComponent from '@/components/HeaderComponent.vue'
import { ref } from 'vue'
import { useSearchStore } from '@/stores/search';

const searchStore = useSearchStore()

export default {
  name: 'BooksView',
  components: {
    HeaderComponent,
  },
  setup() {
    const searchInput = ref(searchStore.getSearchQuery()? searchStore.getSearchQuery(): '')
    const selectedOption = ref('title')
    const results = ref([])
    const selectedBook = ref({})

    return {
      searchInput,
      selectedOption,
      results,
      selectedBook,
    }
  },
  methods: {
    searchBooks() {
      if (this.searchInput.length < 3) {
        return
      }
      console.log('Searching for:', this.searchInput, 'by', this.selectedOption)

      // TODO: Replace with backend call
      const mockResults = [
        {
          title: 'El señor de los anillos',
          author: 'J.R.R. Tolkien',
          releaseYear: 1954,
          cover: 'https://www.openculture.com/?attachment_id=56360',
        },
        {
          title: 'Harry Potter y la piedra filosofal',
          author: 'J.K. Rowling',
          releaseYear: 1997,
          cover:
            'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg',
        },
      ]

      this.results = mockResults
    },
    setSelectedBook(title) {
      this.selectedBook = title
    },
  },
}
</script>

<template>
  <HeaderComponent />

  <div class="m-5">
    <!-- Busqueda -->
    <div class="mb-5">
      <h1 class="mb-4">Encuentra tu próximo mundo</h1>

      <div class="input-group input-group-lg mb-4">
        <input
          v-model="searchInput"
          v-on:input="searchBooks"
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
          v-on:change="searchBooks"
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
        <div
          v-for="{ title, author, releaseYear, cover } in results"
          :key="title"
          class="row mb-4"
          height="150vh"
        >
          <div class="col-2 text-center">
            <img alt="Book cover" :src="cover" height="150vh" />
          </div>
          <div class="col">
            <h3 class="text-body-emphasis">{{ title }}</h3>
            <h5 class="text-body-secondary">{{ author }}</h5>
            <h5 class="text-body-tertiary">{{ releaseYear }}</h5>
          </div>
          <div class="col-1">
            <button
              @click="setSelectedBook({ title, author, releaseYear, cover })"
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
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam nec purus nec nunc ultricies tincidunt. Nullam
                      bibendum, nunc nec ultricies tincidunt,
                    </p>
                  </div>
                  <div>
                    <h5 class="text-body-emphasis">Género</h5>
                    <p>Lorem, Ipsum, Dolor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>
