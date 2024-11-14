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
    const communities = reactive([])
    const newCommunity = reactive({
      name: '',
      description: '',
    })
    const router = useRouter() // Instancia del router

    const fetchCommunities = async () => {
      const currentUserName = userStore.userName

      try {
        // Obtener la lista de usuarios
        const response = await fetch(
          'https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users',
        )
        const data = await response.json()

        // Recorrer los usuarios y verificar el estado de seguimiento
        for (const user of data.body.users) {
          if (user.username !== currentUserName) {
            // Verificar si el usuario está siendo seguido
            const isFollowingResponse = await fetch(
              `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${currentUserName}/following/${user.username}`,
            )
            const isFollowingData = await isFollowingResponse.json()

            communities.push({
              name: user.username,
              profilePicture:
                'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
              isFollowing: isFollowingData.active, // Estado de seguimiento
            })
          }
        }
      } catch (error) {
        console.error('Error al obtener los usuarios:', error)
      }
    }

    const viewCommunities = name => {
      router.push(`/communities/${name}`) // Navegar a la vista de la comunidad
    }

    const filteredCommunities = computed(() => {
      return communities.filter(community =>
        community.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
      )
    })

    const toggleJoin = async community => {
      console.log('Unirse a la comunidad', community.name)
    }

    const createNewCommunity = () => {
      console.log('Crear comunidad', newCommunity)
    }

    onMounted(() => {
      fetchCommunities()
    })

    return {
      searchTerm,
      communities,
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
  <div class="container pt-4">
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
