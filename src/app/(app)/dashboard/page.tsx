'use client'

import { useSession } from 'next-auth/react';
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/model/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCw } from 'lucide-react';
import { set } from 'mongoose';
import { User } from 'next-auth';
import React, { use, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


const Dashboard = () => {

  const router = useRouter();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = React.useState<boolean>(false);

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId));

  }
const { data: session, status } = useSession();

useEffect(() => {
  if (status === 'authenticated') {
    console.log("Session loaded:", session);
  }
}, [status, session]);


    const form = useForm({
      resolver: zodResolver(acceptMessageSchema),
    })

    const {register, watch, setValue} = form

    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessages = useCallback(async() => {
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessage ?? false); 
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message ?? "Error accepting messages");
    } finally {
        setIsSwitchLoading(false);
    }
    }, [setValue])

    const fetchMessages = useCallback(async(refresh: boolean = false) => {
      setLoading(true);
      setIsSwitchLoading(true);
        try {
          const response = await axios.get<ApiResponse>('/api/get-messages');
          //console.log("Response : ", response);
          setMessages(response.data.messages || []);

          if(refresh) {
            toast.success("Showing latest messages");
          }

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Error fetching messages");
        } finally {
            setLoading(false);
            setIsSwitchLoading(false);
        }
        }, [setMessages, setLoading])


        useEffect(() => {
          if (!session || !session.user) {
            return
          }
          fetchMessages();
          fetchAcceptMessages();
        }, [session, setValue ,fetchMessages, fetchAcceptMessages])


        //handle switch change

        const handleSwitchChange = async () => {
          setIsSwitchLoading(true);
          try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {acceptMessages : !acceptMessages});
            setValue('acceptMessages', !acceptMessages);
            toast.success(response.data.message);
          } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Error accepting messages");
          } finally {
            setIsSwitchLoading(false);
          }
        } 
        
        
        //console.log("session : ", session)

        const username = session?.user?.name ?? "";

const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  // profileUrl depends on baseUrl and username
  const profileUrl = `${baseUrl}/u/${username}`;
  //console.log("Username:", username);
  //console.log("Profile URL:", profileUrl);


        const copyToClipboard = async () => {
          try {
            await navigator.clipboard.writeText(profileUrl);
            toast.success("Profile URL copied to clipboard");
          } catch (error) {
            toast.error("Error copying profile URL to clipboard");
          }
        }
         if (status === 'loading') {
    return <div>Loading session...</div>;
  }

        if(!session || !session.user) {
          return <div>Please Login</div>;
        }


  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>

      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Copy Your Unique Link</h2>{' '}
        <div className='flex items-center'>
          <input type="text"
          value={profileUrl}
          disabled
          className='input input-bordered w-full p-2 mr-2' />

          <Button onClick={copyToClipboard}>Copy</Button>


        </div>


      </div>





<div className='mb-4'>
  <Switch
  {...register('acceptMessages')}
  checked={acceptMessages}
  onCheckedChange={handleSwitchChange}
  disabled={isSwitchLoading}
  />

  <span className='ml-2'>Accept Messages: {acceptMessages ? "On" : "Off"} </span>


</div>

<div>
  <Button className='mb-4' onClick={()=>router.push("/send-message")}>Send Message</Button>
</div>

<Separator />
<Button 
className='mt-4'
variant={'outline'}
onClick={(e)=>{
  e.preventDefault();
  fetchMessages(true);
}}
>
  {loading ? (
    <Loader2 className='animate-spin h-4 w-4'/>
  ):(
    <RefreshCw className='h-4 w-4'/>
  )}

</Button>

    


<div className='mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 '>
  {
    
    messages.length > 0 ? (
      messages.map((message, index) => (
        <MessageCard key={message.id} message={message} onMessageDelete={handleDeleteMessage} />
      ))
    ) :(
      <p>No messages to display</p>
    )
  }


</div>

    </div>
  )
}

export default Dashboard