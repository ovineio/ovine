// Any plugins you want to use has to be imported
// Detail plugins list see https://www.tinymce.com/docs/plugins/
// Custom builds see https://www.tinymce.com/download/custom-builds/

/*
lugins: [
  'autosave advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker toc',
  'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
  'save table contextmenu directionality emoticons template paste textcolor importcss colorpicker textpattern',
  'codesample help noneditable print'
],
toolbar: [
  'fontsizeselect fontselect insertfile undo redo | insert | styleselect | '+
  'bold italic | alignleft aligncenter alignright alignjustify | ' +
  'bullist numlist outdent indent | link image | print preview media fullpage | ' +
  'forecolor backcolor emoticons table codesample code | ltr rtl'
],
*/

export default {
  plugins: [
    'autosave advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker toc',
    'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
    'save table contextmenu directionality emoticons template paste textcolor importcss colorpicker textpattern',
    'codesample noneditable print imagetools'
  ],
  toolbar: ['fontsizeselect bold italic underline strikethrough blockquote forecolor backcolor bullist numlist ' +
    'alignleft aligncenter alignright outdent indent hr table link image preview fullscreen',
  ],

  body_class: 'custom-panel-body',
  language: 'zh_CN',
  object_resizing: false,
  end_container_on_empty_block: true,
  powerpaste_word_import: 'clean',
  code_dialog_height: 450,
  code_dialog_width: 1000,
  advlist_bullet_styles: 'square',
  advlist_number_styles: 'default',
  default_link_target: '_blank',
  link_title: false,
  nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin

  template_cdate_format: '[CDATE: %m/%d/%Y : %H:%M:%S]',
  template_mdate_format: '[MDATE: %m/%d/%Y : %H:%M:%S]',
  theme: 'modern',

  image_caption: true,
  image_advtab: true,
  add_unload_trigger: false,
  automatic_uploads: false,
  images_reuse_filename: true,
  paste_data_images: true,
  imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
  // image_title: true,
  // images_upload_url: 'postAcceptor.php',
  // file_picker_callback (callback, value, meta) {
  // callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
  // },
  images_dataimg_filter: () => {

  },
  images_upload_handler: (data: any, success: any, failure: any, progress: (num: number) => void) => {
    console.info('blob upload [started]', 'id:', data.id(), 'filename:', data.filename());
    progress(0);

    setTimeout(function () {
      console.info('blob upload [ended]', data.id());
      success(data.id() + '.png');
      progress(100);
    }, 1000);
  },
};
