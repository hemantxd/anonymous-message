'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import {  useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';


const VeriftAccount = () => {

    const router = useRouter();
    const param = useParams< { username: string }>();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        
      });


      const onSubmit = async(data: z.infer<typeof verifySchema>)=>{

        try {
            const response = await axios.post("/api/verify-code", {
                username: param.username,
                code: data.code
            });

            toast.success(response.data.message);
            router.push("/sign-in");

        } catch (error) {
            console.log("Error verifying account", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Error verifying account");
            
        }

      }



  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
    <div className='text-center'>
        <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-5xl mb-6'>
            Verify your account</h1>
            <p className='mb-4'>Enter the verification code sent to your email</p>
        
    </div>


    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </div>

    </div>
  )
}

export default VeriftAccount