<script>
import { useUserStore } from '@/stores/user'
import HeaderComponent from '@/components/HeaderComponent.vue'

export default {
  name: 'ConfigView',
  components: {
    HeaderComponent,
  },
  setup() {
    const userStore = useUserStore()

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

    return {
      userStore,
      genreTranslations,
    }
  },
  data() {
    return {
      selectedGenres: [], // Géneros seleccionados por el usuario
      isModalOpen: false, // Estado del modal
      availableGenres: [], // Géneros disponibles para seleccionar
    }
  },
  mounted() {
    this.selectedGenres = [...this.userPreferredGenres] // Carga los géneros seleccionados al montar el componente
  },
  computed: {
    // Obtener los géneros preferidos del usuario
    userPreferredGenres() {
      if (!this.userStore.favouriteGenres) {
        return []
      }

      return this.userStore.favouriteGenres.length
        ? JSON.parse(this.userStore.favouriteGenres.replace(/'/g, '"'))
        : []
    },
    // Dividir géneros disponibles en columnas de 5
    genreColumns() {
      const columns = []
      for (let i = 0; i < this.availableGenres.length; i += 5) {
        columns.push(this.availableGenres.slice(i, i + 5))
      }
      return columns
    },
  },
  methods: {
    toggleGenreSelection(genre) {
      if (this.selectedGenres.includes(genre)) {
        this.selectedGenres = this.selectedGenres.filter(g => g !== genre)
      } else {
        this.selectedGenres.push(genre)
      }
    },

    async fetchGenres() {
      this.selectedGenres = [...this.userStore.favouriteGenres]
    },

    openEditGenresModal() {
      this.fetchAllGenres() // Llamada a la función para cargar los géneros
      this.isModalOpen = true
    },

    async fetchAllGenres() {
      const url =
        'https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/book/genres'
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      const genresData = data.body.genres
      const genres = []

      genresData.forEach(genreObj => {
        const genreList = genreObj.genre.split(', ')
        genres.push(...genreList)
      })

      this.availableGenres = genres

      this.selectedGenres = [...this.userPreferredGenres]
    },

    async updateUser(genres) {
      const token = localStorage.getItem('access_token')
      const username = this.userStore.userName
      const apiUrl = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}`

      const userData = this.userStore.getUserData()

      console.log('User data:', userData)

      try {
        const response = await fetch(apiUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ favouriteGenres: genres }),
        })

        if (!response.ok) {
          throw new Error('No se pudo actualizar el usuario')
        }

        console.log('User updated:', userData)
      } catch (error) {
        console.error('Error updating user:', error)
      }
    },

    async saveGenres() {
      const userData = this.userStore.getUserData()

      console.log('User data:', this.selectedGenres)

      userData.favouriteGenres = this.selectedGenres

      console.log('User data:', userData)

      try {
        this.userStore.favouriteGenres = JSON.stringify(this.selectedGenres) // Actualiza el store

        // Actualizar perfil
        this.updateUser(this.selectedGenres)
      } catch (error) {
        console.error('Error saving genres:', error)
      } finally {
        this.fetchGenres()
        this.isModalOpen = false
      }
    },

    closeEditGenresModal() {
      this.isModalOpen = false
    },
  },
}
</script>

<template>
  <div class="config-view">
    <HeaderComponent />
    <div class="container mt-5">
      <h1>Configuración</h1>

      <!-- Mostrar géneros preferidos si existen -->
      <div v-if="userPreferredGenres.length > 0">
        <h3>Géneros Favoritos</h3>
        <ul>
          <li v-for="genre in userPreferredGenres" :key="genre">
            {{ genreTranslations[genre] || genre }}
          </li>
        </ul>
      </div>

      <!-- Si no hay géneros preferidos, mostrar mensaje -->
      <div v-else>
        <h3>Géneros preferidos</h3>
        <p>No tienes géneros favoritos seleccionados.</p>
      </div>

      <!-- Botón de edición siempre visible -->
      <button @click="openEditGenresModal" class="btn btn-primary">
        Editar géneros
      </button>

      <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
          <h3>Selecciona tus géneros</h3>
          <div class="genre-selection">
            <div class="columns">
              <div
                v-for="(column, columnIndex) in genreColumns"
                :key="columnIndex"
                class="column"
              >
                <button
                  v-for="genre in column"
                  :key="genre"
                  class="genre-button"
                  :class="{ selected: selectedGenres.includes(genre) }"
                  @click="toggleGenreSelection(genre)"
                >
                  <span>{{ genreTranslations[genre] || genre }}</span>
                  <span v-if="genre === 'fiction'">📚</span>
                  <span v-if="genre === 'mystery'">🕵️‍♂️</span>
                  <span v-if="genre === 'thriller'">😱</span>
                  <span v-if="genre === 'romance'">💖</span>
                  <span v-if="genre === 'fantasy'">🧙‍♂️</span>
                  <span v-if="genre === 'horror'">👻</span>
                  <span v-if="genre === 'poetry'">📜</span>
                  <span v-if="genre === 'comics'">🦸‍♂️</span>
                  <span v-if="genre === 'non-fiction'">📖</span>
                  <span v-if="genre === 'historical'">🏛️</span>
                  <span v-if="genre === 'biography'">👤</span>
                  <span v-if="genre === 'crime'">🔍</span>
                  <span v-if="genre === 'dark-fantasy'">🧛‍♂️</span>
                  <span v-if="genre === 'graphic'">🎨</span>
                  <span v-if="genre === 'young-adult'">👩‍🎓</span>
                  <span v-if="genre === 'children'">🧒</span>
                  <span v-if="genre === 'Gabigol'">⚽</span>
                </button>
              </div>
            </div>
          </div>
          <div class="modal-buttons">
            <button @click="saveGenres" class="btn btn-success">
              Guardar cambios
            </button>
            <button @click="closeEditGenresModal" class="btn btn-secondary">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 800px;
  max-width: 95%;
  text-align: left;
}

.genre-selection {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.genre-label {
  margin-bottom: 10px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.modal-buttons .btn {
  width: 45%;
}

.genre-selection .columns {
  display: flex;
  gap: 10px;
}

.genre-selection .column {
  display: flex;
  flex-direction: column;
}

.genre-button {
  background: #f5f5f5;
  padding: 10px 20px;
  border: 2px solid #ccc;
  border-radius: 5px;
  margin: 5px 0;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.genre-button.selected {
  background: #ffc300;
  color: black;
}

.genre-button span {
  margin-left: 5px;
}
</style>
