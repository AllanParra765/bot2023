const { createBot, createProvider, createFlow, addKeyword, EVENTS  } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')
const axios = require('axios'); // Importamos la biblioteca Axios


/////////////////////////////////////

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


////////////////////////////////////


// URL de la API que proporciona los datos JSON de los posts
const apiUrl = 'https://jsonplaceholder.typicode.com/posts';




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


//////////////////////////////////


const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encontras un ejemplo rapido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowDiscord = addKeyword(['discord']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null,
    [flowSecundario]
)


const msgWelcome = addKeyword(EVENTS.WELCOME)
    .addAction(async(ctx) => {
        console.log("El primer mensaje del contacto")
        console.log(ctx.body)
    })

const flujoImagen = addKeyword('imagen').addAnswer('Te comparto una imagen ',{
  media: 'https://i.imgur.com/0HpzsEm.png'
})

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
  .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
  .addAnswer('elmensaje de api es',null, async(ctx,{flowDynamic}) => {
    const data = await obtenerEnlacesDeInteres()
    flowDynamic(data)
    console.log("valor de ctx " , ctx.body)
    console.log("valor de ctx " , ctx.key.id)
    console.log("valor de ctx " , ctx.from)
    
  })
  .addAnswer('esta es una imagen', {
    media: 'https://i.imgur.com/0HpzsEm.png',
  })
  .addAnswer('Otra cosa despues', {
    delay:1500
  })

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal,msgWelcome])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb() //{port:4001}
}

main()
