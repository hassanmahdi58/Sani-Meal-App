import React, { useState, useEffect } from 'react';
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { SAVE_MEAL } from '../utils/mutations';
import { saveMealIds, getSavedMealIds } from '../utils/localStorage';

import Auth from '../utils/auth';

const SearchMeals = () => {
 
  const [searchedMeals, setSearchedMeals] = useState([]);
 
  const [searchInput, setSearchInput] = useState('');


  const [savedMealIds, setSavedMealIds] = useState(getSavedMealIds());

  const [saveMeal, { error }] = useMutation(SAVE_MEAL);


  useEffect(() => {
    return () => saveMealIds(savedMealIds);
  });

  
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=b32f2c782426491fb92ac608fe7cdd53&query=${searchInput}`
      );
      if (!response.ok) {
        throw new Error('something went wrong!');
      }
    
      const recipes = await response.json();

      const mealData = recipes.results.map((meal) => ({
        mealId: meal.id,
        title: meal.title,
        description: meal.description,
        image: meal.image,
      }));

      setSearchedMeals(mealData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

 
  const handleSaveMeal = async (mealId) => {
    
    const mealToSave = searchedMeals.find((meal) => meal.mealId === mealId);

    
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveMeal({
        variables: { mealData: { ...mealToSave } },
      });
      console.log(savedMealIds);
      setSavedMealIds([...savedMealIds, mealToSave.mealId]);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Search for Meal</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={12}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search your Meal"
                />
              </Col>
              <Col xs={12} md={12}>
                <Button type="submit" variant="success" size="lg">
                 Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedMeals.length
            ? `Viewing ${searchedMeals.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <CardColumns>
          {searchedMeals.map((meal) => {
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
                  {/* <p className="small">Authors: {book.authors}</p> */}
                  <Card.Text>{meal.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedMealIds?.some(
                        (savedId) => savedId === meal.mealId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveMeal(meal.mealId)}
                    >
                      {savedMealIds?.some((savedId) => savedId === meal.mealId)
                        ? ' Already Saved!'
                        : 'Save This Meal!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchMeals;
