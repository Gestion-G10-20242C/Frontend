<template>
  <div class="genre-sidebar">
    <h3>Géneros Populares</h3>
    <ul>
      <li
        v-for="genre in topGenres"
        :key="genre.name"
        @click="selectGenre(genre)"
      >
        {{ genre.name }} ({{ genre.count }})
      </li>
    </ul>
    <button @click="viewAllGenres">Más géneros</button>
  </div>
</template>

<script>
import booksData from '@/resources/books.json'

export default {
  name: 'GenreSidebar',
  data() {
    return {
      topGenres: [], // Aquí almacenaremos los géneros con su cantidad
    }
  },
  created() {
    this.calculateTopGenres()
  },
  methods: {
    calculateTopGenres() {
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

      // Convertimos los géneros a un array y los ordenamos por cantidad
      const sortedGenres = Object.keys(genreCounts)
        .map(genre => ({ name: genre, count: genreCounts[genre] }))
        .sort((a, b) => b.count - a.count) // Ordenar de mayor a menor

      // Tomamos los 4 géneros más populares
      this.topGenres = sortedGenres.slice(0, 4)
    },
    selectGenre(genre) {
      // Redirige a la página de libros populares del género seleccionado
      this.$router.push({ path: `/genres/${genre.name}` })
    },
    viewAllGenres() {
      // Redirige a la página de todos los géneros
      this.$router.push('/genres')
    },
  },
}
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
