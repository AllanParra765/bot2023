const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const MySQLAdapter = require('@bot-whatsapp/database/mysql');
const axios = require('axios'); // Importamos la biblioteca Axios

/**
 * Declaramos las conexiones de MySQL
 */
const MYSQL_DB_HOST = 'localhost';
const MYSQL_DB_USER = 'root';
const MYSQL_DB_PASSWORD = 'root';
const MYSQL_DB_NAME = 'bd_bot';
const MYSQL_DB_PORT = '8889';

/**
 * Función para obtener los enlaces de interés utilizando Axios
 */
async function obtenerEnlacesDeInteres() {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los enlaces:', error.message);
    return [];
  }
}

// ...

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
  .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
  .addAnswer(
    async () => {
      try {
        // Llamamos a la función para obtener los enlaces de interés utilizando Axios
        const enlacesDeInteres = await obtenerEnlacesDeInteres();

        return [
          'te comparto los siguientes links de interes sobre el proyecto',
          `👉 *doc* para ver la documentación ${enlacesDeInteres[0]?.title || ''}`,
          `👉 *gracias*  para ver la lista de videos ${enlacesDeInteres[1]?.title || ''}`,
          '👉 *discord* unirte al discord',
        ];
      } catch (error) {
        console.error('Error al obtener los enlaces:', error.message);
        return [];
      }
    }
  );

// ...

const main = async () => {
  const adapterDB = new MySQLAdapter({
    host: MYSQL_DB_HOST,
    user: MYSQL_DB_USER,
    database: MYSQL_DB_NAME,
    password: MYSQL_DB_PASSWORD,
    port: MYSQL_DB_PORT,
  });
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider();
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
  QRPortalWeb();
};

main();
