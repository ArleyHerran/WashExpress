<template>
  <div>
    <FormServi />
    <v-dialog v-model="estados.formTurno.display" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ titulo }}</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveItem">
            <v-text-field label="Placa" v-model="editedItem.placa" required></v-text-field>
            <v-text-field label="Propietario" v-model="editedItem.nombre" required></v-text-field>
            <v-text-field label="Celular" v-model="editedItem.celular" required type="number"></v-text-field>
            <v-autocomplete
              v-model="editedItem.servicio"
              :items="getNombresServicios()"
              label="Tipo servicio"
              outlined
              allow-custom-value
            >
              <template #append v-if="estados.formTurno.f!=3">
                <v-btn icon @click="estados.formServices = true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-autocomplete>
            <v-text-field label="Precio" v-model="editedItem.precio" required type="number"></v-text-field>
            <div>
              <span>Fecha:</span>
              <input
                type="date"
                v-model="editedItem.fecha"
                style="margin: 8px; padding: 0px 8px; background: rgb(195, 185, 185); color: rgb(23, 22, 21);"
              />
            </div>
            <div>
              <span>Hora:</span>
              <input
                type="time"
                v-model="editedItem.hora"
                style="margin: 8px; padding: 0px 8px; background: rgb(195, 185, 185); color: rgb(23, 22, 21);"
              />
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelar()">{{tituloBtnA }}</v-btn>
          <v-btn v-if="estados.formTurno.f!=3"  color="blue darken-1" text @click="saveItem">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { useAppStore } from "../store/app";
import FormServi from '@/components/FormServicios.vue'
const estados = useAppStore();
const titulo = ref("Agregar Turno");
const tituloBtnA = ref("Cancelar");

const editedItem = ref({
  id: null,
  placa: null,
  nombre: null,
  servicio: null,
  precio: null,
  celular: null,
  fecha: null,
  fechaCierre:null,
  hora: null,
  estado:'turno'
});
const se=ref('')
async function saveItem() {
  const d = Object.assign({}, editedItem.value);
  if (!d.placa) { alert("Debes poner una placa"); return; }
  if (!d.nombre) { alert("Debes poner nombre del propietario o encargado"); return; }
  if (!d.celular) { alert("Debes poner un numero celular de contacto"); return; }
  if (!d.fecha) { alert("Debes poner una fecha"); return; }
  if (!d.hora) { alert("Debes poner una hora"); return; }
  if (titulo.value === "Agregar Turno") {
    await estados.addTurno(d);
    estados.formTurno.display = false;
    limpiar();
  } else {
    estados.editarTurno(d);
    estados.formTurno.display = false;
    limpiar();
  }
}

function cancelar() {
  estados.formTurno.display = false;
  limpiar();
}

watch(() => estados.formTurno, (newVal) => {
  if (newVal.f === 1) {
    titulo.value = 'Agregar Turno';
    tituloBtnA.value='Cancelar';
    limpiar();
  } else if(newVal.f === 2){
    titulo.value = 'Editar Turno';
    tituloBtnA.value='Cancelar';
    const u = Object.assign({}, estados.edit);
    editedItem.value = u;
  }else if(newVal.f === 3){
    titulo.value = 'Vista';
    tituloBtnA.value='Cerrar';
    const u = Object.assign({}, estados.edit);
    editedItem.value = u;
  }
});

function limpiar() {
  editedItem.value.placa = "";
  editedItem.value.nombre = '';
  editedItem.value.celular = '';
  editedItem.value.fecha = '';
  editedItem.value.hora = '';
}

function getNombresServicios() {
  return estados.$state.servicios.map(servicio => servicio.nombre);
}

function actualizarPrecio() {

  const servicioEncontrado = estados.$state.servicios.find(servicio => servicio.nombre === se.value);
  //console.log( servicioEncontrado);
  if (servicioEncontrado) {
 
    editedItem.value.precio = servicioEncontrado.precio;
  } else {
    editedItem.precio = '00';
  }
}

watch(editedItem, (newValue) => {
  se.value=newValue.servicio;
  //console.log(se.value);
 
}, { deep: true });

watch(se, (n,v) => {
  
  if (n !== v) {
  //  console.log(n,v);
    actualizarPrecio();
  }
})

</script>
