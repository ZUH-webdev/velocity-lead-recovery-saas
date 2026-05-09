import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function Home() {
  const [showSignUp, setShowSignUp] = useState(false);

  if (showSignUp) {
    return (
      <div>
        <SignUp />
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={() => setShowSignUp(false)}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors underline"
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SignIn />
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => setShowSignUp(true)}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors underline"
        >
          Don&apos;t have an account? Sign Up
        </button>
      </div>
    </div>
  );
}
