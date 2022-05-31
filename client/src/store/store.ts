import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import AuthResponse from "../models/response/AuthResponse";
import {API_URL} from "../http";


export default class Store {
  user = {} as IUser
  isAuth = false
  isLoading = false

  constructor() {
    makeAutoObservable(this)
  }

  setAuth(bool: boolean) {
    this.isAuth = bool
  }

  setUser(user: IUser) {
    this.user = user
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
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


  async checkAuth() {
    this.setIsLoading(true)

    try {
      const res = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
        withCredentials: true
      })
      localStorage.setItem('token', res.data.accessToken)
      this.setAuth(true)
      this.setUser(res.data.user)
    } catch (e) {
      // @ts-ignore
      console.log(e.response?.data?.message)
    } finally {
      this.setIsLoading(false)
    }
  }
}