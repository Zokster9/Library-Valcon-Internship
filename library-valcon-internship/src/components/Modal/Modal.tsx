import { PropsWithChildren } from 'react'

import ReactDOM from 'react-dom'
import './Modal.css'

interface ModalProps {
  confirm: () => void
  closeModal: () => void
}

const Modal = ({ children, closeModal, confirm }: PropsWithChildren<ModalProps>) => {
  return ReactDOM.createPortal(
    <div className='modal'>
      <div className='overlay' onClick={closeModal} />
      <div className='content'>
        { children }
        <div className='modal-btns'>
          <button
            type='button'
            className='modal-btn close'
            onClick={closeModal}
          >
            Close
          </button>
          <button
            type='button'
            className='modal-btn confirm'
            onClick={confirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('portal') as HTMLElement
  )
}

export default Modal
