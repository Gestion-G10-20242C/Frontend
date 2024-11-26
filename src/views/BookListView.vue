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
      <div class="container">
        <div class="row">
          <div 
            v-for="book in books" 
            :key="book.title" 
            class="col-md-4 mb-4 text-center"
          >
            <!-- Imagen del libro -->
            <img 
              alt="Book cover" 
              :src="book.image_url" 
              class="img-fluid" 
              style="height: 150px; width: auto;"
            />

            <!-- Título del libro -->
            <RouterLink 
              :to="`/book/${book.isbn}`" 
              class="d-block mt-2 text-decoration-none text-body-emphasis"
            >
              <h4>{{ book.title }}</h4>
            </RouterLink>
          </div>
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