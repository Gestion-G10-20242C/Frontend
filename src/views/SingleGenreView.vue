<template>
  <HeaderComponent />

  <div class="container mt-5">
    <h1>{{ genreName }}</h1>

    <div class="container">
      <div v-for="book in filteredBooks" :key="book.title" class="row mb-4">
        <div class="col-2 text-center">
          <img alt="Book cover" :src="book.cover" height="150vh" />
        </div>
        <div class="col">
          <h3 class="text-body-emphasis">{{ book.title }}</h3>
          <h5 class="text-body-secondary">{{ book.author_name }}</h5>
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
                <h5 class="text-body-secondary">
                  {{ selectedBook.author_name }}
                </h5>
                <h5 class="text-body-tertiary mb-3">
                  {{ selectedBook.releaseYear }}
                </h5>
                <div>
                  <h5 class="text-body-emphasis">Sinopsis</h5>
                  <p>{{ selectedBook.sinopsis }}</p>
                </div>
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

<script>
import HeaderComponent from '@/components/HeaderComponent.vue'
import { ref } from 'vue'
import booksData from '@/resources/books.json'

export default {
  name: 'SingleGenreView',
  components: { HeaderComponent },
  props: {
    genreName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const selectedBook = ref({})

    // Filtra los libros según el género
    const filteredBooks = booksData.filter(
      book => book.genres.toLowerCase() === props.genreName.toLowerCase(),
    )

    // Establece el libro seleccionado para el modal
    const setSelectedBook = book => {
      selectedBook.value = book
    }

    return {
      filteredBooks,
      setSelectedBook,
      selectedBook,
    }
  },
}
</script>

<style scoped>
.container {
  padding: 20px;
}

.main-content {
  width: 70%;
}
</style>
