import React, { useState, useEffect } from 'react'


const serverBaseURL = "http://localhost:5000";

const Portfolio = (props) => {
  // const [portfolio, setPortfolio] = useState([{'id': 2, 'name': 'Bitcoin', 'short_name_handle': 'BTC', 'price': 39000.78177256148, 'amount': 4.0, 'value': 156003.12709024592}, {'id': 3, 'name': 'Ethereum', 'short_name_handle': 'ETH', 'price': 2877.5242154326784, 'amount': 3.0, 'value': 8632.572646298035}])
  const [portfolio, setPortfolio] = useState([])
  // const [data, setData] = useState(null)
  /*
  useEffect(() => {
    const sse = EventSource()
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
            console.log(event.data);
            // [{'id': 2, 'name': 'Bitcoin', 'short_name_handle': 'BTC', 'date': datetime.datetime(2022, 1, 21, 11, 15, 59, 308242), 'price': 39000.78177256148, 'amount': 4.0, 'value': 156003.12709024592}, {'id': 3, 'name': 'Ethereum', 'short_name_handle': 'ETH', 'date': datetime.datetime(2022, 1, 21, 11, 15, 59, 319242), 'price': 2877.5242154326784, 'amount': 3.0, 'value': 8632.572646298035}]
            const regex = /('(?=(,\s*')))|('(?=:))|((?<=([:,]\s*))')|((?<={)')|('(?=}))/g;
            const data = event.data
            const dt = data.replace(regex, '"');
            const parsedData = JSON.parse(dt);
            console.log(parsedData);
            setPortfolio((portfolio) => [parsedData] )
            // setData((data) => [...data, parsedData]);
            // setPortfolio(list(event.data))
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

      // return () => {
        // sse.close()
      // }
    }, []);
    */

    useEffect(() => {
      const sse = new EventSource(`${serverBaseURL}/stream/${props.userId}`, );
      function getRealtimeData(data) {
        // process the data here,
        // then pass it to state to be rendered
      }

      sse.onopen = e => {
        console.log("open");
        console.log(e)
      }

      //sse.onmessage = e => getRealtimeData(JSON.parse(e.data));
      sse.onmessage = e => {
        console.log(e.data)
      }
      sse.onerror = (err) => {
        // error log here 
        console.log("error"); 
        console.log(err)
        // sse.close();
      }

      return () => {
        sse.close();
      };

    }, []);

    return (
    <>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>short</th>
            <th>date</th>
            <th>price</th>
            <th>amount</th>
            <th>value</th>
          </tr>
        </thead>
        <tbody>
          {
            portfolio.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.short_name_handle}</td>
                <td>date</td>
                <td>{item.price}</td>
                <td>{item.amount}</td>
                <td>{item.value}</td>
                <td/>
              </tr>
            ))
          }
        </tbody>
        </table>
      </>
    )
}

export default Portfolio

/*
          <p>tabela sa coin, njegova vrednost, koliko mi imamo tog coina i koliko vredi</p>
          <p>totalna vrednost portfolia</p>
          <p>userId: {props.userId}</p>
          */