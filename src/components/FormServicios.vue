<template>
  <div>
    <v-dialog v-model="estados.formServices" max-width="480px">
      <v-card>
        <v-card-title>
          <span class="headline">Agregar tipo de servicio</span>
        </v-card-title>
        <v-card-text>
          <v-form validate-on="submit" @submit.prevent="saveServices">
            <v-text-field
              label="Nombre"
              v-model="servi"
              required
              :rules="[
                (value) => !!value || 'Este campo es requerido.',
                (value) =>
                  (value && value.length >= 2 && value.length <= 150) ||
                  'El nombre debe tener entre 2 y 150 caracteres.',
              ]"
            ></v-text-field>
            <v-text-field
              label="Precio"
              v-model="precio"
              type="number"
              required
              :rules="[
                (value) => !!value || 'Este campo es requerido.',
                (value) =>
                  (value && value.length >= 2 && value.length <= 20) ||
                  'El nombre debe tener entre 2 y 150 caracteres.',
              ]"
            ></v-text-field>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="estados.formServices = false">Cancelar</v-btn>
              <v-btn color="blue darken-1" text type="submit">Guardar</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { useAppStore } from "../store/app";
const d = ref(true);
const estados = useAppStore();
const servi = ref("");
const precio = ref('');
function saveServices() {
  if (servi.value === "" || servi.value.length > 100 || precio.value === "" || precio.value.length > 100) {
    alert(
      "Error: el nombre o precio  no pueden estar vacío ni tener más de 100 caracteres."
    );
    
    return;
  }
estados.addServicios({nombre:servi.value,precio:precio.value});
  servi.value = "";
  precio.value = "";
}
</script>
