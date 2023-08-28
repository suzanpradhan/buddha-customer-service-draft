'use client';

import Modal from 'react-modal';
import { Button } from '../zenbuddha/src';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#deleteWarningDialog');

interface AlertDialogProps {
  onClickYes: () => void;
  onClickNo: () => void;
  isOpen: boolean;
  deleteContent?: string;
}

const AlertDialog = (props: AlertDialogProps) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onClickNo}
      style={customStyles}
      contentLabel="Warning"
    >
      <div className="w-56">
        <div className="text-base">
          Are you sure you want to delete {props.deleteContent ?? ''}?
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            className="flex-1 h-8"
            text="Yes"
            kind="danger"
            onClick={props.onClickYes}
          />
          <Button
            className="flex-1 h-8"
            text="No"
            kind="secondary"
            onClick={props.onClickNo ?? props.onClickNo}
          />
        </div>
      </div>
    </Modal>
  );
};
export default AlertDialog;
