import React, { useState, useEffect } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source';

const serverBaseURL = "http://localhost:5000";

const Portfolio = (props) => {
  const [portfolio, setPortfolio] = useState()
  const [data, setData] = useState(null)

  useEffect(() => {
      const fetchData = async () => {
        await fetchEventSource(`${serverBaseURL}/stream/${props.userId}`, {
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
            console.log(event.data); // [{'id': 2, 'name': 'Bitcoin', 'short_name_handle': 'BTC', 'date': datetime.datetime(2022, 1, 21, 11, 15, 59, 308242), 'price': 39000.78177256148, 'amount': 4.0, 'value': 156003.12709024592}, {'id': 3, 'name': 'Ethereum', 'short_name_handle': 'ETH', 'date': datetime.datetime(2022, 1, 21, 11, 15, 59, 319242), 'price': 2877.5242154326784, 'amount': 3.0, 'value': 8632.572646298035}]
            // todo dat handling on frontend
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
          <p>userId: {props.userId}</p>
        </div>
    )
}

export default Portfolio
