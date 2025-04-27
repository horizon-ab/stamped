import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import type { POI } from './map_display'

const { Buffer } = require('node:buffer')

const Upload = (props: { poi: POI }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

  const handleFileChange = async (event: any) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleSubmit = async (event: any) => {
    console.log("Upload called!");
    event.preventDefault();

    const user = localStorage.getItem("stamped-username");
    if (!user) {
      alert("Please log in to submit a stamp.");
      return;
    }

    if (!selectedImage) {
      alert("Please select an image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('userName', user);
    formData.append('poiName', props.poi.name);

    try {
      const response = await fetch('http://localhost:80/api/stamp/submitStamp', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert("Successful Submission!");
        setIsDialogOpen(false); // Close the dialog after successful submission
      } else if (response.status === 406) {
        const error = await response.json();
        alert("Submission out of bounds");
      } else if (response.status === 408) {
        const error = await response.json();
        alert("Challenge verification failed");
      } else {
        const error = await response.json();
        alert("Failed Submission...");
      }
    } catch (error) {
      console.log("Unexpected error" + error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Challenge</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload</DialogTitle>
          <DialogDescription>
            Challenge: {props.poi.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input id="file" type="file" className="col-span-3" onChange={handleFileChange} required={true} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Upload;