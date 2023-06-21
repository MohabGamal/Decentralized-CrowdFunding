import { DisplayCampaigns } from '../components'
import useFetch from './../hooks/useFetch'
import { useStateContext } from '../context'
import Pagination from './../components/Pagination'
import { useEffect, useState } from 'react'

const Home = () => {
  const { searchQuery, page } = useStateContext()
  const [limit, setLimit] = useState(1)
  const [paginatedCampaigns, setPaginatedCampaigns] = useState([])

  const url = new URL('http://localhost:8080/api/v1/campaigns')
  url.searchParams.append('q', searchQuery)

  const {
    data: campaigns,
    loading: isCampaignsLoading,
    error: campaignsError
  } = useFetch(url.href, {}, [searchQuery])
  // console.log(campaigns)

  const totalPages = Math.ceil(campaigns?.length / limit)

  useEffect(() => {
    if (campaigns) {
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      setPaginatedCampaigns(campaigns.slice(startIndex, endIndex))
    }
  }, [campaigns, limit, page])

  return (
    <div className="flex flex-col gap-10">
      <DisplayCampaigns
        title="All Campaigns"
        isLoading={isCampaignsLoading}
        campaigns={paginatedCampaigns}
        campaignsCount={campaigns?.length}
      />
      {paginatedCampaigns.length != 0 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  )
}

export default Home
