import React from 'react'

import { useNode } from '@craftjs/core'
import { Button as UiButton, ChoiceGroup, IChoiceGroupOption } from '@fluentui/react'

export const Button = ({ size }: any) => {
  const {
    connectors: { connect, drag },
  } = useNode()
  return (
    <UiButton ref={(ref: any) => connect(drag(ref))} style={{ margin: '5px' }}>
      {size}
    </UiButton>
  )
}

export const ButtonSettings = () => {
  const { setProp, props } = useNode((node) => ({
    props: node.data.props,
  }))

  const sizeChoices: IChoiceGroupOption[] = [
    { key: 'small', text: 'Small' },
    { key: 'medium', text: 'Medium' },
    { key: 'large', text: 'Large' },
  ]

  return (
    <div>
      <ChoiceGroup
        label="Size"
        defaultChecked={props.size}
        options={sizeChoices}
        onChange={(_, o?: IChoiceGroupOption) =>
          setProp((p) => {
            if (o) {
              p.size = o.key
            }
          })
        }
      />
    </div>
  )
}

export const ButtonDefaultProps = {
  size: 'small',
}

Button.craft = {
  defaultProps: ButtonDefaultProps,
  related: {
    settings: ButtonSettings,
  },
}
