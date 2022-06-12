import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      savedMeals {
        mealId
        image
        description
        title
        link
      }
    }
  }
`;
