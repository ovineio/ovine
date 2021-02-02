import PropTypes from 'prop-types'
import React from 'react'

const ReactNode = (props) => {
  return <div>{props.id}</div>
}

ReactNode.propTypes = {
  id: PropTypes.string.isRequired,
}

export default ReactNode
