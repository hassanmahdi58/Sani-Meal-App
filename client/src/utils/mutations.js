import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_MEAL = gql`
  mutation saveMeal($mealInfo: SaveMealSchema!) {
    saveMeal(mealInfo: $mealInfo) {
      _id
      username
      email
      savedMeals {
        mealId
        image
        description
        title
        link
        __typename
      }
    }
  }
`;

export const REMOVE_MEAL = gql`
  mutation removeMeal($mealId: ID!) {
    removeMeal(mealId: $mealId) {
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
