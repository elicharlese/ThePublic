// tests/Signup.test.js

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Signup from '../path-to-your-signup-component/Signup';

describe('Signup Component', () => {
  test('user can sign up successfully', async () => {
    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }));

    expect(screen.getByText(/Signup successful!/i)).toBeInTheDocument();
  });

  // Add more tests for edge cases and validations if needed
});