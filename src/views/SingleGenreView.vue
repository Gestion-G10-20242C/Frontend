<script>
import { ref, computed, onMounted } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'

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
    const loadingPage = ref(true)
    const books = ref([])
    const selectedBook = ref(null)
    const errorMessage = ref('')

    const genreTranslations = {
      fiction: 'Ficción',
      mystery: 'Misterio',
      thriller: 'Thriller',
      crime: 'Crimen',
      fantasy: 'Fantasía',
      'dark-fantasy': 'Fantasía oscura',
      horror: 'Terror',
      poetry: 'Poesía',
      romance: 'Romance',
      comics: 'Cómics',
      graphic: 'Novela gráfica',
      'young-adult': 'Jóvenes adultos',
      children: 'Infantil',
      'non-fiction': 'No ficción',
      historical: 'Histórico',
      biography: 'Biografía',
    }

    // Traducción del género
    const translatedGenre = computed(
      () => genreTranslations[props.genreName] || props.genreName,
    )

    // Función para obtener los libros por género
    const getBooksOfGenre = async () => {
      const genre = props.genreName
      console.log('Buscando libros de género:', genre)
      const apiUrl = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/search?query=${genre}&field=genres`
      const token = localStorage.getItem('access_token')

      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Error al obtener los datos de libros')
        }

        const data = await response.json()
        books.value = data || [] // Suponiendo que los libros vienen en `data.books`

        // Mezclar los libros aleatoriamente
        books.value = books.value.sort(() => Math.random() - 0.5)

        errorMessage.value = '' // Limpia el mensaje de error en caso de éxito
        console.log('Libros obtenidos:', books.value)
      } catch (error) {
        console.error('Error al obtener los libros:', error)
        errorMessage.value =
          'Hubo un problema al obtener los libros. Intenta nuevamente más tarde.'
      }
      loadingPage.value = false
    }

    // Cargar libros al montar el componente
    onMounted(getBooksOfGenre)

    return {
      loadingPage,
      books,
      selectedBook,
      errorMessage,
      translatedGenre,
      setSelectedBook: book => {
        selectedBook.value = book
      },
    }
  },
}
</script>

<template>
  <HeaderComponent />
  <div v-if="loadingPage" class="loading-container">
    <div class="loading-spinner"></div>
    <p class="text-center">Cargando...</p>
  </div>

  <div v-else class="container mt-5">
    <!-- Título traducido -->
    <h1>{{ translatedGenre }}</h1>

    <!-- Mensaje de error -->
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>

    <!-- Lista de libros -->
    <div v-if="!errorMessage && books.length" class="container">
      <div v-for="book in books" :key="book.title" class="row mb-4">
        <div class="col-2 text-center">
          <img alt="Book cover" :src="book.image_url" height="150vh" />
        </div>
        <div class="col">
          <RouterLink :to="`/book/${book.id}`">
            <h3 class="text-body-emphasis">{{ book.title }}</h3>
          </RouterLink>
          <RouterLink :to="`/author/${book.author_name}`">
            <h5 class="text-body-secondary">{{ book.author_name }}</h5>
          </RouterLink>
          <h5 class="text-body-tertiary">{{ book.publication_date }}</h5>
        </div>
      </div>
    </div>

    <!-- Mensaje de no hay libros -->
    <div v-if="!errorMessage && books.length === 0" class="text-center mt-4">
      <p>No se encontraron libros para este género.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}

.main-content {
  width: 70%;
}

.loading-container {
  display: vertical;
  justify-content: center;
  align-items: center;
  height: 80vh;
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
