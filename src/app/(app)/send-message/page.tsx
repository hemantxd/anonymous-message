'use client'
import { Button } from '@/components/ui/button';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react'
import { toast } from 'sonner';

const SendMessagePage = () => {

    const [profileUrl, setProfileUrl] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {

        if(!profileUrl || !message){
            toast.error("Please enter profile URL and message");
        }

        setLoading(true);

        try {

            

            const response = await axios.post<ApiResponse>("/api/send-message", {
                profileUrl,
                message
            })

            toast.success(response.data.message ?? "Message sent successfully");
            
            //setProfileUrl('');
            setMessage(''); 

        } catch (error) {
            
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Error sending message");
        } 
        finally {
            setLoading(false);
        }

    }


  return (
    <div className='my-8 '>
        <h1>Send An Anonymous Message</h1>
        <div>
            <label >Profile Url</label>
            <input type="text"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                placeholder='Enter profile URL (e.g., https://yourapp.com/u/username)'
            />
        </div>

        <div>
            <label >Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here..."
          rows={5}
        />
        </div>

        <Button onClick={handleSend} disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
        </Button>

    </div>
  )
}

export default SendMessagePage