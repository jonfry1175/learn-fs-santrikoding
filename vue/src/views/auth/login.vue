<script setup>
//import reactive and ref from vue
import { reactive, ref } from 'vue'

//import useRouter from vue router
import { useRouter } from 'vue-router'

//inisialisasi vue router on Composition API
const router = useRouter()

//import services api
import { axiosInstance as api } from '../../utils/axios'

//import js-cookie
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode';
import { toast } from 'vue-sonner';

//state user
const user = reactive({
    email: '',
    password: '',
})

//state validation
const validation = ref([])
const loginFailed = ref([])


const login = async () => {
    try {
        const response = await api.post('/auth/login', user)
        if(response.status === 200) {
            toast.success("Login success");
            const { token } = response.data
            const user = jwtDecode(token)
            // const combined = { token, data: jwtDecode(token) }
            Cookies.set('token', token)
            Cookies.set('user', JSON.stringify(user))

            if(Cookies.get('token')) {
               setTimeout(() => {
                router.push({ name: 'dashboard' })
               }, 1000)
            }
        }
    } catch (error) {
        toast.error("Login failed");
        console.log({message: error?.response.statusText})
        validation.value = error?.response?.data
        loginFailed.value = {message: error?.response.statusText}
    }
}
</script>

<template>
    <div class="row justify-content-center mt-5">
        <div class="col-md-4">
            <div class="card border-0 rounded shadow-sm">
                <div class="card-body">
                    <h4>LOGIN</h4>
                    <hr>
                    <div v-if="validation.length > 0" class="mt-2 alert alert-danger">
                        <ul class="mt-0 mb-0">
                            <li v-for="(error, index) in validation" :key="index">
                                {{ `${error.path} : ${error.msg}` }}
                            </li>
                        </ul>
                    </div>
                    <div v-if="loginFailed.message" class="mt-2 alert alert-danger">
                        {{ loginFailed.message }}
                    </div>
                    <form @submit.prevent="login">
                        <div class="form-group mb-3">
                            <label class="mb-1 fw-bold">Email address</label>
                            <input type="email" v-model="user.email" class="form-control" placeholder="Email Address" />
                        </div>

                        <div class="form-group mb-3">
                            <label class="mb-1 fw-bold">Password</label>
                            <input type="password" v-model="user.password" class="form-control"
                                placeholder="Password" />
                        </div>
                        <button type="submit" class="btn btn-primary w-100">LOGIN</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>