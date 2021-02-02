import PropTypes from 'prop-types'
import React from 'react'

const ReactGroup = (props) => {
  return (
    <div className="react-bf-group">
      <div className="react-bf-group-header">{props.id}</div>
      <div className="react-bf-group-content" />
    </div>
  )
}

ReactGroup.propTypes = {
  id: PropTypes.string,
}

export default ReactGroup
