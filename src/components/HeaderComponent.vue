<script>
import { useUserStore } from '@/stores/user'
import { RouterLink } from 'vue-router' // Asegúrate de importar RouterLink

export default {
  setup() {
    const userStore = useUserStore()

    return {
      userStore,
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

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li>
            <RouterLink to="/feed" class="nav-link px-2 text-white">Home</RouterLink>
          </li>
          <li class="nav-item dropdown"> <!-- Nueva pestaña de Comunidad -->
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
                <RouterLink to="/follow-users" class="dropdown-item">Gente</RouterLink> 
              </li>
            </ul>
          </li>
        </ul>

        <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
          <input
            type="search"
            class="form-control form-control-dark text-bg-dark"
            placeholder="Search..."
            aria-label="Search"
          />
        </form>

        <div v-if="!userStore.isLoggedIn" class="text-end">
          <RouterLink to="/login" class="btn btn-outline-light me-2">
            Login
          </RouterLink>
          <RouterLink to="/register" class="btn btn-warning">Sign-up</RouterLink>
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
              class="rounded-circle"
            />
          </a>
          <ul class="dropdown-menu text-small">
            <li><a class="dropdown-item" href="#">Settings</a></li>
            <li>
              <RouterLink 
                :to="`/user/${userStore.userName}`" 
                class="dropdown-item"
              >
                Profile
              </RouterLink>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item" href="/">Sign out</a></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>
