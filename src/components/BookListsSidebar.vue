<script>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

export default {
  name: 'BookListsSidebar',
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  setup() {
    const user = useUserStore()
    const username = user.userName
    const bookLists = ref([])

    const fetchBookLists = async () => {
      const url = `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${username}/booklist`
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        bookLists.value = data || []
      } catch (error) {
        console.error('Error fetching book lists:', error)
      }
    }

    fetchBookLists()

    return {
      fetchBookLists,
      bookLists,
    }
  },
}
</script>

<template>
  <div class="booklists-sidebar">
    <h3>Listas de Libros</h3>
    <ul>
      <li v-for="list in bookLists" :key="list.id">
        <RouterLink
          :to="`/user/${username}/booklists/${list.name}`"
          class="booklist-link"
        >
          {{ list.name }} ({{ list.books.length }} libros)
        </RouterLink>
      </li>
    </ul>
    <RouterLink :to="`/user/${username}/booklists`">
      <button class="btn btn-primary">Ver todas las listas</button>
    </RouterLink>
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
.booklist-link {
  text-decoration: none; /* Elimina el subrayado */
  color: #333; /* Cambia el color del texto */
}

.booklist-link:hover {
  color: #007bff; /* Cambia a azul al pasar el mouse */
}
</style>
