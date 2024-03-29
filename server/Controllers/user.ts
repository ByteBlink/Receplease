import bcrypt from 'bcrypt';
import userModel from '../Models/user';
import recipeModel from '../Models/recipe';
import { Request, Response } from 'express';

const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Check if user` already exists:
  const user = await userModel.findOne({ email: email });
  if (user)
    return res
      .status(409)
      .send({ success: false, message: 'User already exists' });

  // Hash the password and add the new user to the db:
  try {
    if (password === '') throw new Error();
    const hash = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      ...req.body,
      password: hash,
    });
    await newUser.save();

    res.status(201).send({ success: true, message: 'User created' });
  } catch (error) {
    res.status(400).send({ success: false, message: 'Could not create user' });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Find the user and check their password is correct:
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: 'Username or password is incorrect' });
    }

    const validatedPass = await bcrypt.compare(password, user.password);

    if (!validatedPass) {
      return res
        .status(401)
        .send({ success: false, message: 'Username or password is incorrect' });
    }

    res.status(200).send({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: 'An unexpected error occurred' });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: 'User not found' });
    }

    // Iterate over the user's recipes and delete them using the deleteRecipe function
    for (const recipeId of user.recipes) {
      // Since deleteRecipe is designed to work with HTTP requests,
      // we might refactor the recipe deletion logic into a separate function
      // that can be called both here and in deleteRecipe to avoid duplication.
      await recipeModel.deleteOne({ _id: recipeId });
    }

    // After deleting recipes, delete the user
    await userModel.deleteOne({ _id: userId });

    res
      .status(200)
      .send({ success: true, message: 'User and their recipes deleted' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        success: false,
        message: 'An error occurred while deleting the user and their recipes',
      });
  }
};

export default { registerUser, loginUser, deleteUser };
// logoutUser;
