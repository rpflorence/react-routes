import React from 'react'
import Switch from 'react-router/Switch'
import Route from 'react-router/Route'

const renderRoutes = (routes, extraProps = {}) => routes ? (
  <Switch>
    {routes.map(route => (
      <Route
        key='prevent-remount-and-use-static-key'
        path={route.path}
        exact={route.exact}
        strict={route.strict}
        render={(props) => (
          <route.component {...props} {...extraProps} route={route}/>
        )}
      />
    ))}
  </Switch>
) : null

export default renderRoutes
