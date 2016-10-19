import expect from 'expect'
import React from 'react'
import Miss from '../Miss'
import Match from '../Match'
import Redirect from '../Redirect'
import { render, unmountComponentAtNode } from 'react-dom'
import MemoryRouter from '../MemoryRouter'

describe('Miss', () => {
  const TEXT = 'TEXT'
  const loc = { pathname: '/', search: '', hash: '', state: TEXT }

  const renderRouter = (element, location) => (
    <MemoryRouter initialEntries={[location]} initialIndex={0}>
      {element}
    </MemoryRouter>
  )

  it('renders a Component prop', (done) => {
    const div = document.createElement('div')
    const Page = () => <div>{TEXT}</div>
    render(
      renderRouter(
        <Miss
          component={Page}
        />,
        loc
      ), div, () => {
        expect(div.innerHTML).toContain(TEXT)
        unmountComponentAtNode(div)
        done()
      }
    )
  })

  it('renders a render prop passes a location', (done) => {
    const div = document.createElement('div')
    render(
      renderRouter(
        <Miss
          render={({ location }) => (
            <div>{location.state}</div>
          )}
        />,
        loc
      ), div, () => {
        expect(div.innerHTML).toContain(TEXT)
        unmountComponentAtNode(div)
        done()
      }
    )
  })

  it('renders null when a match exists', (done) => {
    const div = document.createElement('div')
    const Page = () => <div>{TEXT}</div>
    const App = () => (
      <div>
        <Match pattern='/' component={() => null} />,
        <Miss component={Page} />
      </div>
    )
    render(
      renderRouter(
        <App />,
        { pathname: '/' }
      ), div, () => {
        expect(div.innerHTML).toNotContain(TEXT)
        unmountComponentAtNode(div)
        done()
      }
    )
  })

  describe('with a nested pattern', () => {
    const MATCH = 'MATCH'

    const App = ({ location }) => (
      renderRouter(
        <Match pattern='/parent' component={Parent} />,
        location
      )
    )

    const Parent = () => (
      <div>
        <Match pattern='child' exactly={true} component={() => <div>{MATCH}</div>} />
        <Miss component={() => <div>{TEXT}</div>} />
      </div>
    )

    it('does not render on match', (done) => {
      const div = document.createElement('div')
      const nestedLoc = { pathname: '/parent/child' }

      render(<App location={nestedLoc} />, div, () => {
        expect(div.innerHTML).toNotContain(TEXT)
        expect(div.innerHTML).toContain(MATCH)
        unmountComponentAtNode(div)
        done()
      })
    })

    it('does render on non-exact match', (done) => {
      const div = document.createElement('div')
      const nestedLoc = { pathname: '/parent/child/foobar' }

      render(<App location={nestedLoc} />, div, () => {
        expect(div.innerHTML).toContain(TEXT)
        expect(div.innerHTML).toNotContain(MATCH)
        unmountComponentAtNode(div)
        done()
      })
    })
  })

  describe('behind shouldComponentUpdate', () => {
    it('updates when a `blocker` component is rendered', (done) => {
      const div = document.createElement('div')

      class Blocker extends React.Component {
        shouldComponentUpdate() { return false }
        render() { return <App /> }
      }
      const Home = () => (
        <Redirect to='/404-it' />
      )
      const App = () => (
        <div>
          <Match pattern='/' exactly component={Home} />
          <Miss component={() => <p>NotFound</p>} />
        </div>
      )

      render(
        renderRouter(
          <Blocker />,
          { pathname: '/' }
        ),
        div,
        () => {
          expect(div.innerHTML).toContain('NotFound')
          unmountComponentAtNode(div)
          done()
        }
      )
    })
  })
})