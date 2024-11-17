<script>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import HeaderComponent from '@/components/HeaderComponent.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'FeedView',
  components: {
    HeaderComponent,
  },
  setup() {
    const follows = reactive([])
    const userStore = useUserStore()
    const router = useRouter()
    const errorMessage = ref('')

    // Estado reactivo para almacenar los libros por género
    const booksByGenre = reactive({})
    const booksPerPage = 9 // Libros por página

    // Estado reactivo para la página actual de cada género
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

    // Convertir géneros favoritos desde el store
    const feedFavouriteGenres = JSON.parse(
      userStore.favouriteGenres.replace(/'/g, '"'),
    )

    // Inicializar las páginas actuales para cada género
    feedFavouriteGenres.forEach(genre => {
      currentPages[genre] = 1 // Página inicial para cada género
    })

    // Función para obtener los libros por género
    const getBooksOfGenre = async genre => {
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
          throw new Error('Error fetching books data')
        }
        const data = await response.json()
        console.log(data)

        // Almacenar los libros en el estado reactivo
        booksByGenre[genre] = data.books || []
        errorMessage.value = '' // Limpiar mensaje de error en caso de éxito
      } catch (error) {
        console.error(error)
        errorMessage.value =
          'Hubo un problema al obtener los libros. Intenta nuevamente más tarde.'
      }
    }

    // Función para obtener los libros paginados de un género
    const getPaginatedBooks = genre => {
      const start = (currentPages[genre] - 1) * booksPerPage
      const end = start + booksPerPage

      // Retornar los libros paginados si están disponibles
      if (booksByGenre[genre] && booksByGenre[genre].length > 0) {
        return booksByGenre[genre].slice(start, end)
      }
      return []
    }

    // Función para cambiar de página para un género específico
    const changePage = (genre, pageNumber) => {
      // Asegurarse de que la página no sea menor que 1 ni mayor que el número total de páginas
      const totalPages = Math.ceil(
        (booksByGenre[genre]?.length || 0) / booksPerPage,
      )
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        currentPages[genre] = pageNumber
      }
    }

    // Obtener la lista de usuarios que sigues
    const fetchFollowing = async () => {
      const currentUserName = userStore.userName
      try {
        const response = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${currentUserName}/following/`,
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        follows.push(...data)
      } catch (error) {
        console.error('Error fetching following:', error)
      }
    }

    // Llamar a fetchFollowing y obtener libros al montar el componente
    onMounted(() => {
      fetchFollowing()

      // Obtener los libros de cada género favorito
      feedFavouriteGenres.forEach(genre => {
        getBooksOfGenre(genre)
      })
    })

    return {
      follows,
      userStore,
      router,
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
    <div class="row">
      <div class="col feed-column">
        <h1>Feed</h1>
        <h2>Sigues a ...</h2>
        <div class="list-group">
          <div
            class="list-group-item"
            v-for="(user, index) in follows"
            :key="index"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
              alt="Icono de seguimiento"
              class="follow-icon"
            />
            <router-link class="user-link" :to="`/user/${user.following}`">{{
              user.following
            }}</router-link>
          </div>
        </div>

        <!-- Mostrar libros por género -->
        <div
          v-for="genre in feedFavouriteGenres"
          :key="genre"
          class="genre-section"
        >
          <h2>
            Te gustan los libros de {{ genreTranslations[genre] }}? ¡Mira estos!
          </h2>
          <div class="book-list">
            <!-- Verificar si ya se cargaron los libros del género -->
            <div
              v-if="booksByGenre[genre] && booksByGenre[genre].length > 0"
              class="horizontal-box"
            >
              <div
                v-for="book in getPaginatedBooks(genre)"
                :key="book.title"
                class="book-item"
              >
                <img
                  :src="book.image_url"
                  :alt="book.title"
                  class="book-cover"
                />
                <p>{{ book.title }}</p>
              </div>
            </div>
            <!-- Mostrar mensaje si no hay libros para este género -->
            <div
              v-else-if="
                booksByGenre[genre] && booksByGenre[genre].length === 0
              "
            >
              <p>No se encontraron libros para este género.</p>
            </div>
            <!-- Mostrar mensaje de error general si ocurre un problema con la API -->
            <div v-else-if="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>
            <!-- Mostrar mensaje de carga si aún no se han obtenido los libros -->
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
</style>
