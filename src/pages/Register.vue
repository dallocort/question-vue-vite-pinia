<script setup>
import axios from "axios";
import {ref} from "vue";
import {onBeforeRouteLeave, useRouter} from "vue-router";
import Button from "../components/Button.vue";

const router = useRouter();
let error = ref('');
let email = ref("");
let password = ref("");
let buttonDisabled = ref(false);

function register(e) {
    buttonDisabled.value = true;
    if (validate()) {
        const request = axios.post('https://dacha-questions.api.deskree.com/api/v1/auth/accounts/signup', {
            "email": email.value,
            "password": password.value
        });
        request.then(response => {
            if (response.data.data) {
                router.push({name: 'login'});
            }
        }).catch(message => {
            buttonDisabled.value = false;
            console.log(message);
            error.value = message.response.data.errors.errors[0].detail;
        });
    }
}

function validate() {
    error.value = '';
    if (email.value && password.value && email.value.includes(' ') === false && password.value.includes(' ') === false) {
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
            <label for="email">EMAIL:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <input id="email"
                   v-model="email"
                   v-focus
                   autocomplete="email"
                   name="email"
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
            <Button :disabled="buttonDisabled" btn-text="REGISTER" span-text="22px" style="scale: .7"
                    @click.prevent="register"></Button>
            <p v-if="error" class="error">{{ error }}</p>
            <router-link :to="{name:'main'}">MAIN MENU</router-link>
        </form>
    </section>
</template>

<style scoped>
#register {
    width: 495px;
    margin: 10vh auto 0;
    background-color: rgba(180, 76, 174, 0.5);
    padding: 1px;
    position: relative;
    border-radius: 10px;
}

#register.cursor, #register.cursor button {
    cursor: progress;
}

#password {
    margin-bottom: 20px;
}

#register a:last-child {
    display: block;
    position: absolute;
    top: 0;
    padding: 5px;
    text-decoration: none;
    color: #ff9900;
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
    color: #2f1e1e;
    margin: 0;
}
</style>
