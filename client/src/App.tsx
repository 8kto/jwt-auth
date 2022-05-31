import React, {useContext, useEffect, useState} from 'react';
import './App.css';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IUser} from "./models/IUser";
import UserService from "./services/UserService";


function App() {
  const {store} = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  if (store.isLoading) {
    return <div>'Loading...'</div>
  }

  const fetchUsers = async () => {
    try {
      const res = await UserService.fetchUsers()
      setUsers(res.data)
    } catch (e) {
      console.log(e)
    }
  }

  return store.isAuth ? (
      <>
        <h1>User is logged in</h1>
        <h2>{store.user.isActivated ? 'Account is activated' : 'Activate account!'}</h2>
        <pre>
          {JSON.stringify(store.user, null, '  ')}
        </pre>
        <button onClick={() => store.logout()}>Logout</button>
        <p>
          <button onClick={() => fetchUsers()}>Get users list</button>
        </p>
        {users.length > 0 && users.map(user =>
          <div key={user.email}>{user.email}</div>
        )}
      </>
    )
    : <>
      <h1>User is logged out</h1>
      <LoginForm/>
    </>
}

export default observer(App);
