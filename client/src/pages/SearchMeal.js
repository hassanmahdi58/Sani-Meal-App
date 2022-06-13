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
        // `https://api.spoonacular.com/mealplanner/generate?apiKey=cb1c464d94f142c08b156c5beddade8b=${searchInput}`
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=222c7e0fe74942f7adfcebc657dae08e&query=${searchInput}`
      );
      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const recipes = await response.json();
      let testRec = recipes.results
      let recipeID = []
      let url = []

      for (let i = 0; i < testRec.length; i++) {
        recipeID.push(recipes.results[i].id);
        url.push(`https://api.spoonacular.com/recipes/${recipeID[i]}/information?apiKey=222c7e0fe74942f7adfcebc657dae08e`)
      }
      console.log(recipeID);
      console.log(url)


      setSearchedMeals(mealData);
      setSearchInput('');

      // const recipeSearch = await fetch (
      //   // `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=b32f2c782426491fb92ac608fe7cdd53`
      //   url
      //   );
      //     if (!recipeSearch.ok) {
      //       throw new Error('something went wrong!');
      //     }

      let testRec1 = []
      for (let i = 0; i < testRec.length; i++) {
        // const element = array[index];
        const recipeSearch = await fetch (
          // `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=b32f2c782426491fb92ac608fe7cdd53`
          url[i]
          );
          // if (!response.ok) {
          //   throw new Error('something went wrong!');
          // }
          const recipes1 = await recipeSearch.json();
          testRec1.push(recipes1.summary)
      }
      console.log(testRec1[1])

      // API fetch data 
      const mealData = recipes.results.map((meal) => ({
        mealId: meal.id,
        title: meal.title,
        description: meal.description,
        image: meal.image,
      }));

    } catch (err) {
      console.error(err);
    }

    
  };

  // const handleFormSubmit = async (event) => {
  //   event.preventDefault();

  //   if (!searchInput) {
  //     return false;
  //   }

  //   try {
  //     const response = await fetch(
  //       `https://api.spoonacular.com/recipes/complexSearch?apiKey=b32f2c782426491fb92ac608fe7cdd53&query=${searchInput}`
  //     );
  //     if (!response.ok) {
  //       throw new Error('something went wrong!');
  //     }

  //     const recipes = await response.json();

  //     let testRec = recipes.results
  //     let recipeID = []
  //     let url = []

  //     for (let i = 0; i < testRec.length; i++) {
  //       recipeID.push(recipes.results[i].id);

  //       url.push(`https://api.spoonacular.com/recipes/${recipeID[i]}/information?apiKey=b32f2c782426491fb92ac608fe7cdd53`)
  //     }
  //     console.log(recipeID);
  //     console.log(url)

      


  //     // for (let i = 0; i < testRec.length; i++) {
  //     //   let recipeID = recipes.results[i].id;
  //     //   console.log(recipeID);
  //     // }

  //     const recipeSearch = await fetch (
  //       // `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=b32f2c782426491fb92ac608fe7cdd53`
  //       url
  //       );
  //       if (!recipeSearch.ok) {
  //         throw new Error('something went wrong!');
  //       }

  //     const recipoo = await recipeSearch.json();
  //       console.log(recipoo.results)
  //     const mealData = recipoo.map((meal) => ({
  //       mealId: meal.id,
  //       title: meal.title,
  //       image: meal.image,
  //       mealUrl: meal.sourceURL,
  //     }));

  //     setSearchedMeals(mealData);
  //     setSearchInput('');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };


  const handleSaveMeal = async (mealId) => {
    
    const mealToSave = searchedMeals.find((meal) => meal.mealId === mealId);

    
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveMeal({
        variables: { mealInfo: { ...mealToSave } },
      });
      console.log(savedMealIds);
      setSavedMealIds([...savedMealIds, mealToSave.mealId]);
    } catch (err) {
      console.error();
    }
  };
  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Search for Meal</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search your Meal"
                />
              </Col>
              <Col xs={12} md={4}>
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
            : ''}
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
                  <Card.Text>{meal.summary}</Card.Text>
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
