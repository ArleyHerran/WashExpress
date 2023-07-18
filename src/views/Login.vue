<template>
  <v-app>
    <v-toolbar color="teal-darken-4" image="https://picsum.photos/1920/1080?random">
      <template v-slot:image>
        <v-img gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"></v-img>
      </template>
      <v-btn v-model="registerMode" text @click="registerMode = false">Iniciar sesión</v-btn>
      <v-btn v-model="registerMode" text @click="registerMode = true">Registrar</v-btn>
    </v-toolbar>

    <v-main>
      <v-container>
        <v-card max-width="500" class="mx-auto">
          <v-card-title>
            <h2>{{ registerMode ? 'Registro' : 'Inicio de sesión' }}</h2>
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent>
              <v-text-field v-model="email" label="Correo electrónico"></v-text-field>

              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                label="Contraseña"
                hint="Mínimo 6 caracteres"
              ></v-text-field>

              <v-alert
                v-if="estados.loginInfo.display"
                :color="estados.loginInfo.color"
                :icon="estados.loginInfo.icon"
                :title="estados.loginInfo.title"
                :text="estados.loginInfo.text"
              ></v-alert>

              <v-btn  color="primary" class="mt-5" @click="registerMode ? registerUser() : loginUser()">
                {{ registerMode ? 'Registrar' : 'Iniciar sesión' }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed,onMounted} from 'vue';
import { useAppStore } from "../store/app";

const estados = useAppStore();

const registerMode = ref(false);
const email = ref('');
const password = ref('');
const showPassword = ref(false);

const registerUser = () => {
  // Lógica para registrar al usuario con Firebase Authentication
  // Utiliza email.value y password.value para crear la cuenta
if(estados.loginInfo.display){estados.loginInfo.display=false}
  estados.registrar(email.value, password.value);
};

const loginUser = () => {
  if(estados.loginInfo.display){estados.loginInfo.display=false}
  estados.login(email.value, password.value);
  // Lógica para iniciar sesión con Firebase Authentication
  // Utiliza email.value y password.value para autenticar al usuario
};


onMounted(() => {
  // Llamar a la acción al cargar el componente
 
});
</script>
