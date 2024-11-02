<script>
import HeaderComponent from '@/components/HeaderComponent.vue'
import { ref } from 'vue'

export default {
  name: 'BooksView',
  components: {
    HeaderComponent,
  },
  setup() {
    const searchInput = ref('')
    const selectedOption = ref('title')
    const results = ref([])

    return {
      searchInput,
      selectedOption,
      results,
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
        </div>
      </div>
    </div>
  </div>
</template>
