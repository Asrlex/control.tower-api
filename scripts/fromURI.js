const URIComponent = 
  `
%7B%22filters%22%3A%5B%5D%2C%22search%22%3A%22%22%2C%22sort%22%3A%5B%7B%22field%22%3A%22customerName%22%2C%22order%22%3A%22asc%22%7D%5D%7D  `;
const URI = decodeURIComponent(URIComponent);
const result = JSON.parse(URI);
console.log(result);