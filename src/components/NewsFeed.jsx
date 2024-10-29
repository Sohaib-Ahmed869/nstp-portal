import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const DUMMY_IMAGE_URLS = [
  "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?cs=srgb&dl=pexels-hillaryfox-1595385.jpg&fm=jpg",
  "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?cs=srgb&dl=pexels-divinetechygirl-1181406.jpg&fm=jpg",
  "https://nstp.pk/wp-content/uploads/2022/03/1647319787330.jpg",
  "https://nstp.pk/wp-content/uploads/2022/10/mnmn-300x225.jpg",
  "https://nstp.pk/wp-content/uploads/2022/10/308044291_483753323763877_5341637127912820597_n.jpg",
  "https://nstp.pk/wp-content/uploads/2019/04/REVNT5.jpg",
  "https://pbs.twimg.com/media/FUDy7OrWYAAiCzP.jpg:large",
  "https://imgcdn.pakistanpoint.com/media/2021/11/_3/730x425/pic_1637150643.jpg",
  "https://nstp.pk/wp-content/uploads/2023/03/Screenshot-2023-03-28-085250.png",
];

const DUMMY_NEWS_ITEMS = [
  { title: "Covid Cases in the Philippines", blurb: "It's shocking, but it's true! New case discovered. Immense cause of concern." },
  { title: "NSTP announces Job Fair", blurb: "The announcement will be a celebration of opportunities, innovation, technology, and modern progression. Join us." },
  { title: "Why you shouldn't use stock photos", blurb: "We'll list some reasons why you shouldn't do exactly what causes businesses to fail." },
  { title: "Tech Innovations in 2023", blurb: "Discover the latest advancements in technology and how they are shaping our future." },
  { title: "Climate Change Effects", blurb: "Learn about the impact of climate change and what we can do to mitigate its effects." },
  { title: "Space Exploration Milestones", blurb: "A look at the significant achievements in space exploration over the past decade." },
  { title: "Health Benefits of a Balanced Diet", blurb: "Understand the importance of a balanced diet and how it can improve your overall health." },
  { title: "The Rise of Remote Work", blurb: "Explore the benefits and challenges of remote work in the modern world." },
  { title: "Financial Tips for Young Adults", blurb: "Essential financial advice for young adults to help them manage their money effectively." },
  { title: "The Future of Artificial Intelligence", blurb: "An in-depth analysis of the potential and risks associated with artificial intelligence." }
];

const NewsFeed = ({numNewsItems}) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const numItems = numNewsItems || 3;
    const shuffledNews = DUMMY_NEWS_ITEMS.sort(() => 0.5 - Math.random()).slice(0, numItems);
    const shuffledImages = DUMMY_IMAGE_URLS.sort(() => 0.5 - Math.random()).slice(0, numItems);
  
    const randomNews = shuffledNews.map((item, index) => ({
      ...item,
      imageSrc: shuffledImages[index],
      link: '/'
    }));
  
    setNews(randomNews);
  }, [numNewsItems]);

  return (
    <div className="card p-5 min-h-full max-h-full overflow-y-scroll flex flex-col gap-5">
      <h1 className="text-2xl font-bold">News Feed</h1>
      {news.map((item, index) => (
        <div key={index} className="flex sm:flex-row flex-col gap-3">
          <div className="w-32 h-20 flex-shrink-0">
            <img 
              src={item.imageSrc} 
              alt={item.title} 
              className="w-full h-full rounded-md object-cover"
            />
          </div>
          <div className="flex flex-col gap-0 sm:mb-0 mb-5">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-sm text-gray-500">{item.blurb}</p>
            {/** add to-{item.link} below */}
            <Link className="underline text-sm text-primary">Read More</Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NewsFeed