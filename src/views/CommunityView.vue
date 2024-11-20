<script>
import { reactive, onMounted } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

export default {
  name: 'FeedView',
  components: {
    HeaderComponent,
  },
  setup() {
    const route = useRoute() // Inicializa el router
    const userStore = useUserStore()

    const communityName = route.params.communityName
    const communityData = reactive({
      id: '',
      profilePicture: '',
      description: '',
      members: [],
      isFollowing: false,
    })

    const toggleJoin = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        const currentUser = userStore.userName
        await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${currentUser}/groups/${communityData.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ active: !communityData.isFollowing }),
          },
        )
        communityData.isFollowing = !communityData.isFollowing
      } catch (error) {
        console.error('Error al unirse a la comunidad:', error)
      }
    }

    // Replace with actual community data
    const fetchCommunityData = async () => {
      try {
        const getGroupResponse = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/groups/${communityName}`,
        )
        const groupDataArray = await getGroupResponse.json()
        const groupData = groupDataArray[0]

        const getGroupMembersResponse = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/groups/${groupData.id}`,
        )
        const groupMembersData = await getGroupMembersResponse.json()
        communityData.members = groupMembersData.map(member => ({
          name: member.name,
          profilePicture: member.image_url,
        }))

        communityData.id = groupData.id
        communityData.profilePicture = groupData.image_url
        communityData.description = new TextDecoder().decode(
          Uint8Array.from(atob(groupData.description), c => c.charCodeAt(0)),
        )
        communityData.isFollowing = communityData.members.some(
          member => member.name === userStore.userName,
        )
        communityData.isFollowing = false
      } catch (error) {
        console.log(error)
      }
    }

    onMounted(() => {
      fetchCommunityData()
    })

    return {
      toggleJoin,
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
      <button
        class="btn btn-primary"
        style="max-width: 10vmax"
        :class="communityData.isFollowing ? 'btn-danger' : 'btn-primary'"
        @click="toggleJoin"
      >
        {{ communityData.isFollowing ? 'Abandonar' : 'Unirse' }}
      </button>
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
