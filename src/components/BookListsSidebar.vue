<script>
export default {
  name: 'BookListsSidebar',
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      bookLists: [], // Listas de libros del usuario
    };
  },
  methods: {
    async fetchBookLists() {
      const url = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${this.username}/booklist`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.bookLists = data || [];
        console.log('Book Lists:', this.bookLists);
      } catch (error) {
        console.error('Error fetching book lists:', error);
      }
    },
    selectBookList(list) {
      // Redirige a la página de la lista de libros seleccionada
      this.$router.push({ path: `/booklist/${list.id}` });
    },
    viewAllBookLists() {
      // Redirige a la página de todas las listas de libros
      this.$router.push(`/users/${this.username}/booklists`);
    },
  },
  mounted() {
    this.fetchBookLists();
  },
};
</script>

<template>
  <div class="booklists-sidebar">
    <h3>Listas de Libros</h3>
    <ul>
      <li
        v-for="list in bookLists"
        :key="list.id"
        @click="selectBookList(list)"
      >
        {{ list.name }} ({{ list.books.length }} libros)
      </li>
    </ul>
    <button @click="viewAllBookLists">Ver todas las listas</button>
  </div>
</template>

<style scoped>
.booklists-sidebar {
  padding: 1em;
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
