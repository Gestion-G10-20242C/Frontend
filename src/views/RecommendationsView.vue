<script>
import { reactive, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import HeaderComponent from '@/components/HeaderComponent.vue'

export default {
  name: 'RecommendationsView',
  components: { HeaderComponent },
  setup() {
    const userStore = useUserStore()
    const booksByGenre = reactive({})
    const errorMessage = ref('')
    const booksPerPage = 9
    const currentPages = reactive({})
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

    const feedFavouriteGenres = userStore.favouriteGenres.length
      ? JSON.parse(userStore.favouriteGenres.replace(/'/g, '"'))
      : []

    feedFavouriteGenres.forEach(genre => {
      currentPages[genre] = 1
    })

    const shuffleArray = array => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]] // Intercambia elementos
      }
      return array
    }

    const getBooksOfGenre = async genre => {
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
          throw new Error('Error fetching books data')
        }

        const data = await response.json()
        const books = data || []
        booksByGenre[genre] = shuffleArray(books) // Mezcla antes de asignar
        errorMessage.value = ''
      } catch (error) {
        console.error(error)
        errorMessage.value =
          'Hubo un problema al obtener los libros. Intenta nuevamente más tarde.'
      }
    }

    const getPaginatedBooks = genre => {
      const start = (currentPages[genre] - 1) * booksPerPage
      const end = start + booksPerPage
      return booksByGenre[genre]?.slice(start, end) || []
    }

    const changePage = (genre, pageNumber) => {
      const totalPages = Math.ceil(
        (booksByGenre[genre]?.length || 0) / booksPerPage,
      )
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        currentPages[genre] = pageNumber
      }
    }

    onMounted(() => {
      feedFavouriteGenres.forEach(genre => {
        getBooksOfGenre(genre)
      })
    })

    return {
      feedFavouriteGenres,
      genreTranslations,
      booksByGenre,
      currentPages,
      getPaginatedBooks,
      changePage,
      errorMessage,
    }
  },
}
</script>

<template>
  <HeaderComponent />
  <div class="container pt-4 content-wrapper">
    <h1>Recomendaciones</h1>

    <div v-if="feedFavouriteGenres.length === 0" class="no-genres-message">
      <p>
        No tienes géneros favoritos seleccionados. Puedes seleccionarlos en la
        sección de Configuración.
      </p>
    </div>

    <div
      v-else
      v-for="genre in feedFavouriteGenres"
      :key="genre"
      class="genre-section"
    >
      <h2>
        Te gustan los libros de {{ genreTranslations[genre] }}? ¡Mira estos!
      </h2>
      <div class="book-list">
        <div
          v-if="booksByGenre[genre] && booksByGenre[genre].length > 0"
          class="horizontal-box"
        >
          <div
            v-for="book in getPaginatedBooks(genre)"
            :key="book.title"
            class="book-item"
          >
            <RouterLink :to="`/book/${book.id}`">
              <img :src="book.image_url" :alt="book.title" class="book-cover" />
            </RouterLink>
            <p>{{ book.title }}</p>
          </div>
        </div>
        <div
          v-else-if="booksByGenre[genre] && booksByGenre[genre].length === 0"
        >
          <p>No se encontraron libros para este género.</p>
        </div>
        <div v-else-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>
        <div v-else>
          <p>Cargando libros...</p>
        </div>
      </div>

      <div class="pagination">
        <button
          @click="changePage(genre, currentPages[genre] - 1)"
          :disabled="currentPages[genre] <= 1"
        >
          Anterior
        </button>
        <span>Página {{ currentPages[genre] }}</span>
        <button
          @click="changePage(genre, currentPages[genre] + 1)"
          :disabled="
            !booksByGenre[genre] ||
            currentPages[genre] ===
              Math.ceil(booksByGenre[genre].length / booksPerPage)
          "
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-group-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.follow-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.user-link {
  color: black;
  text-decoration: none;
}

.user-link:hover {
  text-decoration: underline;
}

.genre-section {
  margin-top: 30px;
}

.book-list {
  display: center;
  gap: 20px; /* Espacio entre los libros */
  padding-bottom: 10px; /* Espacio extra para desplazamiento */
}

.horizontal-box {
  display: flex;
  gap: 20px; /* Espacio entre los libros */
  overflow-x: auto; /* Permite el desplazamiento horizontal */
}

.book-item {
  width: 120px; /* Define un tamaño para las cajas de los libros */
  white-space: nowrap; /* Impide que el texto se envuelva */
  overflow: hidden; /* Oculta el texto que se desborda */
  text-overflow: ellipsis; /* Muestra puntos suspensivos cuando el texto excede el contenedor */
  display: block; /* Asegura que el contenedor sea un bloque */
}

.book-item p {
  text-align: center;
  margin: 0;
  padding: 0;
  font-size: 20px; /* Ajusta el tamaño de la fuente según el espacio */
  max-width: 120px; /* Limita el ancho del texto al tamaño del contenedor */
  overflow: hidden; /* Oculta el texto que se desborda */
  text-overflow: ellipsis; /* Aplica puntos suspensivos si el texto se desborda */
  white-space: nowrap; /* Evita que el texto se envuelva en varias líneas */
}

.book-cover {
  width: 100%;
  height: 150px;
  object-fit: cover; /* Mantiene la proporción de la imagen */
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.pagination button {
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 16px;
}

.pagination button:disabled {
  background-color: #d3d3d3; /* Gris claro */
  cursor: not-allowed;
}

.pagination button:disabled {
  background-color: #ccc; /* Gris claro para el botón deshabilitado */
  cursor: not-allowed;
}

.pagination span {
  font-size: 16px;
  line-height: 36px;
}

.no-genres-message {
  text-align: center;
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.no-genres-message p {
  font-size: 18px;
  color: #555;
}
</style>
