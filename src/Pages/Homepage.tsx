import React, { useEffect, useState } from 'react';
import '../Static/HomePage.css';
import Header from '../Compunents/Header';
import EventSearchAndFilters from '../Compunents/EventSearchAndFilters';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from 'axios';

interface Events {
  id: number,
  name: string,
  description: string,
  created_at: Date,
  created_by: string,
  file_path: string,
  slots: number,
  eventdate: string
}

const Homepage = () => {
  const [events, SetEvents] = useState<Events[]>([])
  const [eventView, setEventViews] = useState<React.ReactNode[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string>("");
  const signupUser = async () => {
    // Retrieve user from localStorage and handle cases where it may be null
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('User data is missing');
      return;
    }

    const user = JSON.parse(userStr);
    console.log('User:', user);

    // Retrieve token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token is missing');
      return;
    }
    console.log("token is :" + token)

    try {
      console.log("Sending user data to server...");

      // Send the request with proper headers and body
      const response = await axios.post(
        "http://127.0.0.1:3000/event", // Your API endpoint
        user, // The user object to send
        {
          headers: {
            "Content-Type": "application/json", // Specify the content type
            Authorization: `Bearer ${token}`,   // Send the token in the Authorization header
          },
        }
      );

      console.log("Response:", response.data);


      // Handle the server response
      if (response.data.success) {
        SetEvents([])
        console.log("Event created successfully, navigate to home page");
        if (response.data.message instanceof Array) {
          response.data.message.map((element: any) => {
            const newElement: Events = {
              id: element.id,
              name: element.name,
              description: element.description,
              slots: element.slots,
              file_path: element.image,
              created_at: element.created_at,
              created_by: element.created_by,
              eventdate: element.event_date
            }
            SetEvents((prev) => [...prev, newElement])
          })
        }

      } else {
        alert(response.data.message); // Show error message if any
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit data.");
    }
  };

  useEffect(() => {
    signupUser();

    console.log(events);
    const ws = new WebSocket("ws://127.0.0.1:3000/ws");

    ws.onopen = () => console.log("Connected to WebSocket server");
    ws.onmessage = (event) => {
      setMessages(event.data)
      const jsonString = event.data
      const parsedEvents = JSON.parse(jsonString);
      console.log(event.data,parsedEvents);
      var tmpArray : Events[] = []
      SetEvents([])
      console.log("cleared the events array...");
      
      parsedEvents.map((element: Events)=>{
        const tmp = events.filter((ele:Events)=>ele.id == element.id)[0]
        if (tmp != null){
          tmp.slots = parsedEvents.slots
          tmpArray.push(tmp)
        }
      })
      console.log("Reinitialized the array...");
      SetEvents(tmpArray)
    };
    ws.onclose = () => console.log("WebSocket connection closed");

    setSocket(ws);
    return () => ws.close();



    // Call the async function
  }, []); // Include 'cred' as a dependency to track changes

  useEffect(() => {
    var count = 0;
    events.map((element) => {
      setEventViews((prev) => [...prev, (
        <div key={count++} className="event-card">
          <img src={"http://127.0.0.1:3000" + element.file_path} alt={element.name} />
          <div className="event-card-content">
            <h3>{element.name}</h3>
            <p>{element.description}</p>
            <p className="location">{element.eventdate}</p>
            <p className="slots">{element.slots} ticket more</p>
            <Link
              to={`/event-details/${encodeURIComponent(
                JSON.stringify({
                  title: element.name,
                  desc: element.description,
                  date: element.eventdate,
                  image: element.file_path,
                  slots: element.slots
                })
              )}`}
              className="details-link"
            >
              <Button variant='outlined' onClick={(eve: React.FormEvent) => {
                localStorage.setItem('event', JSON.stringify(events[count - 1]))
                console.log(localStorage.getItem('event'));

              }}>{"Book Now"}</Button>
            </Link>
          </div>
        </div>
      )])
    })
  }, [events])
  return (
    <div>
      <Header />
      <main>
        <section>
          <EventSearchAndFilters />
        </section>

        <section>
          <h2>Tickets Live</h2>
          <div className="event-highlights">
            {eventView}
          </div>
        </section>

        <section>
          <h2>Upcoming Events</h2>
          <div className="upcoming-events">
            {[
              {
                title: 'Music Festival',
                desc: 'Join us for an unforgettable night of live performances by top artists.',
                location: 'Central Park, NY',
                image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29uY2VydHxlbnwwfHwwfHx8MA%3D%3D'
              }
            ].map((event, idx) => (
              <div key={idx} className="event-card">
                <img src={event.image} alt={event.title} />
                <div className="event-card-content">
                  <h3>{event.title}</h3>
                  <p>{event.desc}</p>
                  <p className="location">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
