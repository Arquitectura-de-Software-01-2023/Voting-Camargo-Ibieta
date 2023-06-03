'use strict';

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.voteProcessing = async (event) => {
  try {
    // Obtener los datos enviados en la solicitud de votación
    const requestBody = JSON.parse(event.body);
    const voteId = requestBody.voteId;
    const voteOption = requestBody.voteOption;

    // Guardar el voto en la tabla de DynamoDB
    const params = {
      TableName: 'myVotesTable',
      Item: {
        voteId: voteId,
        voteOption: voteOption,
        timestamp: new Date().toISOString()
      }
    };
    await dynamoDB.put(params).promise();

    // Devolver una respuesta exitosa
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Reemplaza con el origen permitido en producción
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Vote processed successfully' })
    };
  } catch (error) {
    console.log(error);
    // Devolver una respuesta de error
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process vote xd' })
    };
  }
};
module.exports.getVotes = async (event) => {
  try {
    // Obtener los votos desde la tabla de DynamoDB
    const params = {
      TableName: 'myVotesTable'
    };
    const result = await dynamoDB.scan(params).promise();

    // Procesar los votos y contar las opciones
    const votes = result.Items;
    const voteCounts = {};
    votes.forEach(vote => {
      const option = vote.voteOption;
      voteCounts[option] = (voteCounts[option] || 0) + 1;
    });

    // Devolver los resultados de los votos
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Reemplaza con el origen permitido en producción
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(voteCounts)
    };
  } catch (error) {
    console.log(error);
    // Devolver una respuesta de error
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get votes' })
    };
  }
};
module.exports.deleteVotes = async (event) => {
  try {
    // Parámetros para la operación de escaneo (Scan)
    const params = {
      TableName: 'myVotesTable' // Reemplaza con el nombre de tu tabla
    };

    // Realizar la operación de escaneo para obtener todos los registros
    const scanResult = await dynamoDB.scan(params).promise();

    // Generar un array de promesas para eliminar cada registro individualmente
    const deletePromises = scanResult.Items.map((item) => {
      const deleteParams = {
        TableName: 'myVotesTable', // Reemplaza con el nombre de tu tabla
        Key: {
          voteId: item.voteId
        }
      };
      return dynamoDB.delete(deleteParams).promise();
    });

    // Ejecutar todas las promesas de eliminación en paralelo
    await Promise.all(deletePromises);

    // Devuelve una respuesta con un mensaje indicando que los registros se han borrado exitosamente
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Todos los registros se han borrado exitosamente' })
    };
  } catch (error) {
    // Maneja cualquier error que ocurra durante el borrado de registros
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al borrar los registros' })
    };
  }
};

