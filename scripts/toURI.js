const json = {
  filters: [
    {
      field: 'customerName',
      operator: 'like',
      value: 'Prueba',
    },
  ],
  search: '',
  sort: [],
};
const jsonString = JSON.stringify(json);
const queryParam = encodeURIComponent(jsonString);
console.log(queryParam);
