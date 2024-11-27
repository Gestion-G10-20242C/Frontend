<script>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router' // Importar el router
import HeaderComponent from '@/components/HeaderComponent.vue'
import { useUserStore } from '@/stores/user'

export default {
  name: 'FollowUsersView',
  components: {
    HeaderComponent,
  },
  setup() {
    const userStore = useUserStore()
    const searchTerm = ref('')
    const isLoading = ref(true)
    const communities = reactive([])
    const newCommunity = reactive({
      name: '',
      image_url: '',
      genres: '',
      description: '',
    })
    const router = useRouter() // Instancia del router

    const filteredCommunities = computed(() => {
      return communities.filter(community =>
        community.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
      )
    })

    const fetchFollowedCommunities = async () => {
      try {
        const response = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${userStore.userName}/groups`,
        )
        const data = await response.json()
        return data.groups.map(group => group.name)
      } catch (error) {
        console.error('Error al obtener las comunidades seguidas:', error)
        return []
      }
    }

    const fetchCommunities = async () => {
      try {
        // Obtener la lista de comunidades seguidas
        const followedCommunities = await fetchFollowedCommunities()

        // Obtener la lista de comunidades
        const response = await fetch(
          'https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/groups',
        )
        const data = await response.json()

        // Recorrer las comunidades y verificar el estado de seguimiento
        for (const group of data.groups) {
          communities.push({
            name: group.name,
            profilePicture: group.image_url,
            isFollowing: followedCommunities.includes(group.name),
            id: group.id,
          })
        }
        isLoading.value = false
      } catch (error) {
        console.error('Error al obtener los usuarios:', error)
      }
    }

    const viewCommunities = name => {
      router.push(`/communities/${name}`) // Navegar a la vista de la comunidad
    }

    const toggleJoin = async community => {
      try {
        const accessToken = localStorage.getItem('access_token')
        const currentUser = userStore.userName
        await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${currentUser}/groups/${community.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ active: !community.isFollowing }),
          },
        )
        community.isFollowing = !community.isFollowing
      } catch (error) {
        console.error('Error al unirse a la comunidad:', error)
      }
    }

    const createNewCommunity = async () => {
      if (
        !newCommunity.name ||
        !newCommunity.description ||
        !newCommunity.image_url
      ) {
        alert('Por favor, complete todos los campos')
        return
      }
      console.log('Crear comunidad', newCommunity)

      const accessToken = localStorage.getItem('access_token')
      const currentUser = userStore.userName
      try {
        const response = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${currentUser}/groups`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              name: newCommunity.name,
              description: newCommunity.description,
              image_url: newCommunity.image_url,
              genres: newCommunity.genres,
            }),
          },
        )
        document.getElementById('closeModalBtn').click()
        console.log('response', response)
      } catch (error) {
        console.error('Error al crear la comunidad:', error)
      }
    }

    onMounted(() => {
      fetchCommunities()
    })

    return {
      searchTerm,
      communities,
      isLoading,
      filteredCommunities,
      viewCommunities,
      toggleJoin,
      newCommunity,
      createNewCommunity,
    }
  },
}
</script>

<template>
  <HeaderComponent />
  <div
    v-if="isLoading"
    class="d-flex justify-content-center align-items-center my-5"
    style="height: 80vh"
  >
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
  <div v-else class="container pt-4">
    <div class="row">
      <div class="col-10">
        <h1>Comunidades</h1>
      </div>
      <div class="col">
        <button
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#createCommunityModal"
        >
          Crear comunidad
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Buscar comunidades por nombre"
          class="form-control mb-3"
        />
        <div class="list-group">
          <div
            class="list-group-item d-flex justify-content-between align-items-center"
            v-for="(community, index) in filteredCommunities"
            :key="index"
          >
            <div
              class="d-flex align-items-center"
              @click="viewCommunities(community.name)"
              style="cursor: pointer"
            >
              <img
                :src="community.profilePicture"
                alt="Profile"
                width="50"
                height="50"
                class="rounded-circle me-2"
              />
              <div>
                <h5 class="mb-0">{{ community.name }}</h5>
              </div>
            </div>
            <button
              class="btn"
              :class="community.isFollowing ? 'btn-danger' : 'btn-primary'"
              @click="toggleJoin(community)"
            >
              {{ community.isFollowing ? 'Abandonar' : 'Unirse' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- CreateCommunityModal -->
  <div
    class="modal fade"
    id="createCommunityModal"
    tabindex="-1"
    aria-labelledby="createCommunityModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="createCommunityModalLabel">
            Crear comunidad
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Nombre</span>
            </div>
            <input
              v-model="newCommunity.name"
              type="text"
              class="form-control"
            />
          </div>

          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">URL imagen perfil</span>
            </div>
            <input
              v-model="newCommunity.image_url"
              type="text"
              class="form-control"
            />
          </div>

          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Generos</span>
            </div>
            <input
              v-model="newCommunity.genres"
              type="text"
              class="form-control"
            />
          </div>

          <div class="input-group-prepend">
            <span class="input-group-text">Descripción</span>
          </div>
          <textarea
            v-model="newCommunity.description"
            class="form-control"
            style="min-height: 98px"
          >
          </textarea>
        </div>
        <div class="modal-footer">
          <button
            id="closeModalBtn"
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancelar
          </button>
          <button
            @click="createNewCommunity"
            type="button"
            class="btn btn-primary"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
