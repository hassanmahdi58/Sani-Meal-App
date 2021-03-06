import React from 'react';
import { Link } from 'react-router-dom';
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_MEAL } from '../utils/mutations';
import { removeMealId } from '../utils/localStorage';

import Auth from '../utils/auth';

const SavedMeals = () => {
  const { loading, data } = useQuery(QUERY_ME, {
    fetchPolicy: "network-only"
  });
  const [removeMeal, { error }] = useMutation(REMOVE_MEAL, {
    update: (cache, {data}) => {
      const existing = cache.readQuery({query: QUERY_ME});


      cache.writeQuery({
        query: QUERY_ME,
        data: {
          me: {
            ...existing.me,
            savedMeals: data.removeMeal.savedMeals
          }
        }
      })
    }
  });

  const userData = data?.me || {};

  // create function that accepts the meal's mongo _id value as param and deletes the meal from the database
  const handleDeleteMeal = async (mealId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeMeal({
        variables: { mealId },
      });

      // upon success, remove meal's id from localStorage
      removeMealId(mealId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
        <div className="dashboard">
          <h1>Dashboard {userData.username}'s Meals!</h1>
        </div>
      <Container>
        <h2> Check your saved meal!</h2>
        <CardColumns>
          {userData.savedMeals?.map((meal) => {
            return (
              <Card key={meal.mealId} border="dark">
                {meal.image ? (
                  <Card.Img
                    src={meal.image}
                    alt={`The cover for ${meal.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{meal.title}</Card.Title>
               
                  <Card.Text><span dangerouslySetInnerHTML={{ __html: meal.description }}/></Card.Text>
                  <a href={`${meal.sourceUrl}`}>
                      <Button className="btn-block btn-info">
                        View The Recipe
                      </Button>
                    </a>
                    <br></br>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteMeal(meal.mealId)}
                  >
                    Delete!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedMeals;
