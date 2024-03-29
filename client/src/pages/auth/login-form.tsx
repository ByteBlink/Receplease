import { useState } from 'react';
import { useStore } from '../../zustand/store';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api-service';
import { ToastContainer, toast } from 'react-toastify';

interface LoginData {
  email: string;
  password: string;
}
interface User {
  _id: string;
  firstName: string;
}
interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
}

const initialLoginData: LoginData = {
  email: '',
  password: ''
};

const LogInForm: React.FC = () => {
  // STATES:
  const [loginData, setLoginData] = useState<LoginData>(initialLoginData);

  // ZUSTAND:
  const { updateUserID } = useStore();

  // VARIABLES:
  const navigate = useNavigate();

  // FUNCTIONS:
  // Update form's inputs' values:
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Error pop-up if user's details are incorrect:
  const handleError = (err: string) =>
    toast.error(err, { position: 'top-right' });

  // Success pop-up if user's details are accepted:
  const handleSuccess = (msg: string) =>
    toast.success(msg, { position: 'top-right' });

  // Reset form:
  function resetForm() {
    setLoginData(initialLoginData);
  }

  // On submit, send details to the server:
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
    const res: LoginResponse = await login(loginData);
    const { success, message, user } = res;
    
      
      if (success) {
        handleSuccess(
          `Welcome back Chef ${user.firstName}! Let's get cooking...`
        );
        resetForm();
        updateUserID(user._id);
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // RENDER:
  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          value={loginData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="on"
          value={loginData.password}
          onChange={handleChange}
          required
        />
        <button>Log In</button>
      </form>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={true}
      />
    </>
  );
};

export default LogInForm;
