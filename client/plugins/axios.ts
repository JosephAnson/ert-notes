import createRepository from '~/api/repository';

interface ProjectResponse {
  id: string;
  name: string;
  css: string;
}

export default function ({ $axios }, inject) {
  // Create a custom axios instance
  const api = $axios.create({
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });

  const repositoryWithAxios = createRepository(api);

  const apis = {
    project: repositoryWithAxios('project')
  };

  // Inject to context as $api
  inject('api', apis);
}
