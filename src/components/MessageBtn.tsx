import React, { Suspense } from 'react'
const MessageButton = React.lazy(() => import('chatMF/MessageButton'));

function MessageBtn({ userTwoID } : { userTwoID: string | undefined }) {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
        <MessageButton userTwoID={ userTwoID } />
    </Suspense>
  )
}

export default MessageBtn