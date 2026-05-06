import React, { Suspense } from 'react'
const MessageButton = React.lazy(() => import('chatMF/MessageButton'));
import { designRecipes } from 'hostApp/designRecipes';

function MessageBtn({ userTwoID } : { userTwoID: string | undefined }) {
  return (
    <Suspense fallback={<h1 className={`${designRecipes.panel} p-3 text-sm text-ds-text-secondary`}>Loading...</h1>}>
        <MessageButton userTwoID={ userTwoID } />
    </Suspense>
  )
}

export default MessageBtn