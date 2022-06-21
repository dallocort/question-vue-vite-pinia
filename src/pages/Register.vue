<script setup>
import axios from "axios";
import {ref} from "vue";
import {onBeforeRouteLeave, useRouter} from "vue-router";

const router = useRouter();
let error = ref('');
let username = ref("");
let password = ref("");
let buttonDisabled = ref(false);

function register() {
    buttonDisabled.value = true;
    if (validate()) {
        const request = axios.post(
            'http://739k121.mars-e1.mars-hosting.com/dm_quiz/register', {
                "username": username.value,
                "password": password.value
            });
        request.then(response => {
            if (response.data.status === 'E') {
                throw new Error(response.data.message);
            } else if (response.data.status === 'S') {
                router.push({name: 'login'});
            }
        }).catch(message => {
            buttonDisabled.value = false;
            error.value = message;
        });
    }
}

function validate() {
    error.value = '';
    if (username.value && password.value && username.value.includes(
        ' ') === false && password.value.includes(' ') === false) {
        return true;
    } else {
        error.value = 'enter correct data';
        buttonDisabled.value = false;
        return false;
    }
}

onBeforeRouteLeave(() => {
    buttonDisabled = false;
});
</script>

<template>
    <section id="register" :class="{cursor:buttonDisabled}">
        <form>
            <h1>Create new account:</h1>
            <label for="username">USERNAME:&nbsp;&nbsp;</label>
            <input id="username"
                   v-model="username"
                   v-focus
                   autocomplete="username"
                   name="username"
                   type="text"
                   @keydown.enter="register"/>
            <br/>
            <br/>
            <label for="password">PASSWORD:&nbsp;&nbsp;</label>
            <input id="password"
                   v-model="password"
                   autocomplete="current-password"
                   name="password"
                   type="password"
                   @keydown.enter="register"/>
            <br/>
            <button :disabled="buttonDisabled" @click="register">CREATE ACCOUNT
            </button>
            <p v-if="error" class="error">{{ error }}</p>
            <router-link :to="{name:'main'}">MAIN MENU</router-link>
        </form>
    </section>
</template>

<style scoped>
#register {
    width: 495px;
    height: 280px;
    margin: 10vh auto 0;
    background-color: rgba(180, 76, 174, 0.5);
    color: #f5ac23;
    padding: 1px;
    position: relative;
}

#register.cursor, #register.cursor button {
    cursor: progress;
}

#register a:last-child {
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

#register input {
    height: 30px;
    font-size: 1.2em;
}

button {
    width: 150px;
    height: 40px;
    margin-top: 24px;
    font-weight: bold;
}

.error {
    color: red;
}
</style>
