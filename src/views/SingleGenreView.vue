<template>
    <HeaderComponent />
    <div class="container mt-5">
      <h1>{{ genreName }}</h1>
      <p>Aquí se mostrarán los libros del género seleccionado: {{ genreName }}.</p>
    </div>
  </template>
  
  <script>
  import HeaderComponent from '@/components/HeaderComponent.vue';
  
  export default {
    name: 'SingleGenreView',
    components: { HeaderComponent },
    props: {
      genreName: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    padding: 20px;
  }
  </style>
  