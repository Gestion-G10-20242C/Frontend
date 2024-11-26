<script>
import HeaderComponent from '@/components/HeaderComponent.vue';

export default {
  name: "BookListsView",
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
    };
  },
  methods: {
    async fetchBookLists() {
      const url = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${this.username}/booklist`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Error al obtener las listas de libros");
        }
        const data = await response.json();
        this.bookLists = data || [];
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {   
    this.fetchBookLists();
  },
};
</script>

<template>
  <HeaderComponent />
  <div class="booklists-view">
    <h1>Mis Listas de Libros</h1>

    <!-- Mostrar indicador de carga -->
    <div v-if="isLoading">Cargando listas de libros...</div>

    <!-- Mostrar error si ocurre -->
    <div v-else-if="error" class="error">
      Error: {{ error }}
    </div>

    <!-- Mostrar listas de libros -->
    <ul v-else>
      <li
        v-for="list in bookLists"
        :key="list.id"
        class="booklist-item">
        <RouterLink :to="`/user/${username}/booklists/${list.name}`" class="booklist-link">
          <h3>{{ list.name }}</h3>
          <p>{{ list.books.length }} libros</p>
        </RouterLink>
      </li>
    </ul>

    <!-- Mostrar mensaje si no hay listas -->
    <div v-if="!isLoading && bookLists.length === 0">
      No tienes listas de libros.
    </div>
  </div>
</template>

<style scoped>
.booklists-view {
  padding: 5em;
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

/* Cambia el color del texto de RouterLink */
.booklist-link {
  text-decoration: none; /* Elimina el subrayado */
  color: #333; /* Cambia el color del texto */
}

.booklist-link:hover {
  color: #007BFF; /* Cambia a azul al pasar el mouse */
}
</style>
