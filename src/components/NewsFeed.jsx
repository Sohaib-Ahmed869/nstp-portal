import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const NewsFeed = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    setNews([
      { title: "Covid Cases in the Philippines", blurb: "It's shocking, but it's true! New case discovered. Immense cause of concern.", imageSrc: "https://www.shutterstock.com/image-photo/happy-middle-aged-business-man-600nw-2306186897.jpg", link: '/' },
      { title: "NSTP announces Job Fair", blurb: "The announcement will be a celebration of opportunities, innovation, technology, and modern progresion. Join us.", imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzrKe4K6ksJyAxWNZaZnBusYATav4bgA8TPw&s", link: '/' },
      { title: "Why you shouldnt use stock photos", blurb: "We'll list some reasons why you shouldnt do exactly what causes businesses to fail.", imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeSTgla2aWNWl3ZfgkD5HnhB_eFpP5EvgyTw&s", link: '/' },

    ])
  }, []);
  return (
    <div className="card p-5 min-h-full max-h-full overflow-y-scroll flex flex-col gap-5">
      <h1 className="text-2xl font-bold">News Feed</h1>
      {news.map((item, index) => (
        <div key={index} className="flex sm:flex-row flex-col gap-3">
          <img src={item.imageSrc} alt={item.title} className="w-25 h-20 rounded-md object-cover" />
          <div className="flex flex-col gap-0 sm:mb-0 mb-5">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-sm text-gray-500">{item.blurb}</p>
            {/** add to={item.link}  below */}
            <Link className=" underline text-sm text-primary">Read More</Link>
          </div>
        </div>
      ))}

    </div>
  )
}

export default NewsFeed
