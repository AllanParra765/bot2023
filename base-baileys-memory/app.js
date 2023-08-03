const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const axios = require('axios'); // Importamos la biblioteca Axios


///////////////////////CARGAR URL/////////////////////////////

// URL de la API que proporciona los datos JSON de los posts
const apiUrl = 'http://localhost:4000/api/contactos';


///////////////////AGREGAR CONTACTO/////////////////

// Función para crear un nuevo post
async function crearPost(postData) {
  try {
    const response = await axios.post(apiUrl, postData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el post:', error.message);
    return null;
  }
}

const flowGuardar = addKeyword(['guardar','g','gu'])
.addAnswer('elmensaje de api es',null, async(ctx,{flowDynamic}) => {
  //const data = await crearPost(nuevoPost)
  const nuevoPost = {
    "userId": ctx.body,
    "id": 10,
    "title": ctx.from,
    "body": "Prueba 5"
  }
  
  const data = await crearPost(nuevoPost)
  flowDynamic(data) })

  /////////////////////////////////////////////////////////

////////////////////////actualizar////////////////////////

// Función para actualizar un post existente por su ID
async function actualizarPost(id, postData) {
  try {
    const response = await axios.put(`${apiUrl}/${id}`, postData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el post con ID ${id}:`, error.message);
    return null;
  }
}

  // Actualizar el post recién creado
  const flowActualizar = addKeyword(['actualizar','ac','act'])
  .addAnswer('elmensaje de api es',null, async(ctx,{flowDynamic}) => {
    const nuevoPost = {
      "userId": ctx.body,
      "id": 1,
      "title": ctx.from,
      "body": "Prueba 3"
    }
    const data = await actualizarPost(nuevoPost.id,nuevoPost)
    flowDynamic(data) })

  
///////////////////////////////////////////////

///////////////////////Cargar todos los mensajes/////////////////////////

// Definimos una función para obtener los enlaces de interés utilizando Axios
async function obtenerEnlacesDeInteres() {
  try {//https://jsonplaceholder.typicode.com/posts/1    https://jsonplaceholder.typicode.com/posts/1  
    const response = await axios.get('http://localhost:4000/api/contactos');
    return response.data; // Devolvemos los datos de la respuesta
  } catch (error) {
    console.error('Error al obtener los enlaces:', error.message);
    return []; // Devolvemos un arreglo vacío en caso de error
  }
}


const flowCargar = addKeyword(['hola', 'ole', 'alo'])
  .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
  .addAnswer('elmensaje de api es',null, async(ctx,{flowDynamic}) => {
    const data = await obtenerEnlacesDeInteres()
    flowDynamic(data)
    console.log("valor de ctx1 " , ctx.body)
    console.log("valor de ctx2 " , ctx.key.id)
    console.log("valor de ctx3 " , ctx.from)
    
  })
  .addAnswer('esta es una imagen', {
    media: 'https://i.imgur.com/0HpzsEm.png',
  })
  .addAnswer('Otra cosa despues', {
    delay:1500
  },
  [flowGuardar])

const flowPrincipal = addKeyword('1').addAnswer('Indica cual es tu email',{capture:true}, (ctx) => {
    console.log('👉 Informacion del contexto: ', ctx)
},
[flowGuardar])

//////////////////////////////////////////////////////


/////////////////////////BUSCAR REGISTRO/////////////////////////////

// Definimos una función para obtener los enlaces de interés utilizando Axios
async function buscarunCliente(id) {
  try {//https://jsonplaceholder.typicode.com/posts/1    https://jsonplaceholder.typicode.com/posts/1  
    const response = await axios.get(`${apiUrl}/${id}`);
    return response.data; // Devolvemos los datos de la respuesta
  } catch (error) {
    console.error('Error al obtener los enlaces:', error.message);
    return []; // Devolvemos un arreglo vacío en caso de error
  }
}


// Obtener un contacto por su ID (reemplaza ":id" con el ID del contacto que desees obtener)
const flowBuscar = addKeyword(['buscar', 'bus', 'b'])
.addAnswer('emensaje a buscar',null, async(ctx,{flowDynamic}) => {
  const data = await buscarunCliente(1)//(ctx.body)
  
  flowDynamic(data)
  
})

//////////////////////////////////////////////////////


/////////////////////////ELIMINAR REGISTRO/////////////////////////////
// Función para eliminar un post por su ID
async function eliminarPost(id) {
  try {
    const response = await axios.delete(`${apiUrl}/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error(`Error al eliminar el post con ID ${id}:`, error.message);
    return false;
  }
}


const flowEliminar = addKeyword(['eliminar', 'eli', 'e'])
.addAnswer('eliminar el siguiente',null, async(ctx,{flowDynamic}) => {
  const data = await eliminarPost(1)//(ctx.body)
  flowDynamic(data)
  
})

//////////////////////////////////////////////////////


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowGuardar,flowActualizar,flowCargar,flowBuscar,flowPrincipal,flowEliminar])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
