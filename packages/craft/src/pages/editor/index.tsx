import React from 'react'

import { Editor } from '@craftjs/core'
import { Text } from '@fluentui/react'

import { Button } from '@/components/seletor/Button'
import SettingPanel from '@/components/setting_panel'
import Toolbox from '@/components/toolbox'
import Toolbar from '@/components/toplbar'

export default () => {
  return (
    <div>
      <Text style={{ margin: '20px 0' }}>Basic Page Editor</Text>
      <Editor resolver={{ Button }} />
      <Toolbar />
      <SettingPanel />
      <Toolbox />
    </div>
  )
}
