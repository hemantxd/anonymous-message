'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Form, useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signInSchema } from "@/schemas/signInSchema"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


const Page = () => {


  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [debouncedUsername, setDebouncedUsername] = useDebounceValue(username, 500)
  const router = useRouter()

  //zod implementation

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(()=>{

    const checkUsernameUnique = async () => {
      
      setIsCheckingUsername(true);
      setUsernameMessage('');

      try {

        const response = await axios.get('/api/check-username-unique?username=' + debouncedUsername);
        setUsernameMessage(response.data.message);

      } catch (error) {
        
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(axiosError.response?.data.message ?? ' Error checking username uniqueness');
        
      } finally {
        setIsCheckingUsername(false);
      }

    }
  }, 
  [debouncedUsername])


const onSubmit = async( data:z.infer<typeof signUpSchema>)=>{

  setIsSubmitting(true);
  try {
    const response = await axios.post<ApiResponse>('/api/sign-up', data);
    toast.success(response.data.message);
    router.replace('/verify/' + data.username);

  } catch (error) {
    console.log("Error signing up", error);
    const axiosError = error as AxiosError<ApiResponse>;
    toast.error(axiosError.response?.data.message ?? 'Error signing up');
  } finally {
    setIsSubmitting(false);
  }

}

//41:27 progresssss



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

<div className="text-center">

    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-5xl mb-6">Join Mystery Message</h1>


<p className="mb-4">
    Sign up to start your anonymous messaging experience
</p>

</div>

<Form {...form} >

  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
  <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field}
                  
                  
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!form.formState.isValid || isCheckingUsername || isSubmitting}>
          { isSubmitting ? 
          (<> 
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </>) : 'Sign up'}
        </Button>
  </form>


</Form>


<div className="text-center mt-4">
  <p>Already a member? {' '}<Link href="/sign-in" className="text-blue-500">Sign in</Link></p>
</div>

      </div>
    </div>
  )
}

export default Page