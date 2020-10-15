export const config = {
  basePath: process.env.BASE_API_URL || 'http://localhost:9999',
  locale: 'nl',
  currency: 'EUR',
  country: 'BE',
  countries: [
    {
      code: 'BE',
      name: 'BE',
      label: 'Belgium'
    },
    {
      code: 'DE',
      name: 'DE',
      label: 'Germany'
    },
    {
      code: 'NL',
      name: 'NL',
      label: 'Nederland'
    }
  ],
  currencies: [
    {
      code: 'EUR',
      label: 'Euro'
    },
  ],
  locales: [
    {
      name: 'BE',
      code: 'BE',
      label: 'Nederlands'
    }
  ]
};
