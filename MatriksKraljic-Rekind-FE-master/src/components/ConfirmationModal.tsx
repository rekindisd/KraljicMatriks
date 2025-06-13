import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ConfirmationModalProps {
  onConfirm: () => void;
  isDisabled: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onConfirm, isDisabled }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className={`bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isDisabled}
        >
          Submit
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">
            Konfirmasi Pengajuan
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Apakah Anda yakin ingin mengajukan form Matriks Kraljic ini? 
            Data yang sudah diajukan tidak dapat diubah kembali.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="space-x-2">
          <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-900 border-none">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-blue-500 hover:bg-blue-400 text-white"
          >
            Ya, Ajukan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;