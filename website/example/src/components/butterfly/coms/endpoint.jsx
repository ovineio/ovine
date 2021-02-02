import PropTypes from 'prop-types'
import React from 'react'

function Endpoint(props) {
  const { id } = props

  return <span id={id}>{props.children}</span>
}

Endpoint.propTypes = {
  id: PropTypes.string,
  children: PropTypes.element,
}

export default Endpoint
