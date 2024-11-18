<script>
import { reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import HeaderComponent from '@/components/HeaderComponent.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'FeedView',
  components: { HeaderComponent },
  setup() {
    const follows = reactive([])
    const userStore = useUserStore()
    const router = useRouter()

    const fetchFollowing = async () => {
      const currentUserName = userStore.userName
      try {
        const response = await fetch(
          `https://nev9ddp141.execute-api.us-east-1.amazonaws.com/prod/users/${currentUserName}/following/`,
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        follows.push(...data)
      } catch (error) {
        console.error('Error fetching following:', error)
      }
    }

    onMounted(() => {
      fetchFollowing()
    })

    return {
      follows,
      router,
    }
  },
}
</script>

<template>
  <HeaderComponent />
  <div class="container pt-4 content-wrapper">
    <div class="row">
      <div class="col feed-column">
        <h1>Feed</h1>
        <h2>Sigues a:</h2>
        <div class="list-group">
          <div
            class="list-group-item"
            v-for="(user, index) in follows"
            :key="index"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
              alt="Icono de seguimiento"
              class="follow-icon"
            />
            <router-link class="user-link" :to="`/user/${user.following}`">
              {{ user.following }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Reutiliza estilos específicos del feed */
.list-group-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.follow-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.user-link {
  color: black;
  text-decoration: none;
}

.user-link:hover {
  text-decoration: underline;
}
</style>
