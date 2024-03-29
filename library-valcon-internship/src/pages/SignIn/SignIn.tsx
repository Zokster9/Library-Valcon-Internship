import { Dispatch, FormEvent, SetStateAction, useState } from 'react'

import axios, { AxiosError } from 'axios'
import jwtDecode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import JwtRole from '../../models/JwtRole'
import Token from '../../models/Token'
import { login } from '../../services/AuthorizationService'
import { ROLE_KEY } from '../../services/AxiosConfiguration'
import './SignIn.css'

interface SignInProps {
  setToken: Dispatch<SetStateAction<string | null>>
}

const SignIn = ({ setToken }: SignInProps) => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ emailError, setEmailError ] = useState(false)
  const [ passwordError, setPasswordError ] = useState(false)
  const [ invalidCredentials, setInvalidCredentials ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)
  const navigate = useNavigate()
  const handleOnChangeEmail = ({ currentTarget }: FormEvent<HTMLInputElement>) => {
    const newEmail = currentTarget.value
    setEmail(newEmail)
  }
  const handleOnChangePassword = ({ currentTarget }: FormEvent<HTMLInputElement>) => {
    const newPassword = currentTarget.value
    setPassword(newPassword)
  }
  const handleOnBlurEmail = () => {
    if (email.trim() === '') {
      setEmailError(true)
      return
    }
  }
  const handleOnBlurPassword = () => {
    if (password.trim() === '') {
      setPasswordError(true)
      return
    }
  }
  const handleOnSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (email.trim() === '') {
      setEmailError(true)
      return
    }
    if (password.trim() === '') {
      setPasswordError(true)
      return
    }
    setIsLoading(true)
    login(email, password)
      .then((response) => {
        setIsLoading(false)
        const decodedJwt = jwtDecode<JwtRole>(response.data.AccessToken)
        const token: Token = {
          AccessToken: response.data.AccessToken,
          RefreshToken: response.data.RefreshToken,
          Expiration: response.data.Expiration,
          Role: decodedJwt[ROLE_KEY]
        }
        localStorage.setItem('token', JSON.stringify(token))
        setToken(JSON.stringify(token))
        navigate('/')
      })
      .catch((error: Error | AxiosError) => {
        setIsLoading(false)
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setInvalidCredentials(true)
          }
        }
      })
  }
  return (
    <div className='sign-in'>
      {isLoading && <LoadingSpinner />}
      <h1 className='title'>Sign in</h1>
      <form className='form' onSubmit={handleOnSubmit}>
        <div>
          <div className='form-field'>
            <label className={emailError ? 'label error' : 'label'} htmlFor='email'>
              {!emailError ? 'Email:' : 'Please provide a valid email format'}
            </label>
            <input
              className={emailError ? 'form-input error' : 'form-input'}
              type='email'
              id='email'
              name='email'
              placeholder='Enter email...'
              aria-required={true}
              aria-invalid={true}
              value={email}
              onChange={handleOnChangeEmail}
              onBlur={handleOnBlurEmail}
              onFocus={() => setEmailError(false)}
            />
          </div>
          <div className='form-field'>
            <label className={passwordError ? 'label error' : 'label'} htmlFor='password'>
              {!passwordError ? 'Password:' : 'Please provide a valid password'}
            </label>
            <input
              className={passwordError ? 'form-input error' : 'form-input'}
              type='password'
              id='password'
              name='password'
              placeholder='Enter password...'
              value={password}
              onChange={handleOnChangePassword}
              onBlur={handleOnBlurPassword}
              onFocus={() => setPasswordError(false)}
            />
          </div>
        </div>
        <div className='form-field-button'>
          <div className={invalidCredentials ? 'error-sign-in' : 'sign-in-message'}>
            Wrong email or password!
          </div>
          <button disabled={isLoading} className='form-button'>Sign in</button>
        </div>
      </form>
    </div>
  )
}

export default SignIn
