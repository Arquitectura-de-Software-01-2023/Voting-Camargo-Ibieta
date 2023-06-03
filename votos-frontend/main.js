document.getElementById('voteButton').addEventListener('click', function() {
  const selectedCandidate = document.querySelector('input[name="candidate"]:checked');
  
  if (selectedCandidate) {
    const candidateName = selectedCandidate.value;
    const max = 100;
    const randomNumber = Math.floor(Math.random() * max);
    const voteid = randomNumber.toString();
    console.log(randomNumber);
    const voteData = {
      voteId: voteid,
      voteOption: candidateName
    };
    
    // Realizar la solicitud HTTP POST a la API Gateway
    fetch('https://d1zqahb1y9.execute-api.us-east-1.amazonaws.com/dev/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(voteData)
    })
    .then(response => response.json())
    .then(data => {
      // Manejar la respuesta de la API Gateway
      console.log(data);
      alert('¡Voto exitoso!');
    })
    .catch(error => {
      // Manejar errores
      console.error('Error:', error);
      alert('Error al enviar el voto. Por favor, intenta nuevamente.');
    });
  } else {
    alert('Selecciona un candidato antes de votar.');
  }
});

function updateVoteResults(votes) {
  const voteResultsElement = document.getElementById('voteResults');
  voteResultsElement.innerHTML = '';

  for (const option in votes) {
    const count = votes[option];

    const resultCard = document.createElement('div');
    resultCard.classList.add('resultCard');

    const optionName = document.createElement('h3');
    optionName.textContent = option;
    resultCard.appendChild(optionName);

    const voteCount = document.createElement('p');
    voteCount.textContent = `Votos: ${count}`;
    resultCard.appendChild(voteCount);

    voteResultsElement.appendChild(resultCard);
  }
}

function getRealTimeVotes() {
  // Realizar una solicitud GET a la API Gateway para obtener los votos
  fetch('https://d1zqahb1y9.execute-api.us-east-1.amazonaws.com/dev/votes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    // Manejar los datos de los votos recibidos
    console.log(data);
    // Actualizar la interfaz de usuario con los datos de los votos
    updateVoteResults(data);
  })
  .catch(error => {
    // Manejar errores
    console.error('Error:', error);
    alert('Error al obtener los votos en tiempo real. Por favor, intenta nuevamente.');
  });
}
document.getElementById('deleteButton').addEventListener('click', function() {
  // Realizar la solicitud HTTP DELETE a la API Gateway para borrar todos los registros
  fetch('https://d1zqahb1y9.execute-api.us-east-1.amazonaws.com/dev/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    // Manejar la respuesta de la API Gateway
    console.log(data);
    alert('¡Se han borrado todos los registros!');
    // Actualizar la interfaz de usuario para reflejar que no hay votos
    const voteResultsElement = document.getElementById('voteResults');
    voteResultsElement.innerHTML = '';
  })
  .catch(error => {
    // Manejar errores
    //console.error('Error:', error);
    alert('¡Se han borrado todos los registros!');
  });
});


// Realizar la consulta de votos en tiempo real cada 5 segundos
setInterval(getRealTimeVotes, 5000);

