<script>
export default {
  name: 'GenreSidebar',
  data() {
    return {
      topGenres: [], // Lista de los 4 géneros con más libros
    }
  },
  methods: {
    async calculateTopGenres() {
      const url =
        'https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/book/genres'
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        const genresData = data.body.genres

        // Crear un objeto para contar los géneros
        const genreCounts = {}

        // Contar cada género por separado
        genresData.forEach(item => {
          const genres = item.genre.split(', ')
          genres.forEach(genre => {
            if (genreCounts[genre]) {
              genreCounts[genre] += item.count
            } else {
              genreCounts[genre] = item.count
            }
          })
        })

        // Convertir el objeto en una matriz y ordenar por la cantidad de libros
        const sortedGenres = Object.entries(genreCounts)
          .map(([genre, count]) => ({ genre, count }))
          .sort((a, b) => b.count - a.count)

        // Seleccionar los 4 géneros con más libros
        this.topGenres = sortedGenres.slice(0, 4)
      } catch (error) {
        console.error('Error fetching genres:', error)
      }
    },
    selectGenre(genre) {
      // Redirige a la página de libros populares del género seleccionado
      this.$router.push({ path: `/genres/${genre.genre}` })
    },
    viewAllGenres() {
      // Redirige a la página de todos los géneros
      this.$router.push('/genres')
    },
  },
  computed: {
    translatedTopGenres() {
      const genreTranslations = {
        fiction: 'Ficción',
        mystery: 'Misterio',
        thriller: 'Thriller',
        crime: 'Crimen',
        fantasy: 'Fantasía',
        'dark-fantasy': 'Fantasía oscura',
        horror: 'Terror',
        poetry: 'Poesía',
        romance: 'Romance',
        comics: 'Cómics',
        graphic: 'Novela gráfica',
        'young-adult': 'Jóvenes adultos',
        children: 'Infantil',
        'non-fiction': 'No ficción',
        historical: 'Histórico',
        biography: 'Biografía',
      }

      return this.topGenres.map(genre => ({
        ...genre,
        translatedName: genreTranslations[genre.genre] || genre.genre,
      }))
    },
  },
  mounted() {
    this.calculateTopGenres()
  },
}
</script>

<template>
  <div class="genre-sidebar">
    <h3>Géneros Populares</h3>
    <ul>
      <li
        v-for="genre in translatedTopGenres"
        :key="genre.genre"
        @click="selectGenre(genre)"
      >
        {{ genre.translatedName }} ({{ genre.count }})
      </li>
    </ul>
    <button class="btn btn-primary" @click="viewAllGenres">Más géneros</button>
  </div>
</template>

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
