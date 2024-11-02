// fetch.tsx common GET and POST methods

import {URLs} from '@/config/common'

export const GET = async (relative_path, body, query_params) => {

  const url = URLs.BACKEND + relative_path

  try {

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      query_params: JSON.stringify(query_params),
    })

    const data = await response.json()
    const parsedBody = JSON.parse(data.body)

    console.log('Response:', parsedBody)
    return parsedBody
  } catch (error) {
      console.error('Error:', error)
  }

}
