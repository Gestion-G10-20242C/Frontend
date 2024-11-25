<script>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import { GET } from '@/utils/fetch_async'

export default {
  name: 'AuthorView',
  components: {
    HeaderComponent,
  },
  setup() {
    const route = useRoute()
    const authorName = ref(route.params.authorName)
    const results = ref([])
    const authorData = {
      name: '',
      profilePicture: '',
      description: '',
      favouriteBook: {
        title: '',
        cover: '',
        description: '',
      },
      myBooks: [],
    }
    const loading = ref(true) // Track loading state

    const fetch_books = async rel_path => {
      console.log('Buscando...', rel_path)

      try {
        const response = await GET('GET', rel_path, null, null)

        if (!response || response.error) {
          throw new Error('Error al obtener datos del servidor')
        }

        console.log('Books fetched:', response)
        results.value = response
        loading.value = false

        if (results.value.length === 0) {
          authorData.errorMessage = 'No books found for this author.'
        } else {
          authorData.errorMessage = ''
        }
      } catch (error) {
        console.error('Error al obtener libros:', error)
      }
    }

    const fetchAuthorData = async () => {
      const authorName = route.params.authorName
      authorData.name = authorName
      authorData.profilePicture =
        'https://c8.alamy.com/comp/2CCRG8P/writing-sign-document-paper-writer-letter-author-vector-simple-stickman-no-face-clipart-cartoon-hand-drawn-doodle-sketch-graphic-illustration-2CCRG8P.jpg'
      authorData.description = `Mi nombre es ${authorName}.`

      console.log('Fetching author data for:', authorName)

      const relPath = `/search?query=${authorName}&field=author_name`

      await fetch_books(relPath)

      console.log('Results:', results.value)

      if (results.value.length > 0) {
        authorData.myBooks = results.value
      }

      if (authorData.myBooks.length > 0) {
        authorData.favouriteBook.title = authorData.myBooks[0].title
        authorData.favouriteBook.cover = authorData.myBooks[0].image_url
        authorData.favouriteBook.description = 'Mi obra maestra'
      } else {
        authorData.favouriteBook.title = 'No hay Libro Favorito'
        authorData.favouriteBook.cover =
          'https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png'
        authorData.favouriteBook.description = ''
      }

      loading.value = false // Set loading to false when data is fetched
    }

    onMounted(() => {
      fetchAuthorData()
      console.log('Author data:', authorData)
    })

    return {
      authorName,
      authorData,
      results,
      loading, // Make sure to return loading
    }
  },
}
</script>

<template>
  <HeaderComponent />
  <div class="container pt-4">
    <div class="row">
      <div class="col-3 d-flex flex-column align-items-center">
        <!-- Profile picture with author badge -->
        <div class="position-relative">
          <img
            :src="authorData.profilePicture"
            alt="Profile picture"
            class="logo rounded-circle mx-auto"
            width="140"
            height="140"
          />
          <!-- Display author badge -->
          <span class="author-badge">Autor</span>
        </div>

        <!-- Name -->
        <h2 class="mb-0">{{ authorData.name }}</h2>

        <!-- User description -->
        <p class="mb-0">{{ authorData.description }}</p>

        <!-- Chat with Author -->
        <RouterLink :to="`/chat-author/${authorData.name}`">
          <button class="btn btn-primary mt-3">Chatear con Autor</button>
        </RouterLink>
      </div>

      <!-- Favourite book -->
      <div class="col-9">
        <div class="container bg-primary p-4 rounded">
          <div class="row">
            <h1>{{ authorData.favouriteBook.title }}</h1>
          </div>
          <div class="row">
            <div class="col-2">
              <img
                alt="Book cover"
                class="logo"
                :src="authorData.favouriteBook.cover"
                width="100%"
              />
            </div>
            <div class="col">
              {{ authorData.favouriteBook.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading spinner -->
  <div v-if="loading" class="spinner-overlay">
    <div class="spinner"></div>
  </div>

  <!-- Books section, only shown after author data is loaded -->
  <div
    class="row mt-4"
    style="padding-left: 120px"
    v-if="!loading && authorData.myBooks && authorData.myBooks.length > 0"
  >
    <div class="col">
      <h3>Mis Libros</h3>
      <div class="row">
        <div
          v-for="(book, index) in authorData.myBooks"
          :key="index"
          class="col-4 mb-4"
        >
          <div class="card" style="width: 18rem">
            <!-- Book cover with fixed size and centered -->
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 45vh;
                overflow: hidden;
              "
            >
              <img
                :src="book.image_url"
                class="card-img-top"
                alt="Book cover"
                style="height: 45vh; width: auto"
              />
            </div>
            <div class="card-body">
              <RouterLink :to="`/book/${book.isbn}`">
                <h5 class="card-title">{{ book.title }}</h5>
              </RouterLink>
              <p class="card-text">Autor: {{ book.author_name }}</p>
              <p class="card-text">Publicado: {{ book.publication_date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row mt-4" style="padding-left: 120px; margin-bottom: 20px">
    <!-- Biblioteca -->
    <div class="col">
      <h3>Biblioteca</h3>
    </div>

    <!-- Reading Challenges -->
    <div class="col">
      <h3>Reading Challenges</h3>
    </div>

    <!-- Grupos -->
    <div class="col">
      <h3>Grupos</h3>
    </div>
  </div>
</template>

<style scoped>
.author-badge {
  top: 0;
  right: 0;
  background-color: #ffbb00;
  color: white;
  padding: 5px 10px;
  border-radius: 50%;
  font-weight: bold;
  position: absolute;
  right: -35px;
}

.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
