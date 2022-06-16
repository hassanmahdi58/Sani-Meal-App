import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from "react-bootstrap";
import "./Homepage.css";
import { useMutation, useLazyQuery } from "@apollo/client";
import { SAVE_MEAL } from "../utils/mutations";
import { SEARCH_RECIPES } from "../utils/queries";
import { saveMealIds, getSavedMealIds } from "../utils/localStorage";



import Auth from "../utils/auth";

const SearchMeals = () => {
  const [searchedMeals, setSearchedMeals] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [savedMealIds, setSavedMealIds] = useState(getSavedMealIds());
  const [saveMeal, { error }] = useMutation(SAVE_MEAL);
  const [searchRecipes, { data, loading }] = useLazyQuery(SEARCH_RECIPES);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }
    searchRecipes({
      variables: {
        searchTerm: searchInput,
      },
    });

    setSearchedMeals([...searchedMeals, searchInput]);
    setSearchInput("");
  };

  const LoginPage = (event) => {
    event.preventDefault();
    window.location.replace("/Login")
  }

  const mealData = data?.searchRecipes.map((meal) => {
    return meal;
  });
  // const handleSaveMeal = async (searchRecipes) => {
  //   const mealToSave = searchedMeals.find((mealId) => mealId === searchRecipes);
  
  const handleSaveMeal = async (mealId) => {
    const mealToSave = mealData.find((meal) => meal.mealId === mealId);
    // const mealToSave = requiredMealInfo.pop((__typ) => meal.__typename === __typename);

    debugger;


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
     
        <Container className="Container">
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

      <Container>
        <h2>
          {loading && `LOADING...`} 
        </h2>
        <h2>
          {data?.searchRecipes &&
            ` Please Check you Meal Search Below `}
        </h2>
        <CardColumns>
          {data?.searchRecipes &&
            data?.searchRecipes.map((meal) => {
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
                    <Card.Title>
                    {meal.title}</Card.Title>
                    <Card.Text><span dangerouslySetInnerHTML={{ __html: meal.description }}/></Card.Text>
                    <a href={`${meal.sourceUrl}`}>
                      <Button className="btn-block btn-info">
                        View The Recipe
                      </Button>
                    </a>
                    <br></br>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedMealIds?.some(
                          (savedId) => savedId === meal.mealId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveMeal(meal.mealId)}
                      >
                        {savedMealIds?.some(
                          (savedId) => savedId === meal.mealId
                        )
                          ? " Already Added"
                          : "Add This Meal"}
                      </Button>
                    )}
                    {!Auth.loggedIn() && (
                      <Button className="btn-block btn-info" onClick={LoginPage}>Login To Save The Meal</Button>
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
