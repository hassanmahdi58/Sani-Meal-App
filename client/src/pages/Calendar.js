import React from 'react';
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

const MealCalendar = () => {
    const { loading, data } = useQuery(QUERY_ME);
    const [removeMeal, { error }] = useMutation(REMOVE_MEAL);

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
        <Jumbotron fluid className="text-light bg-primary">
            <Container>
            <h1>Viewing {userData.username}'s Meals!</h1>
            </Container>
        </Jumbotron>
        <Container>
            <h2>
            {userData.savedMeals?.length
                ? `Viewing ${userData.savedMeals.length} saved ${
                    userData.savedMeals.length === 1 ? 'meal' : 'meals'
                }:`
                : 'You have nothing here!'}
            </h2>
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
                
                    <Card.Text>{meal.description}</Card.Text>
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

export default MealCalendar;