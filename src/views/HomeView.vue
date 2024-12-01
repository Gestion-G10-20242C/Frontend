<script>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

export default {
  name: 'HomeView',
  setup() {
    const userStore = useUserStore()
    const router = useRouter()

    const fetchFollowing = () => {
      if (userStore.isLoggedIn === true) {
        console.log(`User Logged: ${userStore.getUserData()}`)
        router.push('/feed')
      }
    }
    onMounted(() => {
      fetchFollowing()
    })
  },
}
</script>

<template>
  <div class="home-view">
    <div class="content-container">
      <img
        alt="Vue logo"
        class="logo"
        src="https://static.vecteezy.com/system/resources/previews/011/660/012/non_2x/book-hand-drawn-sketch-png.png"
        width="90"
        height="90"
      />
      <h1 class="display-5 fw-bold text-body-emphasis">Readme</h1>
      <div class="description">
        <p class="lead mb-4">
          Encuentra y lee los libros que amas, y lleva un registro de los libros
          que deseas leer. Sé parte de la comunidad de lectores más grande del
          mundo en Readme.
        </p>
        <div class="button-group">
          <RouterLink to="/login" class="btn btn-primary btn-lg px-4 gap-3">
            Inicia Sesión
          </RouterLink>
          <RouterLink to="/register" class="btn btn-primary btn-lg px-4 gap-3">
            Regístrate
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  background: url('https://turismo.buenosaires.gob.ar/sites/turismo/files/biblioteca_nacional_1200_a_0.jpg')
    no-repeat center center;
  background-size: cover;
  height: 100vh; /* Ocupa toda la altura de la pantalla */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.content-container {
  background-color: rgba(255, 255, 255, 0.9); /* Fondo semitransparente */
  padding: 2rem;
  border-radius: 8px;
  width: 90%; /* Ancho del contenedor */
  max-width: 500px;
}

.logo {
  margin-bottom: 1rem;
}

.display-5 {
  margin-bottom: 1rem;
}

.description {
  margin-top: 1rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>
