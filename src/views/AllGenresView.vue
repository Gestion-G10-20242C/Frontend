<script>
import HeaderComponent from '@/components/HeaderComponent.vue';

export default {
  name: 'AllGenresView',
  components: {
    HeaderComponent,
  },
  data() {
    return {
      genres: [],
    };
  },
  methods: {
    async fetchGenres() {
      const url = 'https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/book/genres';
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const genresData = data.body.genres;

        // Crear un objeto para contar los géneros
        const genreCounts = {};

        // Contar cada género por separado
        genresData.forEach(item => {
          const genres = item.genre.split(', ');
          genres.forEach(genre => {
            if (genreCounts[genre]) {
              genreCounts[genre] += item.count;
            } else {
              genreCounts[genre] = item.count;
            }
          });
        });

        // Diccionario de traducción de géneros
        const genreTranslations = {
          "fiction": "Ficción",
          "mystery": "Misterio",
          "thriller": "Thriller", 
          "crime": "Crimen",
          "fantasy" : "Fantasía", 
          "dark-fantasy" : "Fantasía oscura",
          "horror" : "Terror",
          "poetry": "Poesía", 
          "romance": "Romance",
          "comics": "Cómics",
          "graphic": "Novela gráfica",
          "young-adult": "Jóvenes adultos",
          "children": "Infantil",
          "non-fiction": "No ficción",
          "historical": "Histórico",
          "biography": "Biografía",
        };

        // Convertir el objeto en una matriz, traducir y ordenar por orden alfabético
        const sortedGenres = Object.entries(genreCounts)
          .map(([genre, count]) => ({
            name: genre,
            translatedName: genreTranslations[genre] || genre,
            count
          }))
          .sort((a, b) => a.translatedName.localeCompare(b.translatedName));

        this.genres = sortedGenres;
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    },
  },
  mounted() {
    this.fetchGenres();
  },
};
</script>

<template>
  <HeaderComponent />
  <div class="container mt-5">
    <h1>Todos los Géneros</h1>
    <ul class="genre-list">
      <li v-for="genre in genres" :key="genre.name">
        <RouterLink :to="`/genres/${genre.name}`"
          >{{ genre.translatedName }} ({{ genre.count }})</RouterLink
        >
      </li>
    </ul>
  </div>
</template>

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