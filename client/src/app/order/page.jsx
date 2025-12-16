'use client';

import React, { useState } from "react";
import { storage } from "../../firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; 

export default function OrderPage() {

  const [total, setTotal] = useState(0);  

  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);

  const handleChange = (event) => {
        setFile(event.target.files[0]);
  };

   const handleUpload = () => {
      if (!file) {
              alert("Please upload an image first!");
              return;
      }
      const storageRef = ref(storage, `/files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                // Update progress
                setPercent(percent);
            },
            (err) => {
                console.log(err);
            },
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                });
            }
        );
    };

    function calc(formData) {
    const ppu = formData.get("price per unit");
    const quantity = formData.get("quantity");
    setTotal(ppu * quantity);
  }
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Create an Order</h1>
      <p className="text-gray-700 mb-8">
        Use our price calculator to estimate costs and add items to your cart.
        The full ordering system will be available soon.
      </p>

      <div className="bg-red-50 border-2 border-stevens-maroon rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-2 text-stevens-maroon">
           Price Calculator
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Service Selection</h2>
                <form action={calc} className=" flex gap-2">
                      <input name="price per unit" placeholder="Price per unit" />
                      <input name="quantity" placeholder="Quantity"/>
                      <button type="submit">Calculate</button>
                      <p>Total price: {total}</p>
                </form>
      </div>
        </h2>
        
        <p className="text-sm text-gray-700">
          Upload your design files, select materials and options, and get an
          instant price quote.
        </p>
        <div className=" flex flex-col gap-3 text-center w-32 m-1 ">
            <input type="file" onChange={handleChange} accept="/image/*" className=" rounded-xl border-2 border-rose-900"/>
            <button onClick={handleUpload} className="rounded-xl border-2 border-rose-900 bg-rose-900 text-white">Upload to Firebase </button>
            <p className="rounded-xl border-2 border-rose-900">{percent} % done</p>
        </div>
      </div>

    </section>
  );
}
