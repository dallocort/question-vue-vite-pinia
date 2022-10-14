<script setup>
import axios from "axios";
import {ref} from "vue";
import {useRouter} from "vue-router";
import Button from "../components/Button.vue";
import {useStore} from "../store/store.js";

const store = useStore();
const router = useRouter();
let error = ref('');
let email = ref("");
let password = ref("");
let buttonDisabled = ref(false);

async function login() {
    try {
        buttonDisabled.value = true;
        const logInResponse = await axios.post('https://dacha-questions.api.deskree.com/api/v1/auth/accounts/sign-in/email', {
            "email": email.value,
            "password": password.value
        });
        store.setIsAuthenticated();
        store.idToken = logInResponse.data.data.idToken;
        const getUserInfoResponse = await axios.get(
            `https://dacha-questions.api.deskree.com/api/v1/rest/collections/users/${logInResponse.data.data.uid}`, {
                headers: {
                    'Authorization': 'Bearer ' + store.idToken
                }
            });
        if (getUserInfoResponse.data.data.roles.includes("ADMIN")) {
            store.setIsAdmin();
        }
        await router.push({name: 'main'});
    } catch (message) {
        console.log(message);
        buttonDisabled.value = false;
        error.value = message.response?.data.errors.errors[0].detail;
    }
}
</script>

<template>
    <section id="login" :class="{cursor:buttonDisabled}">
        <form>
            <h1>Enter your email and password:</h1>
            <label for="email">EMAIL:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <input id="email"
                   v-model="email"
                   v-focus
                   autocomplete="email"
                   name="email"
                   type="text"
                   @keydown.enter="login"/>
            <br/>
            <br/>
            <label for="password">PASSWORD:&nbsp;&nbsp;</label>
            <input id="password"
                   v-model="password"
                   autocomplete="current-password"
                   name="password"
                   type="password"
                   @keydown.enter="login"/>
            <Button :disabled="buttonDisabled" btnText="LOG IN" style="scale: 0.7" @click="login"></Button>
            <p v-if="error" class="error">{{ error }}</p>
            <router-link :to="{name:'main'}">MAIN MENU</router-link>
        </form>
    </section>
</template>

<style scoped>
#login {
    width: 495px;
    margin: 10vh auto 0;
    background: rgba(229, 241, 255, 0.2);
    padding: 1px;
    position: relative;
}

#login.cursor, #login.cursor button {
    cursor: progress;
}

#login a:last-child {
    display: block;
    position: absolute;
    top: 0;
    padding: 5px;
    text-decoration: none;
}

label {
    font-family: monospace;
    font-size: 1.3em;
}

h1 {
    margin: 30px 0 30px;
}

#login input {
    height: 30px;
    font-size: 1.2em;
}

#password {
    margin-bottom: 20px;
}

.error {
    color: #a20505;
}
</style>
