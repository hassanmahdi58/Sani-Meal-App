import React from "react";
import "./Homepage.css";
import { Link } from "react-router-dom";

class HomePage extends React.Component {
  render() {
    return (
      <div className="main-container">
        <div className="home-text-container">
          <h2>Sani Meal App </h2>
          <h3>
          Hello And Welcome To Our Meal Planner! On This Application You Can Search Up Receipes For Breakfast, Lunch Or Dinner! You Can Create
            A Calender And Plan Your Meals In The Week.
          </h3>
          <Link to="/signup">
            <button className="buttonhome">
              <p>Get Started</p>
            </button>
          
          </Link>
        </div>
      </div>
    );
    
  }
}


export default HomePage;