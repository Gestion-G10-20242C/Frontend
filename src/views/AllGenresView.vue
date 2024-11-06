<template>
  <HeaderComponent />
  <div class="container mt-5">
    <h1>Todos los Géneros</h1>
    <ul class="genre-list">
      <li v-for="genre in genres" :key="genre.name">
        <RouterLink :to="`/genres/${genre.name}`"
          >{{ genre.name }} ({{ genre.count }})</RouterLink
        >
      </li>
    </ul>
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue'
import booksData from '@/resources/books.json'

export default {
  name: 'AllGenresView',
  components: { HeaderComponent },
  data() {
    return {
      genres: [], // Aquí almacenaremos los géneros con su cantidad
    }
  },
  created() {
    this.calculateGenres()
  },
  methods: {
    calculateGenres() {
      const genreCounts = {}

      // Contamos cuántos libros hay por género
      booksData.forEach(book => {
        if (book.genre) {
          if (genreCounts[book.genre]) {
            genreCounts[book.genre]++
          } else {
            genreCounts[book.genre] = 1
          }
        }
      })

      // Convertimos los géneros a un array con nombre y cantidad
      const allGenres = Object.keys(genreCounts).map(genre => ({
        name: genre,
        count: genreCounts[genre],
      }))

      // Ordenamos los géneros alfabéticamente por su nombre
      this.genres = allGenres.sort((a, b) => a.name.localeCompare(b.name))
    },
  },
}
</script>

<style scoped>
.container {
  padding: 20px;
}
.genre-list {
  list-style: none;
  padding: 10;
}
.genre-list li {
  margin: 10px 0;
}
.genre-list a {
  color: #1e90ff;
  text-decoration: none;
}
.genre-list a:hover {
  text-decoration: underline;
}
</style>
