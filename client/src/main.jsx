import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import GridBackGround from './components/ui/GridBackGround.jsx'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';


const client = new ApolloClient({
  //TODO: update production uri
  uri: import.meta.env.VITE_NODE_ENV === "development" ? 'http://localhost:4000/graphql' : 'https://expense-tracker-api-exyn.onrender.com/graphql',
  cache: new InMemoryCache(),
  credentials:  "include"
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <GridBackGround>
          <App />
        </GridBackGround>   
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
)
