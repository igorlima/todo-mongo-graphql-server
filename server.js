import express from 'express'
import { Schema } from './schema'
import graphQLHTTP from 'express-graphql'

const app = express();
app.use('/', graphQLHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}));
app.listen(process.env.PORT || 8080, (err) => {
  if (err)
    return console.error(err);
  console.log(`GraphQL Server is now running on localhost:${process.env.PORT || 8080}`);
});
