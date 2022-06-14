import { gql } from "@apollo/client";

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

export const SEARCH_RECIPES = gql`
  query SEARCH_RECIPES($searchTerm: String!) {
    searchRecipes(searchTerm: $searchTerm) {
      mealId
      title
      description
      image
    }
  }
`;
