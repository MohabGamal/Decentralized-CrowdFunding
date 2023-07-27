import { useState, useEffect } from 'react'
import axios from 'axios'

<<<<<<< HEAD
function useFetch(url, options, dependancies = []) {
=======
function useFetch(uri, options, dependancies = []) {
>>>>>>> release
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.get(url)
=======
        const response = await axios.get(uri)
>>>>>>> release
        setData(response.data)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    if (!(dependancies.includes(null) || dependancies.includes(undefined)))
      fetchData()
<<<<<<< HEAD
  }, [url, ...dependancies])
=======
  }, [uri, ...dependancies])
>>>>>>> release

  const reFetch = async () => {
    setLoading(true)
    try {
      const response = await axios.get(uri)
      setData(response.data)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }
  // console.log({data, loading, error, reFetch})
  return { data, loading, error, reFetch }
}

export default useFetch
