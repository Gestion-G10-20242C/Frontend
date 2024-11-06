<template>
    <div class="genre-sidebar">
      <h3>Géneros Populares</h3>
      <ul>
        <li v-for="genre in topGenres" :key="genre.name" @click="selectGenre(genre)">
          {{ genre.name }} ({{ genre.count }})
        </li>
      </ul>
      <button @click="viewAllGenres">Más géneros</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GenreSidebar',
    data() {
      return {
        topGenres: [
          { name: 'Fantasía', count: 120 },
          { name: 'Ciencia Ficción', count: 90 },
          { name: 'Misterio', count: 80 },
          { name: 'Romance', count: 70 },
          // Añade más géneros de ejemplo si deseas
        ],
      };
    },
    methods: {
      selectGenre(genre) {
        // Redirige a la página de libros populares del género seleccionado (simulado)
        this.$router.push({ path: `/genres/${genre.name}` });
      },
      viewAllGenres() {
        // Redirige a la página de todos los géneros
        this.$router.push('/genres');
      },
    },
  };
  </script>
  
  <style scoped>
  .genre-sidebar {
    padding: 1em;
    border-left: 1px solid #ddd;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    cursor: pointer;
    margin: 0.5em 0;
  }
  button {
    margin-top: 1em;
    cursor: pointer;
  }
  </style>
  