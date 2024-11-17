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
        books.value = data.books || [] // Suponiendo que los libros vienen en `data.books`
        errorMessage.value = '' // Limpia el mensaje de error en caso de éxito
        console.log('Libros obtenidos:', books.value)
      } catch (error) {
        console.error('Error al obtener los libros:', error)
        errorMessage.value =
          'Hubo un problema al obtener los libros. Intenta nuevamente más tarde.'
      }
    }

    // Cargar libros al montar el componente
    onMounted(getBooksOfGenre)

    return {
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

  <div class="container mt-5">
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
          <h3 class="text-body-emphasis">{{ book.title }}</h3>
          <h5 class="text-body-secondary">{{ book.author_name }}</h5>
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
</style>
