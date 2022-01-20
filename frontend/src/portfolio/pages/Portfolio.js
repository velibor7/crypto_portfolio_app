import React, { useState, useEffect } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source';

import axios from 'axios'
import io from "socket.io-client"

// let endPoint = "http://localhost:5000/home"
const serverBaseURL = "http://localhost:5000";
// let socket = io.connect("http://127.0.0.1:5000/home")

const Portfolio = (props) => {
    const [portfolio, setPortfolio] = useState()
    const [data, setData] = useState(null)

  /* 
    sockets
      const getData = () => {
        axios({
          method: "GET",
          url: "http://localhost:5000/auth_test",
          headers: {
            Authorization: "Bearer " + props.token
          }
        }).then(response => {
          const res = response.data
          setData({name: res.name, about: res.about})
        }).catch(err => {
          console.error(err)
        })
      }

    useEffect(() => {
        console.log(socket?.data)
        socket.on("newdata", inc_data => {
            console.log("hit")
            console.log(inc_data)
        })
        return () => {
            console.log(socket?.data)
            socket.disconnect()
            
        }
    }, [])
  */

  useEffect(() => {
      const fetchData = async () => {
        await fetchEventSource(`${serverBaseURL}/stream`, {
          method: "POST",
          headers: {
            Accept: "text/event-stream",
          },
          onopen(res) {
            if (res.ok && res.status === 200) {
              console.log("Connection made ", res);
            } else if (
              res.status >= 400 &&
              res.status < 500 &&
              res.status !== 429
            ) {
              console.log("Client side error ", res);
            }
          },
          onmessage(event) {
            console.log(event.data);
            const parsedData = JSON.parse(event.data);
            setData((data) => [...data, parsedData]);
          },
          onclose() {
            console.log("Connection closed by the server");
          },
          onerror(err) {
            console.log("There was an error from server", err);
          },
        });
      };
      fetchData();
    }, []);

    return (
        <div>
          <p>tabela sa coin, njegova vrednost, koliko mi imamo tog coina i koliko vredi</p>
          <p>totalna vrednost portfolia</p>
        </div>
    )
}

export default Portfolio
