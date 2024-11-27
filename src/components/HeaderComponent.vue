<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/search'
import { useUserStore } from '@/stores/user'

export default {
  setup() {
    const userStore = useUserStore()
    const searchStore = useSearchStore()
    const searchQuery = ref('')
    const router = useRouter()
    searchStore.setSearchQuery('')

    const handleSearchSubmit = () => {
      setSearchQuery(searchQuery.value)
      searchQuery.value = ''
      router.push('/books')
    }

    const handleProfileClick = () => {
      // Forzar la recarga de la ruta actual
      router.push({
        path: '/user/' + userStore.userName,
        query: { refresh: Date.now() },
      })
    }

    const handleConfigClick = () => {
      router.push({
        path: '/config',
        query: { refresh: Date.now() },
      })
    }

    const handleCloseSession = () => {
      userStore.logOut()
      router.push({
        path: '/',
      })
    }

    const setSearchQuery = query => {
      searchStore.setSearchQuery(query)
    }

    return {
      userStore,
      searchStore,
      searchQuery,
      handleSearchSubmit,
      setSearchQuery,
      handleProfileClick,
      handleConfigClick,
      handleCloseSession,
    }
  },
}
</script>

<template>
  <header class="p-3 text-bg-dark sticky-top">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-between">
        <a
          href="/"
          class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none me-3"
        >
          <img
            alt="Vue logo"
            class="logo"
            src="https://static.vecteezy.com/system/resources/previews/011/660/012/non_2x/book-hand-drawn-sketch-png.png"
            width="30"
            height="30"
          />
        </a>

        <ul
          class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0"
        >
          <li>
            <RouterLink to="/feed" class="nav-link px-2 text-white"
              >Home</RouterLink
            >
          </li>
          <li class="nav-item dropdown">
            <!-- Nueva pestaña de Comunidad -->
            <a
              class="nav-link dropdown-toggle text-white"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Comunidad
            </a>
            <ul class="dropdown-menu">
              <li>
                <RouterLink to="/follow-users" class="dropdown-item"
                  >Gente</RouterLink
                >
              </li>
              <li>
                <RouterLink to="/communities" class="dropdown-item"
                  >Comunidades</RouterLink
                >
              </li>
            </ul>
          </li>
          <li>
            <RouterLink to="/books" class="nav-link px-2 text-white"
              >Libros</RouterLink
            >
          </li>
          <li class="nav-item dropdown">
            <!-- Nueva pestaña de Explorar -->
            <a
              class="nav-link dropdown-toggle text-white"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Explorar
            </a>
            <ul class="dropdown-menu">
              <li>
                <RouterLink to="/recommendations" class="dropdown-item"
                  >Recomendaciones</RouterLink
                >
              </li>
            </ul>
          </li>
        </ul>

        <form
          class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3"
          role="search"
          @submit.prevent="handleSearchSubmit"
        >
          <input
            type="search"
            class="form-control form-control-dark text-bg-light"
            placeholder="Buscar..."
            aria-label="Search"
            v-model="searchQuery"
          />
        </form>

        <div v-if="!userStore.isLoggedIn" class="text-end">
          <RouterLink to="/login" class="btn btn-outline-light me-2">
            Inicia Sesión
          </RouterLink>
          <RouterLink to="/register" class="btn btn-warning"
            >Regístrate</RouterLink
          >
        </div>

        <div v-if="userStore.isLoggedIn" class="dropdown text-end">
          <a
            href="#"
            class="d-block link-body-emphasis text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              :src="userStore.profilePicture"
              alt="Profile"
              width="32"
              height="32"
              class="rounded-circle bg-light"
            />
          </a>
          <ul class="dropdown-menu text-small">
            <li>
              <RouterLink
                :to="`/user/${userStore.userName}`"
                class="dropdown-item"
                @click="handleConfigClick"
              >
                Configuración
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="`/user/${userStore.userName}`"
                class="dropdown-item"
                @click="handleProfileClick"
              >
                Mi Perfil
              </RouterLink>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <RouterLink
                :to="`/`"
                class="dropdown-item"
                @click="handleCloseSession"
              >
                Cerrar Sesión
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>
