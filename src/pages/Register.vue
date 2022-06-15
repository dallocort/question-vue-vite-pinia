<template>
    <section id="register" :class="{cursor:buttonDisabled}">
        <h1>Create new account:</h1>
        <label for="username">USERNAME:&nbsp;&nbsp;</label>
        <input id="username"
               v-model="username"
               autofocus
               name="username"
               type="text"
               @keydown.enter="register"/>
        <br/>
        <br/>
        <label for="password">PASSWORD:&nbsp;&nbsp;</label>
        <input id="password"
               v-model="password"
               name="password"
               type="password"
               @keydown.enter="register"/>
        <br/>
        <button :disabled="buttonDisabled" @click="register">CREATE ACCOUNT
        </button>
        <p v-if="error" class="error">{{ error }}</p>
        <router-link :to="{name:'main'}">MAIN MENU</router-link>
    </section>
</template>

<script>
import axios from "axios";

export default {
    name: "Register",
    data() {
        return {
            error: '',
            username: "",
            password: "",
            buttonDisabled: false
        };
    },
    methods: {
        register() {
            this.buttonDisabled = true;
            if (this.validate()) {
                const request = axios.post(
                    'http://739k121.mars-e1.mars-hosting.com/dm_quiz/register',
                    {
                        "username": this.username,
                        "password": this.password
                    });
                request.then(response => {
                    if (response.data.status === 'E') {
                        throw new Error(response.data.message);
                    } else if (response.data.status === 'S') {
                        this.$router.push({name: 'login'});
                    }
                }).catch(message => {
                    this.buttonDisabled = false;
                    this.error = message;
                });
            }
        },
        validate() {
            this.error = '';
            if (this.username && this.password && this.username.includes(
                ' ') === false && this.password.includes(' ') === false) {
                return true;
            } else {
                this.error = 'enter correct data';
                this.buttonDisabled = false;
                return false;
            }
        }
    },
    beforeRouteLeave() {
        console.log('register leave');
        this.buttonDisabled = false;
    },
    mounted() {
        console.log('REGISTER M');
    }
};
</script>

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
