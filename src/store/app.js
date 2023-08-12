// Utilities

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  runTransaction,
  endAt,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../confiFirebase";
import { defineStore } from "pinia";
import {  ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from "../confiFirebase";
import { useRouter } from "vue-router";

export const useAppStore = defineStore("app", {
  state: () => ({
    user:{id:null,nombre:null,img:""},
    formPerfil:false,
    datas:false,
    formTurno: { display: false, f: 0 },
    progres:{display:false,ms:''},
    edit: null,
    turnos: [],
    historias:[],
    drawer:false,
    dasboard:{balance:0,turnosP:0,cancelados:0},
    formServices:false,
    servicios:[],
    loginInfo: { display: false, title: "", text: "", color: "", icon: "" },
  }),
  actions: {
    // Función para agregar un nuevo producto a la colección "productos"
    opnenFormTurno(d, ob) {
      if (d.f === 1) {
      }
      {
        this.edit = ob;
      }
      this.formTurno = d;
    },
    //FUNCION PARA AGREGAR TURNO
    async addTurno(turno) {
      try {
     
        const docRef = collection(db, 'Usuarios', this.user.id, 'Turnos');
        const nuevoTurnoRef = await addDoc(docRef, turno);
       /// console.log("Document written with ID: ", nuevoTurnoRef);
      } catch (e) {
        alert("Ocurrio un error : " + e);
      }
    },
     //FUNCION PARA TRAER LOS TURNOS
     async getTurnos() {

      const docRef = collection(db, 'Usuarios', this.user.id, 'Turnos');
      const q = query(docRef, where("placa", "!=", ""));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const turnos = [];
    
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          item.id = doc.id; // Agregar el ID del documento al objeto "turno"
            turnos.push(item);
        });
        this.turnos = turnos;
        this.dasboard.turnosP=this.turnos.length;
      });
    },
    //FUNCION PARA EDITAR TURNO
    async editarTurno(turno) {
      try {
        await runTransaction(db, async (transaction) => {
          await setDoc(doc(db, "Usuarios",this.user.id ,"Turnos",turno.id), turno);
        });
        alert("Cambios guardados con exito");
      } catch (e) {
        alert("Ocurrio un error :", e);
      }
    },
    //FUNCION PARA ELIMINAR TURNO
    async eliminarTurno(v) {
      if (confirm("¿Estás seguro que deseas eliminar este registro?")) {
        const documentoRef = doc(db, 'Usuarios', this.user.id, 'Turnos', v);
        const bRef = doc(db, 'Usuarios', this.user.id, 'Balances', this.hoy());
     
        try {

          await runTransaction(db, async (transaction) => {
            await updateDoc(documentoRef,{estado: 'delet',fechaCierre:this.hoy()});
            const docSnap = await getDoc(documentoRef);
            await setDoc(doc(db, 'Usuarios', this.user.id, 'Historial', v), docSnap.data());
            await deleteDoc(doc(db, 'Usuarios', this.user.id, 'Turnos', v));

            const b = await getDoc(bRef);
      

            if (b.exists()) {
              // El documento existe, puedes acceder y actualizar los datos
              const canceladosAnteriores = b.data().cancelados || 0; // Manejo de valor inicial
            
              // Realiza la actualización
              await updateDoc(bRef, {
                cancelados: canceladosAnteriores + 1
              });
            } else {
              // El documento no existe, crea el documento con los datos proporcionados
              await setDoc(bRef, {
                cancelados: 1 // Puedes establecer otros valores iniciales si lo deseas
              });
            }
      
   });
         
          alert("Registro Eliminado");
        } catch (error) {
          console.error("Error eliminando el registro: ", error);
        }
      }
    },
     //FUNCION PARA FACTURAR TURNO
     async facturarTurno(v) {
      if (confirm("¿Estás seguro que deseas facturar?")) {
        const documentoRef = doc(db,"Usuarios",this.user.id,"Turnos",v);
        const bRef = doc(db,"Usuarios",this.user.id,"Balances",this.hoy());
        try {

          await runTransaction(db, async (transaction) => {
            await updateDoc(documentoRef,{estado: 'facturado',fechaCierre:this.hoy() });
            const docSnap = await getDoc(documentoRef);
            await setDoc(doc(db,"Usuarios",this.user.id, "Historial", v), docSnap.data());
            await deleteDoc(doc(db,"Usuarios",this.user.id, "Turnos", v));

            const b = await getDoc(bRef);
      

            if (b.exists()) {
              // El documento existe, puedes acceder y actualizar los datos
              const canceladosAnteriores = b.data().ba || 0; // Manejo de valor inicial
            
              // Realiza la actualización
              await updateDoc(bRef, {
                ba: parseInt(canceladosAnteriores) + parseInt(docSnap.data().precio)
              });
            } else {
              // El documento no existe, crea el documento con los datos proporcionados
              await setDoc(bRef, {
                ba: parseInt(docSnap.data().precio) // Puedes establecer otros valores iniciales si lo deseas
              });
            }
      
   });
         
          alert("Turno facturado");
        } catch (error) {
          console.error("Error al facturar: ", error);
        }
      }
    },
    //GET BALANCE DEL DIA
    async getBalance(){

      const documentoRef = doc(db,"Usuarios",this.user.id, "Balances", this.hoy());

      const unsubscribe = onSnapshot(documentoRef, (docSnapshot) => {
        // Esta función se ejecutará cada vez que el documento sufra un cambio
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          function p(){
            if(data.ba){return data.ba}else{return 0;}
          };
          this.dasboard.balance=p();
          this.dasboard.cancelados=data.cancelados;
          // Realiza aquí las acciones que necesites con los datos actualizados
        } else {
         // console.log("El documento no existe.");
          this.dasboard.balance=0;
          this.dasboard.cancelados=0;
          // Realiza aquí las acciones que necesites si el documento ya no existe
        }
      });
      
    

    },
    
    ///ME PERMITE TRAER LA COLECION DE HISTOIAL Y FILTRARLA POR UN RANGO DE FECHA;
    async getHistorias(fi, ff) {
      const q = query(
        collection(db, 'Usuarios', this.user.id, 'Historial'),
        where("fechaCierre", ">=", fi),
        where("fechaCierre", "<=", ff)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const histori = [];
       // this.filtro.total = 0;
       // this.filtro.utilidad = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Si el campo "id" no está definido, lo agregamos usando el ID del documento
          if (!data.id) {
            data.id = doc.id;
          }
          histori.push(data);
        });
        this.historias=histori;
      });
    },
    //FUNCION AGREGAR SERVICIO
    async addServicios(labs) {
      try {
        const docRef = await addDoc(collection(db, "Usuarios",this.user.id,"Servicios"), labs);
        //console.log("Document written with ID: ", docRef.id);
        this.formServices = false;
        alert("Registro agregado con exito")
      } catch (error) {
        // console.error("Error adding document: ", error);
        this.formServices = false;
        alert("Ha ocurrido un error")
      }
    },

    //FUNCION  OBTENER  SERVICIOS
    getServicios() {
      const q = query(collection(db, "Usuarios",this.user.id,"Servicios"), where("nombre", "!=", ""));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const labs = [];
        querySnapshot.forEach((doc) => {
            labs.push(doc.data());
        });
        this.servicios = labs;
      
      });
    },
    //CREAR USAURIO CON CORREO  Y CONTRASEÑA
    async registrar(email, password) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          localStorage.setItem("usuario", JSON.stringify(userCredential));
          this.loginInfo.color = "success";
          this.loginInfo.icon = "$success";
          this.loginInfo.title = "Registro exitoso";
          this.loginInfo.text = "";
          this.loginInfo.display = true;

          setTimeout(function () {
            location.reload();
            this.loginInfo.display = false;
          }, 500);
       
          // ...
        })
        .catch((error) => {
          console.log("errror");
          const errorCode = error.code;
          this.loginInfo.color = "error";
          this.loginInfo.icon = "$error";
          this.loginInfo.title = "Error";
          const errorMessage = error.message;
          this.loginInfo.text = this.getAuthErrorMessage(errorCode);
          this.loginInfo.display = true;
          // ..
        });
    },
   //SUBIR IMG
  async subirImg(odject,file){
   if(!file){
    this.guardarDatos(odject.nombre,'');
    return;
   }
  const storageRef = ref(storage, 'images/perfil/'+this.user.id+'.jpg');
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
        //  console.log('Upload is paused');
          break;
        case 'running':
        //  console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      // Handle unsuccessful uploads
    }, 
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
       
        this.guardarDatos(odject.nombre,downloadURL);
       
      });
    }
  );
  },

   //FUNCION QUE PERMITE LOGEAR AL USUARIO
    login(email, password) {
      const auth = getAuth();
      console.log(email);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          localStorage.setItem("usuario", JSON.stringify(userCredential));
          this.loginInfo.color = "success";
          this.loginInfo.icon = "$success";
          this.loginInfo.title = "Acceso exitoso";
          this.loginInfo.text = "";
          this.loginInfo.display = true;

          setTimeout(function () {
            location.reload();
            this.loginInfo.display = false;
          }, 500);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          this.loginInfo.color = "error";
          this.loginInfo.icon = "$error";
          this.loginInfo.title = "Error";
          this.loginInfo.text = this.getAuthErrorMessage(errorCode);
          console.log(error.message);
          this.loginInfo.display = true;
        });
    },
   //GUARDAR DATOS DEL PERFIL DEL USUARIO
   async guardarDatos(nombre,img){
      const bRef = doc(db,"Usuarios",this.user.id,"UserData",'perfil');
   
      try {

        await runTransaction(db, async (transaction) => {
          const b = await getDoc(bRef);
          if (b.exists()) {
           if(img!==''){
            await updateDoc(bRef, {nombre:nombre,img:img});
          }else{
            await updateDoc(bRef, {nombre:nombre});
           }
            
          } else {
            
            if(img!==''){
              await setDoc(bRef, {nombre:nombre,img:img});
            }else{
              await setDoc(bRef, {nombre:nombre,img:''});
             }
          }
    
        });
        this.progres={display:false,ms:''}
        this.formPerfil=false;
        alert("Perfil actualizado");
      } catch (error) {
        this.formPerfil=false;
        this.progres={display:false,ms:''}
        alert("Error al actualizar perfil");
      }
    
    },
    //OBTENER LOS DATOS DEL PERFIL USUARIO
    async getUserDataFirebase(){
      const id= await this.getUserData();
     
        const documentoRef = doc(db,"Usuarios",id,"UserData", 'perfil');
  
        const unsubscribe = onSnapshot(documentoRef, (docSnapshot) => {
          // Esta función se ejecutará cada vez que el documento sufra un cambio
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if(data.img=="")data.img="https://images.vexels.com/media/users/3/146244/isolated/preview/77fd70114be4a7027595861839cbb099-coche-lavado-con-icono-de-manguera.png";
            if(data.nombre=="")data.nombre="Usuario";
            this.user.nombre=data.nombre;
            this.user.img=data.img;
          
          } else {
            this.user.nombre="Usuario";
            this.user.img="https://images.vexels.com/media/users/3/146244/isolated/preview/77fd70114be4a7027595861839cbb099-coche-lavado-con-icono-de-manguera.png";
          this.formPerfil=true;
          }
          
        });
        
      
      },
    //OBTENER DATOS LOCALES DEL USUARIO
    getUserData(){

const userDataJSON = localStorage.getItem("usuario");
if (userDataJSON) {
  const userData = JSON.parse(userDataJSON);
  this.user.id=userData.user.uid;
 return userData.user.uid;

} else {
  return false;

}
    },
    

    //FUNCION QUE PERMITE CERRAR LA SESION
    cerrarSesion() {
      if (confirm("Esta seguro que desea cerrar la sesion?")) {
        const auth = getAuth();
        signOut(auth)
          .then(() => {
            // Sign-out successful.
            localStorage.setItem("usuario", null);
            location.reload();
          })
          .catch((error) => {
            // An error happened.
            alert("Error desconocido al cerrar la sesion");
          });
      }
    },

    //FECHA ACTUAL FUNCION
    hoy() {
      const date = new Date();
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },
    //LIBRERIA ERRORES DE FIREBASE AUTH
    getAuthErrorMessage(errorCode) {
      switch (errorCode) {
        case "auth/email-already-in-use":
          return "El correo electrónico ya está en uso.";

        case "auth/invalid-email":
          return "El correo electrónico proporcionado no es válido.";

        case "auth/user-not-found":
          return "No se encontró ningún usuario con el correo electrónico proporcionado.";

        case "auth/wrong-password":
          return "La contraseña es incorrecta.";

        case "auth/weak-password":
          return "La contraseña debe tener al menos 6 caracteres.";

        case "auth/operation-not-allowed":
          return "Esta operación no está permitida.";

        case "auth/invalid-verification-code":
          return "El código de verificación no es válido.";

        case "auth/invalid-verification-id":
          return "El ID de verificación no es válido.";

        // Agrega más casos para otros códigos de error de autenticación que desees manejar

        default:
          return "Ha ocurrido un error de autenticación desconocido.";
      }
    },

   async prueba(){
      const id= 'M4b9HHdelgTx8YNbyMAkg8QXJVG2';
     
        const documentoRef = doc(db,"Usuarios",id,"UserData", 'perfil');
  
        const unsubscribe = onSnapshot(documentoRef, (docSnapshot) => {
          // Esta función se ejecutará cada vez que el documento sufra un cambio
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if(data.img=="")data.img="https://images.vexels.com/media/users/3/146244/isolated/preview/77fd70114be4a7027595861839cbb099-coche-lavado-con-icono-de-manguera.png";
            if(data.nombre=="")data.nombre="Usuario";
            this.user.nombre=data.nombre;
            this.user.img=data.img;
          
          } else {
            this.user.nombre="Usuario";
            this.user.img="https://images.vexels.com/media/users/3/146244/isolated/preview/77fd70114be4a7027595861839cbb099-coche-lavado-con-icono-de-manguera.png";
          this.formPerfil=true;
          }
          
        });
        
    }
  },

  getters: {
    ////////
  },
});
