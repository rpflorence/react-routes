import invariant from 'invariant'
import { REPLACE } from 'history/lib/Actions'
import createMemoryHistory from 'history/lib/createMemoryHistory'
import useBasename from 'history/lib/useBasename'
import { createRoutes } from './RouteUtils'
import useRoutes from './useRoutes'

const createHistory = useRoutes(useBasename(createMemoryHistory))

/**
 * A high-level API to be used for server-side rendering.
 *
 * This function matches a location to a set of routes and calls
 * callback(error, redirectLocation, renderProps) when finished.
 *
 * Note: You probably don't want to use this in a browser. Use
 * the history.listen API instead.
 */
function match({
  routes,
  location,
  ...options
}, callback) {
  invariant(
    location,
    'match needs a location'
  )

  const history = createHistory({
    routes: createRoutes(routes),
    ...options
  })
  history.push(location)

  let fired = false

  // We don't have to clean up listeners here, because this is just a memory
  // history.
  history.listen((error, state) => {
    // This isn't fully stateless - if the user redirects as a consequence of
    // rendering, this ensures that we won't fire the callback twice.
    if (fired) {
      return
    }
    fired = true

    if (error) {
      callback(error)
      return
    }

    if (!state) {
      // No match.
      callback()
      return
    }

    if (state.location.action === REPLACE) {
      // This was a redirect.
      callback(null, state.location)
      return
    }

    callback(null, null, { ...state, history })
  })
}

export default match
