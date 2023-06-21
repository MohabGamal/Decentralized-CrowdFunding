import { useState, useEffect } from 'react'
import axios from 'axios'

function useFetch(url, options, dependancies = []) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url)
        setData(response.data)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    if (!(dependancies.includes(null) || dependancies.includes(undefined)))
      fetchData()
  }, [url, ...dependancies])

  const reFetch = async () => {
    setLoading(true)
    try {
      const response = await axios.get(url)
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
