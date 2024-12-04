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
      
      await fetchDescription()

      console.log('Fetching author data for:', authorName)

      const relPath = encodeURI(`/search?query=${authorName}&field=author_name`)

      await fetch_books(relPath)

      console.log('Results:', results.value)

      if (results.value.length > 0) {
        authorData.myBooks = results.value
      }


      await fetchFavouriteBook()
    }

    const fetchDescription = async() => {
      const body = JSON.stringify({
        message: `Describete en una frase como si lo fueras a publicar en un perfil de una plataforma de libros.`,
        role: 'author',
        name: authorData.name,
      })
      
      try {
        const response = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${authorData.name}/chat/0000000000000`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              'Content-Type': 'application/json',
            },
            body: body,
          }
        )

        if (response.ok) {
          const data = await response.json()
          console.log('Favourite book description:', data)
          authorData.description = data.response
        } else {
          authorData.favouriteBook.description = ''
        }
      } catch (error) {
        console.error('Error al obtener descripción:', error)
        authorData.favouriteBook.description = ''
      }
    }

    const fetchFavouriteBook= async() => {
      if (authorData.myBooks.length > 0) {
        authorData.favouriteBook.title = authorData.myBooks[0].title
        authorData.favouriteBook.cover = authorData.myBooks[0].image_url

        const body = JSON.stringify({
          message: `Dime brevemente por qué ${authorData.myBooks[0].title} es tu libro favorito como si lo fueras a publicar en un perfil de una plataforma.`,
          role: 'author',
          name: authorData.name,
        })
        
        try {
          const response = await fetch(
            `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${authorData.name}/chat/0000000000000`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json',
              },
              body: body,
            }
          )

          if (response.ok) {
            const data = await response.json()
            console.log('Favourite book description:', data)
            authorData.favouriteBook.description = data.response
          } else {
            authorData.favouriteBook.description = ''
          }
        } catch (error) {
          console.error('Error al obtener descripción del libro favorito:', error)
          authorData.favouriteBook.description = ''
        }

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
      //fetchFavouriteBook()
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
  <!-- Loading spinner -->
  <div v-if="loading" class="loading-container">
    <HeaderComponent />
    <div class="loading-spinner"></div>
    <p class="text-center">Cargando...</p>
  </div>

  <!-- Contenido principal, visible solo cuando loading es false -->
  <div v-else>
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

    <!-- Books section -->
    <div
      class="row mt-4"
      style="padding-left: 120px"
      v-if="authorData.myBooks && authorData.myBooks.length > 0"
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
                <RouterLink :to="`/book/${book.id}`">
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

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top-color: #fad155;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
  margin: 50px auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
