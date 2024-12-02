<script>
import HeaderComponent from '@/components/HeaderComponent.vue'
import { useUserStore } from '@/stores/user'
import { GET } from '@/utils/fetch_async'

export default {
  name: 'BookView',
  components: {
    HeaderComponent,
  },
  props: ['id'],
  data() {
    return {
      book: null,
      loading: true,
      error: false,
      reviewText: '',
      isRead: false,
      addToReadbuttonLoading: false,
      publishButtonLoading: false,
      addListModal: false,
      rateModal: false,
      rating: 0,
      userLists: [],
      filteredLists: [],
      selectedLists: [],
      newListName: '',
      reviewPublished: false,
      showSnackbar: false,
    }
  },
  async mounted() {
    console.log('ID:', this.id)
    await this.fetchBookDetails()
    await this.isBookRead()
  },
  methods: {
    async handleAddReview() {

      this.publishButtonLoading = true
      const relativePath = `book/${this.book.id}/review`
      const accessToken = localStorage.getItem('access_token')

      const userStore = useUserStore()

      const data = JSON.stringify({
        username: userStore.userName,
        user_review: this.reviewText,
      })

      try {
        const response = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/${relativePath}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: data,
          },
        )

        console.log('Review added successfully', response)

        this.fetchBookDetails()
      } catch (e) {
        console.error('Error adding review:', e)
      } finally {
        this.publishButtonLoading = false
      }

      if (data) {
        this.reviewPublished = true
        this.showSnackbar = true
        setTimeout(() => {
          this.showSnackbar = false
        }, 3000)
      }
      this.reviewText = ''
    },
    async addBookToSelectedLists() {
      try {
        // Iterar sobre las listas seleccionadas y agregar el libro
        for (const listName of this.selectedLists) {
          await this.addBookToList(listName)
        }
        this.addListModal = false // Cerrar el modal al finalizar
      } catch (error) {
        console.error(
          'Error al agregar libro a las listas seleccionadas:',
          error,
        )
      }
    },
    async createNewList() {
      try {
        const userStore = useUserStore()
        const username = userStore.userName
        const API_URL = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}/booklist`
        const token = localStorage.getItem('access_token')

        const body = { name: this.newListName }

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        })

        if (response.ok) {
          console.log(`Lista creada: ${this.newListName}`)
          this.newListName = '' // Limpiar el campo de entrada
          await this.fetchUserLists() // Actualizar las listas
        } else {
          throw new Error('Error al crear la nueva lista')
        }
      } catch (error) {
        console.error('Error al crear la nueva lista:', error)
      }
    },
    async fetchUserLists() {
      try {
        const userStore = useUserStore()
        const username = userStore.userName
        const API_URL = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}/booklist`
        const token = localStorage.getItem('access_token')

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          this.userLists = data

          // Filtra las listas: excluye "Leídos" y las listas que ya contienen el libro
          this.filteredLists = this.userLists.filter(
            list =>
              list.name !== 'Leidos' &&
              !list.books.some(book => book.id === this.book.id),
          )
        } else {
          throw new Error('Error al obtener las listas del usuario')
        }
      } catch (error) {
        console.error('Error al obtener las listas:', error)
      }
    },
    async addBookToList(listName) {
      try {
        const userStore = useUserStore()
        const username = userStore.userName
        const API_URL = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}/booklist/${listName}`
        const token = localStorage.getItem('access_token')

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: this.book.id }),
        })

        if (response.ok) {
          console.log(`Libro agregado a la lista ${listName}`)
          this.addListModal = false // Cierra el modal
          await this.fetchUserLists() // Actualiza las listas
        } else {
          throw new Error('Error al agregar el libro a la lista')
        }
      } catch (error) {
        console.error('Error al agregar el libro a la lista:', error)
      }
    },
    openAddToListModal() {
      this.addListModal = true
      this.fetchUserLists()
    },
    closeAddToListModal() {
      this.addListModal = false
    },
    async fetchBookDetails() {
      console.log('Id:', this.id)
      const relativePath = `/book/${encodeURIComponent(this.id)}`

      try {
        const data = await GET('GET', relativePath, null, null)

        if (data) {
          this.book = data

        } else {
          this.error = true
        }
      } catch (error) {
        console.error('Error fetching book:', error)
        this.error = true
        this.loading = false
      }

      this.loading = false
    },
    async isBookRead() {
      try {
        const userStore = useUserStore()
        const username = userStore.userName
        const API_URL = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}/booklist`
        const token = localStorage.getItem('access_token')

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          const readBooks = data.find(list => list.name === 'Leidos')

          if (readBooks) {
            this.isRead = readBooks.books.some(book => book.id === this.book.id)
          }
        } else {
          throw new Error('Error al obtener los libros leídos')
        }
      } catch (error) {
        console.error('Error al obtener los libros leídos:', error)
        this.errorMessage = 'Hubo un error al obtener los libros leídos.'
      }
    },
    async markAsRead() {
      this.addToReadbuttonLoading = true
      try {
        const userStore = useUserStore()
        const username = userStore.userName
        const API_URL = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}/booklist/Leidos`
        const token = localStorage.getItem('access_token')

        console.log('Marking as read:', this.book)

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: this.book.id }),
        })

        if (response) {
          console.log('Libro marcado como leído:', this.book)
          this.isRead = true
        }
      } catch (error) {
        console.error('Error al marcar como leído:', error)
        this.errorMessage = 'Hubo un error al marcar el libro como leído.'
        this.successMessage = ''
      } finally {
        this.addToReadbuttonLoading = false
      }
    },
    async removeFromRead() {
      this.addToReadbuttonLoading = true
      try {
        const userStore = useUserStore()
        const username = userStore.userName
        const API_URL = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}/booklist/Leidos`
        const token = localStorage.getItem('access_token')

        const response = await fetch(API_URL, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: this.book.id }),
        })

        if (response) {
          console.log('Libro eliminado de leídos:', this.book)
          this.isRead = false
        }
      } catch (error) {
        console.error('Error al eliminar de leídos:', error)
        this.errorMessage = 'Hubo un error al eliminar el libro de leídos.'
        this.successMessage = ''
      } finally {
        this.addToReadbuttonLoading = false
      }
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

    getStarClassesRating(index) {
      const rating = this.rating
      if (index < Math.floor(rating)) {
        return 'star filled' // Estrella llena
      } else if (index < rating) {
        return 'star half-filled' // Media estrella
      } else {
        return 'star empty' // Estrella vacía
      }
    },

    OpenRateBookModal() {
      this.rateModal = true
    },
    // Cerrar el modal
    CloseRateBookModal() {
      this.rateModal = false;
    },

    async rateBook() {
      const relativePath = `book/${this.book.id}/rating`
      const accessToken = localStorage.getItem('access_token')
      const username = useUserStore().userName

      const data = JSON.stringify({
        username: username,
        user_rating: this.rating,
      })

      try {
        const response = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/${relativePath}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: data,
          },
        )

        if (response.ok) {
          const data = await response.json()
          console.log('Book rated successfully', data)
        }

        this.rateModal = false
        this.rating = 0

        this.fetchBookDetails()
      } catch (e) {
        console.error('Error rating book:', e)
      }
    },

    // Actualizar el rating basado en el incremento
    updateRating(value) {
      const newRating = this.rating + value;
      if (newRating >= 0 && newRating <= 5) {
        this.rating = newRating;
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

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="text-center">Cargando...</p>
    </div>

    <!-- Mostrar error si no hay resultados de libros -->
    <div v-else-if="error" class="error-message">
      <h2>No se encontró el Libro.</h2>
      <p>Por favor, revisa los criterios de búsqueda.</p>
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
            style="width: 315px; height: 425px"
          />
        </div>
          <div class="col-md-8">
          <h2 class="text-body-emphasis">{{ book.title }}</h2>
          <RouterLink :to="`/author/${book.author_name}`">
            <h4 class="text-body-secondary">{{ book.author_name }}</h4>
          </RouterLink>
          <h5 class="text-body-tertiary">{{ book.publication_date }}</h5>
          
          <div class="rate-container">
            <div class="stars">
              <span v-for="n in 5" :key="n" :class="getStarClasses(n - 1)"
                >★
              </span >
            </div>
            <button class="btn btn-primary" @click="OpenRateBookModal">Puntuar</button>
          </div>

          <p>
            <strong>Puntaje Promedio:</strong> {{ book.average_rating }} / 5
          </p>

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
          <p><strong>Reseñas:</strong> {{ (book?.text_reviews_count || 0)  + (book.reviews?.length || 0)}} reseña(s)</p>

          <div class="button-container">
            <button v-if="!isRead" class="btn btn-success" @click="markAsRead">
              {{ addToReadbuttonLoading ? 'Procesando...' : 'Marcar como leído' }}
            </button>
            <button v-else class="btn btn-danger" @click="removeFromRead">
              {{ addToReadbuttonLoading ? 'Procesando...' : 'Quitar de Leídos' }}
            </button>
            <button class="btn btn-primary" @click="openAddToListModal">
              Agregar a lista
            </button>

          </div>
          <div class="review-container">
            <div v-if="reviewPublished">
              <div :class="['snackbar', { show: showSnackbar }]">
                Reseña publicada exitosamente!
              </div>
            </div>

            <h3>Reseñas</h3>

            <div class="title-review">
              <div class="review-input">
              <textarea v-model="reviewText" class="square-input" placeholder="Escribe tu reseña aquí..."></textarea>
              <div class="button-container">
                <button class="review-section-button" 
                  @click="handleAddReview" 
                  :disabled="reviewText.trim() == ''"
                  :class="{ 'review-section-button-disabled-button': reviewText.trim() == '' }">
                  {{publishButtonLoading ? 'Procesando...' : 'Publicar'}}
                </button>
              </div>
              </div>
            </div>

            <div v-for="review in book.reviews" :key="review.username" class="review">
              <img :src="review.profilePicture" alt="Profile Picture" class="profile-picture" />
              <div class="review-content">
                <h4>{{ review.name }}</h4>
                <p4>{{ review.username }}</p4>
                <p>{{ review.review }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para agregar a lista -->
  <div v-if="addListModal" class="modal">
    <div class="modal-content">
      <div class="header-container">
        <div class="checklist-container">
          <h2>Agregar a listas</h2>
          <p>Selecciona las listas a las que deseas agregar este libro:</p>
          <div
            v-for="list in filteredLists"
            :key="list.name"
            class="checklist-item"
          >
            <input
              type="checkbox"
              :id="list.name"
              :value="list.name"
              v-model="selectedLists"
            />
            <label :for="list.name">{{ list.name }}</label>
          </div>
          <hr />
          <button @click="addBookToSelectedLists" class="btn btn-success">
            Agregar
          </button>
          <button @click="closeAddToListModal" class="btn btn-danger mt-2">
            Cancelar
          </button>
        </div>

        <div class="vertical-line"></div>

        <div class="new-list-container">
          <h3>Crear nueva lista</h3>
          <input
            v-model="newListName"
            type="text"
            placeholder="Nombre de la nueva lista"
            class="form-control"
          />
          <button
            @click="createNewList"
            class="btn btn-primary mt-2"
            :disabled="!newListName.trim()"
          >
            Crear lista
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para puntuar un libro de 0 a 5 estrellas -->
  <div v-if="rateModal" class="rate-modal">
    <div class="rate-modal-content">
      <h3>Calificar libro</h3>
      <div class="modal-rate-container">
        <!-- Flecha para disminuir el rating -->
        <button 
          class="arrow-button" 
          :disabled="rating <= 0" 
          @click="updateRating(-0.5)"
        >
          ◀
        </button>

        <!-- Mostrar el número de calificación -->
        
        <div class="book-view">
          <div class="stars">
            <span v-for="n in 5" :key="n" :class="getStarClassesRating(n - 1)"
              >★
            </span >
          </div>
        </div>
      
        <!-- Flecha para aumentar el rating -->
        <button 
          class="arrow-button" 
          :disabled="rating >= 5" 
          @click="updateRating(0.5)"
        >
          ▶
        </button>
      </div>

      <div class="modal-button-container">
        <button class="btn btn-success mt-2" @click="rateBook">Confirmar Puntuación</button>
        <button class="btn btn-danger mt-2" @click="CloseRateBookModal">Cerrar</button>
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
  padding: 10px 10px; /* Añade un poco de espacio alrededor */
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

.button-container {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.modal-button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2em;
  border-radius: 8px;
  width: 1000px;
  text-align: center;
}

.lists-container {
  display: flex;
  gap: 30px; /* Espacio entre la lista de checkboxes y el input de nueva lista */
}

.checklist-container {
  display: horizontal;
}

.new-list-container {
  flex: 1; /* Toma el mismo espacio que la lista de checkboxes */
  max-width: 300px; /* Limita el ancho del formulario de nueva lista */
}

.header-container {
  display: flex;
  justify-content: space-between; /* Coloca los elementos en los extremos */
  align-items: flex-start; /* Alinea los elementos en la parte superior */
}

.new-list-container input {
  width: 100%;
}

.modal-content input {
  margin: 1em 0;
  padding: 0.5em;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.modal-content button {
  margin: 0.5em;
  padding: 0.5em 1em;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.vertical-line {
  width: 2px; /* Ancho de la línea */
  height: 400px; /* Altura de la línea */
  background-color: #ddd; /* Color de la línea */
  margin: 0 auto; /* Alineación centrada */
}

.review-container {
  display: vertical;
  margin-top: 40px;
  margin-left: -400px;

}

.title-review {
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  align-items: center;
}

.review-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;

  margin-left: -250px;
  text-align: center;
}

.square-input {
  width: 1000px;
  height: 100px;
  resize: none;
  overflow-wrap: break-word;
  box-sizing: border-box;
  border-radius: 10px;
}

.snackbar {
  visibility: hidden;
  min-width: 250px;
  margin-left: -125px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
  font-size: 17px;
}

.snackbar.show {
  visibility: visible;
}


.review-section {
  margin-top: 20px;
}

.review-section textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.review-section-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  cursor: pointer;
  margin-left: 900px
}

.review-section-button-disabled-button {
  background-color: #ccc;
  cursor: not-allowed;
}

.review {
  display: flex;
  align-items: flex-start;
  margin-top: 20px;
}

.profile-picture {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.review-content {
  flex: 1;
}

.review-content h4 {
  margin: 0;
  font-size: 1.2em;
}

.review-content p {
  margin: 5px 0 0;
}

.rate-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.rate-modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.rate-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.modal-rate-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  gap: 20px;
}

.arrow-button {
  background: #f0f0f0;
  border: none;
  padding: 10px;
  font-size: 20px;
  cursor: pointer;
  border-radius: 5px;
}

.arrow-button:hover {
  background: #e0e0e0;
}

.arrow-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.rating-display {
  font-size: 24px;
  font-weight: bold;
  margin: 0 15px;
}
</style>
