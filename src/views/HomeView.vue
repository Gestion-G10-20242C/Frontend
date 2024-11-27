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
  <div class="px-4 py-5 my-5 text-center">
    <img
      alt="Vue logo"
      class="logo"
      src="https://static.vecteezy.com/system/resources/previews/011/660/012/non_2x/book-hand-drawn-sketch-png.png"
      width="90"
      height="90"
    />
    <h1 class="display-5 fw-bold text-body-emphasis">Readme</h1>
    <div class="col-lg-6 mx-auto">
      <p class="lead mb-4">
        Encuentra y lee los libros que amas, y lleva un registro de los libros
        que deseas leer. Sé parte de la comunidad de lectores más grande del
        mundo en Readme.
      </p>
      <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <RouterLink to="/login" class="btn btn-primary btn-lg px-4 gap-3">
          Iniciar Sesión
        </RouterLink>
        <RouterLink to="/register" class="btn btn-primary btn-lg px-4 gap-3">
          Regístrate
        </RouterLink>
      </div>
    </div>
  </div>
</template>
