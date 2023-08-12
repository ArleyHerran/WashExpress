<style scoped>
.custom-file-upload {
  cursor: pointer;
  display: inline-block;
  padding: 5px 20px;
  font-size: 12px;
  background-color: #2196F3;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.custom-file-upload:hover {
  background-color: #1565C0;
}

.hidden-input {
  display: none;
}
</style>

<template>
  <v-dialog v-model="estados.formPerfil" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Actualizar Perfil</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <div class="text-center" style="display: flex; flex-direction: column; align-items: center;">
            <v-avatar size="80" class="mb-1">
              <v-img :src="img" />
            </v-avatar>
            <label for="file-input" class="custom-file-upload mb-4">
             Subir imagen
            </label>
            <input
              id="file-input"
              type="file"
              ref="inputFile"
              @change="onFileChange"
              accept="image/*"
              class="hidden-input"
            />
          </div>
          <v-text-field v-model="data.nombre" label="Nombre"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="save()">Guardar</v-btn>
        <v-btn color="secondary" @click="estados.formPerfil=false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

  <script setup>
import { useAppStore } from "../store/app";
  import { ref,onMounted, watch} from 'vue';
  const estados = useAppStore();
//////
 const dialog=ref(true);
const data=ref({nombre:'',img:''});

const img=ref(estados.user.img);

const archivo = ref(null);
const porcentajeSubida = ref(0);

const onFileChange = (event) => {
  archivo.value = event.target.files[0];
  img.value = URL.createObjectURL(archivo.value);
  
};

function save(){
  if (!data.value.nombre) {
   alert("El campo nombre nopuede estar vacio")
    return;

  }
  estados.progres={display:true,ms:'Actualizando...'}
  estados.subirImg(data.value,archivo.value);

};

watch(() => estados.formPerfil,(count) => {
   if(count){data.value.nombre=estados.user.nombre;
    img.value=estados.user.img;
  }
  }
)

  </script>
  
  