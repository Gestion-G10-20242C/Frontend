<script>
import HeaderComponent from '@/components/HeaderComponent.vue'

export default {
  name: 'BookListsView',
  components: { HeaderComponent },
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      bookLists: [], // Todas las listas de libros del usuario
      isLoading: true, // Indicador de carga
      error: null, // Errores en la carga
      // Modal para nueva lista
      showModal: false,
      newListName: '', // Nombre de la nueva lista
      nameError: '', // Error relacionado al nombre
    }
  },
  methods: {
    // Fetch de las listas
    async fetchBookLists() {
      const url = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${this.username}/booklist`
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Error al obtener las listas de libros')
        }
        const data = await response.json()
        this.bookLists = data || []
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
    // Validar nombre de la lista
    validateListName(name) {
      if (!name.trim()) {
        this.nameError = 'El nombre de la lista no puede estar vacío.'
        return false
      }
      if (
        this.bookLists.some(
          list => list.name.toLowerCase() === name.toLowerCase(),
        )
      ) {
        this.nameError = 'El nombre de la lista ya existe.'
        return false
      }
      this.nameError = ''
      return true
    },
    // Crear nueva lista
    async createBookList() {
      if (!this.validateListName(this.newListName)) {
        return
      }
      const url = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${this.username}/booklist`
      const body = { name: this.newListName }
      const accessToken = localStorage.getItem('access_token')

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
        if (!response.ok) {
          throw new Error('Error al crear la nueva lista')
        }
        // Si se crea con éxito, agregar a bookLists y cerrar modal
        this.bookLists.push({ name: this.newListName, books: [] })
        this.newListName = ''
        this.showModal = false
      } catch (error) {
        console.error(error)
        alert(`No se pudo crear la lista. Intenta nuevamente.`)
      }
    },
  },
  mounted() {
    this.fetchBookLists()
  },
}
</script>

<template>
  <HeaderComponent />
  <div class="booklists-view">
    <h1>Mis Listas de Libros</h1>

    <!-- Botón para agregar lista -->
    <button @click="showModal = true" class="btn btn-primary">
      Agregar Lista
    </button>

    <!-- Mostrar indicador de carga -->
    <div v-if="isLoading">Cargando listas de libros...</div>

    <!-- Mostrar error si ocurre -->
    <div v-else-if="error" class="error">Error: {{ error }}</div>

    <!-- Mostrar listas de libros -->
    <ul v-else>
      <li v-for="list in bookLists" :key="list.id" class="booklist-item">
        <RouterLink
          :to="`/user/${username}/booklists/${list.name}`"
          class="booklist-link"
        >
          <h3>{{ list.name }}</h3>
          <p>
            {{ list.books.length }}
            {{ list.books.length === 1 ? 'libro' : 'libros' }}
          </p>
        </RouterLink>
      </li>
    </ul>

    <!-- Mostrar mensaje si no hay listas -->
    <div v-if="!isLoading && bookLists.length === 0">
      No tienes listas de libros.
    </div>

    <!-- Modal para nueva lista -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Crear Nueva Lista</h2>
        <label class="error" v-if="nameError">{{ nameError }}</label>
        <input
          v-model="newListName"
          type="text"
          placeholder="Nombre de la lista"
          @input="validateListName(newListName)"
        />
        <button @click="createBookList">Crear</button>
        <button class="btn btn-sm btn-danger mt-2" @click="showModal = false">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.booklists-view {
  padding: 6em;
  margin-top: -55px;
}

.error {
  color: red;
  margin-top: 1em;
}

ul {
  list-style: none;
  padding: 0;
}

.booklist-item {
  margin: 1em 0;
  padding: 1em;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
}

.booklist-item:hover {
  background: #f9f9f9;
}

.booklist-link {
  text-decoration: none;
  color: #333;
}

.booklist-link:hover {
  color: #fad155;
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
  width: 500px;
  text-align: center;
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

.cancel-button {
  background: #ddd;
}

.cancel-button:hover {
  background: #bbb;
}
</style>
