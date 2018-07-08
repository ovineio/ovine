import * as React from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default class CodeRich extends React.PureComponent {
  render() {
    return (
      <Editor
        initialValue="<p>This is the initial content of the editor</p>"
        init={{
          plugins: 'link image code table',
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
        }}
      />
    );
  }
}
