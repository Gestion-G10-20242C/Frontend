// fetch.tsx common GET and POST methods

import { URLs } from '@/config/common'

export const GET = async (method, relative_path, body, query_params) => {
  const url = URLs.BACKEND + relative_path

  console.log("URL:",url)

  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (body !== null) {
    options.body = JSON.stringify(body)
  }

  if (query_params !== null) {
    options.query_params = JSON.stringify(query_params)
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()
    console.log('GET:', data)
    return data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
