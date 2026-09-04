import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { authService } from '../services/authService'

interface LoginFormValues {
  username: string
  password: string
  remember: boolean
}

const demoCredentials = [
  { id: 'admin', label: 'admin', username: 'admin', password: '123456', className: 'bg-adminBtn' },
  { id: 'teacher', label: 'teacher', username: 'teacher1', password: '123456', className: 'bg-teacherBtn' },
  { id: 'student', label: 'student', username: 'student1', password: '123456', className: 'bg-studentBtn' },
  { id: 'parent', label: 'parent', username: 'parent1', password: '123456', className: 'bg-parentBtn' },
  { id: 'accountant', label: 'accountant', username: 'accountant', password: '123456', className: 'bg-accountantBtn' },
  { id: 'librarian', label: 'librarian', username: 'librarian', password: '123456', className: 'bg-librarianBtn' },
  { id: 'recep', label: 'Receptionist', username: 'receptionist', password: '123456', className: 'bg-recepBtn' },
] as const

const initialValues: LoginFormValues = {
  username: '',
  password: '',
  remember: false,
}

const validationSchema = Yup.object({
  username: Yup.string().trim().required('Username is required').min(3, 'Username must be at least 3 characters'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  remember: Yup.boolean(),
})

export const Login = () => {
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState('')

  const handleSubmit = async (values: LoginFormValues, helpers: FormikHelpers<LoginFormValues>) => {
    try {
      const user = await authService.login(values.username.trim(), values.password);
      if (user) {
        setLoginError('');
        navigate('/dashboard');
      } else {
        setLoginError('Invalid username or password. Please try again.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      helpers.setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-bodyBg text-[#41403F] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <section className="w-full max-w-[933px] bg-white rounded-lg shadow-xl overflow-hidden my-8 md:my-12">
        <div className="w-full flex flex-col md:flex-row">
          <div className="w-full md:w-[450px] lg:w-[482px] shrink-0 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <h3 className="text-[28px] sm:text-[35px] font-bold text-secondary mb-2 capitalize leading-tight">
              welcome back!
            </h3>
            <p className="text-base text-[#7A6F69] mb-8">Please login to your account</p>

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ errors, touched, isSubmitting, setFieldValue }) => {
                const handleDemoFill = (username: string, password: string) => {
                  setFieldValue('username', username)
                  setFieldValue('password', password)
                  setLoginError('')
                }

                return (
                  <>
                    {loginError && (
                      <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {loginError}
                      </div>
                    )}
                    <Form className="space-y-6 mb-8">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-secondary after:content-['*'] after:text-red-500 after:ml-0.5">
                          User Name
                        </label>
                        <Field
                          name="username"
                          type="text"
                          autoFocus
                          placeholder="Username"
                          className={`block w-full px-4 py-3 text-sm text-secondary bg-white border rounded-md transition duration-150 ease-in-out focus:outline-none placeholder-gray-400 ${
                            errors.username && touched.username
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border-[#ced4da] focus:border-primary focus:ring-1 focus:ring-primary'
                          }`}
                        />
                        <ErrorMessage name="username" component="div" className="text-sm text-red-500" />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-secondary after:content-['*'] after:text-red-500 after:ml-0.5">
                          Password
                        </label>
                        <Field
                          name="password"
                          type="password"
                          placeholder="Password"
                          className={`block w-full px-4 py-3 text-sm text-secondary bg-white border rounded-md transition duration-150 ease-in-out focus:outline-none placeholder-gray-400 ${
                            errors.password && touched.password
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border-[#ced4da] focus:border-primary focus:ring-1 focus:ring-primary'
                          }`}
                        />
                        <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center cursor-pointer select-none text-secondary font-medium">
                          <Field
                            type="checkbox"
                            name="remember"
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary mr-2.5"
                          />
                          <span>Remember Me</span>
                        </label>
                        <a
                          className="text-secondary hover:text-primary transition duration-150 font-medium underline underline-offset-4"
                          href="https://demo.eduking.xyz/reset/index"
                        >
                          Forgot Password?
                        </a>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-primary hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-base rounded-md uppercase transition duration-150 ease-in-out tracking-wider shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSubmitting ? 'Signing in...' : 'sign in'}
                      </button>
                    </Form>

                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="text-base font-semibold text-secondary mb-4">
                        For Quick Demo Login Click Below...
                      </h4>
                      <nav className="flex flex-wrap gap-2.5">
                        {demoCredentials.map((entry) => (
                          <button
                            key={entry.id}
                            type="button"
                            id={entry.id}
                            onClick={() => handleDemoFill(entry.username, entry.password)}
                            className={`text-xs sm:text-sm font-semibold px-4 py-2.5 rounded text-white ${entry.className} hover:brightness-95 active:scale-95 transition-all duration-150 capitalize shadow-sm`}
                          >
                            {entry.label}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </>
                )
              }}
            </Formik>
          </div>

          <div className="hidden md:block relative flex-auto min-h-[600px]">
            <img
              src="https://demo.eduking.xyz/frontend/default/assets/images/login.jpg"
              alt="login"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute w-[85%] left-1/2 bottom-12 -translate-x-1/2 p-6 bg-white/75 backdrop-blur-[8px] rounded-lg border border-white/20 shadow-lg text-secondary">
              <blockquote className="text-lg lg:text-[22px] font-bold italic text-center mb-4 leading-relaxed">
                “Education is the most powerful weapon which can use to change the world.”
              </blockquote>
              <label className="block w-full text-sm lg:text-[18px] font-bold text-right">
                --Nelson Mandela
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
