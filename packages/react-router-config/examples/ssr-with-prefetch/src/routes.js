import React from 'react';
import { renderRoutes } from 'react-router-config'

import HomePage from './home/Page';
import ChuckJokePage from './chuck/PagePrefetch';
import { fetchJoke } from './chuck/action';


const Root = ({ route }) => (
  <React.Fragment>
    {renderRoutes(route.routes)}
  </React.Fragment>
);

export default [
  { component: Root,
    routes: [
      {
        path: '/pre-fetch',
        exact: true,
        component: ChuckJokePage,
        fetchData: ({ dispatch, getState}) => {
          dispatch(fetchJoke());
        }
      },
      {
        path: '/no-fetch',
        exact: true,
        component: ChuckJokePage,
      },
      {
        path: '/',
        exact: false,
        component: HomePage,
      }
    ]
  }
];
