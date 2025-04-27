

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
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import type { POI } from './map_display'

const { Buffer} = require('node:buffer')

const Upload = (props: {poi: POI}) => {

    const [selectedImage, setSelectedImage] = useState(null);

    const handleFileChange = async (event: any) => {
      setSelectedImage(event.target.files[0])
    }

    const handleSubmit = async (event: any) => {

      console.log("Upload called!");
      event.preventDefault();

      if (!selectedImage) {
        alert("Please select an image before submitting.");
        return;
      }

      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('userName', 'Alice'); // TODO: replace with local storage user name
      formData.append('poiName', props.poi.name);

      try {
        const response = await fetch('http://localhost:80/api/stamp/submitStamp', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const result = await response.json();
          alert("Successful Submission!");
        } else {
          const error = await response.json();
          alert("Failed Submission...")
        }
      } catch (error) {
        console.log("Unexpected error" + error);
      }

    }

    return(
        <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Upload</Button>
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
    )
}

export default Upload