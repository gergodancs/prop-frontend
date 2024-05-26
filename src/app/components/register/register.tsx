import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import './register.scss';
import { useAuth } from '@/context/AuthContext';

const Register = ({ onClose }: { onClose: () => void }) => {
    const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
    const [message, setMessage] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const { login } = useAuth();

    const onSubmit = async (data: { email: string; password: string }) => {
        try {
            if (isRegister) {
                await axios.post('http://localhost:5000/auth/register', data);
                setMessage('Registration successful!');
            } else {
                const response = await axios.post('http://localhost:5000/auth/login', data);
                setMessage('Login successful!');
                const token = response.data.token;
                login(data.email, token);
                onClose();
            }
        } catch (err) {
            setMessage('Registration/Login failed.');
        }
    };

    const toggleForm = () => {
        setIsRegister(!isRegister);
        setMessage('');
    };

    const email = watch('email');
    const password = watch('password');

    return (
        <div className="register-container">
            <h2>{isRegister ? "Register" : "Log in"}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    {...register('email', {
                        required: true,
                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                    })}
                    type="email"
                    placeholder="Email"
                />
                {errors.email && <p className="error">Invalid email</p>}
                <input
                    {...register('password', { required: true, minLength: 6 })}
                    type="password"
                    placeholder="Password"
                />
                {errors.password && <p className="error">Password must be at least 6 characters</p>}
                <button type="submit" disabled={!isValid}>
                    {isRegister ? "Register" : "Log in"}
                </button>
            </form>
            {message && <p>{message}</p>}
            <button onClick={toggleForm} className="toggle-button">
                {isRegister ? "Already have an account? Log in" : "Don't have an account? Register"}
            </button>
        </div>
    );
};

export default Register;
