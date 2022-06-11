import React from 'react';
import { Link } from 'react-router-dom';

export default function Homepage() {
return (
<div>
        <h1 style={ { textAlign:"left", fontSize:"80px", marginLeft:"2%"} }>Sani Meal Planner</h1>
        

        <p style={ {textAlign:"left", fontSize:"20px", marginRight:"50%", marginLeft:"2%"}}>
            Hello And Welcome To Our Meal Planner! On This Application You Can Search Up Receipes For Breakfast, Lunch Or Dinner! You Can Create
            A Calender And Plan Your Meals In The Week.
        </p>
        {/* <img src={food} alt="this is food gallery" id="food"/> */}

        <h2 style={{marginLeft:"2%", marginTop:"10%"}}>Create Your Account Below</h2>
          <Link to="/signup">
            <button style={{width:"8%", borderRadius:"55%", backgroundColor:"#F77487", textAlign:"center", marginLeft: "8%"}}>
              <p>Sign Up</p>
            </button>
          </Link>
        </div>
  );
}
