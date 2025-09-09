"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Message } from "@/model/User";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete(`/api/delete-message/${message._id}`);
    toast.success(response.data.message);
    onMessageDelete(message._id.toString());
  };

  return (
    <Card className="relative shadow-md border rounded-2xl hover:shadow-lg transition-all">
      {/* Delete button */}
      <div className="absolute top-3 right-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-red-100 text-red-500"
            >
              <X className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this message?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The message will be permanently
                removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Anonymous Message
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 whitespace-pre-line leading-relaxed">
          {message.content}
        </p>
      </CardContent>

      <CardFooter className="text-xs text-gray-400 flex justify-end">
        {new Date(message.createdAt || "").toLocaleString()}
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
