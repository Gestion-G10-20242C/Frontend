<script>
import { reactive, onMounted } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import { useRoute } from 'vue-router'

export default {
  name: 'FeedView',
  components: {
    HeaderComponent,
  },
  setup() {
    const route = useRoute() // Inicializa el router

    const communityName = route.params.communityName
    const communityData = reactive({
      profilePicture: '',
      description: '',
      members: [],
    })

    // Replace with actual community data
    const fetchCommunityData = async () => {
      try {
        // const response = await fetch(
        //   `http://localhost:3000/api/community/${communityName}`,
        // )

        communityData.profilePicture =
          'https://i.pinimg.com/736x/6d/92/bd/6d92bd31e49001b5035d75a6191802cb.jpg'
        communityData.description =
          'Grupo de lectura divertido y amigable donde los niños descubrirán la magia de los libros junto a Snoopy y la pandilla de Peanuts. Cada semana nos sumergiremos en nuevas historias, compartiremos personajes favoritos y exploraremos el maravilloso mundo de la lectura juntos. Al igual que Snoopy con su máquina de escribir, liberaremos nuestra imaginación y quizás hasta crearemos algunas historias propias.'
        communityData.members = [
          {
            name: 'Snoopy 1',
            profilePicture:
              'https://i.pinimg.com/736x/c4/86/8f/c4868fc3f718f95e10eb6341e1305bb6.jpg',
          },
          {
            name: 'Snoopy 2',
            profilePicture:
              'https://i.pinimg.com/736x/c4/86/8f/c4868fc3f718f95e10eb6341e1305bb6.jpg',
          },
          {
            name: 'Snoopy 3',
            profilePicture:
              'https://i.pinimg.com/736x/c4/86/8f/c4868fc3f718f95e10eb6341e1305bb6.jpg',
          },
          {
            name: 'Snoopy 4',
            profilePicture:
              'https://i.pinimg.com/736x/c4/86/8f/c4868fc3f718f95e10eb6341e1305bb6.jpg',
          },
          {
            name: 'Snoopy 5',
            profilePicture:
              'https://i.pinimg.com/736x/c4/86/8f/c4868fc3f718f95e10eb6341e1305bb6.jpg',
          },
          {
            name: 'Snoopy 6',
            profilePicture:
              'https://i.pinimg.com/736x/c4/86/8f/c4868fc3f718f95e10eb6341e1305bb6.jpg',
          },
        ]
      } catch (error) {
        console.log(error)
      }
    }

    onMounted(() => {
      fetchCommunityData()
    })

    return {
      communityName,
      communityData,
    }
  },
}
</script>

<template>
  <HeaderComponent />
  <div class="container pt-4 content-wrapper">
    <div
      class="row d-flex justify-content-center align-items-center text-center mb-4"
    >
      <h1>{{ communityName }}</h1>
      <img
        :src="communityData.profilePicture"
        alt="Community profile picture"
        class="rounded-circle mx-auto"
        style="height: 25vmax; width: 25vmax"
      />
    </div>
    <div class="row d-flex justify-content-center mb-4">
      <button class="btn btn-primary" style="max-width: 10vmax">Unirse</button>
    </div>
    <div class="row">
      <div class="col rounded text-center" style="min-height: 50vh">
        <h4 class="text-primary">Descripción</h4>
        {{ communityData.description }}
      </div>
      <div class="col">
        <h4 class="text-primary">Miembros</h4>
        <div
          v-for="user in communityData.members"
          :key="user.name"
          @click="$router.push(`/users/${user.name}`)"
          style="cursor: pointer"
          class="mb-2 bg-light d-flex align-items-center p-2"
        >
          <img
            :src="user.profilePicture"
            alt="User profile picture"
            class="rounded-circle"
            style="height: 5vmax; width: 5vmax"
          />
          {{ user.name }}
        </div>
      </div>
    </div>
  </div>
</template>
