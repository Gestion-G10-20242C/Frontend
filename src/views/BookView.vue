<script>
import HeaderComponent from '@/components/HeaderComponent.vue'
import { GET } from '@/utils/fetch_async'

export default {
  name: 'BookView',
  components: {
    HeaderComponent,
  },
  props: ['isbn'],
  data() {
    return {
      book: null,
      loading: true,
      error: false,
    }
  },
  async mounted() {
    await this.fetchBookDetails()
  },
  methods: {
    async fetchBookDetails() {
      console.log('Isbn:', this.isbn)
      const relativePath = `/search?query=${encodeURIComponent(this.isbn)}&field=isbn`
      const book = await GET('GET', relativePath, null, null)
      console.log('Book:', book)

      if (book && book.length > 0) {
        this.book = book[0]
      } else {
        this.error = true // Marca error si no se encuentran libros
      }

      this.loading = false
    },
    getStarClasses(index) {
      const rating = this.book?.average_rating || 0
      if (index < Math.floor(rating)) {
        return 'star filled' // Estrella llena
      } else if (index < rating) {
        return 'star half-filled' // Media estrella
      } else {
        return 'star empty' // Estrella vacía
      }
    },
  },
}
</script>

<template>
  <div class="book-view">
    <HeaderComponent />
    <div v-if="loading" class="loading-spinner"></div>

    <!-- Mostrar error si no hay resultados de libros -->
    <div v-else-if="error" class="error-message">
      <h2>No se encontraron libros para el ISBN proporcionado.</h2>
      <p>
        Por favor, intenta con otro ISBN o revisa los criterios de búsqueda.
      </p>
      <img
        src="https://media.istockphoto.com/id/1347475061/vector/book-with-sad-face-in-speech-bubble-line-icon-bad-literature-review-negative-feedback-symbol.jpg?s=612x612&w=0&k=20&c=PQa7DkacREaANvys7s7iUpEbysHTUGzD2D3Jj5eIVaw="
        alt="Error - No books found"
        class="error-image"
      />
    </div>

    <div v-else class="container mt-5">
      <div class="row">
        <div class="col-md-4 text-center">
          <img
            :src="book.image_url"
            alt="Book cover"
            class="img-fluid"
            style="width: 300px; height: 400px"
          />
        </div>
        <div class="col-md-8">
          <h2 class="text-body-emphasis">{{ book.title }}</h2>
          <h4 class="text-body-secondary">{{ book.author_name }}</h4>
          <h5 class="text-body-tertiary">{{ book.publication_date }}</h5>
          <div class="stars">
            <span v-for="n in 5" :key="n" :class="getStarClasses(n - 1)"
              >★</span
            >
          </div>
          <p><strong>Average Rating:</strong> {{ book.average_rating }} / 5</p>
          <p><strong>Genres:</strong> {{ book.genres }}</p>
          <p><strong>Reviews:</strong> {{ book.text_reviews_count }} reviews</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-view .stars {
  font-size: 20px;
  color: gold;
}

.book-view .star {
  display: inline-block;
  font-size: 40px;
}

.book-view .star.filled {
  color: orange;
}

.book-view .star.half-filled {
  background: linear-gradient(90deg, orange 50%, lightgray 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.book-view .star.empty {
  color: lightgray;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
  margin: 50px auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  margin-top: 20px;
  color: red;
}

.error-message img.error-image {
  margin-top: 15px;
  width: 150px;
  height: auto;
}
</style>
