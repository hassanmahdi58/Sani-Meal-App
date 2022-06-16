import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import SearchMeal from './pages/SearchMeal';
import SavedMeal from './pages/SavedMeal';
import Navbar from './components/Navbar';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Homepage from './pages/Homepage';


// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path="/Search" component={SearchMeal} />
            <Route exact path="/saved" component={SavedMeal} />
            <Route exact path="/" component={Homepage} />
            <Route exact path="/SignUp" component={SignupForm} />
            <Route exact path="/Login" component={LoginForm} />
            <Route exact path="/custom" component={LoginForm} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
  
}


export default App;
