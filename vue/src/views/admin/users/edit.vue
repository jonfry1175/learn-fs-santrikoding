<script setup>
import { onMounted, ref, reactive } from "vue";
import Cookies from "js-cookie";
import { useRouter, useRoute } from "vue-router";
import { axiosInstance } from "../../../utils/axios";
import SidebarMenu from "../../../components/SidebarMenu.vue";
import { toast } from "vue-sonner";

const token = Cookies.get("token");
//inisialisasi vue router on Composition API
const route = useRoute();
const router = useRouter();

const user = reactive({
  name: "",
  email: "",
  password: "",
});

const validation = ref([]);

const detailUser = async () => {
  try {
    const response = await axiosInstance.get(`/users/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      user.name = response.data.name;
      user.email = response.data.email;
    }
  } catch (error) {
    toast.error(error.message);
  }
};

const updateUser = async () => {
  try {
    const response = await axiosInstance.put(
      `/users/${route.params.id}`,
      user,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      toast.success("User updated successfully");
      setTimeout(() => {
        router.push({ name: "admin.users.index" });
      }, 500);
    }
  } catch (error) {
    toast.error(error.message);
    validation.value = { errors: error?.response?.data };
  }
};


onMounted(() => {
  detailUser();
});


</script>

<template>
    <div class="container mt-5 mb-5">
        <div class="row">
            <div class="col-md-3">
                <SidebarMenu />
            </div>
            <div class="col-md-9">
                <div class="card border-0 rounded shadow-sm">
                    <div class="card-header">
                        EDIT USER
                    </div>
                    <div class="card-body">
                        <div v-if="validation.errors" class="mt-2 alert alert-danger">
                            <ul class="mt-0 mb-0">
                                <li v-for="(error, index) in validation.errors" :key="index">
                                    {{ `${error.path} : ${error.msg}` }}
                                </li>
                            </ul>
                        </div>
                        <form @submit.prevent="updateUser">

                            <div class="form-group mb-3">
                                <label class="mb-1 fw-bold">Full Name</label>
                                <input type="text" v-model="user.name" class="form-control" placeholder="Full Name" />
                            </div>

                            <div class="form-group mb-3">
                                <label class="mb-1 fw-bold">Email address</label>
                                <input type="email" v-model="user.email" class="form-control"
                                    placeholder="Email Address" />
                            </div>

                            <div class="form-group mb-3">
                                <label class="mb-1 fw-bold">Password</label>
                                <input type="password" v-model="user.password" class="form-control"
                                    placeholder="Password" />
                            </div>

                            <button type="submit" class="btn btn-sm btn-primary">UPDATE</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
