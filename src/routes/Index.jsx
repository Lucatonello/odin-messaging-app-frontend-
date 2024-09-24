import { useState, useEffect } from "react";

function Index() {
    const [data, setData] = useState("");
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch('http://localhost:3000/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json',
            },
        })
          .then(res => res.json())
          .then(data => {
            setData(data)
            console.log(data);
          })
    }, [token]);
    return (
      <>
        <h1>{data.message}</h1>
      </>
    )
}

export default Index;