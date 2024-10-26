<script setup>
import Header from '../components/Header.vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()
const username = route.params.username
// We should run a query from the extracted username to get the user data
// const userData = await fetchUser(username);
const userFound = true

// Mocked as of now - If empty should return a not found page
const userData = {
  name: 'Carlos Fontela',
  profilePicture:
    'https://cysingsoft.wordpress.com/wp-content/uploads/2009/01/carlosfontela6.jpg?w=584',
  description:
    'Hola! Mi nombre es Carlos Fontela, soy un desarrollador de software amante de las metodologías ágiles.',
  favouriteBook: {
    title: 'Java y UML',
    cover:
      'https://sbslibreria.vtexassets.com/arquivos/ids/466160/9789871104888.jpg?v=638156213260000000',
    description:
      'Me gusto mucho, coincido con varios de los aspectos nombrados por el autor. Java es un lenguaje de programación de propósito general, concurrente, orientado a objetos que fue diseñado específicamente para tener tan pocas dependencias de implementación como fuera posible. UML es un lenguaje de modelado gráfico que se utiliza para especificar, visualizar, construir y documentar un sistema de software.',
  },
  groups: [
    {
      name: 'Agile beasts',
      members: 14,
    },
    {
      name: 'FIUBA',
      members: 518,
    },
    {
      name: 'Borges Lovers',
      members: 1234,
    },
  ],
}
</script>

<template>
  <!-- User found -->
  <template v-if="userFound">
    <Header />
    <div class="container pt-4">
      <div class="row">
        <div class="col-3">
          <!-- Profile picture -->
          <div class="col-3 position-relative" style="display: inline-block">
            <img
              alt="Profile picture"
              class="logo rounded-circle mx-auto"
              :src="userData.profilePicture"
              width="140"
              height="140"
            />
            <button
              v-if="username === userStore.userName"
              class="btn btn-sm btn-primary position-absolute"
              style="bottom: 0; right: 10"
            >
              ✎
            </button>
          </div>
          <!-- User name -->
          <h2>{{ userData.name }}</h2>
          <!-- User username -->
          <h5 class="fw-normal">@{{ username }}</h5>
          <!-- User description -->
          <p>
            {{ userData.description }}
          </p>
        </div>

        <!-- Favourite bo -->
        <div class="col-9">
          <div class="container bg-primary p-4 rounded">
            <div class="row">
              <h1>{{ userData.favouriteBook.title }}</h1>
            </div>
            <div class="row">
              <div class="col-3">
                <img
                  alt="Book cover"
                  class="logo"
                  :src="userData.favouriteBook.cover"
                  width="140"
                />
              </div>
              <div class="col">
                {{ userData.favouriteBook.description }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
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
          <ul class="list-group">
            <li
              v-for="group in userData.groups"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              {{ group.name }}
              <span class="badge bg-primary rounded-pill">
                <div>
                  <template v-if="group.members < 1000">
                    {{ group.members }}
                  </template>
                  <template v-else> 999+ </template>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-people"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"
                    />
                  </svg>
                </div>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>

  <!-- User not found -->
  <template v-else>
    <Header />
    <div class="p-4 d-flex justify-content-center">
      <h1>Usuario no encontrado!</h1>
    </div>
  </template>
</template>
