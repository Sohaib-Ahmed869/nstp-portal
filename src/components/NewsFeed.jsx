import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';



const NewsFeed = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
       setNews([
        { title: "Covid Cases in the Philippines", blurb: "It's shocking, but it's true! New case discovered. Lets be scared", imageSrc: "https://www.shutterstock.com/image-photo/happy-middle-aged-business-man-600nw-2306186897.jpg" , link: '/'},
        { title: "NSTP announces free food for all", blurb:"The announcement comes after the incident of multiple employees starving", imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzrKe4K6ksJyAxWNZaZnBusYATav4bgA8TPw&s" ,link: '/'},
        {title: "Why you shouldnt use stock photos", blurb: "We'll list some reasons why you shouldnt do exactly what we're doing.",imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeSTgla2aWNWl3ZfgkD5HnhB_eFpP5EvgyTw&s", link: '/'},

    ])
}, []);
  return (
    <div className="bg-base-100 min-h-full max-h-full overflow-y-scroll rounded-md shadow-md border-t flex flex-col gap-5 border-t-gray-200 p-5">
      <h1 className="text-2xl font-bold">News Feed</h1>

      {news.map((item, index) => ( 
        <div key={index} className="flex gap-3">
          <img src={item.imageSrc} alt={item.title} className="w-25 h-20 rounded-md" />
          <div className="flex flex-col gap-0">
          <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-sm text-gray-500">{item.blurb}</p>
            <Link to={item.link} className=" underline text-sm text-primary">Read More</Link>
          </div>
        </div>
      ))}
      
    </div>
  )
}

export default NewsFeed