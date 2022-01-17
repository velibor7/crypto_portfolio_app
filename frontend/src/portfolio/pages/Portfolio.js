import React, { useState, useEffect } from 'react'
import io from "socket.io-client"

// let endPoint = "http://localhost:5000/home"

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState()
    const [data, setData] = useState()

    /*
    useEffect(() =>{
        // fetch(`http:/localhost:5000/investment/user/${user_id}`, {
        fetch("http://localhost:5000/investments/user/1", {
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(async (res) => {
            const resJson = await res.json()
            console.log(resJson?.investments)
            console.log(resJson)
            setPortfolio(resJson?.investments)
        })
        .catch(err => {
            console.log("something bad happened")
            console.error(err)
        })
    }, [])

    useEffect(() => {
    const fetchData = async () => {
      await fetchEventSource(`http://localhost:5000/stream`, {
        //method: "POST",
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
  */

/*
    useEffect(() => {
        console.log("omg")
        var source = new EventSource('http://localhost:5000/stream');
        source.onopen = e => {
            console.log("proba")
        }

        const getRealTimeData = (data) => {
            console.log(data)
            setPortfolio(data)
        }

        source.onmessage = e => {
            console.log("idk")
            getRealTimeData(JSON.parse(e.data));
        }
            // console.log("I AMMMMM HEREEEEEEE")
            // setData(event.data)
            // console.log(data)
            // console.log(event)
            // alert(event.data);
        // };
        return () => {
            source.close()
        }
    }, [portfolio])
    const getData = () => {
        let socket = io.connect(`${endPoint}`)
        socket.addEventListener("newdata", inc_data => {
            // setData(data)
            console.log("this was hit!")
            console.log(inc_data['msg'])
            setData(inc_data['msg'])
        })
    }
    */

    useEffect(() => {
        let socket = io.connect("http://127.0.0.1:5000/home")
        console.log(socket?.data)
        socket.on("newdata", inc_data => {
            console.log("hit")
            console.log(inc_data)
        })
        return () => {
            socket.disconnect()
            
        }
    }, [])

    return (
        <div>
            <ul>
            {portfolio}
            </ul>
        </div>
    )
}

export default Portfolio
