const { AuthenticationError } = require("apollo-server-express");
const axios = require("axios");

require("dotenv").config({
  path: "./.env",
});

const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },

    searchRecipes: async (_, { searchTerm }) => {
      try {
        var {
          data: { results: recipes },
          status,
        } = await axios.get(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.SPOON_API_KEY}&query=${searchTerm}`
        );
      } catch (error) {
        console.log(error);

        return [];
      }

      if (status !== 200) {
        return [];
      }

      const recipeInfoPromises = recipes.map((recipe) =>
        axios.get(
          `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${process.env.SPOON_API_KEY}`
        )
      );

      const extendedRecipeInfo = await Promise.all(recipeInfoPromises);

      return extendedRecipeInfo.map(
        ({ data: { id, title, description, image } }) => ({
          mealId: id,
          title,
          description: summary,
          image,
        })
      );
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    saveMeal: async (parent, { mealInfo }, context) => {
      if (context.user) {
        const MealArray = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedMeals: mealInfo } },
          { new: true, runValidators: true }
        );
        return MealArray;
      }

      throw new AuthenticationError("You Must Be Logged In!");
    },
    removeMeal: async (parent, { mealId }, context) => {
      if (context.user) {
        const deleteMeal = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedMeals: { mealId } } },
          { new: true }
        );
        return deleteMeal;
      }
      throw new AuthenticationError("You Must Be Logged In!");
    },
  },
};

module.exports = resolvers;
