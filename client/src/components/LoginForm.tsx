import React, {useContext, useState} from 'react';
import {Context} from "./../";

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {store} = useContext(Context)

  return (
    <div>
      <input
        onChange={e => setEmail(e.target.value)}
        type="text"
        value={email}
        placeholder="Email"
      />
      <input
        onChange={e => setPassword(e.target.value)}
        type="password"
        value={password}
        placeholder="Password"
      />
      <button onClick={() => store.login(email, password)}>Login</button>
      <button onClick={() => store.registration(email, password)}>Registration</button>
    </div>
  );
};

export default LoginForm;