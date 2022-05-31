import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";


export default class Store {
  user = {} as IUser
  isAuth = false

  constructor() {
    makeAutoObservable(this)
  }

  setAuth(bool: boolean) {
    this.isAuth = bool
  }

  setUser(user: IUser) {
    this.user = user
  }

  async login(email: string, pass: string) {
    try {
      const res = await AuthService.login(email, pass)
      localStorage.setItem('token', res.data.accessToken)
      console.log(res)
      this.setAuth(true)
      this.setUser(res.data.user)
    } catch (e) {
      // @ts-ignore
      console.log(e.response?.data?.message)
    }
  }

  async registration(email: string, pass: string) {
    try {
      const res = await AuthService.registration(email, pass)
      localStorage.setItem('token', res.data.accessToken)
      console.log(res)
      this.setAuth(true)
      this.setUser(res.data.user)
    } catch (e) {
      // @ts-ignore
      console.log(e.response?.data?.message)
    }
  }

  async logout() {
    try {
      const res = await AuthService.logout()
      localStorage.removeItem('token')
      this.setAuth(false)
      this.setUser({} as IUser)
    } catch (e) {
      // @ts-ignore
      console.log(e.response?.data?.message)
    }
  }
}