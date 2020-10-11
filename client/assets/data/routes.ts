interface Route {
  title: string;
  description: string;
  path: string;
}

const routes: Map<string, Route> = new Map([
  [
    '/',
    {
      title: 'Home',
      description:
        'ERT Notes is a lightweight library of responsive HTML components based on the Bulma framework.',
      path: '/'
    }
  ],
  [
    '/notfound',
    {
      title: 'Page not found',
      description: 'Sorry, we couldn’t find the page you were looking for',
      path: '/notfound'
    }
  ]
]);

export default routes;
