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
    console.log('ISBN:', this.isbn)
    await this.fetchBookDetails()
  },
  methods: {
    async fetchBookDetails() {
      console.log('Isbn:', this.isbn)
      const relativePath = `/search?query=${encodeURIComponent(this.isbn)}&field=isbn`
      const data = await GET('GET', relativePath, null, null)

      if (data && data.books.length > 0) {
        console.log('Book:', data.books[0])
        this.book = data.books[0]
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
    translateGenre(genre) {
      const genreTranslations = {
        fiction: '📚 Ficción',
        mystery: '🕵️‍♂️ Misterio',
        thriller: '😱 Thriller',
        crime: '🔍 Crimen',
        fantasy: '🧙‍♂️ Fantasía',
        'dark-fantasy': '🧛‍♂️ Fantasía oscura',
        horror: '👻 Terror',
        poetry: '📜 Poesía',
        romance: '💖 Romance',
        comics: '🦸‍♂️ Cómics',
        graphic: '🎨 Novela gráfica',
        'young-adult': '👩‍🎓 Jóvenes adultos',
        children: '🧒 Infantil',
        'non-fiction': '📖 No ficción',
        historical: '🏛️ Histórico',
        biography: '👤 Biografía',
      }
      return genreTranslations[genre] || genre // Si no encuentra traducción, devuelve el género original
    },
  },
  computed: {
    parsedGenres() {
      if (!this.book?.genres) return []
      return this.book.genres
        .split(',') // Dividir por comas
        .map(genre => genre.trim()) // Quitar espacios
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
            <span v-for="n in 5" :key="n" :class="getStarClasses(n - 1)">★</span>
          </div>
          <p><strong>Puntaje Promedio:</strong> {{ book.average_rating }} / 5</p>
          <div class="genres-row">
            <p><strong>Géneros:</strong></p>
            <div class="genre-container">
              <RouterLink
                v-for="genre in parsedGenres"
                :key="genre"
                :to="`/genres/${genre}`"
                class="genre-badge"
              >
                {{ translateGenre(genre) }}
              </RouterLink>
            </div>
          </div>
          <p><strong>Reseñas:</strong> {{ book.text_reviews_count }} reseñas</p>
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
.genres-row {
  display: flex; /* Coloca los elementos en una fila */
  align-items: center; /* Alinea verticalmente el texto con los badges */
  gap: 10px; /* Espacio entre el texto y el contenedor de géneros */
}
.genre-container {
  display: flex; /* Coloca los badges en fila */
  flex-wrap: wrap; /* Permite que los badges se ajusten en múltiples líneas si es necesario */
  gap: 10px; /* Espacio entre los badges */
}
.genre-badge {
  display: inline-block;
  background-color: #e5e7eb; /* Un color de fondo más claro */
  color: #1f2937; /* Texto más oscuro */
  padding: 8px 15px; /* Aumenta el padding para que el badge sea más grande */
  margin: 0; /* Elimina el margen adicional */
  margin-top: -20px;
  border-radius: 10px; /* Redondea más las esquinas */
  font-size: 16px; /* Aumenta el tamaño del texto */
  font-weight: bold; /* Mantiene el texto en negrita */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Agrega un pequeño sombreado */
  cursor: default; /* Cambia el cursor a una flecha */
  transition: transform 0.2s ease; /* Agrega un efecto de animación */
  text-decoration: none; /* Elimina el subrayado */
}

.genre-badge:hover {
  transform: scale(1.05); /* Efecto de zoom al pasar el ratón */
  background-color: #d1d5db; /* Cambia el color al hacer hover */
}

</style>
