<script>
import HeaderComponent from "@/components/HeaderComponent.vue";

export default {
  name: "BookListView",
  components: { HeaderComponent },
  props: {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true, // Nombre de la lista como parámetro de la ruta
    },
  },
  data() {
    return {
      books: [], // Libros de la lista
      bookListName: "", // Nombre de la lista
      isLoading: true, // Indicador de carga
      error: null, // Manejo de errores
    };
  },
  methods: {
    async fetchBookList() {
      const url = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${this.username}/booklist`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Error al obtener los libros de la lista");
        }
        const data = await response.json();

        // Encuentra la lista con el mismo nombre en los datos

        const list = data.find((list) => list.name === this.name);

        this.books = list.books || [];
        this.bookListName = list.name;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.fetchBookList();
  },
};
</script>

<template>
    <HeaderComponent />
  
    <div class="container mt-5">

      <!-- Titulo de la lista de libros -->
        <h1>{{ bookListName }}</h1>

  
      <!-- Lista de libros -->
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
  
      <!-- Mensaje de no hay libros -->
      <div v-if="books.length === 0" class="text-center mt-4">
        <p>No hay libros en esta lista.</p>
      </div>
    </div>
  </template>
  
  <style scoped>
  .container {
    padding: 10px;
  }

  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .main-content {
    width: 70%;
    margin-top: -100;
  }
  </style>