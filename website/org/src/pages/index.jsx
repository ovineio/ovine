import React, { useEffect } from 'react'

const main = 'ovine.igroupes.com/'

function Home() {
  useEffect(() => {
    if (location.href.indexOf(main) > -1) {
      location.href = `https://${main}`
    }
  }, [])

  return <div />
}

export default Home
