import React, { useState, useEffect } from "react";
import food from '../assets/food.jpg'

export default function Homepage() {
return (
<div>
        <h1 style={ { textAlign:"center", fontSize:"100px", fontFamily:"fantasy"} }>Sani Meal Planner</h1>
        

        <p style={ {textAlign:"center", fontSize:"20px", marginLeft:"0"}}>
            Hello And Welcome To Our Meal Planner! On This Application You Can Search Up Receipes For Breakfast, Lunch Or Dinner! You Can Create
            A Calender And Plan Your Meals In The Week.
        </p>
        <img src={food} alt="this is food gallery" id="food"/>

        
        </div>
  );
}
