<template>
    <HeaderComponent />
    <div class="container mt-5">
      <h1>Todos los Géneros</h1>
      <ul class="genre-list">
        <li v-for="genre in genres" :key="genre.name">
          <RouterLink :to="`/genres/${genre.name}`">{{ genre.name }} ({{ genre.count }})</RouterLink>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import HeaderComponent from '@/components/HeaderComponent.vue';
  
  export default {
    name: 'AllGenresView',
    components: { HeaderComponent },
    data() {
      return {
        genres: [
          { name: 'Fantasía', count: 120 },
          { name: 'Ciencia Ficción', count: 90 },
          { name: 'Misterio', count: 80 },
          { name: 'Romance', count: 70 },
          { name: 'Historia', count: 60 },
          { name: 'Aventura', count: 50 },
          // Agrega más géneros según sea necesario
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .container {
    padding: 20px;
  }
  .genre-list {
    list-style: none;
    padding: 0;
  }
  .genre-list li {
    margin: 10px 0;
  }
  </style>
  