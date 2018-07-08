import Modal, { ModalProps } from './modal';
import showModal from './showModal';

Modal.showFormModal = (config: ModalProps) => {
  return showModal({
    ...config,
    component: Modal.FormModal,
  });
};

Modal.showModal = (config: ModalProps) => {
  return showModal({
    ...config,
    component: Modal,
  });
};

export default Modal;
